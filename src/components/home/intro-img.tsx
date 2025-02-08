"use client"
import Image from "next/image";
import React from "react";

const ImagemIntroducao = () => {

    return (
        <span className={'flip-conteiner'}>
            <div className={'flip mx-auto'}>
                <div className="frente">

                </div>
                <div className="verso">
                    <Image
                        src="/images/Foto-perfil_2024.png"
                        alt="Foto minha de perfil sorrindo com uma câmera fotográfica pendurada no pescoço em Times Square."
                        width={500}
                        height={500}
                        className={`verso`}
                    />
                </div>
            </div>
        </span>
    );
};

export default ImagemIntroducao;
