import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    await sql`ALTER TABLE cv_generated ADD COLUMN IF NOT EXISTS config JSONB`;
    return NextResponse.json({ success: true, message: 'Column config added' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}