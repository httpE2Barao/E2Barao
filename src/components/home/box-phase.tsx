export const BoxMainPhase = ({language}: {language:string}) => {

  const PhraseMain = [
    ['Faça o que você ama,', <br />, 'ame o que você faz!'],
    ['Do what you love,', <br />, 'love what you do!']
  ];

  return (
    <h1 className="slideRight py-[8vh] flex flex-col gap-10 justify-between textShadow-xl text-[1.77em] text-[#00000077] tracking-widest leading-normal font-extrabold uppercase
    sm:text-4xl xl:text-5xl 2k:text-4xl 2xl:text-5xl 4k:text-6xl w-full">

      <span className="text-left">
        {language === 'pt-BR' ? PhraseMain[0][0] : PhraseMain[1][0]} <br/>
      </span>
      <span className="text-right lg:pt-10">
        {language === 'pt-BR' ? PhraseMain[0][2] : PhraseMain[1][2]}
      </span>
    </h1>
  )
}