import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CV_TEMPLATES_JSON_PATH = path.join(process.cwd(), 'public', 'data', 'cv-templates.json');

async function getCvTemplatesFromJSON() {
  try {
    const data = await fs.readFile(CV_TEMPLATES_JSON_PATH, 'utf-8');
    return JSON.parse(data).templates || [];
  } catch {
    return [];
  }
}

async function saveCvTemplatesToJSON(templates: any[]) {
  await fs.writeFile(CV_TEMPLATES_JSON_PATH, JSON.stringify({ templates }, null, 2), 'utf-8');
}

interface CvTemplate {
  id: number;
  name: string;
  format: string;
  config: any;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function GET() {
  try {
    const { sql } = await import('@vercel/postgres');
    const { rows } = await sql`SELECT * FROM cv_templates ORDER BY created_at ASC`;
    return NextResponse.json(rows.map(row => ({
      ...row,
      config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
    })));
  } catch (error) {
    console.log('[CV Templates API] Vercel Postgres indisponível, usando JSON fallback');
    try {
      const templates = await getCvTemplatesFromJSON();
      return NextResponse.json(templates);
    } catch (jsonError) {
      console.error('Erro ao buscar CV templates (JSON fallback também falhou):', jsonError);
      return NextResponse.json({ error: 'Failed to fetch CV templates' }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, format, config, is_default } = body;

    try {
      const { sql } = await import('@vercel/postgres');
      if (is_default) {
        await sql`UPDATE cv_templates SET is_default = false`;
      }

      const { rows } = await sql`
        INSERT INTO cv_templates (name, format, config, is_default)
        VALUES (${name}, ${format}, ${JSON.stringify(config)}::jsonb, ${is_default || false})
        RETURNING *;
      `;

      const result = rows[0];
      result.config = typeof result.config === 'string' ? JSON.parse(result.config) : result.config;

      return NextResponse.json(result, { status: 201 });
    } catch {
      console.log('[CV Templates API] Vercel Postgres indisponível, usando JSON fallback');
      const templates = await getCvTemplatesFromJSON();
      
      if (is_default) {
        templates.forEach((t: CvTemplate) => t.is_default = false);
      }
      
      const newTemplate = {
        id: templates.length > 0 ? Math.max(...templates.map((t: CvTemplate) => t.id)) + 1 : 1,
        name,
        format,
        config,
        is_default: is_default || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      templates.push(newTemplate);
      await saveCvTemplatesToJSON(templates);
      
      return NextResponse.json(newTemplate, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create CV template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, format, config, is_default } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
      const { sql } = await import('@vercel/postgres');
      if (is_default) {
        await sql`UPDATE cv_templates SET is_default = false WHERE id != ${id}`;
      }

      const { rows } = await sql`
        UPDATE cv_templates 
        SET name = COALESCE(${name}, name),
            format = COALESCE(${format}, format),
            config = COALESCE(${config ? JSON.stringify(config) : null}, config)::jsonb,
            is_default = COALESCE(${is_default}, is_default),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;

      if (rows.length === 0) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }

      const result = rows[0];
      result.config = typeof result.config === 'string' ? JSON.parse(result.config) : result.config;

      return NextResponse.json(result);
    } catch {
      console.log('[CV Templates API] Vercel Postgres indisponível, usando JSON fallback');
      const templates = await getCvTemplatesFromJSON();
      
      if (is_default) {
        templates.forEach((t: CvTemplate) => {
          if (t.id !== id) t.is_default = false;
        });
      }
      
      const index = templates.findIndex((t: CvTemplate) => t.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      
      templates[index] = {
        ...templates[index],
        ...(name && { name }),
        ...(format && { format }),
        ...(config && { config }),
        ...(is_default !== undefined && { is_default }),
        updated_at: new Date().toISOString(),
      };
      
      await saveCvTemplatesToJSON(templates);
      
      return NextResponse.json(templates[index]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update CV template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
      const { sql } = await import('@vercel/postgres');
      await sql`DELETE FROM cv_templates WHERE id = ${id}`;
      return NextResponse.json({ message: 'Template deleted' });
    } catch {
      console.log('[CV Templates API] Vercel Postgres indisponível, usando JSON fallback');
      const templates = await getCvTemplatesFromJSON();
      const filtered = templates.filter((t: CvTemplate) => t.id !== Number(id));
      await saveCvTemplatesToJSON(filtered);
      return NextResponse.json({ message: 'Template deleted' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete CV template' }, { status: 500 });
  }
}
