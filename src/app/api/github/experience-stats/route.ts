import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData, getGitHubHeaders } from '@/lib/github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

interface LanguageBytes {
  [language: string]: number;
}

function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    'TypeScript': 'TypeScript',
    'JavaScript': 'JavaScript',
    'Python': 'Python',
    'Java': 'Java',
    'C#': 'C#',
    'C++': 'C++',
    'C': 'C',
    'Go': 'Go',
    'Rust': 'Rust',
    'Ruby': 'Ruby',
    'PHP': 'PHP',
    'Swift': 'Swift',
    'Kotlin': 'Kotlin',
    'Shell': 'Shell',
    'Bash': 'Shell',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'SCSS': 'SCSS',
    'Sass': 'SCSS',
    'Vue': 'Vue',
    'Svelte': 'Svelte',
    'JSON': 'JSON',
    'YAML': 'YAML',
    'TOML': 'TOML',
    'Markdown': 'Markdown',
    'SQL': 'SQL',
    'GraphQL': 'GraphQL',
    'Dockerfile': 'Dockerfile',
  };
  return map[lang] || lang;
}

async function fetchLanguages(repoName: string): Promise<LanguageBytes> {
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${repoName}/languages`,
      { headers: getGitHubHeaders() }
    );
    if (!response.ok) return {};
    const data = await response.json();
    
    const normalized: LanguageBytes = {};
    for (const [lang, bytes] of Object.entries(data)) {
      const normalizedLang = normalizeLanguage(lang);
      normalized[normalizedLang] = (normalized[normalizedLang] || 0) + (bytes as number);
    }
    return normalized;
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reposParam = searchParams.get('repos');

  if (!reposParam) {
    return NextResponse.json(
      { error: 'Parâmetro "repos" é obrigatório (separados por vírgula)' },
      { status: 400 }
    );
  }

  const repos = reposParam.split(',').map(r => r.trim()).filter(Boolean);

  if (repos.length === 0) {
    return NextResponse.json({ error: 'Nenhum repositório fornecido' }, { status: 400 });
  }

  const cacheKey = `exp_${reposParam}`;
  const cached = await getCachedData(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const allLanguages: LanguageBytes = {};
    const repoStats: any[] = [];
    let reposWithData = 0;

    for (const repo of repos) {
      const languages = await fetchLanguages(repo);
      const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
      
      if (totalBytes > 0) {
        reposWithData++;
      }

      for (const [lang, bytes] of Object.entries(languages)) {
        allLanguages[lang] = (allLanguages[lang] || 0) + bytes;
      }

      repoStats.push({
        repo,
        bytes: totalBytes,
        lines_estimate: Math.round(totalBytes / 30),
        languages: Object.entries(languages)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 5)
          .map(([lang, bytes]) => ({
            language: lang,
            bytes,
            percentage: Math.round(((bytes as number) / totalBytes) * 100),
          })),
      });
    }

    const totalBytes = Object.values(allLanguages).reduce((a, b) => a + b, 0);

    const stats = Object.entries(allLanguages)
      .map(([lang, bytes]) => ({
        language: lang,
        bytes,
        percentage: Math.round(((bytes as number) / totalBytes) * 100),
        lines_estimate: Math.round((bytes as number) / 30),
      }))
      .sort((a, b) => b.bytes - a.bytes);

    const result = {
      repos_count: repos.length,
      repos_with_data: reposWithData,
      total_bytes: totalBytes,
      total_lines_estimate: Math.round(totalBytes / 30),
      by_language: stats,
      by_repo: repoStats,
      generated_at: new Date().toISOString(),
    };

    await setCachedData(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GitHub experience stats error:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular estatísticas' },
      { status: 500 }
    );
  }
}