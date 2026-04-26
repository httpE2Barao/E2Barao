import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const messages: string[] = [];

    try {
      await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS name_pt TEXT`;
      messages.push('Added name_pt to skills');
    } catch (e) {}

    try {
      await sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS name_es TEXT`;
      messages.push('Added name_es to skills');
    } catch (e) {}

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS name_pt TEXT`;
      messages.push('Added name_pt to projects');
    } catch (e) {}

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_pt TEXT`;
      messages.push('Added abt_pt to projects');
    } catch (e) {}

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS name_es TEXT`;
      messages.push('Added name_es to projects');
    } catch (e) {}

    try {
      await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS abt_es TEXT`;
      messages.push('Added abt_es to projects');
    } catch (e) {}

    try {
      await sql`UPDATE skills SET name_pt = name WHERE name_pt IS NULL OR name_pt = ''`;
      messages.push('Copied name to name_pt for skills');
    } catch (e) {}

    try {
      await sql`UPDATE projects SET name_pt = name, abt_pt = abt WHERE (name_pt IS NULL OR name_pt = '') AND name IS NOT NULL`;
      messages.push('Copied name to name_pt and abt to abt_pt for projects');
    } catch (e) {}

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}