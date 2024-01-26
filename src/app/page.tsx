"use client"
import React, { useState } from "react";
import { ThemeProvider } from "@/components/Switchers";
import { Header } from "@/components/header/header";
import Backgrounds from "./trajetoria/page";
import Link from "next/link";
import Home from "./home/page";

export default function Root() {
  
  const [atualPage, setAtualPage] = useState('');

  const togglePage = (newPage: string) => {
    setAtualPage(newPage)
    console.log(atualPage)
  }

  return (
    <ThemeProvider>
        <Header togglePage={togglePage} />
      <Home />
    </ThemeProvider>
  );
}
