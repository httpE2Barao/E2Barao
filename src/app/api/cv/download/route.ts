import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || 'pt';
  
  try {
    const { rows } = await sql`
      SELECT * FROM cv_generated 
      WHERE language = ${language}
      ORDER BY created_at DESC 
      LIMIT 1;
    `;

    if (rows.length === 0) {
      const { rows: fallbackRows } = await sql`
        SELECT * FROM cv_generated 
        ORDER BY created_at DESC 
        LIMIT 1;
      `;
      
      if (fallbackRows.length === 0) {
        return NextResponse.json({ error: 'No CV found. Generate one from the admin panel.' }, { status: 404 });
      }
      
      return NextResponse.json({
        url: fallbackRows[0].blob_url,
        created_at: fallbackRows[0].created_at,
        language: fallbackRows[0].language,
      });
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
