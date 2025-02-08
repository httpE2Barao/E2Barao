import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Elias - Dev. Web",
  description: "Portfolio of a Web Developer",
  icons: "/images/icon-logo-dark-clean.png"
};

export function RootLayoutServer({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
