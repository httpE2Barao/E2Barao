import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const history = searchParams.get('history');
  const language = searchParams.get('language');
  
  try {
    if (history === 'true') {
      const { rows } = await sql`
        SELECT * FROM cv_generated 
        WHERE format = 'pdf'
        ORDER BY created_at DESC LIMIT 20
      `;
      return NextResponse.json(rows);
    }
    
    if (language) {
      // Return config entry for this language
      const { rows } = await sql`
        SELECT * FROM cv_generated 
        WHERE language = ${language} AND format = 'config'
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      if (rows.length > 0) {
        return NextResponse.json(rows[0]);
      }
      // Fallback: any config entry
      const { rows: fallback } = await sql`
        SELECT * FROM cv_generated 
        WHERE format = 'config'
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      return NextResponse.json(fallback[0] || null);
    }
    
    const { rows } = await sql`
      SELECT * FROM cv_generated 
      WHERE format = 'config'
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    return NextResponse.json(rows[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CV' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { config } = body;
      
      if (!config) {
        return NextResponse.json({ error: 'Config is required' }, { status: 400 });
      }

      console.log('Saving config:', Object.keys(config));

      // Find existing config entries
      const { rows: existing } = await sql`
        SELECT id, language FROM cv_generated 
        WHERE format = 'config'
      `;

      if (existing.length > 0) {
        // Update all existing config entries with same config
        for (const row of existing) {
          await sql`
            UPDATE cv_generated 
            SET config = ${JSON.stringify(config)}, created_at = NOW()
            WHERE id = ${row.id}
          `;
        }
        console.log('Updated existing config entries:', existing.length);
        return NextResponse.json({ success: true, id: existing[0].id });
      } else {
        // Insert config entries for all languages
        const langs = ['pt', 'en', 'es'];
        for (const lang of langs) {
          await sql`
            INSERT INTO cv_generated (template_id, format, blob_url, language, config)
            VALUES (0, 'config', '', ${lang}, ${JSON.stringify(config)})
          `;
        }
        console.log('Inserted new config entries for all languages');
        return NextResponse.json({ success: true });
      }
    }

    // FormData (PDF upload)
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const templateId = formData.get('templateId') as string;
    const language = formData.get('language') as string;
    const configJson = formData.get('config') as string;

    if (!pdfFile) {
      return NextResponse.json({ error: 'PDF file is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    
    const cvDir = path.join(process.cwd(), 'public', 'cv');
    if (!fs.existsSync(cvDir)) {
      fs.mkdirSync(cvDir, { recursive: true });
    }
    
    const fileName = `cv-${language || 'pt'}-${Date.now()}.pdf`;
    const filePath = path.join(cvDir, fileName);
    fs.writeFileSync(filePath, buffer);
    
    const pdfUrl = `/cv/${fileName}`;
    console.log('Saved PDF:', { fileName, size: buffer.length });

    const { rows } = await sql`
      INSERT INTO cv_generated (template_id, format, blob_url, language, config)
      VALUES (0, 'pdf', ${pdfUrl}, ${language || 'pt'}, ${configJson || null})
      RETURNING *;
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Failed to save CV:', error);
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
