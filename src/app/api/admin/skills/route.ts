import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { readArrayFromJson } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const all = searchParams.get('all');
    
    // Se all=true, retorna todas as skills sem filtrar por category
    if (all === 'true') {
      const { rows } = await sql`SELECT * FROM skills ORDER BY display_order NULLS LAST, name`;
      return NextResponse.json(rows);
    }
    
    let query = 'SELECT * FROM skills';
    const conditions: string[] = [];
    const values: any[] = [];
    
    if (category) {
      conditions.push(`category = $${conditions.length + 1}`);
      values.push(category);
      // Por padrão, se category=tech, também inclui concept e program
    } else if (!active) {
      // Se não tem filtros, retorna todas as skills (sem filtrar active)
      // query stays as is
    }
    
    // Se active não for passado explicitamente como false, filtra active=true
    if (active === null && !category) {
      conditions.push(`active = $${conditions.length + 1}`);
      values.push(true);
    } else if (active !== null) {
      const isActive = active === 'true';
      conditions.push(`active = $${conditions.length + 1}`);
      values.push(isActive);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY display_order NULLS LAST, name';
    
    const { rows } = await sql.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.log('Using fallback data for skills');
    try {
      const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
      return NextResponse.json(skills);
    } catch {
      return NextResponse.json(v1Data.skills);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rows } = await sql`
      INSERT INTO skills (name, category, level, color, icon_src, display_order, active)
      VALUES (${body.name}, ${body.category}, ${body.level || 0}, ${body.color}, ${body.icon_src}, ${body.display_order || 0}, ${body.active ?? true})
      RETURNING *;
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.log('Skills POST fallback - DB unavailable');
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
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
    const query = `UPDATE skills SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
    const { rows } = await sql.query(query, values);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update skill:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await sql`DELETE FROM skills WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('Failed to delete skill:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
