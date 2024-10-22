import { Logo } from "./logo";
import { MenuNav } from "./menu";
import { Nav } from "./nav";

export const Header = () => {
  return (
    <header className={`sticky p-5 py-0 flex items-center justify-between max-w-[3020px] mx-auto`}>
      <a className="overflow-hidden">
        <Logo />
      </a>
      <Nav />
      <MenuNav />
    </header>
  );
};
