import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { sql } = await import('@vercel/postgres');
    
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS in_spiral BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true`;
    
    return NextResponse.json({ success: true, message: 'Migration completed' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed', details: String(error) }, { status: 500 });
  }
}