import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject, updateProject, deleteProject } from '@/lib/db/queries/projects';
import { getSkillMap } from '@/lib/db/queries/skills';
import { findOrCreateSkill } from '@/lib/db/queries/skills';

async function migrateTagsToSkills(tags: string[], existingIds: number[]): Promise<number[]> {
  const skillMap = await getSkillMap();
  const allSkills = Object.values(skillMap);
  const ids = new Set(existingIds);
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    const normalized = normalize(lower);

    let skill = allSkills.find(s => s.name.toLowerCase() === lower);
    if (!skill) skill = allSkills.find(s => normalize(s.name) === normalized);
    if (!skill) skill = allSkills.find(s => s.name.toLowerCase().includes(lower) || normalized.includes(normalize(s.name)));

    if (skill) {
      ids.add(skill.id);
    } else {
      const { getSkillCategory } = await import('@/lib/skill-categories');
      const category = getSkillCategory({ name: tag });
      try {
        const newSkill = await findOrCreateSkill(tag, category);
        ids.add(newSkill.id);
      } catch { /* skip */ }
    }
  }

  return [...ids];
}

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tags: string[] = Array.isArray(body.tags) ? body.tags : body.tags?.split(',') || [];
    const skill_ids = await migrateTagsToSkills(tags, body.skill_ids || []);
    const project = await createProject({
      src: body.src,
      site_url: body.site_url,
      repo_url: body.repo_url,
      image_urls: Array.isArray(body.image_urls) ? body.image_urls : body.image_urls?.split(',') || [],
      tags,
      skill_ids,
      name_pt: body.name_pt,
      name_en: body.name_en,
      name_es: body.name_es,
      name_fr: body.name_fr,
      name_zh: body.name_zh,
      subtitle_pt: body.subtitle_pt,
      subtitle_en: body.subtitle_en,
      subtitle_es: body.subtitle_es,
      subtitle_fr: body.subtitle_fr,
      subtitle_zh: body.subtitle_zh,
      abt_pt: body.abt_pt,
      abt_en: body.abt_en,
      abt_es: body.abt_es,
      abt_fr: body.abt_fr,
      abt_zh: body.abt_zh,
      alt_pt: body.alt_pt,
      alt_en: body.alt_en,
      alt_es: body.alt_es,
      alt_fr: body.alt_fr,
      alt_zh: body.alt_zh,
      featured: body.featured,
      display_order: body.display_order,
      show_on_page: body.show_on_page,
      in_spiral: body.in_spiral,
      visible: body.visible,
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const tags: string[] = Array.isArray(body.tags) ? body.tags : body.tags?.split(',') || [];
    const skill_ids = await migrateTagsToSkills(tags, body.skill_ids || []);

    const project = await updateProject(id, {
      src: body.src,
      site_url: body.site_url,
      repo_url: body.repo_url,
      image_urls: Array.isArray(body.image_urls) ? body.image_urls : body.image_urls?.split(',') || [],
      tags,
      skill_ids,
      name_pt: body.name_pt,
      name_en: body.name_en,
      name_es: body.name_es,
      name_fr: body.name_fr,
      name_zh: body.name_zh,
      subtitle_pt: body.subtitle_pt,
      subtitle_en: body.subtitle_en,
      subtitle_es: body.subtitle_es,
      subtitle_fr: body.subtitle_fr,
      subtitle_zh: body.subtitle_zh,
      abt_pt: body.abt_pt,
      abt_en: body.abt_en,
      abt_es: body.abt_es,
      abt_fr: body.abt_fr,
      abt_zh: body.abt_zh,
      alt_pt: body.alt_pt,
      alt_en: body.alt_en,
      alt_es: body.alt_es,
      alt_fr: body.alt_fr,
      alt_zh: body.alt_zh,
      featured: body.featured,
      display_order: body.display_order,
      show_on_page: body.show_on_page,
      in_spiral: body.in_spiral,
      visible: body.visible,
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
