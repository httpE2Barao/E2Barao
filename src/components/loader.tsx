"use client"
import { useEffect, useState } from "react";
import { Header } from "./header/header";
import { useTheme } from "./switchers/switchers";

interface LoaderProps {
  selector: string;
}

export function Loader(props: LoaderProps): JSX.Element {
  const { theme } = useTheme();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loaderContainer = document.querySelector('.loader-container');
    const pageContent = document.querySelector(props.selector);

    if (loaderContainer && pageContent) {
      pageContent.classList.add('visible');
      setLoaded(true);
    }
  }, [props.selector]);

  return (
    <div className={`loader-container ${loaded ? 'hidden' : ''} ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <Header />
      <div className="loader"></div>
    </div>
  );
}
