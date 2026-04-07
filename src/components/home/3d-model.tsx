"use client"
import dynamic from "next/dynamic"
import { useState, Suspense } from "react"
import { useWelcomeAudio } from "@/hooks/use-welcome-audio";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null
})

export const Modelo3D = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { playWelcome } = useWelcomeAudio();

    const handleLoad = () => {
        setIsLoading(false);
        playWelcome();
    };

    return (
        <main className={`flex flex-col items-center justify-center min-h-screen pb-0`}>
            <div className='modelo-3d w-[50vw] max-xl:w-[100vw] h-[100vh] max-w-6xl rounded-lg overflow-hidden will-change-transform'>
                {isLoading && (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    </div>
                )}
                
                <Suspense fallback={null}>
                    <Spline
                        scene="./scene.splinecode"
                        onLoad={handleLoad}
                    />
                </Suspense>
            </div>
        </main>
    )
}