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
        blob_url TEXT NOT NULL,
        language VARCHAR(10) NOT NULL DEFAULT 'pt',
        config JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
  } catch {}
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || 'pt';
  const direct = searchParams.get('direct');

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

      const pdfUrl = fallbackRows.rows[0].blob_url;
      return NextResponse.json({
        direct: pdfUrl,
        url: pdfUrl,
        created_at: fallbackRows.rows[0].created_at,
        language: fallbackRows.rows[0].language,
      });
    }

    const latestCV = rows[0];
    const pdfUrl = latestCV.blob_url;

    return NextResponse.json({
      direct: pdfUrl,
      url: pdfUrl,
      created_at: latestCV.created_at,
      language: latestCV.language,
    });
  } catch (error) {
    console.error('CV download error:', error);
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}