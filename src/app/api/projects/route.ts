import { NextResponse } from 'next/server'; 
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'pt';

  try {
    const { rows } = await sql`
      SELECT 
        id, src, site_url, repo_url, image_urls, tags, created_at,
        name_pt, name_en, name_es, name_fr, name_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
      FROM projects 
      ORDER BY created_at DESC;
    `;

    const projects = rows.map(row => {
      const getText = (field: string) => {
        return row[`${field}_${lang}`] || row[`${field}_en`] || row[`${field}_pt`];
      };
      
      return {
        src: row.src,
        site: row.site_url,
        repo: row.repo_url,
        tags: row.tags,
        imageUrls: row.image_urls,
        name: getText('name'),
        alt: getText('alt'),
        abt: getText('abt'),
      };
    });
    
    return NextResponse.json(projects);

  } catch (error) {
    console.error("Erro ao buscar projetos do banco de dados:", error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'Pelo menos uma imagem é obrigatória.' }, { status: 400 });
    }

    const blobUploads = await Promise.all(
      images.map((image) => put(image.name, image, { access: 'public' }))
    );

    const imageUrls = blobUploads.map((blob) => blob.url);
    const tags = formData.getAll('tags[]') as string[];
    const tagsForDb = `{${tags.join(',')}}`;
    const imageUrlsForDb = `{${imageUrls.join(',')}}`;

    await sql`
      INSERT INTO projects (
        src, site_url, repo_url, image_urls, tags, 
        name_pt, name_en, name_es, name_fr, name_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
      )
      VALUES (
        ${formData.get('src') as string}, 
        ${formData.get('site') as string}, 
        ${formData.get('repo') as string}, 
        ${imageUrlsForDb}, 
        ${tagsForDb}, 
        ${formData.get('name_pt') as string}, ${formData.get('name_en') as string}, ${formData.get('name_es') as string}, ${formData.get('name_fr') as string}, ${formData.get('name_zh') as string},
        ${formData.get('abt_pt') as string}, ${formData.get('abt_en') as string}, ${formData.get('abt_es') as string}, ${formData.get('abt_fr') as string}, ${formData.get('abt_zh') as string},
        ${formData.get('alt_pt') as string}, ${formData.get('alt_en') as string}, ${formData.get('alt_es') as string}, ${formData.get('alt_fr') as string}, ${formData.get('alt_zh') as string}
      )
      ON CONFLICT (src) DO NOTHING;
    `;

    return NextResponse.json({ message: 'Projeto adicionado com sucesso!', urls: imageUrls }, { status: 201 });

  } catch (error) {
    console.error("Erro ao adicionar projeto:", error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}