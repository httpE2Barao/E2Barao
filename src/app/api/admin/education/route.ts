import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const { rows } = await sql`SELECT * FROM education_entries ORDER BY display_order NULLS LAST, period_start DESC`;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Failed to fetch education:', error);
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newEdu = await sql`
      INSERT INTO education_entries (
        period_start, period_end,
        degree_pt, degree_en, degree_es, degree_fr, degree_zh,
        school_pt, school_en, school_es, school_fr, school_zh,
        description_pt, description_en, description_es, description_fr, description_zh,
        display_order
      ) VALUES (
        ${body.period_start || null}, ${body.period_end || null},
        ${body.degree_pt || ''}, ${body.degree_en || ''}, ${body.degree_es || ''}, ${body.degree_fr || ''}, ${body.degree_zh || ''},
        ${body.school_pt || ''}, ${body.school_en || ''}, ${body.school_es || ''}, ${body.school_fr || ''}, ${body.school_zh || ''},
        ${body.description_pt || ''}, ${body.description_en || ''}, ${body.description_es || ''}, ${body.description_fr || ''}, ${body.description_zh || ''},
        ${body.display_order || null}
      )
      RETURNING *
    `;
    
    return NextResponse.json(newEdu.rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create education:', error);
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const allowedFields = [
      'period_start', 'period_end',
      'degree_pt', 'degree_en', 'degree_es', 'degree_fr', 'degree_zh',
      'school_pt', 'school_en', 'school_es', 'school_fr', 'school_zh',
      'description_pt', 'description_en', 'description_es', 'description_fr', 'description_zh',
      'display_order'
    ];

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

    values.push(id);
    const query = `UPDATE education_entries SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update education:', error);
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM education_entries 
      WHERE id = ${parseInt(id)}
      RETURNING id
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Education deleted' });
  } catch (error) {
    console.error('Failed to delete education:', error);
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
