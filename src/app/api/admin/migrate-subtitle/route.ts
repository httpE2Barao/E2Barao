import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { sql } = await import('@vercel/postgres');
    
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS subtitle_pt TEXT,
      ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
      ADD COLUMN IF NOT EXISTS subtitle_es TEXT,
      ADD COLUMN IF NOT EXISTS subtitle_fr TEXT,
      ADD COLUMN IF NOT EXISTS subtitle_zh TEXT
    `;
    
    return NextResponse.json({ success: true, message: 'Columns added' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}