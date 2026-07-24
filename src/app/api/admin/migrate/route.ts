import { NextResponse } from 'next/server';
import { runMigrations } from '@/lib/db/migrate';

export async function POST() {
  const result = await runMigrations();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await runMigrations();
  return NextResponse.json(result);
}
