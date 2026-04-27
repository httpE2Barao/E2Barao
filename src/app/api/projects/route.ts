import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData, getGitHubHeaders } from '@/lib/github-cache';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'httpE2Barao';

function parsePostgresArray(arr: any): string[] {
  if (Array.isArray(arr)) return arr;
  if (typeof arr === 'string') {
    if (arr.startsWith('{') && arr.endsWith('}')) {
      const inner = arr.slice(1, -1);
      if (!inner) return [];
      return inner.split(',').map(s => s.trim()).filter(Boolean);
    }
    try { return JSON.parse(arr); } catch { return []; }
  }
  return [];
}

function getText(row: any, field: string, lang: string): string {
  const langMap: Record<string, string> = {
    'pt': 'pt', 'ptBR': 'pt', 'en': 'en', 'enUS': 'en', 'es': 'es', 'fr': 'fr', 'zh': 'zh',
  };
  const langKey = langMap[lang] || 'en';
  return row[`${field}_${langKey}`] || row[`${field}_en`] || row[`${field}_pt`] || '';
}

async function fetchRepoLanguages(repoName: string): Promise<Record<string, number>> {
  const cacheKey = `lang_${repoName}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${GITHUB_API}/repos/${OWNER}/${repoName}/languages`, {
      headers: getGitHubHeaders()
    });
    if (!res.ok) return {};
    
    const raw = await res.json();
    const total = Object.values(raw as Record<string, number>).reduce((a, b) => a + b, 0);
    if (total === 0) return {};
    
    const percentages: Record<string, number> = {};
    for (const [lang, bytes] of Object.entries(raw)) {
      percentages[lang] = Math.round(((bytes as number) / total) * 100);
    }
    
    await setCachedData(cacheKey, percentages);
    return percentages;
  } catch {
    return {};
  }
}

