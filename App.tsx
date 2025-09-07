import React, { useState, useCallback } from 'react';
import type { ProjectState, Idea, Story, Page } from './types';
import StepIndicator from './components/StepIndicator';
import Step1Spark from './components/Step1_Spark';
import Step2CharacterLab from './components/Step2_CharacterLab';
import Step3Storyboard from './components/Step3_Storyboard';
import Step4CreationEngine from './components/Step4_CreationEngine';
import Step5Animate from './components/Step5_Animate';
import Step6Premiere from './components/Step6_Premiere';
import LandingPage from './components/LandingPage'; // Import the new LandingPage component
import { 
    generateCharacterDescription, 
    generateCharacterSheet, 
    generateStoryPages,
    generateVideoForPage
} from './services/geminiService';

const App: React.FC = () => {
    const [appState, setAppState] = useState<'landing' | 'creating'>('landing');
    const [currentStep, setCurrentStep] = useState(1);
    const [projectState, setProjectState] = useState<ProjectState>({
        status: 'idea',
        idea: null,
        character: null,
        story: null,
        pages: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // For Step 4 progress
    const [creationProgress, setCreationProgress] = useState(0);
    const [creationStatus, setCreationStatus] = useState('');

    // For Step 5 progress
    const [animationStatus, setAnimationStatus] = useState('');

    // For Step 6
    const [isFinalized, setIsFinalized] = useState(false);

    const handleStep1Submit = useCallback(async (idea: Idea) => {
        setIsLoading(true);
        setError(null);
        setProjectState(prev => ({ ...prev, idea }));
        try {
            const description = await generateCharacterDescription(idea);
            const sheetBase64 = await generateCharacterSheet(description);
            const sheetUrl = `data:image/png;base64,${sheetBase64}`;

            setProjectState(prev => ({
                ...prev,
                character: {
                    approvedSheetUrl: sheetUrl,
                    detailedDescription: description,
                    base64Image: sheetBase64
                }
            }));
            setCurrentStep(2);
        } catch (err) {
            setError('Failed to create character. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleStep2TryAgain = useCallback(async () => {
        if (!projectState.idea) return;
        setIsLoading(true);
        setError(null);
        setProjectState(prev => ({ ...prev, character: null }));
        try {
            // Re-run generation from the original idea
            const description = await generateCharacterDescription(projectState.idea);
            const sheetBase64 = await generateCharacterSheet(description);
            const sheetUrl = `data:image/png;base64,${sheetBase64}`;
            setProjectState(prev => ({
                ...prev,
                character: {
                    approvedSheetUrl: sheetUrl,
                    detailedDescription: description,
                    base64Image: sheetBase64
                }
            }));
        } catch (err) {
            setError('Failed to generate a new character. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [projectState.idea]);

    const handleStep3Complete = useCallback(async (story: Story) => {
        setProjectState(prev => ({ ...prev, story }));
        setCurrentStep(4);

        if (!projectState.character?.detailedDescription || !story) return;

        try {
            const pages = await generateStoryPages(
                story,
                projectState.character.detailedDescription,
                (progress, status) => {
                    setCreationProgress(progress);
                    setCreationStatus(status);
                }
            );
            setProjectState(prev => ({ ...prev, pages }));
            setCurrentStep(5);
        } catch (err) {
            setError("Failed to generate story pages. Please go back and try again.");
            console.error(err);
            // Optional: logic to allow user to go back
        }
    }, [projectState.character]);

    const handleStep5Complete = useCallback(async (selectedIndices: number[]) => {
        setIsLoading(true);
        setError(null);
        const updatedPages = [...projectState.pages];
        const RATE_LIMIT_DELAY_MS = 60000; // 60-second delay between video API calls
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < selectedIndices.length; i++) {
            const pageIndex = selectedIndices[i];
            try {
                setAnimationStatus(`Generating video ${i + 1} of ${selectedIndices.length} for page ${pageIndex + 1}... This may take a moment.`);
                updatedPages[pageIndex].animate = true;
                const videoUrl = await generateVideoForPage(updatedPages[pageIndex]);
                updatedPages[pageIndex].videoUrl = videoUrl;
                // Incrementally update state to show progress
                setProjectState(prev => ({ ...prev, pages: [...updatedPages] }));

                // Add a delay before starting the next video to avoid rate limiting
                if (i < selectedIndices.length - 1) {
                    setAnimationStatus(`Pausing for ${RATE_LIMIT_DELAY_MS / 1000}s to cool down the video engine...`);
                    await delay(RATE_LIMIT_DELAY_MS);
                }
            } catch (err: any) {
                console.error(`Failed to generate video for page ${pageIndex + 1}:`, err);
                
                let detailedMessage = "An unexpected error occurred. Please try again later.";
                // Attempt to parse a JSON string error if it exists
                try {
                    const errorJson = JSON.parse(err.message);
                    if (errorJson?.error?.message) {
                        detailedMessage = errorJson.error.message;
                    }
                } catch(e) {
                     if (err instanceof Error) {
                        detailedMessage = err.message;
                    } else if (err?.error?.message) {
                        detailedMessage = err.error.message;
                    } else if (typeof err === 'string') {
                        detailedMessage = err;
                    }
                }
                
                setError(`Failed to generate video for page ${pageIndex + 1}. ${detailedMessage}`);
                setIsLoading(false);
                setAnimationStatus('');
                return; // Stop the process if one video fails
            }
        }

        setProjectState(prev => ({ ...prev, pages: updatedPages }));
        setIsLoading(false);
        setAnimationStatus('');
        setCurrentStep(6);
    }, [projectState.pages]);

    const handleStep6Finalize = useCallback(() => {
        setIsLoading(true);
        // Simulate final assembly, like adding music or titles
        setTimeout(() => {
            setIsLoading(false);
            setIsFinalized(true);
        }, 3000);
    }, []);

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Spark onSubmit={handleStep1Submit} isLoading={isLoading} />;
            case 2:
                return <Step2CharacterLab 
                            character={projectState.character} 
                            onApprove={() => setCurrentStep(3)}
                            onTryAgain={handleStep2TryAgain}
                            isLoading={isLoading} 
                        />;
            case 3:
                return <Step3Storyboard 
                            onComplete={handleStep3Complete} 
                            characterDescription={projectState.character?.detailedDescription || ''}
                        />;
            case 4:
                return <Step4CreationEngine progress={creationProgress} status={creationStatus} />;
            case 5:
                return <Step5Animate pages={projectState.pages} onComplete={handleStep5Complete} isLoading={isLoading} animationStatus={animationStatus} />;
            case 6:
                return <Step6Premiere 
                            pages={projectState.pages}
                            title={projectState.story?.title || 'My Comic Movie'}
                            onFinalize={handleStep6Finalize}
                            isFinalizing={isLoading}
                            isFinalized={isFinalized}
                        />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="bg-white text-gray-800 min-h-screen font-sans flex flex-col">
            <header className="text-center p-4 border-b border-gray-200">
                <h1 className="text-4xl font-black tracking-tighter">
                    Comic Book Movie Creator
                </h1>
            </header>
            
            {appState === 'landing' ? (
                <LandingPage onStart={() => setAppState('creating')} />
            ) : (
                <>
                    <StepIndicator currentStep={currentStep} />
                    <main className="flex-grow flex flex-col items-center justify-center p-4">
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 max-w-2xl w-full text-center">{error}</div>}
                        {renderStep()}
                    </main>
                </>
            )}

            <footer className="text-center p-4 text-xs text-gray-500 border-t border-gray-200">
                Powered by Google AI
            </footer>
        </div>
    );
};

export default App;