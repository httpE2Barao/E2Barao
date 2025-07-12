interface iContactMe {
  theme: string
}

export const ContactMe = (props: iContactMe) => {

  const contactsList = [
    ['WhatsApp', 'https://api.whatsapp.com/send?phone=5541998046755'],
    ['Email', 'mailto:e2barao@hotmail.com'],
    ['GitHub', 'https://github.com/httpE2Barao'],
    ['LinkedIn', 'https://www.linkedin.com/in/e2barao/']
  ]

  return (
    <ul className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    flex flex-col text-center md:flex-row gap-10 text-3xl`}>
      {contactsList.map((contact, index) => {
        return (
          <li key={index}>
            <button
              onClick={() => { window.open(contact[1]) }}
              className={`
                underline hover:cursor-pointer hover:text-azul-claro
                focus:outline-none focus-visible:text-azul-claro focus-visible:ring-2
                ${props.theme === 'light' && 'textShadow-xl'}
              `}
            >
              {contact[0]}
            </button>
          </li>
        )
      })}
    </ul>
  )
}