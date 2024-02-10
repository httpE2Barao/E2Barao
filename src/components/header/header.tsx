import React from "react";
import { Logo } from "./logo";
import { Nav } from "./nav";

export const Header = () => {
  return (
    <header className={`p-5 z-50 flex items-center justify-between w-full
    2xl:p-10`}>
      <a>
        <Logo />
      </a>
      <Nav />
    </header>
  );
};
