"use client"
import React from "react";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { usePage } from "@/components/switchers/pages";

export const Header = (  ) => {

  return (
    <header className={`px-10 py-10 flex items-center justify-between`}>
      <a>
        <Logo />
      </a>
      <Nav />
    </header>
  );
};
