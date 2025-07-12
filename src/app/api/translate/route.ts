import { NextResponse } from 'next/server';
import { translateText } from '@/lib/deepl'; // Importando nossa nova função

export async function POST(request: Request) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ message: 'Texto e idioma de destino são obrigatórios.' }, { status: 400 });
    }

    // Apenas chama a função centralizada
    const translatedText = await translateText(text, targetLang);

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("Erro na API de tradução:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Erro interno do servidor.' }, { status: 500 });
  }
}