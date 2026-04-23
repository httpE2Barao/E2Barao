import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

async function fetchAllRepos(): Promise<any[]> {
  const repos: any[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const response = await fetch(
      `${GITHUB_API}/users/${OWNER}/repos?sort=updated&per_page=${perPage}&page=${page}&type=owner`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'E2Barao-Portfolio',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) break;
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return repos.filter((repo) => !repo.fork);
}

async function fetchLanguages(repoName: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${repoName}/languages`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'E2Barao-Portfolio',
        },
      }
    );
    if (!response.ok) return {};
    return await response.json();
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get('dry_run') === 'true';

  try {
    const repos = await fetchAllRepos();
    const results: any[] = [];

    for (const repo of repos) {
      const languages = await fetchLanguages(repo.name);
      const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
      
      const formatted: any = {
        src: repo.name,
        name_en: repo.name,
        abt_en: repo.description || '',
        repo_url: repo.html_url,
        site_url: repo.homepage || '',
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics || [],
        default_branch: repo.default_branch,
        updated_at: repo.updated_at,
        git_bytes: totalBytes,
      };

      const langPercentages: Record<string, number> = {};
      for (const [lang, bytes] of Object.entries(languages)) {
        langPercentages[lang] = Math.round(((bytes as number) / totalBytes) * 100);
      }
      formatted.languages = langPercentages;

      if (!dryRun) {
        try {
          const { sql } = await import('@vercel/postgres');
          
          await sql`
            INSERT INTO projects (
              src, name_en, abt_en, repo_url, site_url, tags, featured, display_order
            )
            VALUES (
              ${formatted.src},
              ${formatted.name_en},
              ${formatted.abt_en},
              ${formatted.repo_url},
              ${formatted.site_url},
              ${JSON.stringify(formatted.topics)},
              false,
              999
            )
            ON CONFLICT (src) DO UPDATE SET
              name_en = EXCLUDED.name_en,
              abt_en = EXCLUDED.abt_en,
              repo_url = EXCLUDED.repo_url,
              site_url = EXCLUDED.site_url,
              tags = EXCLUDED.tags,
              updated_at = NOW()
          `;
        } catch (dbError) {
          console.log('[Sync] BD não disponível, apenas retornando dados:', dbError);
        }
      }

      results.push(formatted);
    }

    return NextResponse.json({
      synced: results.length,
      dry_run: dryRun,
      repos: results,
    });
  } catch (error) {
    console.error('GitHub sync error:', error);
    return NextResponse.json(
      { error: 'Erro ao sincronizar repositórios' },
      { status: 500 }
    );
  }
}