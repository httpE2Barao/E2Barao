import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getInitialPage = () => {
  if (typeof window !== 'undefined') {
    const savedPage = localStorage.getItem('page');
    return typeof savedPage === 'string' ? savedPage : 'home';
  }
  return '/';
}

export const usePage = () => {
  const [page, setPage] = useState(getInitialPage());
  const [pageSelected, setPageSelected] = useState(-1);
  const router = useRouter();

  useEffect(() => {
    const savedPage = localStorage.getItem('page');
    setPage(savedPage || '/');
  }, []);

  useEffect(() => {
    localStorage.setItem('page', page);
  }, [page]);

  const changePage = (newPage: number) => {
    let newPageString = '/';

    switch (newPage) {
      case 0:
        newPageString = '/';
        break;
      case 1:
        newPageString = '/Projects';
        break;
      case 2:
        newPageString = '/Experiences';
        break;
      case 3:
        newPageString = '/Tecs';
        break;
      case 4:
        newPageString = '/Contacts';
        break;
      default:
        newPageString = '';
    }

    setPageSelected(newPage - 1);
    router.push(newPageString);
    setPage(newPageString);
    localStorage.setItem('page', newPageString);
  };

  return { page, changePage, pageSelected, setPageSelected };
};
