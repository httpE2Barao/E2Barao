import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const PROJECTS_JSON_PATH = path.join(process.cwd(), 'public', 'data', 'projects.json');

async function getProjectsFromJSON() {
  try {
    const data = await fs.readFile(PROJECTS_JSON_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.projects || [];
  } catch (err) {
    console.error('Erro ao ler projects.json:', err);
    return [];
  }
}

async function saveProjectsToJSON(projects: any[]) {
  await fs.writeFile(PROJECTS_JSON_PATH, JSON.stringify({ projects }, null, 2), 'utf-8');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get('lang') || 'pt';
  const lang = langParam === 'pt-BR' ? 'ptBR' : langParam === 'en-US' ? 'enUS' : langParam;

  try {
    const { sql } = await import('@vercel/postgres');
    const { rows } = await sql`
      SELECT 
        id, src, site_url, repo_url, image_urls, tags, created_at, featured, display_order,
        name_pt, name_en, name_es, name_fr, name_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
      FROM projects 
      ORDER BY 
        CASE WHEN featured = true THEN 0 ELSE 1 END,
        display_order ASC,
        created_at DESC;
    `;

    const projects = (rows as any[]).map((row: any) => {
      const getText = (field: string) => {
        return row[`${field}_${lang}`] || row[`${field}_en`] || row[`${field}_pt`];
      };
      
      return {
        id: row.id,
        src: row.src,
        site: row.site_url,
        repo: row.repo_url,
        tags: row.tags,
        imageUrls: row.image_urls,
        name: getText('name'),
        alt: getText('alt'),
        abt: getText('abt'),
        featured: row.featured,
        display_order: row.display_order,
      };
    });
    
    return NextResponse.json(projects);
  } catch (dbError) {
    console.log('[Projects API] Vercel Postgres indisponível, usando JSON fallback');
    
    try {
      const projects = await getProjectsFromJSON();
      
      const formatted = projects.map((p: any) => ({
        id: p.id,
        src: p.src,
        site: p.site || '',
        repo: p.repo || '',
        tags: p.tags || [],
        name: p.name?.[lang] || p.name?.ptBR || p.name?.enUS || '',
        alt: p.alt?.[lang] || p.alt?.ptBR || p.alt?.enUS || '',
        abt: p.abt?.[lang] || p.abt?.ptBR || p.abt?.enUS || '',
        featured: p.featured || false,
      }));

      return NextResponse.json(formatted);
    } catch (jsonError) {
      console.error('Erro ao buscar projetos (JSON fallback também falhou):', jsonError);
      return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'Pelo menos uma imagem é obrigatória.' }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${Date.now()}-${image.name.replace(/\s+/g, '-').toLowerCase()}`;
      const filePath = path.join(process.cwd(), 'public', 'images', fileName);
      
      await fs.writeFile(filePath, buffer);
      imageUrls.push(`/images/${fileName}`);
    }

    const tags = formData.getAll('tags[]') as string[];
    const src = formData.get('src') as string;

    try {
      const { sql } = await import('@vercel/postgres');
      const tagsForDb = `{${tags.join(',')}}`;
      const imageUrlsForDb = `{${imageUrls.join(',')}}`;

      await sql`
        INSERT INTO projects (
          src, site_url, repo_url, image_urls, tags, 
          name_pt, name_en, name_es, name_fr, name_zh,
          abt_pt, abt_en, abt_es, abt_fr, abt_zh,
          alt_pt, alt_en, alt_es, alt_fr, alt_zh
        )
        VALUES (
          ${src}, 
          ${formData.get('site') as string}, 
          ${formData.get('repo') as string}, 
          ${imageUrlsForDb}, 
          ${tagsForDb}, 
          ${formData.get('name_pt') as string}, ${formData.get('name_en') as string}, ${formData.get('name_es') as string}, ${formData.get('name_fr') as string}, ${formData.get('name_zh') as string},
          ${formData.get('abt_pt') as string}, ${formData.get('abt_en') as string}, ${formData.get('abt_es') as string}, ${formData.get('abt_fr') as string}, ${formData.get('abt_zh') as string},
          ${formData.get('alt_pt') as string}, ${formData.get('alt_en') as string}, ${formData.get('alt_es') as string}, ${formData.get('alt_fr') as string}, ${formData.get('alt_zh') as string}
        )
        ON CONFLICT (src) DO NOTHING;
      `;

      return NextResponse.json({ message: 'Projeto adicionado com sucesso!', urls: imageUrls }, { status: 201 });
    } catch {
      console.log('[Projects API] Vercel Postgres indisponível, salvando em JSON');
      
      const projects = await getProjectsFromJSON();
      const maxId = projects.reduce((max: number, p: any) => Math.max(max, p.id || 0), 0);

      const newProject = {
        id: maxId + 1,
        src,
        featured: formData.get('featured') === 'true',
        site: formData.get('site') as string,
        repo: formData.get('repo') as string,
        name: {
          ptBR: formData.get('name_pt') as string,
          enUS: formData.get('name_en') as string,
          es: formData.get('name_es') as string,
          fr: formData.get('name_fr') as string,
          zh: formData.get('name_zh') as string,
        },
        alt: {
          ptBR: formData.get('alt_pt') as string,
          enUS: formData.get('alt_en') as string,
          es: formData.get('alt_es') as string,
          fr: formData.get('alt_fr') as string,
          zh: formData.get('alt_zh') as string,
        },
        abt: {
          ptBR: formData.get('abt_pt') as string,
          enUS: formData.get('abt_en') as string,
          es: formData.get('abt_es') as string,
          fr: formData.get('abt_fr') as string,
          zh: formData.get('abt_zh') as string,
        },
        tags,
      };

      projects.push(newProject);
      await saveProjectsToJSON(projects);

      return NextResponse.json({ message: 'Projeto adicionado com sucesso! (JSON fallback)', urls: imageUrls }, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao adicionar projeto:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { sql } = await import('@vercel/postgres');

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const textFields = ['src', 'site_url', 'repo_url', 'name_pt', 'name_en', 'name_es', 'name_fr', 'name_zh', 'abt_pt', 'abt_en', 'abt_es', 'abt_fr', 'abt_zh', 'alt_pt', 'alt_en', 'alt_es', 'alt_fr', 'alt_zh'];

    for (const field of textFields) {
      if (fields[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(fields[field]);
        paramIndex++;
      }
    }

    if (fields.tags !== undefined) {
      setClauses.push(`tags = $${paramIndex}`);
      values.push(`{${fields.tags.join(',')}}`);
      paramIndex++;
    }

    if (fields.featured !== undefined) {
      setClauses.push(`featured = $${paramIndex}`);
      values.push(fields.featured);
      paramIndex++;
    }

    if (fields.display_order !== undefined) {
      setClauses.push(`display_order = $${paramIndex}`);
      values.push(fields.display_order);
      paramIndex++;
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE projects SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *;`;
    const { rows } = await sql.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update project:', error);
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
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
