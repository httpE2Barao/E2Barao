import React from "react";
import { Logo } from "./logo";
import { Nav } from "./nav";
import { MenuNav } from "../menu";

export const Header = () => {
  return (
    <header className={`relative p-5 flex items-center justify-between w-full
    2xl:p-10`}>
      <a>
        <Logo />
      </a>
      <Nav />
      <MenuNav />
    </header>
  );
};
