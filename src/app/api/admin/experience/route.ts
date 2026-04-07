import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET() {
  try {
    const experience = await readArrayFromJson('experience.json', 'experience', v1Data.experience);
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json(v1Data.experience);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const experience = await readArrayFromJson('experience.json', 'experience', v1Data.experience);
    
    const newExp = {
      id: Math.max(0, ...experience.map((e: any) => e.id || 0)) + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    experience.push(newExp);
    await writeJsonFile('experience.json', { experience });
    
    return NextResponse.json(newExp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const experience = await readArrayFromJson('experience.json', 'experience', v1Data.experience);
    const index = experience.findIndex((e: any) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    experience[index] = { ...experience[index], ...fields, updated_at: new Date().toISOString() };
    await writeJsonFile('experience.json', { experience });

    return NextResponse.json(experience[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const experience = await readArrayFromJson('experience.json', 'experience', v1Data.experience);
    const filtered = experience.filter((e: any) => e.id !== parseInt(id));
    await writeJsonFile('experience.json', { experience: filtered });
    
    return NextResponse.json({ message: 'Experience deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
