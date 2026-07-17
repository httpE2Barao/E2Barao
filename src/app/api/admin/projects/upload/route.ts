import { NextRequest, NextResponse } from 'next/server';
import { put, del, list } from '@vercel/blob';

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

    const nameParts = file.name.split('.');
    const ext = nameParts.length > 1 ? '.' + nameParts.pop() : (allowedVideoTypes.includes(file.type) ? '.mp4' : '.png');
    const fileName = `project_${projectSrc}${ext}`;

    const { url } = await put(fileName, file, { access: 'public' });

    return NextResponse.json({
      success: true,
      url,
      fileName,
    });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url') || searchParams.get('fileName');

    if (!url) {
      return NextResponse.json({ error: 'url or fileName is required' }, { status: 400 });
    }

    if (url.startsWith('http')) {
      await del(url);
    } else {
      const { blobs } = await list({ prefix: url });
      for (const blob of blobs) {
        await del(blob.url);
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'project_' });
    const projectImages = blobs.map(b => ({
      name: b.pathname,
      url: b.url,
    }));
    return NextResponse.json(projectImages);
  } catch {
    return NextResponse.json([]);
  }
}
