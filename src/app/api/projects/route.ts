import { NextResponse } from 'next/server';
import { getFeaturedProjects, getSpiralProjects, getVisibleProjects } from '@/lib/db/queries/projects';
import { getSkillMap } from '@/lib/db/queries/skills';
import { parsePostgresArray, parsePostgresIntArray } from '@/lib/db/parse';
import { fetchGitHubRepos, getLanguagesForRepos, buildProjectLookups, filterGithubOnly } from '@/lib/github';
import { Project, ProjectDTO } from '@/lib/db/types';

function getText(row: any, field: string, lang: string): string {
  const langMap: Record<string, string> = {
    pt: 'pt', ptBR: 'pt', en: 'en', enUS: 'en', es: 'es', fr: 'fr', zh: 'zh',
  };
  const langKey = langMap[lang] || 'en';
  return row[`${field}_${langKey}`] || row[`${field}_en`] || row[`${field}_pt`] || '';
}

function matchTagsToSkills(
  tags: string[],
  skillByName: Record<string, { id: number; name: string; category: string }>
): { id: number; name: string; category: string }[] {
  const result: { id: number; name: string; category: string }[] = []
  const seen = new Set<string>()
  let fallbackId = 9999
  for (const tag of tags) {
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const skill = skillByName[key]
    if (skill) {
      result.push(skill)
    } else {
      result.push({ id: fallbackId++, name: tag, category: 'tools' })
    }
  }
  return result
}

function mapProject(
  p: Project,
  skillMap: Record<number, { id: number; name: string; category: string }>,
  skillByName: Record<string, { id: number; name: string; category: string }>,
  allLanguages: Record<string, Record<string, number>>,
  githubRepos: any[],
  lang: string
): ProjectDTO {
  const ids = parsePostgresIntArray(p.skill_ids);
  const dbSkills = ids.map(id => skillMap[id]).filter(Boolean) as { id: number; name: string; category: string }[]
  const tags = parsePostgresArray(p.tags)
  const tagSkills = matchTagsToSkills(tags, skillByName)
  const seen = new Set(dbSkills.map(s => s.id))
  const allSkills = [...dbSkills, ...tagSkills.filter(s => !seen.has(s.id))]
  return {
    id: p.id,
    src: p.src,
    site: p.site_url,
    repo: p.repo_url,
    tags,
    imageUrls: parsePostgresArray(p.image_urls),
    name: getText(p, 'name', lang),
    subtitle: getText(p, 'subtitle', lang),
    alt: getText(p, 'alt', lang),
    abt: getText(p, 'abt', lang),
    featured: p.featured,
    display_order: p.display_order,
    hasLocalMedia: parsePostgresArray(p.image_urls).length > 0,
    githubLanguages: allLanguages[p.src] || {},
    skills: allSkills,
    stars: githubRepos.find((r: any) => r.name === p.src)?.stargazers_count || 0,
    forks: githubRepos.find((r: any) => r.name === p.src)?.forks_count || 0,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang') || 'pt';
  const lang = langParam === 'pt-BR' ? 'ptBR' : langParam === 'en-US' ? 'enUS' : langParam;

  try {
    const [featuredProjects, spiralProjects, visibleProjects, skillMap, githubRepos] = await Promise.all([
      getFeaturedProjects().catch(() => [] as Project[]),
      getSpiralProjects().catch(() => [] as Project[]),
      getVisibleProjects().catch(() => [] as Project[]),
      getSkillMap().catch(() => ({}) as Record<number, { id: number; name: string; category: string }>),
      fetchGitHubRepos(),
    ]);

    const featuredSrcs = new Set(featuredProjects.map(p => p.src?.toLowerCase()).filter(Boolean));
    const featuredRepoUrls = new Set(featuredProjects.map(p => p.repo_url?.toLowerCase()).filter(Boolean));
    const visibleSrcs = new Set(visibleProjects.map(p => p.src?.toLowerCase()).filter(Boolean));
    const visibleRepoUrls = new Set(visibleProjects.map(p => p.repo_url?.toLowerCase()).filter(Boolean));
    const allLocalSrcs = new Set([...featuredProjects, ...visibleProjects].map(p => p.src));

    const dedupedVisible = visibleProjects.filter(p => {
      const srcLower = p.src?.toLowerCase();
      const repoLower = p.repo_url?.toLowerCase();
      return !featuredSrcs.has(srcLower) && !featuredRepoUrls.has(repoLower);
    });

    const projectSrcs = [...featuredProjects, ...dedupedVisible].map(p => p.src).filter(Boolean);
    const allRepoNames = [
      ...projectSrcs,
      ...githubRepos.map((r: any) => r.name).filter((name: string) => !projectSrcs.includes(name)),
    ];

    const allLanguages = await getLanguagesForRepos(allRepoNames);

    const skillByName: Record<string, { id: number; name: string; category: string }> = {}
    for (const skill of Object.values(skillMap)) {
      skillByName[skill.name.toLowerCase()] = skill
    }

    const mapWith = (p: Project) => mapProject(p, skillMap, skillByName, allLanguages, githubRepos, lang);

    const mergedFeatured = featuredProjects.map(mapWith);
    const mergedVisible = dedupedVisible.map(mapWith);
    const mergedSpiral = spiralProjects.map(mapWith);

    const githubOnly = filterGithubOnly(
      githubRepos, allLocalSrcs, featuredSrcs, visibleSrcs, featuredRepoUrls, visibleRepoUrls
    ).map((r: any) => {
      const tags: string[] = r.topics || []
      return {
        id: r.id,
        src: r.name,
        site: r.homepage || '',
        repo: r.html_url,
        tags,
        imageUrls: [] as string[],
        name: r.name,
        subtitle: r.description || '',
        alt: '',
        abt: '',
        featured: false,
        display_order: 999,
        hasLocalMedia: false,
        githubLanguages: allLanguages[r.name] || {},
        skills: matchTagsToSkills(tags, skillByName),
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        isPrivate: r.private || false,
      }
    });

    return NextResponse.json({
      featuredProjects: mergedFeatured,
      showcaseProjects: mergedVisible,
      spiralProjects: mergedSpiral,
      githubOnlyProjects: githubOnly,
      total: mergedFeatured.length + mergedVisible.length + githubOnly.length,
    });
  } catch (dbError) {
    console.error('[Projects API] Error:', dbError);
    return NextResponse.json(
      { featuredProjects: [], showcaseProjects: [], spiralProjects: [], githubOnlyProjects: [], total: 0 },
      { status: 500 }
    );
  }
}
