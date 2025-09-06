
export interface Idea {
  type: 'text' | 'voice' | 'image';
  content: string;
  base64Image?: string;
}

export interface Character {
  approvedSheetUrl: string;
  detailedDescription: string;
  base64Image?: string;
}

export interface Chapter {
  title: string;
}

export interface Story {
  title: string;
  coverConcept: string;
  chapters: Chapter[];
}

export interface Page {
  pageNumber: number;
  chapter: number;
  text: string;
  imageUrl: string;
  base64Image?: string;
  narrationScript: string;
  sfx: string;
  animate: boolean;
  videoUrl?: string;
}

export interface ProjectState {
  status: string;
  idea: Idea | null;
  character: Character | null;
  story: Story | null;
  pages: Page[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
