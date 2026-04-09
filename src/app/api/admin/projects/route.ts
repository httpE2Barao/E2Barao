import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET() {
  try {
    const projects = await readArrayFromJson('projects.json', 'projects', v1Data.projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(v1Data.projects);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projects = await readArrayFromJson('projects.json', 'projects', v1Data.projects);
    
    const newProject = {
      id: Math.max(0, ...projects.map((p: any) => p.id || 0)) + 1,
      ...body,
      created_at: new Date().toISOString(),
    };
    
    projects.push(newProject);
    await writeJsonFile('projects.json', { projects });
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const text = await request.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { id, ...fields } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const projects: any[] = await readArrayFromJson<any>('projects.json', 'projects', []);
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...fields };
  await writeJsonFile('projects.json', { projects });

  return NextResponse.json(projects[index]);
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const projects = await readArrayFromJson('projects.json', 'projects', v1Data.projects);
    const filtered = projects.filter((p: any) => p.id !== parseInt(id));
    await writeJsonFile('projects.json', { projects: filtered });
    
    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
