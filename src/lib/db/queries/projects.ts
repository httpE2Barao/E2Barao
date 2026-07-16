import { sql } from '@vercel/postgres';
import { Project } from '../types';

function mapRow(row: any): Project {
  return {
    ...row,
    image_urls: row.image_urls ?? [],
    tags: row.tags ?? [],
    skill_ids: row.skill_ids ?? [],
    github_languages: row.github_languages ?? {},
    featured: !!row.featured,
    display_order: row.display_order ?? 0,
    show_on_page: row.show_on_page !== false,
    in_spiral: row.in_spiral !== false,
    visible: row.visible !== false,
    is_private: !!row.is_private,
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const { rows } = await sql`
    SELECT id, src, site_url, repo_url, image_urls, tags, skill_ids,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, in_spiral, visible,
      github_src, github_languages, is_private, created_at
    FROM projects
    ORDER BY display_order NULLS LAST, id
  `;
  return rows.map(mapRow);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { rows } = await sql`
    SELECT id, src, site_url, repo_url, image_urls, tags, skill_ids,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, in_spiral, visible,
      github_src, github_languages, is_private, created_at
    FROM projects
    WHERE featured = true AND show_on_page IS DISTINCT FROM false
    ORDER BY display_order ASC NULLS LAST, created_at DESC
  `;
  return rows.map(mapRow);
}

export async function getSpiralProjects(): Promise<Project[]> {
  const { rows } = await sql`
    SELECT id, src, site_url, repo_url, image_urls, tags, skill_ids,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, in_spiral, visible,
      github_src, github_languages, is_private, created_at
    FROM projects
    WHERE COALESCE(in_spiral, true) = true
    ORDER BY display_order ASC NULLS LAST, created_at DESC
  `;
  return rows.map(mapRow);
}

export async function getVisibleProjects(): Promise<Project[]> {
  const { rows } = await sql`
    SELECT id, src, site_url, repo_url, image_urls, tags, skill_ids,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, in_spiral, visible,
      github_src, github_languages, is_private, created_at
    FROM projects
    WHERE COALESCE(visible, true) = true
    ORDER BY display_order ASC NULLS LAST, created_at DESC
  `;
  return rows.map(mapRow);
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const { rows } = await sql`
    INSERT INTO projects (
      src, site_url, repo_url, image_urls, tags, skill_ids,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, in_spiral, visible
    ) VALUES (
      ${data.src}, ${data.site_url || null}, ${data.repo_url || null},
      ${(data.image_urls?.length ?? 0) > 0 ? `{${(data.image_urls || []).join(',')}}` : '{}'},
      ${(data.tags?.length ?? 0) > 0 ? `{${(data.tags || []).join(',')}}` : '{}'},
      ${(data.skill_ids?.length ?? 0) > 0 ? `{${(data.skill_ids || []).join(',')}}` : '{}'},
      ${data.name_pt || null}, ${data.name_en || null}, ${data.name_es || null}, ${data.name_fr || null}, ${data.name_zh || null},
      ${data.subtitle_pt || null}, ${data.subtitle_en || null}, ${data.subtitle_es || null}, ${data.subtitle_fr || null}, ${data.subtitle_zh || null},
      ${data.abt_pt || null}, ${data.abt_en || null}, ${data.abt_es || null}, ${data.abt_fr || null}, ${data.abt_zh || null},
      ${data.alt_pt || null}, ${data.alt_en || null}, ${data.alt_es || null}, ${data.alt_fr || null}, ${data.alt_zh || null},
      ${data.featured || false}, ${data.display_order || 0},
      ${data.show_on_page !== false}, ${data.in_spiral !== false}, ${data.visible !== false}
    )
    ON CONFLICT (src) DO UPDATE SET
      site_url = EXCLUDED.site_url, repo_url = EXCLUDED.repo_url,
      image_urls = EXCLUDED.image_urls, tags = EXCLUDED.tags,
      skill_ids = EXCLUDED.skill_ids,
      name_pt = EXCLUDED.name_pt, name_en = EXCLUDED.name_en,
      name_es = EXCLUDED.name_es, name_fr = EXCLUDED.name_fr, name_zh = EXCLUDED.name_zh,
      subtitle_pt = EXCLUDED.subtitle_pt, subtitle_en = EXCLUDED.subtitle_en,
      subtitle_es = EXCLUDED.subtitle_es, subtitle_fr = EXCLUDED.subtitle_fr, subtitle_zh = EXCLUDED.subtitle_zh,
      abt_pt = EXCLUDED.abt_pt, abt_en = EXCLUDED.abt_en,
      abt_es = EXCLUDED.abt_es, abt_fr = EXCLUDED.abt_fr, abt_zh = EXCLUDED.abt_zh,
      alt_pt = EXCLUDED.alt_pt, alt_en = EXCLUDED.alt_en,
      alt_es = EXCLUDED.alt_es, alt_fr = EXCLUDED.alt_fr, alt_zh = EXCLUDED.alt_zh,
      featured = EXCLUDED.featured, display_order = EXCLUDED.display_order,
      show_on_page = EXCLUDED.show_on_page,
      in_spiral = EXCLUDED.in_spiral, visible = EXCLUDED.visible
    RETURNING *
  `;
  return mapRow(rows[0]);
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let idx = 1;

  const scalarFields = [
    'src', 'site_url', 'repo_url',
    'name_pt', 'name_en', 'name_es', 'name_fr', 'name_zh',
    'subtitle_pt', 'subtitle_en', 'subtitle_es', 'subtitle_fr', 'subtitle_zh',
    'abt_pt', 'abt_en', 'abt_es', 'abt_fr', 'abt_zh',
    'alt_pt', 'alt_en', 'alt_es', 'alt_fr', 'alt_zh',
    'featured', 'display_order', 'show_on_page',
  ];
  for (const field of scalarFields) {
    if ((data as any)[field] !== undefined) {
      updates.push(`${field} = $${idx++}`);
      values.push((data as any)[field]);
    }
  }

  if (data.tags !== undefined) {
    updates.push(`tags = $${idx++}`);
    values.push(data.tags.length ? `{${data.tags.join(',')}}` : '{}');
  }
  if (data.image_urls !== undefined) {
    updates.push(`image_urls = $${idx++}`);
    values.push(data.image_urls.length ? `{${data.image_urls.join(',')}}` : '{}');
  }
  if (data.skill_ids !== undefined) {
    updates.push(`skill_ids = $${idx++}`);
    values.push(data.skill_ids.length ? `{${data.skill_ids.join(',')}}` : '{}');
  }
  if (data.in_spiral !== undefined) {
    updates.push(`in_spiral = $${idx++}`);
    values.push(data.in_spiral);
  }
  if (data.visible !== undefined) {
    updates.push(`visible = $${idx++}`);
    values.push(data.visible);
  }

  if (updates.length === 0) return null;

  values.push(id);
  const { rows } = await sql.query(
    `UPDATE projects SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const { rowCount } = await sql`DELETE FROM projects WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}
