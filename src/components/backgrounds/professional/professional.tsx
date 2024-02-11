import { Chrono } from "react-chrono";
import { useTheme } from "../../switchers/switchers";
import { experiences } from "./experiences";

export const ProfessionalContent = () => {
  const { theme, language } = useTheme();

  return (
    <section id="professional" className={`${theme === 'dark' ? 'text-white' : 'text-black'} mx-auto max-w-[2000px] animate lg:pt-20`}>
      <Chrono
        items={experiences.map((item, index) => {
          const title = Array.isArray(item.title) ? item.title[0] + item.title[language === 'pt-BR' ? 1 : 2] : item.title;
          const cardTitle = Array.isArray(item.cardTitle) ? item.cardTitle[language === 'pt-BR' ? 0 : 1] : item.cardTitle;
          const cardSubtitle = Array.isArray(item.cardSubtitle) ? item.cardSubtitle[language === 'pt-BR' ? 0 : 1] : item.cardSubtitle;
          const cardDetailedText = Array.isArray(item.cardDetailedText) ? (
            <div>
              <p><b>Soft Skills:</b> {item.cardDetailedText[language === 'pt-BR' ? 0 : 1].softSkills}</p>
              <p><b>Hard Skills:</b> {item.cardDetailedText[language === 'pt-BR' ? 0 : 1].hardSkills}</p>
              <br /><p><b>Description:</b> {item.cardDetailedText[language === 'pt-BR' ? 0 : 1].description}</p>
            </div>
          ) : item.cardDetailedText;

          return {
            title,
            cardTitle,
            key: index,
            url: item.url,
            cardSubtitle,
            cardDetailedText,
          };
        })}
        mode="VERTICAL_ALTERNATING"
        timelinePointDimension={30}
        cardHeight={150}
        slideItemDuration={4000}
        slideShow
        fontSizes={{
          cardTitle: '1rem',
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
};
