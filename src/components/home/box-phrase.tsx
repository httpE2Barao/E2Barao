export const BoxMainPhrase = ({language}: {language:string}) => {

  const phraseMainPT = 'Tornando sua presença online única e memorável.';
  const phraseMainEN = 'Collaboration among people is what makes technology powerful.';

  return (
    <h1 className="slideRight pt-5 px-3 mr-auto max-w-[15em] flex flex-col gap-10 justify-between text-5xl text-[#000000ca] font-bold md:text-6xl 2k:text-6xl 2xl:text-6xl 4k:text-7xl w-full">
      <span className="main-phrase text-center md:text-left max-md:py-10 leading-tight">
          {language === 'pt-BR' ? phraseMainPT : phraseMainEN}
        <br/>
      </span>
    </h1>
  )
}
