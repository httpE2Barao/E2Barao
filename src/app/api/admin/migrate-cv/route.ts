import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST() {
  try {
    await sql`
      ALTER TABLE cv_generated ADD COLUMN IF NOT EXISTS config JSONB;
    `;
    await sql`
      ALTER TABLE cv_generated ADD COLUMN IF NOT EXISTS pdf_data BYTEA;
    `;
    return NextResponse.json({ message: 'Migration completed: added config and pdf_data columns' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}