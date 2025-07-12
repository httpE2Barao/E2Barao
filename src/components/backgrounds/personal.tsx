import Image from "next/image";
import { useTheme } from "../switchers/switchers";
import { useInView } from "react-intersection-observer";
import { experiencesTranslations } from "@/data/translations/experiences";

export const PersonalContent = () => {
  const { theme, language } = useTheme();
  const content = experiencesTranslations.personalContent;

  const [ref0, inView0] = useInView();
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();

  const addAnimationClass = (index: number) => {
    return (inView0 && index === 0) || (inView1 && index === 1) || (inView2 && index === 2) ? 'animate' : '';
  };

  return (
    <section id="personal" className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex-col gap-20 p-4 lg:pt-60 mx-auto max-w-[2350px] pt-20 max-sm:text-center sm:pr-11 lg:p-20`}>
      {content.map((item, index) => (
        <div
          key={index}
          ref={index === 0 ? ref0 : index === 1 ? ref1 : ref2}
          className={`overflow-visible flex-conteiner g-container-${index} mb-52 mx-auto xl:pb-32 ${addAnimationClass(index)}`}
        >
          <h1 className={`gradient-title ${theme === 'dark' ? `gradient-title-black-${index}` : `gradient-title-white-${index}`} text-3xl pb-5 md:text-4xl lg:text-6xl lg:pb-8 tracking-wider leading-lg`}>
            {item.title[language as keyof typeof item.title] || item.title.en}
          </h1>

          {index === 0 && (
            <p className="grid-span pb-4 md:text-left md:text-base lg:text-lg xl:text-lg 2xl:text-xl">
              {item.text1[language as keyof typeof item.text1] || item.text1.en}
            </p>
          )}

          <p className={`md:text-left lg:pt-5 md:text-base lg:text-lg xl:text-lg 2xl:text-xl`}>
            <Image 
              src={`/images/${item.image}`}
              className={`grid-img g-img-${index} pt-3 w-1/2 float-start rounded-2xl ${addAnimationClass(index)}`}
              alt={item.title[language as keyof typeof item.title] || item.title.en}
              width={700}
              height={700}
            />
            {item.text2[language as keyof typeof item.text2] || item.text2.en}
          </p>
        </div>
      ))}
    </section>
  );
}