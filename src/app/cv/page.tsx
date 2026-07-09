"use client";
import { useSearchParams } from 'next/navigation';

export default function CVPage() {
  const searchParams = useSearchParams();
  const language = searchParams.get('lang') || 'pt';

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <iframe
        src={`/api/cv/generate?language=${language}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="CV"
      />
    </div>
  );
}
