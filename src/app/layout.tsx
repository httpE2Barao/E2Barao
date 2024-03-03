import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles.css"
import ThemeProvider from "@/components/switchers/switchers";
import { MenuNav } from "@/components/header/menu";
import { Header } from "@/components/header/header";
import { ToTheTopButton } from "@/components/to-top-btn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elias - Dev. Web",
  description: "Portfolio of a Web Developer",
  icons: "/images/icon-logo.svg"
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
