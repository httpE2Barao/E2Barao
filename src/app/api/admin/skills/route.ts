import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET() {
  try {
    const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json(v1Data.skills);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
    
    const newSkill = {
      id: Math.max(0, ...skills.map((s: any) => s.id || 0)) + 1,
      ...body,
    };
    
    skills.push(newSkill);
    await writeJsonFile('skills.json', { skills });
    
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
    const index = skills.findIndex((s: any) => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    skills[index] = { ...skills[index], ...fields, updated_at: new Date().toISOString() };
    await writeJsonFile('skills.json', { skills });

    return NextResponse.json(skills[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const skills = await readArrayFromJson('skills.json', 'skills', v1Data.skills);
    const filtered = skills.filter((s: any) => s.id !== parseInt(id));
    await writeJsonFile('skills.json', { skills: filtered });
    
    return NextResponse.json({ message: 'Skill deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
