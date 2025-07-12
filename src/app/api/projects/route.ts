import { NextResponse } from 'next/server'; 
import { sql } from '@vercel/postgres';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'pt'; // Default 'pt'

  try {
    // 1. Busca todas as colunas de idioma do banco de dados
    const { rows } = await sql`
      SELECT 
        id, src, site_url, repo_url, image_urls, tags, created_at,
        name_pt, name_en, name_es, name_fr, name_zh,
        abt_pt, abt_en, abt_es, abt_fr, abt_zh,
        alt_pt, alt_en, alt_es, alt_fr, alt_zh
      FROM projects 
      ORDER BY created_at DESC;
    `;

    // 2. Processa os resultados no JavaScript para escolher o idioma correto
    const projects = rows.map(row => {
      // Função auxiliar para escolher o texto do idioma correto, com fallback para inglês ou português
      const getText = (field: string) => {
        const fieldForLang = `${field}_${lang}`; // ex: name_es
        const fieldForEn = `${field}_en`;     // ex: name_en
        const fieldForPt = `${field}_pt`;     // ex: name_pt
        return row[fieldForLang] || row[fieldForEn] || row[fieldForPt];
      };
      
      return {
        src: row.src,
        site: row.site_url,
        repo: row.repo_url,
        tags: row.tags,
        imageUrls: row.image_urls,
        // Usa a função auxiliar para cada campo de texto
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
    
    // ... (extração dos outros campos) ...
    const name_pt = formData.get('name_pt') as string;
    const name_en = formData.get('name_en') as string;

    if (!images || images.length === 0) {
      return NextResponse.json({ message: 'Pelo menos uma imagem é obrigatória.' }, { status: 400 });
    }

    const blobUploads = await Promise.all(
      images.map((image) =>
        put(image.name, image, { access: 'public' })
      )
    );

    const imageUrls = blobUploads.map((blob) => blob.url);
    const tags = formData.getAll('tags[]') as string[];

    // --- A CORREÇÃO ESTÁ AQUI ---
    // Formatamos ambos os arrays para o formato do Postgres
    const tagsForDb = `{${tags.join(',')}}`;
    const imageUrlsForDb = `{${imageUrls.join(',')}}`;

    await sql`
      INSERT INTO projects (
        src, site_url, repo_url, image_urls, tags, 
        name_pt, name_en, alt_pt, alt_en, abt_pt, abt_en
        -- Adicione aqui os outros campos de idioma (es, fr, zh)
      )
      VALUES (
        ${formData.get('src') as string}, 
        ${formData.get('site') as string}, 
        ${formData.get('repo') as string}, 
        ${imageUrlsForDb},  -- Usando a variável formatada
        ${tagsForDb}, 
        ${name_pt}, ${name_en}, 
        ${formData.get('alt_pt') as string}, ${formData.get('alt_en') as string},
        ${formData.get('abt_pt') as string}, ${formData.get('abt_en') as string}
        -- Adicione aqui os outros campos de idioma
      )
      ON CONFLICT (src) DO NOTHING;
    `;

    return NextResponse.json({ message: 'Projeto adicionado com sucesso!', urls: imageUrls }, { status: 201 });

  } catch (error) {
    console.error("Erro ao adicionar projeto:", error);
    // ... (seu tratamento de erro) ...
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}