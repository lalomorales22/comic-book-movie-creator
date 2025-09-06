import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Step6PremiereProps {
  pages: Page[];
  title: string;
  onFinalize: () => void;
  isFinalizing: boolean;
  isFinalized: boolean;
}

const MoviePlayer: React.FC<{ pages: Page[]; title: string }> = ({ pages, title }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const synth = window.speechSynthesis;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Cleanup speech synthesis on component unmount
        return () => {
            if (synth.speaking) {
                synth.cancel();
            }
        };
    }, [synth]);

    const playMovie = () => {
        setIsPlaying(true);
        setCurrentPageIndex(0);
    };
    
    const stopMovie = () => {
        setIsPlaying(false);
        setCurrentPageIndex(null);
        if (synth.speaking) {
            synth.cancel();
        }
    }

    useEffect(() => {
        if (isPlaying && currentPageIndex !== null && currentPageIndex < pages.length) {
            const page = pages[currentPageIndex];
            utteranceRef.current = new SpeechSynthesisUtterance(page.narrationScript);
            
            utteranceRef.current.onend = () => {
                setTimeout(() => {
                    setCurrentPageIndex(prev => (prev !== null ? prev + 1 : 0));
                }, 1000); // 1-second pause between panels
            };
            synth.speak(utteranceRef.current);
        } else if (currentPageIndex === pages.length) {
            stopMovie();
        }
    }, [isPlaying, currentPageIndex, pages, synth]);

    const currentPage = currentPageIndex !== null ? pages[currentPageIndex] : null;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="aspect-video bg-black rounded-lg shadow-2xl flex items-center justify-center p-4 relative overflow-hidden border-2 border-black">
                {!isPlaying && currentPageIndex === null && (
                     <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">{title}</h3>
                        <p className="text-gray-300 mt-2">Your comic book movie is ready!</p>
                        <button onClick={playMovie} className="mt-8 px-8 py-4 bg-white text-black rounded-lg font-bold text-xl hover:bg-gray-200 transition-transform transform hover:scale-105">
                           ▶️ PLAY MOVIE
                        </button>
                    </div>
                )}
                {currentPage && (
                    <>
                    {currentPage.videoUrl ? (
                         <video key={currentPage.videoUrl} src={currentPage.videoUrl} autoPlay muted loop className="w-full h-full object-contain"></video>
                    ) : (
                        <img src={currentPage.imageUrl} alt={`Page ${currentPage.pageNumber}`} className="w-full h-full object-contain animate-pulse-once" style={{animation: 'pulse-once 5s ease-in-out'}}/>
                    )}
                     <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                        <p className="text-white text-center text-sm sm:text-base">{currentPage.narrationScript}</p>
                    </div>
                    </>
                )}
                {isPlaying && (
                    <button onClick={stopMovie} className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 z-10">
                        STOP
                    </button>
                )}
            </div>
             <style>{`
                @keyframes pulse-once {
                    0%, 100% { transform: scale(1); }
                    10% { transform: scale(1.02); }
                }
                .animate-pulse-once {
                    animation: pulse-once 5s ease-in-out;
                }
            `}</style>
        </div>
    )
}

const Step6Premiere: React.FC<Step6PremiereProps> = ({ pages, title, onFinalize, isFinalizing, isFinalized }) => {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 text-center">
      <h2 className="text-3xl font-bold text-black">Step 6: The Premiere</h2>
      <p className="text-gray-500 mt-2 mb-8">
        {isFinalized ? "Your movie is ready to watch and download!" : "One final step to assemble your masterpiece."}
      </p>

      {!isFinalized && !isFinalizing && (
        <button
          onClick={onFinalize}
          className="px-12 py-4 bg-black text-white rounded-lg font-bold text-xl hover:bg-gray-800 disabled:bg-gray-300 transition-transform transform hover:scale-105"
        >
          Finalize & Create My Movie
        </button>
      )}

      {isFinalizing && (
          <div className="w-full max-w-md mx-auto">
            <LoadingSpinner message="Assembling your movie..." />
            <p className="text-gray-500">This involves rendering scenes, generating narration, and adding final touches.</p>
          </div>
      )}

      {isFinalized && <MoviePlayer pages={pages} title={title} />}

      {isFinalized && (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white border-2 border-black rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-bold text-black text-center">Download Your Creation</h3>
            <p className="text-gray-500 text-center mt-2 mb-6">Save the animated scenes you brought to life.</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
                {pages.filter(p => p.videoUrl).map((page) => (
                    <a
                        key={page.pageNumber}
                        href={page.videoUrl}
                        download={`comic_movie_scene_${page.pageNumber}.mp4`}
                        className="px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-transform transform hover:scale-105"
                    >
                        Download Scene {page.pageNumber}
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Step6Premiere;