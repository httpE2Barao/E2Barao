import type { Metadata } from 'next';
import { Rubik } from "next/font/google"; // Importe a fonte
import ClientLayout from "./client-layout";
import "./globals.css";
import "./styles.css";

// Configure a fonte
const rubik = Rubik({ 
  subsets: ["latin"],
  display: 'swap', 
  variable: '--font-rubik' 
});

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
    // Aplique a classe da fonte ao HTML
    <html lang="pt-br" className={rubik.className}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}