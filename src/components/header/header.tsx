import { Logo } from "./logo";
import { MenuNav } from "./menu";
import { Nav } from "./nav";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-[.23rem]">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <Logo />

          <Nav />
          <MenuNav />
        </div>
      </nav>
    </header>
  );
};
