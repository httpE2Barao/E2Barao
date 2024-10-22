import { Header } from "@/components/header/header";
import { MenuNav } from "@/components/header/menu";
import ThemeProvider from "@/components/switchers/switchers";
import { ToTheTopButton } from "@/components/to-top-btn";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
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
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang={'pt-BR'}>
      <ThemeProvider>
        <body className={`${inter.className} relative`}>
          <Header />
          {children}
          <MenuNav />
          <ToTheTopButton />
        </body>
      </ThemeProvider>
    </html>
  );
}