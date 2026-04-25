import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS github_cache (
        id SERIAL PRIMARY KEY,
        cache_key VARCHAR(50) NOT NULL UNIQUE,
        data JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_github_cache_key ON github_cache(cache_key)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_github_cache_expires ON github_cache(expires_at)`;

    return NextResponse.json({ message: 'Tabela github_cache criada com sucesso' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: 'Erro ao criar tabela' }, { status: 500 });
  }
}