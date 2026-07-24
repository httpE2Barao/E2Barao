import { getCachedData, setCachedData, getGitHubHeaders } from './github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

export async function fetchGitHubRepos(): Promise<any[]> {
  try {
    const cached = await getCachedData('repos');
    if (cached) return cached;

    const res = await fetch(
      `${GITHUB_API}/users/${OWNER}/repos?sort=updated&per_page=100&type=owner`,
      { headers: getGitHubHeaders() }
    );
    if (!res.ok) return [];

    const repos = await res.json();
    await setCachedData('repos', repos);
    return repos;
  } catch {
    return [];
  }
}

export async function fetchRepoLanguages(repoName: string): Promise<Record<string, number>> {
  const cacheKey = `lang_${repoName}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${encodeURIComponent(repoName)}/languages`,
      { headers: getGitHubHeaders() }
    );
    if (!res.ok) return {};

    const raw = await res.json() as Record<string, number>;
    const total = Object.values(raw).reduce((a, b) => a + b, 0);
    if (total === 0) return {};

    const percentages: Record<string, number> = {};
    for (const [lang, bytes] of Object.entries(raw)) {
      percentages[lang] = Math.round((bytes / total) * 100);
    }

    await setCachedData(cacheKey, percentages);
    return percentages;
  } catch {
    return {};
  }
}

export async function getLanguagesForRepos(repoNames: string[]): Promise<Record<string, Record<string, number>>> {
  const results: Record<string, Record<string, number>> = {};
  const entries = await Promise.all(
    repoNames.map(async (name) => ({ name, langs: await fetchRepoLanguages(name) }))
  );
  for (const { name, langs } of entries) {
    results[name] = langs;
  }
  return results;
}

export function buildProjectLookups(projects: { src?: string; repo_url?: string }[]) {
  const srcs = new Set(projects.map(p => p.src?.toLowerCase()).filter(Boolean));
  const repoUrls = new Set(projects.map(p => p.repo_url?.toLowerCase()).filter(Boolean));
  return { srcs, repoUrls };
}

export function filterGithubOnly(
  githubRepos: any[],
  localSrcs: Set<string>,
  featuredSrcs: Set<string>,
  visibleSrcs: Set<string>,
  featuredRepoUrls: Set<string>,
  visibleRepoUrls: Set<string>
): any[] {
  return githubRepos.filter((r: any) => {
    const nameLower = r.name?.toLowerCase();
    const htmlLower = r.html_url?.toLowerCase();
    return !localSrcs.has(r.name) &&
      !featuredSrcs.has(nameLower) &&
      !visibleSrcs.has(nameLower) &&
      !featuredRepoUrls.has(htmlLower) &&
      !visibleRepoUrls.has(htmlLower);
  });
}
