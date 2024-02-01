interface SectionProps {
  language: string
}

export const PhraseSection = ( props:SectionProps ) => {
  return (
    <section className="slideBottom flex mx-auto text-center">
      <h1 className="text-6xl font-bold text-azul-claro textShadow-xl tracking-wider leading-relaxed">
        { props.language === 'pt-BR'
          ? `A vida não é esperar a tempestade passar, é aprender a dançar na chuva.`
          : `Life isn't about waiting for the storm to pass, it's learning to dance in the rain.`}
      </h1>
    </section>
  )
}