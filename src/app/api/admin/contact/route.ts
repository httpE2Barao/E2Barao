import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM contact_info ORDER BY display_order NULLS LAST, id`;
    return NextResponse.json(rows.filter((c: any) => c.visible !== false));
  } catch (error) {
    console.error('Failed to fetch contact:', error);
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { rowCount } = await sql`DELETE FROM contact_info WHERE id = ${parseInt(id)}`;
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Contact deleted' });
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
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
      'label', 'value', 'icon',
      'description_pt', 'description_en', 'description_es', 'description_fr', 'description_zh',
      'visible', 'display_order'
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

    setClauses.push('updated_at = NOW()');
    values.push(id);

    const query = `UPDATE contact_info SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const { rows } = await sql.query(query, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Failed to update contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
