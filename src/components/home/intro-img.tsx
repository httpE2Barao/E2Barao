"use client"
import Image from "next/image";
import React from "react";

const ImagemIntroducao = () => {

    return (
        <span className={'flip-conteiner'}>
            <div className={'flip max-lg:right-0'}>
                <div className="frente">

                </div>
                <div className="verso">
                    <img
                        src="/images/Foto-perfil_2024.png"
                        alt="Foto minha de perfil sorrindo com uma câmera fotográfica pendurada no pescoço em Times Square."
                        className={`verso`}
                    />
                </div>
            </div>
        </span>
    );
};

export default ImagemIntroducao;
