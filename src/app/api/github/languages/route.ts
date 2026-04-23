import { NextRequest, NextResponse } from 'next/server';

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
      const repoList = repos.split(',');
      const results = await Promise.all(
        repoList.map(async (r: string) => {
          try {
            const response = await fetch(
              `${GITHUB_API}/repos/${OWNER}/${r.trim()}/languages`,
              {
                headers: {
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'E2Barao-Portfolio',
                },
              }
            );
            const data = await response.json();
            return { repo: r.trim(), languages: data };
          } catch (e) {
            return { repo: r.trim(), languages: null, error: 'Repo não encontrado' };
          }
        })
      );
      return NextResponse.json(results);
    }

    const response = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${repo}/languages`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'E2Barao-Portfolio',
        },
      }
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

    return NextResponse.json({
      repo,
      total_bytes: total,
      languages: percentages,
      raw: languages,
    });
  } catch (error) {
    console.error('GitHub languages error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar linguagens' },
      { status: 500 }
    );
  }
}