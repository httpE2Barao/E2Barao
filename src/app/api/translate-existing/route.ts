import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { translateText } from '@/lib/deepl';

// Função auxiliar para adicionar uma pausa e evitar bloqueios da API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const { rows: projects } = await sql`SELECT * FROM projects;`;
    let updatedProjectCount = 0;

    console.log(`Iniciando verificação de tradução para ${projects.length} projetos.`);

    for (const project of projects) {
      let needsUpdate = false;
      const updates: { [key: string]: string } = {};

      const fieldsToTranslate = [
        { lang: 'en', field: 'name' }, { lang: 'en', field: 'abt' }, { lang: 'en', field: 'alt' },
        { lang: 'es', field: 'name' }, { lang: 'es', field: 'abt' }, { lang: 'es', field: 'alt' },
        { lang: 'fr', field: 'name' }, { lang: 'fr', field: 'abt' }, { lang: 'fr', field: 'alt' },
        { lang: 'zh', field: 'name' }, { lang: 'zh', field: 'abt' }, { lang: 'zh', field: 'alt' },
      ];

      for (const { lang, field } of fieldsToTranslate) {
        const dbField = `${field}_${lang}`;
        const sourceField = `${field}_pt`;

        // Verifica se o campo está vazio/nulo no banco
        if (!project[dbField]) {
          console.log(`Traduzindo ${field} para ${lang.toUpperCase()} do projeto "${project.name_pt}"...`);
          
          const translated = await translateText(project[sourceField], lang);
          updates[dbField] = translated;
          needsUpdate = true;
          
          // Pausa para não sobrecarregar a API
          await delay(500); // 500ms de pausa
        }
      }

      // Se alguma tradução foi feita para este projeto, atualiza o banco
      if (needsUpdate) {
        // Constrói a query de UPDATE dinamicamente
        const setClauses = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const query = `UPDATE projects SET ${setClauses} WHERE id = $1`;
        
        await sql.query(query, [project.id, ...Object.values(updates)]);
        
        updatedProjectCount++;
        console.log(`Projeto "${project.name_pt}" atualizado.`);
        
        // Pausa maior entre a atualização de diferentes projetos
        await delay(1000); 
      }
    }

    return NextResponse.json({ message: `Verificação concluída. ${updatedProjectCount} projetos foram atualizados com novas traduções.` });

  } catch (error) {
    console.error("Erro na tradução em massa:", error);
    return NextResponse.json({ message: 'Erro ao traduzir projetos existentes.', error: (error as Error).message }, { status: 500 });
  }
}