import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { sql } = await import('@vercel/postgres');
    const { rows } = await sql`SELECT * FROM projects ORDER BY display_order NULLS LAST, id`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = await import('@vercel/postgres');
    
    const {
      src, site_url, repo_url, image_urls, tags,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, github_src
    } = body;

    const { rows } = await sql`
      INSERT INTO projects (
        src, site_url, repo_url, image_urls, tags,
        name_pt, name_en, name_es, name_fr, name_zh,
        subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh,
        featured, display_order, show_on_page, github_src
      ) VALUES (
        ${src}, ${site_url || null}, ${repo_url || null}, 
        ${tags ? `{${tags.join(',')}}` : '{}'}, ${tags ? `{${tags.join(',')}}` : '{}'},
        ${name_pt || null}, ${name_en || null}, ${name_es || null}, ${name_fr || null}, ${name_zh || null},
        ${subtitle_pt || null}, ${subtitle_en || null}, ${subtitle_es || null}, ${subtitle_fr || null}, ${subtitle_zh || null},
        ${abt_pt || null}, ${abt_en || null}, ${abt_es || null}, ${abt_fr || null}, ${abt_zh || null},
        ${alt_pt || null}, ${alt_en || null}, ${alt_es || null}, ${alt_fr || null}, ${alt_zh || null},
        ${featured || false}, ${display_order || 0}, ${show_on_page !== false}, ${github_src || null}
      )
      ON CONFLICT (src) DO UPDATE SET
        site_url = EXCLUDED.site_url,
        repo_url = EXCLUDED.repo_url,
        image_urls = EXCLUDED.image_urls,
        tags = EXCLUDED.tags,
        name_pt = EXCLUDED.name_pt,
        name_en = EXCLUDED.name_en,
        name_es = EXCLUDED.name_es,
        name_fr = EXCLUDED.name_fr,
        name_zh = EXCLUDED.name_zh,
        subtitle_pt = EXCLUDED.subtitle_pt,
        subtitle_en = EXCLUDED.subtitle_en,
        subtitle_es = EXCLUDED.subtitle_es,
        subtitle_fr = EXCLUDED.subtitle_fr,
        subtitle_zh = EXCLUDED.subtitle_zh,
        abt_pt = EXCLUDED.abt_pt,
        abt_en = EXCLUDED.abt_en,
        abt_es = EXCLUDED.abt_es,
        abt_fr = EXCLUDED.abt_fr,
        abt_zh = EXCLUDED.abt_zh,
        alt_pt = EXCLUDED.alt_pt,
        alt_en = EXCLUDED.alt_en,
        alt_es = EXCLUDED.alt_es,
        alt_fr = EXCLUDED.alt_fr,
        alt_zh = EXCLUDED.alt_zh,
        featured = EXCLUDED.featured,
        display_order = EXCLUDED.display_order,
        show_on_page = EXCLUDED.show_on_page,
        github_src = EXCLUDED.github_src
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sql } = await import('@vercel/postgres');
    
    const {
      id, src, site_url, repo_url, image_urls, tags,
      name_pt, name_en, name_es, name_fr, name_zh,
      subtitle_pt, subtitle_en, subtitle_es, subtitle_fr, subtitle_zh,
      abt_pt, abt_en, abt_es, abt_fr, abt_zh,
      alt_pt, alt_en, alt_es, alt_fr, alt_zh,
      featured, display_order, show_on_page, github_src
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (src !== undefined) { updates.push(`src = $${idx++}`); values.push(src); }
    if (site_url !== undefined) { updates.push(`site_url = $${idx++}`); values.push(site_url); }
    if (repo_url !== undefined) { updates.push(`repo_url = $${idx++}`); values.push(repo_url); }
    if (image_urls !== undefined) { updates.push(`image_urls = $${idx++}`); values.push(image_urls.length ? `{${image_urls.join(',')}}` : '{}'); }
    if (tags !== undefined) { updates.push(`tags = $${idx++}`); values.push(tags.length ? `{${tags.join(',')}}` : '{}'); }
    if (name_pt !== undefined) { updates.push(`name_pt = $${idx++}`); values.push(name_pt); }
    if (name_en !== undefined) { updates.push(`name_en = $${idx++}`); values.push(name_en); }
    if (name_es !== undefined) { updates.push(`name_es = $${idx++}`); values.push(name_es); }
    if (name_fr !== undefined) { updates.push(`name_fr = $${idx++}`); values.push(name_fr); }
    if (name_zh !== undefined) { updates.push(`name_zh = $${idx++}`); values.push(name_zh); }
    if (subtitle_pt !== undefined) { updates.push(`subtitle_pt = $${idx++}`); values.push(subtitle_pt); }
    if (subtitle_en !== undefined) { updates.push(`subtitle_en = $${idx++}`); values.push(subtitle_en); }
    if (subtitle_es !== undefined) { updates.push(`subtitle_es = $${idx++}`); values.push(subtitle_es); }
    if (subtitle_fr !== undefined) { updates.push(`subtitle_fr = $${idx++}`); values.push(subtitle_fr); }
    if (subtitle_zh !== undefined) { updates.push(`subtitle_zh = $${idx++}`); values.push(subtitle_zh); }
    if (abt_pt !== undefined) { updates.push(`abt_pt = $${idx++}`); values.push(abt_pt); }
    if (abt_en !== undefined) { updates.push(`abt_en = $${idx++}`); values.push(abt_en); }
    if (abt_es !== undefined) { updates.push(`abt_es = $${idx++}`); values.push(abt_es); }
    if (abt_fr !== undefined) { updates.push(`abt_fr = $${idx++}`); values.push(abt_fr); }
    if (abt_zh !== undefined) { updates.push(`abt_zh = $${idx++}`); values.push(abt_zh); }
    if (alt_pt !== undefined) { updates.push(`alt_pt = $${idx++}`); values.push(alt_pt); }
    if (alt_en !== undefined) { updates.push(`alt_en = $${idx++}`); values.push(alt_en); }
    if (alt_es !== undefined) { updates.push(`alt_es = $${idx++}`); values.push(alt_es); }
    if (alt_fr !== undefined) { updates.push(`alt_fr = $${idx++}`); values.push(alt_fr); }
    if (alt_zh !== undefined) { updates.push(`alt_zh = $${idx++}`); values.push(alt_zh); }
    if (featured !== undefined) { updates.push(`featured = $${idx++}`); values.push(featured); }
    if (display_order !== undefined) { updates.push(`display_order = $${idx++}`); values.push(display_order); }
    if (show_on_page !== undefined) { updates.push(`show_on_page = $${idx++}`); values.push(show_on_page); }
    if (github_src !== undefined) { updates.push(`github_src = $${idx++}`); values.push(github_src); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE projects SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`;
    const { rows } = await sql.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { sql } = await import('@vercel/postgres');
    await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}