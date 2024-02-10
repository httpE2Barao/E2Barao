import { useTheme } from "../switchers/switchers"

export const ProfessionalContent = () => {
  const { theme, language } = useTheme();
  const languageClean = language.replace('-', '')

  return (
    <section id="professional" className={`${theme === 'dark' ? 'text-white' : 'text-black'}`
    }>
    </section>
  )
}