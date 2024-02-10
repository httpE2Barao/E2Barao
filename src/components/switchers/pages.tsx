import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const getInitialPage = () => {
  if (typeof window !== 'undefined') {
    const savedPage = localStorage.getItem('page');
    return typeof savedPage === 'string' ? savedPage : 'home';
  }
  return 'home';
}

export const usePage = () => {
  const [page, setPage] = useState(getInitialPage);
  const [selected, setSelected] = useState(null)
  const router = useRouter();

  useEffect(() => {
    const savedPage = localStorage.getItem('page');
    setPage(savedPage || '');
  }, []);

  useEffect(() => {
    localStorage.setItem('page', page);
  }, [page])

  const changePage = (newPage:number) => {
    var newPageString = '';

    if (newPage == 0) {
      newPageString = '/'
    } if (newPage == 1) {
      newPageString = 'Backgrounds'
    } if (newPage == 2){
      newPageString = 'Projects'
    } if (newPage == 3){
      newPageString = 'Tecnologies'
    }

    console.log(newPage)
    router.push(newPageString);
    setPage(newPageString);
    localStorage.setItem('page', page);
  };

  return { page, changePage, selected, setSelected };
};
