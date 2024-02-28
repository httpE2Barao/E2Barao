export const BoxMainPhrase = ({language}: {language:string}) => {

  const phraseMainPT = 'Faça o que você ama,';
  const phraseMainEN = 'Do what you love,';
  const phraseSubPT = 'ame o que você faz!';
  const phraseSubEN = 'love what you do!';

  return (
    <h1 className="slideRight py-[8vh] flex flex-col gap-10 justify-between textShadow-xl text-[1.77em] text-[#00000077] tracking-widest leading-normal font-extrabold uppercase sm:text-4xl xl:text-5xl 2k:text-4xl 2xl:text-5xl 4k:text-6xl w-full">

      <span className="text-left">
        {language === 'pt-BR' ? phraseMainPT : phraseMainEN}
        <br />
      </span>
      <span className="text-right lg:pt-10">
        {language === 'pt-BR' ? phraseSubPT : phraseSubEN}
      </span>
    </h1>
  )
}