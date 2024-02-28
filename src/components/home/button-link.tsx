"use client"
import { useTheme } from "../switchers/switchers"

export const ButtonToTecs = () => {

  const { theme, language, changePage } = useTheme();

  return (
    <div className="flex col-span-4 lg:col-span-3">
      <button className={`${theme==='dark' ? 'bg-white' : 'bg-dark text-white'} invert-color-hover mx-auto my-5 rounded-xl p-4 text-3xl `}
      onClick={() => changePage(3)}>
        {language === 'pt-BR'}
        <b>
          Ver tudo
        </b>
      </button>
    </div>
  )
} 