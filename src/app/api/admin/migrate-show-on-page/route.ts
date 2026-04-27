import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { sql } = await import('@vercel/postgres');
    
    await sql`
      ALTER TABLE projects 
      ADD COLUMN IF NOT EXISTS show_on_page BOOLEAN DEFAULT true
    `;
    
    return NextResponse.json({ success: true, message: 'Column show_on_page added' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}