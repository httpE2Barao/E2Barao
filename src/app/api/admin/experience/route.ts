import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { readArrayFromJson } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET(request: NextRequest) {
  try {
    const { rows } = await sql`SELECT * FROM experience_entries ORDER BY display_order NULLS LAST, period_start DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.log('Using fallback data for experience');
    try {
      const experience = await readArrayFromJson('experience.json', 'experience', v1Data.experience);
      return NextResponse.json(experience);
    } catch {
      return NextResponse.json(v1Data.experience);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rows } = await sql`
      INSERT INTO experience_entries (role_pt, role_en, role_es, company_pt, company_en, company_es, period_start, period_end, description_pt, description_en, description_es, display_order)
      VALUES (${body.role_pt}, ${body.role_en}, ${body.role_es}, ${body.company_pt}, ${body.company_en}, ${body.company_es}, ${body.period_start}, ${body.period_end}, ${body.description_pt}, ${body.description_en}, ${body.description_es}, ${body.display_order || 0})
      RETURNING *;
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create experience:', error);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    for (const [key, value] of Object.entries(fields)) {
      if (key !== 'id') {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }
    
    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    values.push(id);
    const query = `UPDATE experience_entries SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const { rows } = await sql.query(query, values);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update experience:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await sql`DELETE FROM experience_entries WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ message: 'Experience deleted' });
  } catch (error) {
    console.error('Failed to delete experience:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
