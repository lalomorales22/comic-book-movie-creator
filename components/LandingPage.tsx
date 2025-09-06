import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const StepCard: React.FC<{
  step: number;
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ step, title, description, children }) => (
  <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-transform transform hover:-translate-y-1 hover:-translate-x-1">
    <div className="flex items-center mb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white font-bold text-black">{`0${step}`}</span>
      <h3 className="ml-4 text-2xl font-bold text-black">{title}</h3>
    </div>
    <p className="text-gray-500 mb-4">{description}</p>
    <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center">
      {children}
    </div>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="text-center my-12 max-w-4xl">
        <h2 className="text-5xl md:text-7xl font-black text-black tracking-tighter">
          Your Idea, Your Movie, Your Universe.
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-600">
          Welcome to the Comic Book Movie Creator! Turn any spark of an idea—a drawing, a sentence, or a spoken thought—into a complete, animated comic book movie. Guided by AI, you'll craft a unique story from character design to the final premiere.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-12">
        {/* Step 1 Mockup */}
        <StepCard step={1} title="The Spark" description="Start with a text, voice, or image prompt.">
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2">
            <div className="flex space-x-2">
              <div className="px-3 py-1 bg-black text-white text-xs rounded">Text</div>
              <div className="px-3 py-1 bg-white border border-gray-300 text-xs rounded">Voice</div>
              <div className="px-3 py-1 bg-white border border-gray-300 text-xs rounded">Image</div>
            </div>
            <div className="w-full h-16 bg-white border border-gray-300 rounded p-1">
                <p className="text-gray-400 text-xs">A hero squirrel...</p>
            </div>
          </div>
        </StepCard>

        {/* Step 2 Mockup */}
        <StepCard step={2} title="Character Lab" description="Approve the AI-generated character sheet for consistency.">
            <div className="w-full h-full flex items-center justify-center">
                 <div className="w-2/3 h-full bg-white border border-gray-300 rounded p-2 flex items-center">
                    <div className="w-1/2 h-full flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                        <div className="w-10 h-16 bg-gray-300 mt-1"></div>
                    </div>
                    <div className="w-1/2 h-full flex flex-col items-center">
                         <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                         <div className="w-10 h-16 bg-gray-200 mt-1"></div>
                    </div>
                 </div>
            </div>
        </StepCard>

        {/* Step 3 Mockup */}
        <StepCard step={3} title="Storyboard" description="Collaborate with the AI in a chat to outline your story.">
            <div className="w-full h-full flex flex-col justify-end space-y-2">
                <div className="p-2 bg-gray-200 text-xs rounded-lg self-start">How about "Astro-Squirrel's Adventure"?</div>
                <div className="p-2 bg-black text-white text-xs rounded-lg self-end">I love it!</div>
            </div>
        </StepCard>

        {/* Step 4 Mockup */}
        <StepCard step={4} title="Creation Engine" description="Watch as the AI generates all 16 pages of your comic book.">
           <div className="w-full flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-black">75%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-black h-2.5 rounded-full" style={{width: '75%'}}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Generating page 12...</p>
           </div>
        </StepCard>

        {/* Step 5 Mockup */}
        <StepCard step={5} title="Animate" description="Select four of your favorite comic panels to bring to life.">
            <div className="w-full h-full grid grid-cols-2 gap-2">
                <div className="bg-white border-2 border-black rounded"></div>
                <div className="bg-white border border-gray-300 rounded"></div>
                <div className="bg-white border border-gray-300 rounded"></div>
                <div className="bg-white border-2 border-black rounded"></div>
            </div>
        </StepCard>

        {/* Step 6 Mockup */}
        <StepCard step={6} title="The Premiere" description="Watch, download, and share your final comic book movie.">
             <div className="w-full h-full bg-black rounded flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                </div>
             </div>
        </StepCard>
      </div>

      <div className="my-12 text-center">
        <button
          onClick={onStart}
          className="px-16 py-5 bg-black text-white rounded-lg font-bold text-2xl hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Give it a try
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