async function getLanguagesForRepos(repoNames: string[]): Promise<Record<string, Record<string, number>>> {
  const results: Record<string, Record<string, number>> = {};
  await Promise.all(repoNames.map(async (name) => {
    results[name] = await fetchRepoLanguages(name);
  }));
  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang') || 'pt';
  const lang = langParam === 'pt-BR' ? 'ptBR' : langParam === 'en-US' ? 'enUS' : langParam;

  try {
    const { sql } = await import('@vercel/postgres');
    
    const { rows: featuredProjects } = await sql`
      SELECT 
        id, src, site_url, repo_url, image_urls, tags, created_at, featured, display_order,
        name_pt, name_en, name_es, name_fr, name_zh,
        subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
      FROM projects 
      WHERE featured = true AND show_on_page IS DISTINCT FROM false
      ORDER BY display_order ASC NULLS LAST, created_at DESC;
    `;

    let spiralProjects: any[] = [];
    try {
      const { rows: spiral } = await sql`
        SELECT id, src, site_url, repo_url, image_urls, tags, created_at, featured, display_order,
        name_pt, name_en, name_es, name_fr, name_zh,
        subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
        FROM projects 
        WHERE COALESCE(in_spiral, true) = true
        ORDER BY display_order ASC NULLS LAST, created_at DESC;
      `;
      spiralProjects = spiral;
    } catch {
      spiralProjects = [...featuredProjects];
    }

    let visibleProjects: any[] = [];
    try {
      const { rows: visible } = await sql`
        SELECT id, src, site_url, repo_url, image_urls, tags, created_at, featured, display_order,
        name_pt, name_en, name_es, name_fr, name_zh,
        subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
        FROM projects 
        WHERE COALESCE(visible, true) = true
        ORDER BY display_order ASC NULLS LAST, created_at DESC;
      `;
      visibleProjects = visible;
    } catch {
      visibleProjects = featuredProjects.filter((p: any) => !p.featured);
    }

    let githubRepos: any[] = [];
    try {
      const githubRes = await fetch(
        `${GITHUB_API}/users/${OWNER}/repos?sort=updated&per_page=100&type=owner`,
        { headers: getGitHubHeaders() }
      );
      if (githubRes.ok) githubRepos = await githubRes.json();
    } catch (e) { /* GitHub unavailable */ }

    // Build lookup sets using both src AND repo_url (case-insensitive)
    const featuredSrcs = new Set(featuredProjects.map(p => p.src?.toLowerCase()).filter(Boolean));
    const featuredRepoUrls = new Set(featuredProjects.map(p => p.repo_url?.toLowerCase()).filter(Boolean));
    const visibleSrcs = new Set(visibleProjects.map(p => p.src?.toLowerCase()).filter(Boolean));
    const visibleRepoUrls = new Set(visibleProjects.map(p => p.repo_url?.toLowerCase()).filter(Boolean));
    
    // All local project identifiers
    const allLocalSrcs = new Set([
      ...featuredProjects.map(p => p.src),
      ...visibleProjects.map(p => p.src)
    ]);
    
    // Deduplicate visible projects - exclude any that match featured
    const dedupedVisible = visibleProjects.filter(p => {
      const srcLower = p.src?.toLowerCase();
      const repoLower = p.repo_url?.toLowerCase();
      return !featuredSrcs.has(srcLower) && !featuredRepoUrls.has(repoLower);
    });

    // Get all repo names for language fetching (local + GitHub only)
    const allRepoNames = [
      ...featuredProjects.map(p => p.src),
      ...visibleProjects.map(p => p.src),
      ...githubRepos.map((r: any) => r.name).filter((name: string) => !allLocalSrcs.has(name))
    ];
    
    const allLanguages = await getLanguagesForRepos(allRepoNames);

    // Transform local projects
    const mergedFeatured = featuredProjects.map((p: any) => ({
      id: p.id,
      src: p.src,
      site: p.site_url,
      repo: p.repo_url,
      tags: parsePostgresArray(p.tags),
      imageUrls: parsePostgresArray(p.image_urls),
      name: getText(p, 'name', lang),
      subtitle: getText(p, 'subtitle', lang),
      alt: getText(p, 'alt', lang),
      abt: getText(p, 'abt', lang),
      featured: p.featured,
      display_order: p.display_order,
      hasLocalMedia: parsePostgresArray(p.image_urls).length > 0,
      githubLanguages: allLanguages[p.src] || {},
      stars: githubRepos.find((r: any) => r.name === p.src)?.stargazers_count || 0,
      forks: githubRepos.find((r: any) => r.name === p.src)?.forks_count || 0,
    }));

    const mergedVisible = dedupedVisible.map((p: any) => ({
      id: p.id,
      src: p.src,
      site: p.site_url,
      repo: p.repo_url,
      tags: parsePostgresArray(p.tags),
      imageUrls: parsePostgresArray(p.image_urls),
      name: getText(p, 'name', lang),
      subtitle: getText(p, 'subtitle', lang),
      alt: getText(p, 'alt', lang),
      abt: getText(p, 'abt', lang),
      featured: p.featured,
      display_order: p.display_order,
      hasLocalMedia: parsePostgresArray(p.image_urls).length > 0,
      githubLanguages: allLanguages[p.src] || {},
      stars: githubRepos.find((r: any) => r.name === p.src)?.stargazers_count || 0,
      forks: githubRepos.find((r: any) => r.name === p.src)?.forks_count || 0,
    }));

    const mergedSpiral = spiralProjects.map((p: any) => ({
      id: p.id,
      src: p.src,
      site: p.site_url,
      repo: p.repo_url,
      tags: parsePostgresArray(p.tags),
      imageUrls: parsePostgresArray(p.image_urls),
      name: getText(p, 'name', lang),
      subtitle: getText(p, 'subtitle', lang),
      alt: getText(p, 'alt', lang),
      abt: getText(p, 'abt', lang),
      featured: p.featured,
      display_order: p.display_order,
      hasLocalMedia: parsePostgresArray(p.image_urls).length > 0,
      githubLanguages: allLanguages[p.src] || {},
      stars: githubRepos.find((r: any) => r.name === p.src)?.stargazers_count || 0,
      forks: githubRepos.find((r: any) => r.name === p.src)?.forks_count || 0,
    }));

    // GitHub-only projects: exclude any that match local projects by src OR repo_url
    const githubOnly = githubRepos
      .filter((r: any) => {
        const repoNameLower = r.name?.toLowerCase();
        const repoHtmlLower = r.html_url?.toLowerCase();
        // Keep if NOT in local projects
        return !allLocalSrcs.has(r.name) && 
               !featuredSrcs.has(repoNameLower) && 
               !visibleSrcs.has(repoNameLower) &&
               !featuredRepoUrls.has(repoHtmlLower) &&
               !visibleRepoUrls.has(repoHtmlLower);
      })
      .map((r: any) => ({
        id: r.id,
        src: r.name,
        site: r.homepage,
        repo: r.html_url,
        tags: r.topics || [],
        imageUrls: [],
        name: r.name,
        subtitle: r.description,
        alt: '',
        abt: '',
        featured: false,
        display_order: 999,
        hasLocalMedia: false,
        githubLanguages: allLanguages[r.name] || {},
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        isPrivate: r.private || false,
      }));

    return NextResponse.json({
      featuredProjects: mergedFeatured,
      showcaseProjects: mergedVisible,
      spiralProjects: mergedSpiral,
      githubOnlyProjects: githubOnly,
      total: mergedFeatured.length + mergedVisible.length + githubOnly.length,
    });
  } catch (dbError) {
    console.log('[Projects API] DB error:', dbError);
    return NextResponse.json({ featuredProjects: [], showcaseProjects: [], spiralProjects: [], githubOnlyProjects: [], total: 0 }, { status: 500 });
  }
}