import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const history = searchParams.get('history');
  
  try {
    if (history === 'true') {
      const { rows } = await sql`SELECT * FROM cv_generated ORDER BY created_at DESC LIMIT 20`;
      return NextResponse.json(rows);
    }
    
    const language = searchParams.get('language');
    if (language) {
      const { rows } = await sql`
        SELECT * FROM cv_generated 
        WHERE language = ${language}
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      if (rows.length > 0) {
        return NextResponse.json({ default: rows[0], all: [] });
      }
    }
    
    const { rows } = await sql`SELECT * FROM cv_generated ORDER BY created_at DESC LIMIT 1`;
    return NextResponse.json(rows[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const templateId = formData.get('templateId') as string;
    const language = formData.get('language') as string;
    const configJson = formData.get('config') as string;

    if (!pdfFile) {
      return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    
    // Save to public/cv/ folder
    const cvDir = path.join(process.cwd(), 'public', 'cv');
    if (!fs.existsSync(cvDir)) {
      fs.mkdirSync(cvDir, { recursive: true });
    }
    
    const fileName = `cv-${language || 'pt'}-${Date.now()}.pdf`;
    const filePath = path.join(cvDir, fileName);
    fs.writeFileSync(filePath, buffer);
    
    const pdfUrl = `/cv/${fileName}`;
    console.log('Saved PDF:', { fileName, size: buffer.length });

    // Save metadata to database
    const { rows } = await sql`
      INSERT INTO cv_generated (template_id, format, blob_url, language, config)
      VALUES (${templateId || null}, 'pdf', ${pdfUrl}, ${language || 'pt'}, ${configJson || null})
      RETURNING *;
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to save CV:', error);
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
