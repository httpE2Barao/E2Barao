import { Chrono } from "react-chrono";
import { useTheme } from "../../switchers/switchers"
import { experiences } from "./experiences";

export const ProfessionalContent = () => {
  const { theme, language } = useTheme();

  return (
    <section id="professional" className={`${theme === 'dark' ? 'text-white' : 'text-black'} mx-auto max-w-[2000px] animate lg:pt-20`}>
      <Chrono
        items={experiences.map((item, index) => ({
          title: Array.isArray(item.title) ? item.title.length > 1 && language === 'pt-BR'
            ? item.title[0] + item.title[1]
            : item.title[0] + item.title[2]
          : item.title,
          cardTitle: Array.isArray(item.cardTitle) ? item.cardTitle.length > 1 && language === 'pt-BR'
            ? item.cardTitle[0]
            : item.cardTitle[1]
          : item.cardTitle,
          url: item.url,
          cardSubtitle: Array.isArray(item.cardSubtitle) ? item.cardSubtitle.length > 1 && language === 'pt-BR'
            ? item.cardSubtitle[0]
            : item.cardSubtitle[1]
          : item.cardSubtitle,
          cardDetailedText: Array.isArray(item.cardDetailedText) ? item.title.length > 1 && language === 'pt-BR'
          ? item.cardDetailedText[0]
          : item.cardDetailedText[1]
        : item.cardDetailedText,
        }))}
        mode="VERTICAL_ALTERNATING"
        timelinePointDimension={35}
        cardHeight={150}
        slideItemDuration={4000}
        slideShow
        fontSizes={{
          cardTitle: '1.23rem',
        }}
        theme={{
          primary: '#00FFFF',
          secondary: `${theme === 'dark' ? 'white' : 'black'}`,
          titleColor: `${theme === 'dark' ? 'white' : 'black'}`,
          cardTitleColor: '#FFC700',
          cardBgColor: 'white',
          cardForeColor: '#00FFFF',
          titleColorActive: 'black',
          cardDetailsColor: 'black',
        }}
      />
    </section>
  );
}