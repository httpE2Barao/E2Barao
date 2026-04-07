import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET() {
  try {
    const education = await readArrayFromJson('education.json', 'education', v1Data.education);
    return NextResponse.json(education);
  } catch (error) {
    return NextResponse.json(v1Data.education);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const education = await readArrayFromJson('education.json', 'education', v1Data.education);
    
    const newEdu = {
      id: Math.max(0, ...education.map((e: any) => e.id || 0)) + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    education.push(newEdu);
    await writeJsonFile('education.json', { education });
    
    return NextResponse.json(newEdu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const education = await readArrayFromJson('education.json', 'education', v1Data.education);
    const index = education.findIndex((e: any) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    education[index] = { ...education[index], ...fields, updated_at: new Date().toISOString() };
    await writeJsonFile('education.json', { education });

    return NextResponse.json(education[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const education = await readArrayFromJson('education.json', 'education', v1Data.education);
    const filtered = education.filter((e: any) => e.id !== parseInt(id));
    await writeJsonFile('education.json', { education: filtered });
    
    return NextResponse.json({ message: 'Education deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
