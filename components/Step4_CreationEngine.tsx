import React from 'react';

interface Step4CreationEngineProps {
  progress: number;
  status: string;
}

const Step4CreationEngine: React.FC<Step4CreationEngineProps> = ({ progress, status }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
      <h2 className="text-3xl font-bold text-black">Step 4: The Creation Engine</h2>
      <p className="text-gray-500 mt-2 mb-8">The AI is now bringing your story to life. Please wait while we generate all 16 pages of your comic book.</p>

      <div className="bg-white border-2 border-black p-8 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="w-full bg-gray-200 rounded-full h-5 mb-4 border-2 border-black p-0.5">
          <div
            className="bg-black h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-black text-lg font-semibold">{Math.round(progress)}% Complete</p>
        <p className="text-gray-600 mt-2 h-6">{status}</p>
      </div>
    </div>
  );
};

export default Step4CreationEngine;
