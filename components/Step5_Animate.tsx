import React, { useState } from 'react';
import type { Page } from '../types';
import LoadingSpinner from './LoadingSpinner';

declare var JSZip: any;

interface Step5AnimateProps {
  pages: Page[];
  onComplete: (selectedIndices: number[]) => void;
  isLoading: boolean;
  animationStatus: string;
}

const Step5Animate: React.FC<Step5AnimateProps> = ({ pages, onComplete, isLoading, animationStatus }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const MAX_SELECT = 4;

  const toggleSelection = (pageNumber: number) => {
    const index = pageNumber - 1;
    setSelected(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      if (prev.length < MAX_SELECT) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleDownloadZip = async () => {
    if (isZipping || !pages.length) return;
    setIsZipping(true);

    try {
        const zip = new JSZip();
        pages.forEach((page) => {
            if (page.base64Image) {
                const pageNum = page.pageNumber.toString().padStart(2, '0');
                zip.file(`page_${pageNum}.png`, page.base64Image, { base64: true });
            }
        });

        const blob = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'comic_book_pages.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Failed to create zip file", error);
        // In a real app, you might want to show an error toast here.
    } finally {
        setIsZipping(false);
    }
  };


  if (isLoading) {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
             <h2 className="text-3xl font-bold text-black">Animating your scenes...</h2>
             <p className="text-gray-500 mt-2 mb-6">This can take a minute or two. The AI is working its magic!</p>
             <LoadingSpinner message={animationStatus || "Generating video clips..."}/>
        </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-black text-center">Step 5: Lights, Camera, Action!</h2>
      <p className="text-gray-500 text-center mt-2 mb-6">Select four pages to animate, or download all pages as a ZIP file.</p>

      <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 py-4 mb-4 text-center border-b-2 border-gray-200">
        <p className="text-lg font-semibold text-black mb-4">
          {selected.length} / {MAX_SELECT} selected for animation
        </p>
        <div className="flex justify-center items-center flex-wrap gap-4">
            <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-8 py-3 bg-white text-black border-2 border-black rounded-lg font-bold text-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
                {isZipping ? 'Zipping...' : 'Download Pages (.zip)'}
            </button>
            <button
                onClick={() => onComplete(selected)}
                disabled={selected.length !== MAX_SELECT}
                className="px-8 py-3 bg-black text-white rounded-lg font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
                Generate Animations
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pages.map((page, index) => {
          const isSelected = selected.includes(index);
          return (
            <div
              key={page.pageNumber}
              onClick={() => toggleSelection(page.pageNumber)}
              className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${
                isSelected ? 'border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]' : 'border-2 border-gray-200 hover:border-black'
              }`}
            >
              <div className="aspect-[4/3] bg-gray-100">
                <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-black font-bold">PAGE {page.pageNumber}</p>
                <p className="text-gray-600 text-sm mt-1 h-20 overflow-hidden">{page.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Step5Animate;