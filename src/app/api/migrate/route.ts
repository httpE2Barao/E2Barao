import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { rawProjectsData } from '@/data/projects-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  if (secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    let insertedCount = 0;

    // A MUDANÇA ESTÁ AQUI: Invertemos o array
    const reversedProjects = rawProjectsData.reverse();

    for (const project of reversedProjects) {
      const { src, site, repo, tags, name, alt, abt } = project;
      const tagsForDb = `{${(tags || []).join(',')}}`;

      const result = await sql`
        INSERT INTO projects (src, site_url, repo_url, image_url, tags, name_pt, name_en, alt_pt, alt_en, abt_pt, abt_en)
        VALUES (
          ${src}, ${site}, ${repo}, ${`/images/project_${src}.png`}, ${tagsForDb}, 
          ${name.ptBR}, ${name.enUS}, ${alt.ptBR}, ${alt.enUS}, ${abt.ptBR}, ${abt.enUS}
        )
        ON CONFLICT (src) DO NOTHING;
      `;

      if (result.rowCount) {
        insertedCount++;
      }
    }
    
    return NextResponse.json({ message: `Migração concluída! ${insertedCount} novos projetos foram adicionados na ordem correta.` });

  } catch (error) {
    console.error("Erro durante a migração:", error);
    return NextResponse.json({ message: 'Erro interno do servidor durante a migração.', error: (error as Error).message }, { status: 500 });
  }
}