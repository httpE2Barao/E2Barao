import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

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
      WHERE language = ${language} AND format = 'pdf'
      ORDER BY created_at DESC
      LIMIT 1 OFFSET 0;
    `;

    if (rows.length === 0) {
      const fallbackRows = await sql`
        SELECT * FROM cv_generated
        WHERE format = 'pdf'
        ORDER BY created_at DESC
        LIMIT 1 OFFSET 0;
      `;

      if (fallbackRows.rows.length === 0) {
        return NextResponse.json({ error: 'No CV found. Generate one from the admin panel.' }, { status: 404 });
      }

      const cv = fallbackRows.rows[0];
      if (download === 'true') {
        if (cv.pdf_data) {
          return new NextResponse(cv.pdf_data, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="cv-${cv.language}.pdf"`,
            },
          });
        }
        if (cv.blob_url) {
          const filePath = path.join(process.cwd(), 'public', cv.blob_url);
          if (fs.existsSync(filePath)) {
            const buffer = fs.readFileSync(filePath);
            return new NextResponse(buffer, {
              headers: {
                'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="CV-EliasBarao-${cv.language}.pdf"`,
              },
            });
          }
        }
      }

      return NextResponse.json({
        direct: cv.blob_url || `api/cv/download?language=${cv.language}&download=true`,
        url: cv.blob_url,
        created_at: cv.created_at,
        language: cv.language,
      });
    }

    const latestCV = rows[0];

    if (download === 'true') {
      if (latestCV.pdf_data) {
        return new NextResponse(latestCV.pdf_data, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="cv-${latestCV.language}.pdf"`,
          },
        });
      }
      if (latestCV.blob_url) {
        const filePath = path.join(process.cwd(), 'public', latestCV.blob_url);
        if (fs.existsSync(filePath)) {
          const buffer = fs.readFileSync(filePath);
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="CV-EliasBarao-${latestCV.language}.pdf"`,
            },
          });
        }
      }
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
