import Image from 'next/image';

const InfiniteScroll = () => {

    const listaDeItens = [
        // { src: "/images/img-html.png", alt: "HTML" },
        { src: "/images/img-css.png", alt: "CSS" },
        { src: "/images/img-javascript.png", alt: "JavaScript" },
        { src: "/images/img-figma.png", alt: "Figma" },
        { src: "/images/img-github.png", alt: "Github" },
        { src: "/images/img-react.png", alt: "React"},
        { src: "/images/img-tailwind.png", alt: "Tailwind" },
        { src: "/images/img-sass.png", alt: "Sass" },
        { src: "/images/img-api.png", alt: "Api" },
        { src: "/images/img-bootstrap.png", alt: "Bootstrap" },
        { src: "/images/img-jquery.png", alt: "JQuery" },
        { src: "/images/img-lightroom.png", alt: "Lightroom" },
        { src: "/images/img-microsoft365.png", alt: "Microsoft 365" },
        { src: "/images/img-photoshop.png", alt: "Photoshop CS6" },
        { src: "/images/img-nextjs.png", alt: "NextJS" },
    ];

    const itemProps = "infinite-scroll-item absolute text-white rounded w-32 h-32 max-md:w-24 max-md:h-24"; 

    return (
        <section className="scroll-wrapper relative h-32 w-full mx-auto overflow-hidden max-md:h-28"> 
            {listaDeItens.map((item, index) => {
                return (
                    <div key={index} className={`${itemProps} scroll-item-${index} invert-color-hover`}>
                        <Image 
                            src={item.src} 
                            alt={item.alt} 
                            width={80}
                            height={80}
                            className="w-20 h-20 max-md:w-20 max-md:h-20 max-xl:30" 
                        />
                    </div>
                );
            })}
        </section>
    );
};

export default InfiniteScroll;