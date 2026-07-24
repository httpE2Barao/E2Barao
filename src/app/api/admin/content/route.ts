import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    let query;
    if (section) {
      query = sql`SELECT * FROM portfolio_content WHERE section = ${section} ORDER BY display_order NULLS LAST, id`;
    } else {
      query = sql`SELECT * FROM portfolio_content ORDER BY display_order NULLS LAST, id`;
    }

    const { rows } = await query;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, section, key, ...fields } = body;

    if (!section || !key) {
      return NextResponse.json({ error: 'section and key are required' }, { status: 400 });
    }

    const allowedFields = ['value_pt', 'value_en', 'value_es', 'value_fr', 'value_zh', 'display_order'];

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (field in fields) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(fields[field]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    setClauses.push('updated_at = NOW()');
    values.push(section, key);

    const query = `UPDATE portfolio_content SET ${setClauses.join(', ')} WHERE section = $${paramIndex} AND key = $${paramIndex + 1} RETURNING *`;
    const { rows } = await sql.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
