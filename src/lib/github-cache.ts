import { sql } from '@vercel/postgres';

export interface GitHubCache {
  id: number;
  cache_key: string;
  data: any;
  created_at: string;
  expires_at: string;
}

const CACHE_TTL_HOURS = 24;

export async function getCachedData(key: string): Promise<any | null> {
  try {
    const { rows } = await sql<GitHubCache>`
      SELECT data, expires_at FROM github_cache 
      WHERE cache_key = ${key} AND expires_at > NOW()
    `;
    
    if (rows.length > 0) {
      return rows[0].data;
    }
    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function setCachedData(key: string, data: any): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + CACHE_TTL_HOURS);
    
    await sql`
      INSERT INTO github_cache (cache_key, data, expires_at)
      VALUES (${key}, ${JSON.stringify(data)}, ${expiresAt.toISOString()})
      ON CONFLICT (cache_key) DO UPDATE SET
        data = EXCLUDED.data,
        expires_at = EXCLUDED.expires_at,
        created_at = NOW()
    `;
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

export async function clearExpiredCache(): Promise<void> {
  try {
    await sql`DELETE FROM github_cache WHERE expires_at < NOW()`;
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

export function getGitHubHeaders() {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'E2Barao-Portfolio',
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
}