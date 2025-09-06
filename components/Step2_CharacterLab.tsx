import React from 'react';
import type { Character } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Step2CharacterLabProps {
  character: Character | null;
  onApprove: () => void;
  onTryAgain: () => void;
  isLoading: boolean;
}

const Step2CharacterLab: React.FC<Step2CharacterLabProps> = ({ character, onApprove, onTryAgain, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
      <h2 className="text-3xl font-bold text-black">Step 2: The Character Lab</h2>
      <p className="text-gray-500 mt-2 mb-8">Here's your main character! Approve the design to continue, or try again for a different look.</p>

      <div className="bg-white p-6 rounded-lg border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] min-h-[300px] flex items-center justify-center">
        {isLoading && !character ? (
            <LoadingSpinner message="Generating character sheet..."/>
        ) : character ? (
          <img src={character.approvedSheetUrl} alt="Character Model Sheet" className="max-w-full h-auto max-h-96 rounded-md" />
        ) : (
            <p className="text-gray-400">Character sheet will appear here.</p>
        )}
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onTryAgain}
          disabled={isLoading || !character}
          className="px-8 py-3 bg-white text-black border-2 border-black rounded-lg font-bold hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          {isLoading ? 'Generating...' : 'Try Again'}
        </button>
        <button
          onClick={onApprove}
          disabled={isLoading || !character}
          className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Approve Character
        </button>
      </div>
    </div>
  );
};

export default Step2CharacterLab;
