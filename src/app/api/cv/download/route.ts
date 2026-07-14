import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

async function ensureTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cv_generated (
        id SERIAL PRIMARY KEY,
        template_id VARCHAR(100) NOT NULL,
        format VARCHAR(50) NOT NULL,
        blob_url TEXT,
        language VARCHAR(10) NOT NULL DEFAULT 'pt',
        config JSONB DEFAULT '{}',
        pdf_data BYTEA,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
  } catch {}
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || 'pt';
  const download = searchParams.get('download');

  try {
    await ensureTable();

    const { rows } = await sql`
      SELECT * FROM cv_generated
      WHERE language = ${language}
      ORDER BY created_at DESC
      LIMIT 1 OFFSET 0;
    `;

    if (rows.length === 0) {
      const fallbackRows = await sql`
        SELECT * FROM cv_generated
        ORDER BY created_at DESC
        LIMIT 1 OFFSET 0;
      `;

      if (fallbackRows.rows.length === 0) {
        return NextResponse.json({ error: 'No CV found. Generate one from the admin panel.' }, { status: 404 });
      }

      const cv = fallbackRows.rows[0];
      if (cv.pdf_data && download === 'true') {
        return new NextResponse(cv.pdf_data, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="cv-${cv.language}.pdf"`,
          },
        });
      }

      return NextResponse.json({
        direct: cv.blob_url || `api/cv/download?language=${cv.language}&download=true`,
        url: cv.blob_url,
        created_at: cv.created_at,
        language: cv.language,
      });
    }

    const latestCV = rows[0];

    if (latestCV.pdf_data && download === 'true') {
      return new NextResponse(latestCV.pdf_data, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="cv-${latestCV.language}.pdf"`,
        },
      });
    }

    return NextResponse.json({
      direct: latestCV.blob_url || `api/cv/download?language=${latestCV.language}&download=true`,
      url: latestCV.blob_url,
      created_at: latestCV.created_at,
      language: latestCV.language,
    });
  } catch (error) {
    console.error('CV download error:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}
