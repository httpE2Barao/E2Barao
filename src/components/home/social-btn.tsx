import Image from "next/image";

{/* Social Buttons */}
export const SocialBtns = () => {
    return(       
    <span className="flex flex-row-reverse justify-center w-[95%] lg:gap-5 hover:cursor-pointer mt-auto mr-auto py-5 max-md:flex-row max-md:items-center max-md:gap-3 overflow-hidden"> {/* Adicionando responsividade */}
        <div
        className="invert-color-hover h-16 min-w-16 bg-white rounded-full px-5 max-sm:w-16 lg:w-[100px] lg:h-[100px] flex items-center"
        onClick={() => window.open('https://www.linkedin.com/in/e2barao/', '_blank')}>
            <Image
                className="content-animation mx-auto"
                src='/images/icon-linkedin.svg'
                alt='Ver meu Linkedin'
                width={40}
                height={40}
                />
        </div>
        <div
        className="invert-color-hover h-16 min-w-16 bg-white rounded-full max-sm:w-16 lg:w-[100px] lg:h-[100px] flex items-center"
        onClick={() => window.open('https://github.com/httpE2Barao', '_blank')}>
            <Image
                className="content-animation m-auto pt-4 rounded-full p-2"
                src='/images/icon-github.svg'
                alt='Ver meu Github'
                width={80}
                height={80}
                />
        </div>
    </span>
)}