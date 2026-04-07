import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM cv_generated ORDER BY created_at DESC LIMIT 1`;
    return NextResponse.json(rows[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch latest CV' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const templateId = formData.get('templateId') as string;
    const language = formData.get('language') as string;

    if (!pdfFile) {
      return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const fileName = `cv-${language}-${Date.now()}.pdf`;

    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: 'application/pdf',
    });

    const { rows } = await sql`
      INSERT INTO cv_generated (template_id, format, blob_url, language)
      VALUES (${templateId || null}, 'pdf', ${blob.url}, ${language || 'pt'})
      RETURNING *;
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
