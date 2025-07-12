"use client"
import Spline from "@splinetool/react-spline";
import { useState } from "react";
import { useInView } from "react-intersection-observer"; 

export const Modelo3D = () => {
    const [isLoading, setIsLoading] = useState(true);
    // Setup do Intersection Observer
    const { ref, inView } = useInView({
        triggerOnce: true, 
        threshold: 0.1, 
    });

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <main ref={ref} className={`flex flex-col items-center justify-center min-h-screen pb-0`}>
            <div className='modelo-3d w-[50vw] max-xl:w-[100vw] h-[100vh] max-w-6xl rounded-lg overflow-hidden'>
                {(isLoading || !inView) && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                )}
                
                {inView && (
                    <Spline
                        scene="./scene.splinecode"
                        onLoad={handleLoad}
                    />
                )}
            </div>
        </main>
    )
}