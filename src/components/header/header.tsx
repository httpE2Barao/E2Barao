import Link from "next/link";
import { Logo } from "./logo";
import { Nav } from "./nav";

export const Header = ({ togglePage }: any) => {

  return (
    <header className={`px-10 py-10 flex items-center justify-between`}>
      <Link href={'/home'}>
        <Logo />
      </Link>
      <Nav togglePage={togglePage} />
    </header >
  );
};
