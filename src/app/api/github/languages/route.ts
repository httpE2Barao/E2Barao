import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData, getGitHubHeaders } from '@/lib/github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get('repo');
  const repos = searchParams.get('repos');

  if (!repo && !repos) {
    return NextResponse.json(
      { error: 'Parâmetro "repo" ou "repos" é obrigatório' },
      { status: 400 }
    );
  }

  try {
    if (repos) {
      const cacheKey = `lang_${repos}`;
      const cached = await getCachedData(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }

      const repoList = repos.split(',');
      const results = await Promise.all(
        repoList.map(async (r: string) => {
          try {
            const response = await fetch(
              `${GITHUB_API}/repos/${OWNER}/${r.trim()}/languages`,
              { headers: getGitHubHeaders() }
            );
            const data = await response.json();
            return { repo: r.trim(), languages: data };
          } catch {
            return { repo: r.trim(), languages: null, error: 'Repo não encontrado' };
          }
        })
      );
      
      await setCachedData(cacheKey, results);
      return NextResponse.json(results);
    }

    const cacheKey = `lang_${repo}`;
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${repo}/languages`,
      { headers: getGitHubHeaders() }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Repositório não encontrado' },
        { status: 404 }
      );
    }

    const languages = await response.json();

    const bytes = Object.values(languages) as number[];
    const total = bytes.reduce((a, b) => a + b, 0);

    const percentages: Record<string, number> = {};
    for (const [lang, bytes] of Object.entries(languages)) {
      percentages[lang] = Math.round(((bytes as number) / total) * 100);
    }

    const result = {
      repo,
      total_bytes: total,
      languages: percentages,
      raw: languages,
    };

    await setCachedData(cacheKey, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GitHub languages error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar linguagens' },
      { status: 500 }
    );
  }
}