import React from 'react';
import BoxMain from "@/components/home/box-main";
import IntroConteiner from '@/components/home/intro-main';
import InfiniteScroll from '@/components/home/infinite-scroll';

export default function Home() {
  
  return (
    <main className="px-1.5 md:px-5 pb-5 max-w-[3020px] mx-auto">
      <section className='flex flex-col gap-20'>
        <BoxMain />
        {/* <IntroConteiner /> */}
        <InfiniteScroll />
      </section>
    </main>
  );
}

{/* <section className="grid grid-col-4 gap-3 lg:gap-6 inset-0 justify-items-stretch 2xl:grid-row-4 ">
        <BoxesSmall />
      </section> */}
{/* <PhraseSection 
          phrase={"Hello, I'm Elias"}
          type={0}
        /> */}