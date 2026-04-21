import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    const content = await readArrayFromJson('content.json', 'content', v1Data.content);
    
    const contentWithIds = content.map((c: any, i: number) => ({ ...c, id: i + 1 }));

    if (section) {
      return NextResponse.json(contentWithIds.filter((c: any) => c.section === section));
    }
    
    return NextResponse.json(contentWithIds);
  } catch (error) {
    return NextResponse.json(v1Data.content);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, section, key, ...fields } = body;

    if (!section || !key) {
      return NextResponse.json({ error: 'section and key are required' }, { status: 400 });
    }

    const content = await readArrayFromJson('content.json', 'content', v1Data.content);
    const index = content.findIndex((c: any) => c.section === section && c.key === key);

    if (index === -1) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    content[index] = { ...content[index], ...fields, updated_at: new Date().toISOString() };
    await writeJsonFile('content.json', { content });

    return NextResponse.json({ ...content[index], id: index + 1 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
