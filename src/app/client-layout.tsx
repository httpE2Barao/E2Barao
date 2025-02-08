"use client"
import { Header } from '@/components/header/header';
import ThemeProvider from '@/components/switchers/switchers';
import { ToTheTopButton } from '@/components/to-top-btn';
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider>
      <Header />
      {children}
      <ToTheTopButton />
    </ThemeProvider>
  );
}
