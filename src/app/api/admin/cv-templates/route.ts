import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM cv_templates ORDER BY created_at ASC`;
    return NextResponse.json(rows.map(row => ({
      ...row,
      config: typeof row.config === 'string' ? JSON.parse(row.config) : row.config,
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CV templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, format, config, is_default } = body;

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

    await sql`DELETE FROM cv_templates WHERE id = ${id}`;
    return NextResponse.json({ message: 'Template deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete CV template' }, { status: 500 });
  }
}
