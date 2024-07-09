export const BoxMainPhrase = ({language}: {language:string}) => {

  const phraseMainPT = 'A colaboração entre as pessoas é o que torna a tecnologia poderosa.';
  const phraseMainEN = 'Collaboration among people is what makes technology powerful.';

  return (
    <h1 className="slideRight pt-5 px-3 ml-auto max-w-[20em] flex flex-col gap-10 justify-between text-[1.77em] text-[#000000ca] tracking-wide font-extrabold sm:text-4xl 2k:text-4xl 2xl:text-4xl 4k:text-6xl w-full">

      <span className="text-right leading-normal">
        {language === 'pt-BR' ? phraseMainPT : phraseMainEN}
        <br/>
      </span>

    </h1>
  )
}
