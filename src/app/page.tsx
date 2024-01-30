"use client"
import React, { useEffect } from "react";
import Home from "./home/page";
import Projetos from "./Projetos/page";
import Backgrounds from "./trajetoria/page";
import { usePage } from "@/components/switchers/pages";
import { Header } from "@/components/header/header";

export default function Page() {
  const { page } = usePage();
  console.log('Current 1',page)

  // Render the content based on the current page
  const renderContent = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "Projetos":
        return <Projetos />;
      case "backgrounds":
        return <Backgrounds />;
      default:
        return null; 
    }
  };

  return (
    <main>
      <Header />
      {renderContent()}
    </main>
  );
}
