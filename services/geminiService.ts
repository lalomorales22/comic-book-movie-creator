import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import type { Page } from '../types';

// IMPORTANT: This key is managed by the environment and must not be modified.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateCharacterDescription(idea: { type: 'text' | 'voice' | 'image', content: string, base64Image?: string }): Promise<string> {
    const model = 'gemini-2.5-flash';
    let prompt;
    let contents;

    if (idea.type === 'image' && idea.base64Image) {
        prompt = "Describe this character for a children's comic book in vivid detail. Focus on their appearance, clothing, colors, and key features. This description will be used to create a consistent character sheet.";
        const imagePart = {
            inlineData: {
                mimeType: 'image/png',
                data: idea.base64Image,
            },
        };
        const textPart = { text: prompt };
        contents = { parts: [imagePart, textPart] };
    } else {
        prompt = `Generate a vivid, detailed character description for a children's comic book based on this idea: "${idea.content}". Focus on their appearance, clothing, colors, and key features to ensure visual consistency.`;
        contents = prompt;
    }
    
    const response = await ai.models.generateContent({
        model,
        contents,
    });
    
    return response.text;
}

export async function generateCharacterSheet(description: string): Promise<string> {
    const prompt = `A character model sheet for a children's comic book character. The character is: ${description}. Show a full-body front view and a full-body side view. The background should be plain white. The style should be clean, with simple lines and vibrant colors, suitable for a comic book.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Failed to generate character sheet.");
}

export function createStoryChat(): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a friendly and imaginative children's story co-writer. Your goal is to help the user create a 4-chapter outline for their story. Start by proposing a catchy Title, a concept for the Cover Image, and a 4-Chapter Table of Contents. Be open to their feedback and creatively incorporate their ideas. Once they seem happy, ask them to confirm by saying 'I approve the story'. Keep your responses concise and friendly.",
        },
    });
}

export async function generateStoryPages(
    story: { title: string, chapters: { title: string }[] },
    characterDescription: string,
    onProgress: (progress: number, status: string) => void
): Promise<any[]> {
    const totalPages = 16;
    const pages = [];
    const RATE_LIMIT_DELAY_MS = 5000; // 5-second delay to avoid rate limiting
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a 16-page children's comic book story based on this outline:
        Title: ${story.title}
        Chapters: ${story.chapters.map(c => c.title).join(', ')}
        Main Character: ${characterDescription}
        
        Generate the content for all 16 pages (4 pages per chapter). For each page, provide the page text, a narration script (which can be the same as the page text), and a simple sound effect cue.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    pages: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                pageNumber: { type: Type.INTEGER },
                                chapter: { type: Type.INTEGER },
                                text: { type: Type.STRING, description: "The dialogue or story text for this comic panel." },
                                narrationScript: { type: Type.STRING, description: "The script for a narrator to read for this panel." },
                                sfx: { type: Type.STRING, description: "A simple sound effect cue, e.g., [SOUND of wind howling]." },
                            },
                        },
                    },
                },
            },
        },
    });

    const parsed = JSON.parse(response.text);

    for (let i = 0; i < totalPages; i++) {
        const pageData = parsed.pages[i];
        if (!pageData) continue;

        onProgress(((i + 0.5) / totalPages) * 100, `Generating image for page ${i + 1}...`);
        
        const imagePrompt = `A comic book panel illustration for a children's story. The character is: ${characterDescription}. The scene is: ${pageData.text}. Style: vibrant, colorful, clean lines, friendly cartoon style.`;
        
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '4:3',
            },
        });
        
        const base64Image = imageResponse.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/png;base64,${base64Image}`;

        pages.push({
            ...pageData,
            imageUrl,
            base64Image,
            animate: false,
        });

        onProgress(((i + 1) / totalPages) * 100, `Page ${i + 1} complete.`);

        // Add a delay between image generation calls to avoid hitting rate limits.
        if (i < totalPages - 1) {
            onProgress(((i + 1) / totalPages) * 100, 'Pausing for 5s to respect API limits...');
            await delay(RATE_LIMIT_DELAY_MS);
        }
    }

    return pages;
}


export async function generateVideoForPage(page: Page): Promise<string> {
    if (!page.base64Image) {
        throw new Error("Page is missing image data for video generation.");
    }

    console.log(`Starting video generation for page: ${page.pageNumber}`);
    
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: `Animate this comic book panel in a cinematic, engaging style suitable for a children's story. Scene: ${page.text}`,
        image: {
            imageBytes: page.base64Image,
            mimeType: 'image/png',
        },
        config: {
            numberOfVideos: 1,
        },
    });

    console.log(`Video generation operation started for page ${page.pageNumber}. Polling for completion...`);

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds before checking again
        operation = await ai.operations.getVideosOperation({ operation: operation });
        console.log(`Polling for page ${page.pageNumber}... Status: ${operation.done ? 'Done' : 'In Progress'}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error(`Failed to get video download link for page ${page.pageNumber}.`);
    }
    
    console.log(`Fetching generated video for page ${page.pageNumber}`);
    
    // The video download link requires the API key to be appended for access.
    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video file for page ${page.pageNumber}. Status: ${videoResponse.statusText}`);
    }

    // Create a local URL for the video blob to use in the <video> tag and for download.
    const videoBlob = await videoResponse.blob();
    const videoObjectURL = URL.createObjectURL(videoBlob);
    
    console.log(`Video for page ${page.pageNumber} ready at object URL.`);
    
    return videoObjectURL;
}