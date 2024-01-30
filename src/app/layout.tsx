import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Page from "./page";
import { Header } from "@/components/header/header";
import ThemeProvider from "@/components/switchers/switchers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elias - Dev. Web",
  description: "Portfolio of a Web Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang={'pt-BR'}>
      <body className={inter.className}>
        <ThemeProvider>
          <Page />
        </ThemeProvider>
      </body>
    </html>
  );
}
