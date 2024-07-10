"use client";
import Image from "next/image";
import { useTheme } from "../switchers/switchers";

const ArrowToDown = () => {
    const { language, theme } = useTheme();
    const handleClick = (targetId: string) => {
        smoothScroll(targetId);
    };
    const smoothScroll = (targetId: string) => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            console.error(`Element with ID ${targetId} not found`);
        }
    };
    return (
        <>
            <Image src='/images/icon-down-arrow.png' alt="seta pra baixo" width={50} height={50}
                className={`${theme === 'dark' && 'invert-color'} seta-animation mx-auto hover:cursor-pointer`}
                onClick={() => { handleClick('#intro') }} />
        </>
    )
}

export default ArrowToDown;