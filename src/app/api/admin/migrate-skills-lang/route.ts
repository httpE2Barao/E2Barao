import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS name_en VARCHAR(100)`;
    await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS name_es VARCHAR(100)`;
    return NextResponse.json({ success: true, message: 'Columns name_en and name_es added to skills' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}