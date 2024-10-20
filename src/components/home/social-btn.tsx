import Image from "next/image";

{/* Social Buttons */}
export const SocialBtns = () => {
    return(       
    <span className=" flex flex-row-reverse justify-center w-[95%] lg:gap-5 mt-auto mr-auto py-5 max-md:flex-row max-md:items-center max-md:gap-3 overflow-hidden"> {/* Adicionando responsividade */}
        <div
        className="invert-color-hover rounded-full flex items-center hover:cursor-pointer"
        onClick={() => window.open('https://www.linkedin.com/in/e2barao/', '_blank')}>
            <Image
                className="content-animation mx-auto invert-color"
                src='/images/icon-linkedin.png'
                alt='Ver meu Linkedin'
                width={69}
                height={69}
                />
        </div>
        <div
        className="invert-color-hover px-1 rounded-full flex items-center hover:cursor-pointer"
        onClick={() => window.open('https://github.com/httpE2Barao', '_blank')}>
            <Image
                className="content-animation m-auto rounded-full max-lg:p-[5px] lg:w-16"
                src='/images/icon-github.png'
                alt='Ver meu Github'
                width={80}
                height={80}
                />
        </div>
    </span>
)}