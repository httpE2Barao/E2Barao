import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return fallback;
  }
}

export async function writeJsonFile(filename: string, data: any): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function saveArrayToJson(filename: string, array: any[], key: string): Promise<void> {
  const data = { [key]: array };
  await writeJsonFile(filename, data);
}

export async function readArrayFromJson<T>(filename: string, key: string, fallback: T[]): Promise<T[]> {
  const data = await readJsonFile<Record<string, T[]>>(filename, { [key]: fallback });
  return data[key] || fallback;
}
