import { useEffect, useState } from "react";

const getInitialPage = () => {
  const savedPage = localStorage.getItem('page');
  return typeof savedPage === 'string' ? savedPage : 'home';
}

export const usePage = () => {
  const [page, setPage] = useState(getInitialPage);

  useEffect(() => {
    const savedPage = localStorage.getItem('page');
    setPage(savedPage || 'home');
  }, []);

  useEffect(() => {
    localStorage.setItem('page', page);
  }, [page])

  const changePage = (newPage:string) => {
    setPage(newPage);
  };

  return { page, changePage };
};
