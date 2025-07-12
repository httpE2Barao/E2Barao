"use client";
import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const PREDEFINED_TAGS = [
  'react', 'nextjs', 'typescript', 'javascript', 'tailwind', 
  'figma', 'api', 'html', 'css', 'sass', 'nodejs', 'vite', 
  'bootstrap', 'jquery', 'github'
];
type Lang = 'pt' | 'en' | 'es' | 'fr' | 'zh';

export default function AdminPage() {
  // --- SEÇÃO DE ESTADOS (STATES) ---
  const [fields, setFields] = useState({
    pt: { name: '', abt: '', alt: '' },
    en: { name: '', abt: '', alt: '' },
    es: { name: '', abt: '', alt: '' },
    fr: { name: '', abt: '', alt: '' },
    zh: { name: '', abt: '', alt: '' },
  });
  
  const [site, setSite] = useState('');
  const [repo, setRepo] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const [activeTab, setActiveTab] = useState<Lang>('pt');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- SEÇÃO DE FUNÇÕES (HANDLERS) ---
  const handleFieldChange = (lang: Lang, fieldName: 'name' | 'abt' | 'alt', value: string) => {
    setFields(prev => ({ ...prev, [lang]: { ...prev[lang], [fieldName]: value }}));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTranslate = async () => {
    if (!fields.pt.name && !fields.pt.abt && !fields.pt.alt) {
      setMessage({ type: 'error', text: 'Preencha os campos em Português para traduzir.' });
      return;
    }
    setIsTranslating(true);
    setMessage(null);
    const targetLangs: Lang[] = ['en', 'es', 'fr', 'zh'];

    try {
      for (const lang of targetLangs) {
        for (const field of ['name', 'abt', 'alt']) {
          const sourceText = fields.pt[field as keyof typeof fields.pt];
          if (sourceText) {
            const response = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: sourceText, targetLang: lang }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(`Falha ao traduzir para ${lang.toUpperCase()}`);
            handleFieldChange(lang, field as 'name'|'abt'|'alt', result.translatedText);
          }
        }
      }
      setMessage({ type: 'success', text: 'Traduções concluídas!'});
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Erro na tradução.' });
    } finally {
      setIsTranslating(false);
    }
  };
  
  // --- LÓGICA DE ENVIO DO FORMULÁRIO ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (images.length === 0 || !fields.pt.name || !fields.en.name) {
      setMessage({ type: 'error', text: 'Nome (em PT e EN) e ao menos uma imagem são obrigatórios.' });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    const projectSrc = fields.en.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Adiciona todos os campos de texto
    formData.append('src', projectSrc);
    formData.append('site', site);
    formData.append('repo', repo);

    Object.entries(fields).forEach(([lang, langFields]) => {
      Object.entries(langFields).forEach(([fieldName, value]) => {
        formData.append(`${fieldName}_${lang}`, value);
      });
    });

    selectedTags.forEach(tag => formData.append('tags[]', tag));
    images.forEach(image => formData.append('images', image));

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Falha ao adicionar o projeto.');
      
      setMessage({ type: 'success', text: result.message });
      // Limpa todo o formulário
      setFields({ pt: { name: '', abt: '', alt: '' }, en: { name: '', abt: '', alt: '' }, es: { name: '', abt: '', alt: '' }, fr: { name: '', abt: '', alt: '' }, zh: { name: '', abt: '', alt: '' }});
      setSite(''); setRepo(''); setSelectedTags([]); setImages([]);
      const fileInput = document.getElementById('images') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- SEÇÃO DE RENDERIZAÇÃO (JSX) ---
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-4xl my-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 pb-2 text-center">Adicionar Novo Projeto</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg space-y-6">
          
          <div className="flex border-b border-gray-600 mb-4 flex-wrap">
            {(['pt', 'en', 'es', 'fr', 'zh'] as Lang[]).map(lang => (
              <button key={lang} type="button" onClick={() => setActiveTab(lang)} className={`py-2 px-4 font-medium uppercase text-sm ${activeTab === lang ? 'border-b-2 border-azul-claro text-azul-claro' : 'text-gray-400'}`}>
                {lang}
              </button>
            ))}
          </div>

          <div>
            {Object.keys(fields).map(lang => (
              <div key={lang} className={activeTab === lang ? 'space-y-4' : 'hidden'}>
                <div>
                  <label htmlFor={`name_${lang}`} className="block text-sm font-medium text-gray-300 mb-1">Nome ({lang.toUpperCase()})*</label>
                  <input type="text" id={`name_${lang}`} value={fields[lang as Lang].name} onChange={e => handleFieldChange(lang as Lang, 'name', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" required={lang === 'pt' || lang === 'en'} />
                </div>
                <div>
                  <label htmlFor={`abt_${lang}`} className="block text-sm font-medium text-gray-300 mb-1">Descrição ({lang.toUpperCase()})*</label>
                  <textarea id={`abt_${lang}`} value={fields[lang as Lang].abt} onChange={e => handleFieldChange(lang as Lang, 'abt', e.target.value)} rows={4} className="w-full bg-gray-700 p-2 rounded-md" required={lang === 'pt' || lang === 'en'}></textarea>
                </div>
                <div>
                  <label htmlFor={`alt_${lang}`} className="block text-sm font-medium text-gray-300 mb-1">Texto Alternativo da Imagem ({lang.toUpperCase()})</label>
                  <input type="text" id={`alt_${lang}`} value={fields[lang as Lang].alt} onChange={e => handleFieldChange(lang as Lang, 'alt', e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" />
                </div>
                {lang === 'pt' && (
                  <div className="pt-2">
                    <button type="button" onClick={handleTranslate} disabled={isTranslating} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 flex items-center">
                      {isTranslating && <LoadingSpinner />}
                      <span className={isTranslating ? 'ml-2' : ''}>{isTranslating ? 'Traduzindo...' : 'Traduzir PT para outros idiomas'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <hr className="border-gray-600"/>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="site" className="block text-sm font-medium text-gray-300 mb-1">URL do Site</label>
                <input type="url" id="site" value={site} onChange={e => setSite(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" />
              </div>
              <div>
                <label htmlFor="repo" className="block text-sm font-medium text-gray-300 mb-1">URL do Repositório</label>
                <input type="url" id="repo" value={repo} onChange={e => setRepo(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md" />
              </div>
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-700 border border-gray-600 rounded-md">
                {selectedTags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 bg-azul-claro text-black text-sm font-semibold px-2 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-black hover:text-red-700 font-bold">&times;</button>
                  </span>
                ))}
                <input type="text" id="tags" list="tag-suggestions" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-grow bg-transparent outline-none p-1" placeholder="Digite ou selecione e tecle Enter" />
                <datalist id="tag-suggestions">
                  {PREDEFINED_TAGS.filter(tag => !selectedTags.includes(tag)).map(tag => (<option key={tag} value={tag} />))}
                </datalist>
              </div>
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-300 mb-1">Imagens do Projeto* <span className="text-xs text-gray-400 ml-2">(a primeira será a capa)</span></label>
              <input type="file" id="images" onChange={handleImageChange} multiple accept="image/png, image/jpeg, image/webp" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-azul-claro file:text-black hover:file:bg-azul-pastel" required />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-900/50 rounded-md">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                    <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    {index === 0 && <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">Capa</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end pt-4">
            {message && (<p className={`mr-4 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>)}
            <button type="submit" disabled={isLoading} className="bg-white text-black font-bold py-2 px-6 rounded-md hover:bg-gray-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center">
              {isLoading && <LoadingSpinner />}
              <span className={isLoading ? 'ml-2' : ''}>{isLoading ? 'Enviando...' : 'Adicionar Projeto'}</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}