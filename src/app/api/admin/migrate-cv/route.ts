import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`
      ALTER TABLE cv_generated ADD COLUMN IF NOT EXISTS config JSONB;
    `;
    return NextResponse.json({ message: 'Migration completed: added config column to cv_generated' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}