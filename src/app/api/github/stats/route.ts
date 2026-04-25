import { NextResponse } from 'next/server';
import { getCachedData, setCachedData, getGitHubHeaders } from '@/lib/github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';
const CACHE_KEY = 'stats';

interface LanguageBytes {
  [language: string]: number;
}

export async function GET() {
  try {
    const cached = await getCachedData(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached);
    }

    const repos: any[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(
        `${GITHUB_API}/users/${OWNER}/repos?sort=updated&per_page=${perPage}&page=${page}&type=owner`,
        { headers: getGitHubHeaders() }
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

    const nonForkRepos = repos.filter((repo) => !repo.fork);
    const repoNames = nonForkRepos.map((r) => r.name);

    const allLanguages: LanguageBytes = {};
    let reposWithData = 0;

    for (const repoName of repoNames) {
      try {
        const langResponse = await fetch(
          `${GITHUB_API}/repos/${OWNER}/${repoName}/languages`,
          { headers: getGitHubHeaders() }
        );

        if (langResponse.ok) {
          const languages = await langResponse.json();
          reposWithData++;

          for (const [lang, bytes] of Object.entries(languages)) {
            const normalizedLang = normalizeLanguage(lang);
            if (allLanguages[normalizedLang]) {
              allLanguages[normalizedLang] += bytes as number;
            } else {
              allLanguages[normalizedLang] = bytes as number;
            }
          }
        }
      } catch {
        console.log(`Erro ao buscar linguagens de ${repoName}`);
      }
    }

    const totalBytes = Object.values(allLanguages).reduce((a, b) => a + b, 0);

    const stats: any[] = [];
    for (const [lang, bytes] of Object.entries(allLanguages)) {
      stats.push({
        language: lang,
        bytes,
        percentage: Math.round(((bytes as number) / totalBytes) * 100),
        lines_estimate: Math.round((bytes as number) / 30),
      });
    }

    stats.sort((a, b) => b.bytes - a.bytes);

    const topLanguages = stats.slice(0, 15);
    const otherBytes = stats.slice(15).reduce((a, b) => a + b.bytes, 0);

    if (otherBytes > 0) {
      topLanguages.push({
        language: 'Other',
        bytes: otherBytes,
        percentage: Math.round((otherBytes / totalBytes) * 100),
        lines_estimate: Math.round(otherBytes / 30),
      });
    }

    const result = {
      owner: OWNER,
      total_repos: nonForkRepos.length,
      repos_analyzed: reposWithData,
      total_bytes: totalBytes,
      total_lines_estimate: Math.round(totalBytes / 30),
      languages: topLanguages,
      generated_at: new Date().toISOString(),
    };

    await setCachedData(CACHE_KEY, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GitHub stats error:', error);
    return NextResponse.json(
      { error: 'Erro ao calcular estatísticas' },
      { status: 500 }
    );
  }
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
    'Scala': 'Scala',
    'R': 'R',
    'Shell': 'Shell',
    'Bash': 'Shell',
    'PowerShell': 'PowerShell',
    'Lua': 'Lua',
    'Perl': 'Perl',
    'Haskell': 'Haskell',
    'Elixir': 'Elixir',
    'Erlang': 'Erlang',
    'Clojure': 'Clojure',
    'HTML': 'HTML',
    'CSS': 'CSS',
    'SCSS': 'SCSS',
    'Sass': 'SCSS',
    'Less': 'Less',
    'Vue': 'Vue',
    'Svelte': 'Svelte',
    'JSON': 'JSON',
    'YAML': 'YAML',
    'TOML': 'TOML',
    'XML': 'XML',
    'Markdown': 'Markdown',
    'SQL': 'SQL',
    'GraphQL': 'GraphQL',
    'Dockerfile': 'Dockerfile',
    'Makefile': 'Makefile',
    'CMake': 'CMake',
    'Nix': 'Nix',
    'Assembly': 'Assembly',
    'Vim script': 'Vim Script',
    'Emacs Lisp': 'Emacs Lisp',
    'TeX': 'TeX',
    'LaTeX': 'LaTeX',
  };

  return map[lang] || lang;
}