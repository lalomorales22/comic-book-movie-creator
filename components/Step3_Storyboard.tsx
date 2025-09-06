import React, { useState, useEffect, useRef } from 'react';
import type { Story, ChatMessage } from '../types';
import { createStoryChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import LoadingSpinner from './LoadingSpinner';

interface Step3StoryboardProps {
  onComplete: (story: Story) => void;
  characterDescription: string;
}

const Step3Storyboard: React.FC<Step3StoryboardProps> = ({ onComplete, characterDescription }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const chatSession = createStoryChat();
      setChat(chatSession);
      const firstMessage = `My story is about: ${characterDescription}. Please propose a title, cover concept, and 4 chapter titles.`;
      const response = await chatSession.sendMessage({ message: firstMessage });
      setMessages([
          { role: 'model', text: response.text },
      ]);
      setIsLoading(false);
    };
    initChat();
  }, [characterDescription]);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const handleSend = async () => {
    if (!userInput.trim() || isLoading || !chat) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const response = await chat.sendMessage({ message: userInput });
    setMessages([...newMessages, { role: 'model', text: response.text }]);
    setIsLoading(false);

    if (userInput.toLowerCase().includes('i approve the story')) {
        setIsLoading(true);
        // Final call to get structured data
        const finalResponse = await chat.sendMessage({message: "Great, based on our conversation, please provide the final approved story outline as a JSON object with keys: title, coverConcept, and chapters (an array of objects with a 'title' key). Just output the JSON."});
        try {
            const jsonString = finalResponse.text.match(/```json\n([\s\S]*?)\n```/)?.[1] || finalResponse.text;
            const finalStory = JSON.parse(jsonString);
            onComplete(finalStory);
        } catch (e) {
            console.error("Failed to parse story JSON:", e);
            // Fallback or error message
            alert("There was an issue finalizing the story. Please try approving again.");
            setIsLoading(false);
        }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-black text-center">Step 3: The Storyboard Session</h2>
      <p className="text-gray-500 text-center mt-2 mb-8">Chat with the AI to refine your story. Type "I approve the story" when you're ready.</p>
      
      <div className="bg-white border-2 border-black rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col h-[60vh]">
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`} style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
                <div className="max-w-lg p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75 mr-1"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                </div>
            </div>
          )}
          {isLoading && messages.length === 0 && <LoadingSpinner message="Warming up the AI Storyteller..."/>}
        </div>
        
        <div className="p-4 border-t-2 border-black">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-white border-2 border-black rounded-md text-black focus:ring-2 focus:ring-black"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !userInput.trim()}
              className="px-6 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Storyboard;
