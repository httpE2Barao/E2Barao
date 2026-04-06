"use client"
import { Header } from '@/components/header/header';
import ThemeProvider from '@/components/switchers/switchers';
import { ToTheTopButton } from '@/components/to-top-btn';
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isV2 = pathname?.startsWith('/v2');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider>
      {!isV2 && <Header />}
      {children}
      {!isV2 && <ToTheTopButton />}
    </ThemeProvider>
  );
}
