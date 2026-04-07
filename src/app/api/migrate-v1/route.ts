import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v1Data } from '@/data/v1-data';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function saveJsonFile(filename: string, data: any) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST() {
  try {
    console.log('🚀 Migrating v1 data to JSON storage...');

    await saveJsonFile('projects.json', { projects: v1Data.projects });
    console.log(`✅ Saved ${v1Data.projects.length} projects`);

    await saveJsonFile('skills.json', { skills: v1Data.skills });
    console.log(`✅ Saved ${v1Data.skills.length} skills`);

    await saveJsonFile('experience.json', { experience: v1Data.experience });
    console.log(`✅ Saved ${v1Data.experience.length} experience entries`);

    await saveJsonFile('education.json', { education: v1Data.education });
    console.log(`✅ Saved ${v1Data.education.length} education entries`);

    await saveJsonFile('content.json', { content: v1Data.content });
    console.log(`✅ Saved ${v1Data.content.length} content entries`);

    await saveJsonFile('contact.json', { contact: v1Data.contact });
    console.log(`✅ Saved ${v1Data.contact.length} contact entries`);

    return NextResponse.json({ 
      message: 'Migration completed successfully!',
      stats: {
        projects: v1Data.projects.length,
        skills: v1Data.skills.length,
        experience: v1Data.experience.length,
        education: v1Data.education.length,
        content: v1Data.content.length,
        contact: v1Data.contact.length,
      }
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({ message: 'Migration failed', error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to migrate v1 data to JSON storage',
    endpoint: '/api/migrate-v1'
  });
}
