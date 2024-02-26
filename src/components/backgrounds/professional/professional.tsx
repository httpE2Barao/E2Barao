import React from "react";
import { Chrono } from "react-chrono";
import { useTheme } from "../../switchers/switchers";
import { experiences } from "./experiences";

export const ProfessionalContent = () => {
  const { theme, language } = useTheme();

  return (
    <section
      id="professional"
      className={`${theme === "dark" ? "text-white" : "text-black"
        } mx-auto max-w-[2500px] animate lg:pt-20`}
    >
      <Chrono
        items={experiences.map((item, index) => {
          const title = Array.isArray(item.title)
            ? item.title[0] + item.title[language === "pt-BR" ? 1 : 2]
            : item.title;
          const cardTitle = Array.isArray(item.cardTitle)
            ? item.cardTitle[language === "pt-BR" ? 0 : 1]
            : item.cardTitle;
          const cardSubtitle = Array.isArray(item.cardSubtitle)
            ? item.cardSubtitle[language === "pt-BR" ? 0 : 1]
            : item.cardSubtitle;
          const cardDetailedText = Array.isArray(item.cardDetailedText)
            ? (
              <div>
                {language === 'pt-BR' && (
                  <>
                    <p>
                      <b>Soft Skills:</b> {item.cardDetailedText[0].softSkills}
                    </p>
                    <p>
                      <b>Hard Skills:</b> {item.cardDetailedText[0].hardSkills}
                    </p>
                    <br />
                    <ul>
                      {Array.isArray(item.cardDetailedText[0].description) ? (
                        item.cardDetailedText[0].description.map((desc, idx) => (
                          <>
                            <li key={idx}><b>~</b>{desc}</li><br />
                          </>
                        ))
                      ) : (
                        <>
                          <li><b>~</b>{item.cardDetailedText[0].description}</li><br />
                        </>
                      )}
                    </ul>
                    <br />
                  </>
                )}
              </div>
            )
            : item.cardDetailedText;

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
          title: ".7em",
          cardTitle: "1.2em",
        }}
        theme={{
          primary: "#00FFFF",
          secondary: `${theme === "dark" ? "white" : "black"}`,
          titleColor: `${theme === "dark" ? "white" : "black"}`,
          cardTitleColor: "#00a5a5",
          cardBgColor: "white",
          cardForeColor: "#00FFFF",
          titleColorActive: `${theme === "dark" ? "black" : "white"}`,
          cardDetailsColor: "black",
        }}
      />
    </section>
  );
};
