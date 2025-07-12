export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    throw new Error("Chave de API da DeepL não configurada no .env.local");
  }

  const url = 'https://api-free.deepl.com/v2/translate';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang.toUpperCase(),
      source_lang: 'PT',
    }),
  });

  // --- MUDANÇA IMPORTANTE AQUI ---
  // Se a resposta da DeepL não for 'OK' (ex: erro 429 Too Many Requests)
  if (!response.ok) {
    // Tentamos ler o corpo do erro como texto para entender o que aconteceu
    const errorBody = await response.text();
    throw new Error(`Erro da API DeepL: Status ${response.status} - ${errorBody}`);
  }
  
  const data = await response.json();
  
  // A verificação abaixo é uma segurança extra, mas o !response.ok já deve pegar os erros.
  if (data.message) {
      throw new Error(data.message);
  }

  return data.translations[0].text;
}