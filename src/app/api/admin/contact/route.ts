import { NextRequest, NextResponse } from 'next/server';
import { readArrayFromJson, writeJsonFile } from '@/lib/json-storage';
import { v1Data } from '@/data/v1-data';

export async function GET() {
  try {
    const contact = await readArrayFromJson('contact.json', 'contact', v1Data.contact);
    return NextResponse.json(contact.filter((c: any) => c.visible !== false));
  } catch (error) {
    return NextResponse.json(v1Data.contact.filter((c: any) => c.visible !== false));
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const contact = await readArrayFromJson('contact.json', 'contact', v1Data.contact);
    const index = contact.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    contact[index] = { ...contact[index], ...fields, updated_at: new Date().toISOString() };
    await writeJsonFile('contact.json', { contact });

    return NextResponse.json(contact[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
