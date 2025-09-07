import React, { useState, useRef, useEffect } from 'react';
import type { Idea } from '../types';

interface Step1SparkProps {
  onSubmit: (idea: Idea) => void;
  isLoading: boolean;
}

const InputMethodTab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors duration-200 ${
      active ? 'bg-black text-white' : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

const Step1Spark: React.FC<Step1SparkProps> = ({ onSubmit, isLoading }) => {
  const [inputType, setInputType] = useState<'text' | 'voice' | 'image'>('text');
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 'SpeechRecognition' is the standard, 'webkitSpeechRecognition' is for Chrome/Safari
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // Only capture a single utterance
      recognition.lang = 'en-US';
      recognition.interimResults = false; // We don't need intermediate results

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      // This event fires when speech has been successfully recognized
      recognition.onresult = (event: any) => {
        // The result is a SpeechRecognitionResultList object
        // We get the transcript from the first result
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };

      // Handle errors, which is crucial for debugging and user feedback
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'no-speech') {
            // This is a common case, not necessarily an error to show the user
            console.log("No speech was detected.");
        } else if (event.error === 'not-allowed') {
            // This happens if the user denies microphone permission
            console.error("Microphone access was not granted.");
        }
        // Ensure the recording state is reset on error.
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setBase64Image((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return; // Guard against unsupported browser

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setText(''); // Clear any previous text before starting a new recording
      recognitionRef.current.start();
    }
  };

  const handleSubmit = () => {
    if (isLoading) return;

    let idea: Idea | null = null;
    if (inputType === 'text' && text.trim()) {
      idea = { type: 'text', content: text.trim() };
    } else if (inputType === 'voice' && text.trim()) {
      idea = { type: 'voice', content: text.trim() };
    } else if (inputType === 'image' && base64Image) {
      idea = { type: 'image', content: text || "A character from the image", base64Image };
    }
    
    if (idea) {
      onSubmit(idea);
    }
  };

  const isSubmitDisabled = isLoading || (inputType === 'text' && !text.trim()) || (inputType === 'voice' && !text.trim()) || (inputType === 'image' && !base64Image);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-black text-center">Step 1: The Spark</h2>
        <p className="text-gray-500 text-center mt-2 mb-8">Provide the central concept for your story.</p>

        <div className="flex justify-center space-x-2 mb-6">
            <InputMethodTab active={inputType === 'text'} onClick={() => setInputType('text')}>Text</InputMethodTab>
            <InputMethodTab active={inputType === 'voice'} onClick={() => setInputType('voice')}>Voice</InputMethodTab>
            <InputMethodTab active={inputType === 'image'} onClick={() => setInputType('image')}>Image</InputMethodTab>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            {inputType === 'text' && (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., A brave little astronaut squirrel who discovers a talking alien flower on Mars..."
                    className="w-full h-32 p-3 bg-white border-2 border-black rounded-md text-black focus:ring-2 focus:ring-black focus:border-black transition"
                    disabled={isLoading}
                />
            )}

            {inputType === 'voice' && (
                <div className="text-center">
                    <button onClick={toggleRecording} disabled={!recognitionRef.current || isLoading} className="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition flex items-center mx-auto">
                        {isRecording ? (
                            <><svg className="animate-pulse h-5 w-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16z"></path></svg> Stop Recording</>
                        ) : (
                            <><svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> Start Recording</>
                        )}
                    </button>
                    <p className="text-gray-500 mt-4 h-12">{text || "Click to start recording your idea."}</p>
                </div>
            )}
            
            {inputType === 'image' && (
                <div className="flex flex-col items-center">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-2 file:border-black file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100" disabled={isLoading} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 h-48 object-cover rounded-lg border-2 border-black" />}
                    <textarea value={text} onChange={e => setText(e.target.value)} placeholder="(Optional) Add a brief description" className="w-full mt-4 p-2 bg-white border-2 border-black rounded-md text-black"></textarea>
                </div>
            )}
        </div>
        
        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto px-12 py-3 bg-black text-white rounded-lg font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
            >
                {isLoading ? 'Generating...' : 'Create My Character'}
            </button>
        </div>
    </div>
  );
};

export default Step1Spark;