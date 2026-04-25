import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const projectSrc = formData.get('projectSrc') as string;

    if (!file || !projectSrc) {
      return NextResponse.json({ error: 'File and projectSrc are required' }, { status: 400 });
    }

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: jpeg, png, webp, gif, mp4, webm, mov' }, { status: 400 });
    }

    const maxSize = allowedVideoTypes.includes(file.type) ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${maxSize / 1024 / 1024}MB` }, { status: 400 });
    }

    try {
      await fs.access(IMAGES_DIR);
    } catch {
      await fs.mkdir(IMAGES_DIR, { recursive: true });
    }

    const ext = path.extname(file.name) || (allowedVideoTypes.includes(file.type) ? '.mp4' : '.png');
    const fileName = `project_${projectSrc}${ext}`;
    const filePath = path.join(IMAGES_DIR, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/images/${fileName}`,
      fileName 
    });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    const filePath = path.join(IMAGES_DIR, fileName);

    try {
      await fs.unlink(filePath);
      return NextResponse.json({ success: true, message: 'Image deleted' });
    } catch (error) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Image deletion failed:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await fs.access(IMAGES_DIR);
    const files = await fs.readdir(IMAGES_DIR);
    const projectImages = files
      .filter(f => f.startsWith('project_') && /\.(png|jpg|jpeg|webp|gif|mp4|webm|mov)$/i.test(f))
      .map(f => ({
        name: f,
        url: `/images/${f}`
      }));
    return NextResponse.json(projectImages);
  } catch {
    return NextResponse.json([]);
  }
}
