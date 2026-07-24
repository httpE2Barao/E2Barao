import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { readArrayFromJson, saveArrayToJson } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';
import { CATEGORY_ORDER } from '@/lib/skill-categories';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const active = searchParams.get('active');
  const all = searchParams.get('all');

  try {
    // Se all=true, retorna todas as skills sem filtrar por category
    if (all === 'true') {
      const { rows } = await sql`
        SELECT * FROM skills
        ORDER BY
          CASE category
            WHEN 'languages' THEN 1 WHEN 'frameworks' THEN 2
            WHEN 'styling' THEN 3 WHEN 'database' THEN 4
            WHEN 'state' THEN 5 WHEN 'auth' THEN 6
            WHEN 'ai' THEN 7 WHEN 'devops' THEN 8
            WHEN 'design' THEN 9 WHEN 'testing' THEN 10
            WHEN 'realtime' THEN 11 WHEN 'dataviz' THEN 12
            WHEN 'integrations' THEN 13 WHEN 'tools' THEN 14
            WHEN 'concepts' THEN 15
          END,
          display_order NULLS LAST,
          name
      `;
      return NextResponse.json(rows);
    }
    
    let query = 'SELECT * FROM skills';
    const conditions: string[] = [];
    const values: any[] = [];
    
    if (category) {
      conditions.push(`category = $${conditions.length + 1}`);
      values.push(category);
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
    query += `
      ORDER BY
        CASE category
          WHEN 'languages' THEN 1 WHEN 'frameworks' THEN 2
          WHEN 'styling' THEN 3 WHEN 'database' THEN 4
          WHEN 'state' THEN 5 WHEN 'auth' THEN 6
          WHEN 'ai' THEN 7 WHEN 'devops' THEN 8
          WHEN 'design' THEN 9 WHEN 'testing' THEN 10
          WHEN 'realtime' THEN 11 WHEN 'dataviz' THEN 12
          WHEN 'integrations' THEN 13 WHEN 'tools' THEN 14
          WHEN 'concepts' THEN 15
        END,
        display_order NULLS LAST,
        name
    `;
    
    const { rows } = await sql.query(query, values);
    return NextResponse.json(rows);
  } catch (error) {
    console.log('Using fallback data for skills');
    try {
      const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
      skills.sort((a: any, b: any) => {
        const catA = CATEGORY_ORDER[a.category] ?? 99;
        const catB = CATEGORY_ORDER[b.category] ?? 99;
        if (catA !== catB) return catA - catB;
        return (a.display_order ?? 999) - (b.display_order ?? 999) || a.name.localeCompare(b.name);
      });
      if (all === 'true') {
        return NextResponse.json(skills);
      }
      if (category) {
        return NextResponse.json(skills.filter((s: any) => s.category === category));
      }
      if (active === 'true') {
        return NextResponse.json(skills.filter((s: any) => s.active === true));
      }
      return NextResponse.json(skills.filter((s: any) => s.active !== false));
    } catch {
      return NextResponse.json(v1Data.skills);
    }
  }
}

export async function POST(request: NextRequest) {
  const clonedRequest = request.clone();
    let body: any;
    try {
      body = await request.json();
      console.log('Skills POST - attempting DB insert:', body.name, 'category:', body.category);

      let order = body.display_order;
    if (!order || order === 0) {
      const maxResult = await sql`
        SELECT COALESCE(MAX(display_order), 0) + 10 AS next_order
        FROM skills WHERE category = ${body.category}
      `;
      order = maxResult.rows[0]?.next_order || 10;
    }

    const { rows } = await sql`
      INSERT INTO skills (name, category, level, color, icon_src, display_order, active)
      VALUES (${body.name}, ${body.category}, ${body.level || 0}, ${body.color || ''}, ${body.icon_src || ''}, ${order}, ${body.active ?? true})
      RETURNING *;
    `;
    console.log('Skills POST - DB insert successful:', rows[0]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Skills POST - DB error:', error?.message || error);
    try {
      body = await clonedRequest.json();
      const existingSkills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
      const maxOrder = existingSkills
        .filter((s: any) => s.category === body.category)
        .reduce((max: number, s: any) => Math.max(max, s.display_order || 0), 0);
      const order = body.display_order || maxOrder + 10;
      const newSkill = {
        id: Date.now(),
        name: body.name,
        category: body.category,
        level: body.level || 0,
        color: body.color || '',
        icon_src: body.icon_src || '',
        display_order: order,
        active: body.active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const updatedSkills = [...existingSkills, newSkill];
      await saveArrayToJson('skills.json', updatedSkills, 'skills');
      console.log('Skills POST - saved to JSON fallback');
      return NextResponse.json(newSkill, { status: 201 });
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError);
      return NextResponse.json({ error: 'Database unavailable and local save failed' }, { status: 503 });
    }
  }
}

export async function PUT(request: NextRequest) {
  const clonedRequest = request.clone();
  let body: any;
  try {
    body = await request.json();
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
    console.log('Skills PUT fallback - saving to JSON');
    try {
      body = await clonedRequest.json();
      const { id, ...fields } = body;
      const existingSkills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
      const index = existingSkills.findIndex((s: any) => s.id === id);
      if (index === -1) {
        return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
      }
      existingSkills[index] = { ...existingSkills[index], ...fields, updated_at: new Date().toISOString() };
      await saveArrayToJson('skills.json', existingSkills, 'skills');
      return NextResponse.json(existingSkills[index]);
    } catch (fallbackError) {
      console.error('Fallback update also failed:', fallbackError);
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
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
    console.log('Skills DELETE fallback - removing from JSON');
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      const existingSkills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
      const filteredSkills = existingSkills.filter((s: any) => s.id !== parseInt(id!));
      await saveArrayToJson('skills.json', filteredSkills, 'skills');
      return NextResponse.json({ message: 'Skill deleted (local)' });
    } catch (fallbackError) {
      console.error('Fallback delete also failed:', fallbackError);
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }
  }
}
