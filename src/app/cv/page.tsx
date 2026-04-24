"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function CVPage() {
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    
    const language = searchParams.get('lang') || 'pt';
    fetch(`/api/cv/download?language=${language}`)
      .then(r => r.json())
      .then(data => {
        if (data.direct) setPdfUrl(data.direct);
      })
      .catch(() => setPdfUrl(null));
  }, [searchParams]);

  if (!pdfUrl) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000', color: '#fff' }}>
        Carregando CV...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <iframe
        src={pdfUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="CV"
      />
    </div>
  );
}