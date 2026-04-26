import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData, getGitHubHeaders } from '@/lib/github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const repos = searchParams.get('repos');

  if (!repos) {
    return NextResponse.json({ error: 'Parâmetro "repos" é obrigatório' }, { status: 400 });
  }

  const repoList = repos.split(',').map(r => r.trim()).filter(Boolean);

  try {
    const results: Record<string, Record<string, number>> = {};

    for (const repo of repoList) {
      const cacheKey = `lang_${repo}`;
      const cached = await getCachedData(cacheKey);
      
      if (cached && cached.languages) {
        results[repo] = cached.languages;
        continue;
      }

      try {
        const response = await fetch(
          `${GITHUB_API}/repos/${OWNER}/${repo}/languages`,
          { headers: getGitHubHeaders() }
        );

        if (response.ok) {
          const languages = await response.json();
          const total = Object.values(languages as Record<string, number>).reduce((a, b) => a + b, 0);
          const percentages: Record<string, number> = {};
          
          for (const [lang, bytes] of Object.entries(languages)) {
            percentages[lang] = Math.round(((bytes as number) / total) * 100);
          }
          
          results[repo] = percentages;
          await setCachedData(cacheKey, { languages: percentages, raw: languages });
        }
      } catch (e) {
        console.log(`Erro ao buscar linguagens de ${repo}`);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}