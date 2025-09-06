import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "The Spark",
  "Character Lab",
  "Storyboard",
  "Creation Engine",
  "Animate",
  "The Premiere"
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress" className="p-4 sm:p-6">
      <ol role="list" className="flex flex-wrap items-center justify-center gap-y-4 gap-x-6">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = currentStep > stepIndex;
          const isCurrent = currentStep === stepIndex;

          return (
            <li key={step}>
              <div
                className={`flex items-center font-medium transition-colors duration-200 ${
                  isCurrent ? 'text-black' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                    isCurrent
                      ? 'border-black bg-white'
                      : isCompleted
                      ? 'border-black bg-black'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.454-12.68a.75.75 0 011.04-.208z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={isCurrent ? 'text-black font-bold' : 'text-gray-400'}>{`0${stepIndex}`}</span>
                  )}
                </span>
                <span className="ml-4 hidden sm:block">{step}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;
