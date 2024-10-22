"use client"
import Spline from "@splinetool/react-spline";
import { useState } from "react";


export const Modelo3D = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
    setIsLoading(false);
    };

    return (
        <main className={`flex flex-col items-center justify-center min-h-screen pb-0`}>
            <div className='modelo-3d w-full h-[100vh] max-w-6xl rounded-lg overflow-hidden'>
            {isLoading && (
                <div className="flex items-center justify-center w-full h-full fixed top-20 left-0 z-50">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
            )}
            <Spline
                scene="./scene.splinecode"
                onLoad={handleLoad}
                />
            </div>
        </main>
    )
}