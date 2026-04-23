import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'updated';
  const perPage = searchParams.get('per_page') || '30';
  const includeForks = searchParams.get('include_forks') === 'true';

  try {
    const response = await fetch(
      `${GITHUB_API}/users/${OWNER}/repos?sort=${sort}&per_page=${perPage}&type=owner`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'E2Barao-Portfolio',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub API error:', response.status, error);
      return NextResponse.json(
        { error: 'Erro ao buscar repositórios do GitHub' },
        { status: response.status }
      );
    }

    let repos = await response.json();

    if (!includeForks) {
      repos = repos.filter((repo: any) => !repo.fork);
    }

    const formatted = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      watchers_count: repo.watchers_count,
      topics: repo.topics,
      fork: repo.fork,
      private: repo.private,
      archived: repo.archived,
      disabled: repo.disabled,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      default_branch: repo.default_branch,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GitHub repos error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar repositórios' },
      { status: 500 }
    );
  }
}