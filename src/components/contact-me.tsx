import { useTheme } from "./switchers/switchers";
import { contactsTranslations } from "@/data/translations/contacts";

export const ContactMe = () => {
  const { theme, language } = useTheme();
  const lang = language as keyof typeof contactsTranslations.contactLabels.whatsapp;
  
  // A lista agora busca os nomes traduzidos, mantendo os links fixos.
  const contactsList = [
    { 
      name: contactsTranslations.contactLabels.whatsapp[lang] || contactsTranslations.contactLabels.whatsapp.en,
      url: 'https://api.whatsapp.com/send?phone=5541998046755'
    },
    { 
      name: contactsTranslations.contactLabels.email[lang] || contactsTranslations.contactLabels.email.en,
      url: 'mailto:e2barao@hotmail.com'
    },
    { 
      name: contactsTranslations.contactLabels.github[lang] || contactsTranslations.contactLabels.github.en,
      url: 'https://github.com/httpE2Barao'
    },
    { 
      name: contactsTranslations.contactLabels.linkedin[lang] || contactsTranslations.contactLabels.linkedin.en,
      url: 'https://www.linkedin.com/in/e2barao/'
    },
  ];

  return (
    <ul className={`${theme === 'dark' ? 'text-white' : 'text-black'}
    flex flex-col text-center md:flex-row gap-10 text-3xl`}>
      {contactsList.map((contact, index) => (
        <li key={index}>
          <button
            onClick={() => { window.open(contact.url) }}
            className={`
              underline hover:cursor-pointer hover:text-azul-claro
              focus:outline-none focus-visible:text-azul-claro focus-visible:ring-2
              ${theme === 'light' && 'textShadow-xl'}
            `}
          >
            {contact.name}
          </button>
        </li>
      ))}
    </ul>
  );
}