"use client"
import React, { useState } from "react";
import { ThemeProvider } from "@/components/Switchers";
import { Header } from "@/components/header/header";
import Projetos from "./projetos/page";

export default function Root() {
  
  const [atualPage, setAtualPage] = useState('');

  const togglePage = (newPage: string) => {
    setAtualPage(newPage)
    console.log(atualPage)
  }

  return (
    <ThemeProvider>
      <Header togglePage={togglePage} />
    </ThemeProvider>
  );
}
