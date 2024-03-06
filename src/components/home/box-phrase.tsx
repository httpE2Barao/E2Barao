export const BoxMainPhrase = ({language}: {language:string}) => {

  const phraseMainPT = 'Faça o que você ama,';
  const phraseMainEN = 'Do what you love,';
  const phraseSubPT = 'ame o que você faz!';
  const phraseSubEN = 'love what you do!';

  return (
    <h1 className="slideRight pt-[7vh] flex flex-col gap-10 justify-between text-[1.77em] text-[#00000077] tracking-widest leading-normal font-extrabold uppercase sm:text-4xl 2k:text-4xl 2xl:text-4xl 4k:text-6xl w-full">

      <span className="text-left max-lg:text-center">
        {language === 'pt-BR' ? phraseMainPT : phraseMainEN}
        <br/>
      </span>
      <span className="text-right max-lg:text-center lg:pt-10">
        {language === 'pt-BR' ? phraseSubPT : phraseSubEN}
      </span>
    </h1>
  )
}
