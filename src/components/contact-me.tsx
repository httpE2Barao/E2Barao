interface iContactMe {
  theme: string
}

export const ContactMe = (props: iContactMe) => {

  const contactsList = [
    ['WhatsApp', 'https://api.whatsapp.com/send?phone=551998046755'],
    ['Email', 'mailto:e2barao@hotmail.com'],
    ['GitHub', 'https://github.com/httpE2Barao'],
    ['LinkedIn', 'https://www.linkedin.com/in/e2barao/']
  ]

  return (
    <ul className={`${props.theme === 'dark' ? 'text-white' : 'text-black'}
    flex flex-row gap-10 text-3xl`}>
      {contactsList.map((contact, index) => {
        return (
          <li key={index} className={`underline hover:cursor-pointer hover:text-azul-claro
          ${props.theme === 'light' && 'textShadow-xl'}`}
            onClick={() => { window.open(contact[1]) }}>
            {contact[0]}
          </li>
        )
      })}
    </ul>
  )
} 