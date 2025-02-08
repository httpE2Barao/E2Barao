import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import ClientLayout from "./client-layout";
import "./globals.css";
import "./styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elias - Dev. Web",
  description: "Portfolio of a Web Developer",
  icons: "/images/icon-logo-dark-clean.png"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className={inter.className}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}