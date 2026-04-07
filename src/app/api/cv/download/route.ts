import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM cv_generated 
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No CV found. Generate one from the admin panel.' }, { status: 404 });
    }

    const latestCV = rows[0];

    return NextResponse.json({
      url: latestCV.blob_url,
      created_at: latestCV.created_at,
      language: latestCV.language,
    });
  } catch (error) {
    console.error('Failed to fetch CV:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}
