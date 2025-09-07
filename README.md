# Comic Book Movie Creator

**Repository:** [lalomorales22/comic-book-movie-creator](https://github.com/lalomorales22/comic-book-movie-creator)

Welcome to the **Comic Book Movie Creator**! This is an innovative, end-to-end web application that allows anyone, especially children and creatives, to co-create a personalized, multimodal "Comic Book Movie." The app guides users through an interactive, step-by-step process, turning a simple idea into a complete story with consistent characters, comic-style images, animated video scenes, and narration.

This project is built to showcase the power of integrating multiple Google AI modalities (text, image, and video generation) into a single, cohesive, and fun user journey.

 <!-- It's a good practice to add a real screenshot here -->

---

## The Creative Journey: A 6-Step Process

The application is a single-page wizard that guides the user through 6 distinct steps. The user cannot proceed to the next step until the current one is complete.

### Step 1: The Spark (Initial Idea)
The user provides the central concept for their story in one of three ways:
-   **Text Input:** Typing a description (e.g., "A story about a brave little astronaut squirrel...").
-   **Voice Input:** Speaking the description into their microphone.
-   **Image Input:** Uploading a drawing or photo of their main character.

### Step 2: The Character Lab (Ensuring Consistency)
The AI processes the user's input and generates a "Character Model Sheet"—a single image showing the character from the front and side. The user must approve this design to lock in the character's look for the rest of the story, ensuring visual consistency.

### Step 3: The Storyboard Session (Collaborative Outlining)
The user enters a real-time chat with an AI story co-writer. The AI proposes a title, a cover concept, and a 4-chapter outline. The user can chat to refine these ideas until they are happy and approve the final storyboard.

### Step 4: The Creation Engine (Automated Generation)
With the character and story approved, the AI automatically generates the full 16-page comic book. For each page, it creates:
-   Story text and dialogue.
-   A corresponding comic panel image, matching the approved character sheet.
-   A narration script and simple sound effect cues.

### Step 5: Lights, Camera, Action! (Bringing it to Life)
The user is presented with a gallery of all 16 comic pages and selects exactly four to animate. The AI then generates short, 5-10 second video clips based on the image and text of those selected panels.

### Step 6: The Premiere (Final Assembly & Viewing)
The system assembles the final product: a motion comic video. It plays each panel in order, overlays the generated narration, and inserts the animated video clips at the appropriate points. The user can then watch the video, download the animated scenes, and share their creation.

---

## Technology Stack

This application uses a modern, powerful tech stack to deliver a seamless experience.

-   **Frontend:**
    -   **React 18:** For building the interactive user interface.
    -   **TypeScript:** For type safety and robust code.
    -   **Tailwind CSS:** For a clean, modern, and responsive design.
-   **Google AI & Cloud APIs:**
    -   **Gemini API (`gemini-2.5-flash`):** Used for understanding the initial idea, generating character descriptions, powering the storyboard chat, and writing the 16-page story script.
    -   **Image Generation (`gemini-2.5-flash-image-preview`):** Used for generating the high-quality Character Model Sheet and all 16 comic panel images.
    -   **Veo (`veo-2.0-generate-001`):** Used for generating the animated video clips from user-selected comic panels.
    -   **Browser Web Speech API:** Used for narration playback and voice input.

---

## Getting Started

This project is designed to be run in an environment that provides a Google AI API key as an environment variable, such as **Google AI Studio**.

### Prerequisites
1.  A modern web browser (Chrome, Firefox, Safari, Edge).
2.  A valid **Google AI API Key**.

### Running the Application

1.  **Set up the API Key:**
    The application requires your Google AI API key to be available as an environment variable named `API_KEY`. The code accesses it via `process.env.API_KEY`. **Do not hardcode your key directly into the source code.**

2.  **Deployment / Running in AI Studio:**
    -   Import or clone this project into your Google AI Studio workspace.
    -   Configure your API key in the secrets or environment settings of the studio.
    -   Run the application directly from the AI Studio interface. The environment will automatically serve the `index.html` and handle the necessary build steps.

3.  **Running Locally (Advanced):**
    To run this project on your local machine, you need a development server that can inject environment variables (like Vite or Create React App).
    -   Clone the repository:
        ```bash
        git clone https://github.com/lalomorales22/comic-book-movie-creator.git
        cd comic-book-movie-creator
        ```
    -   Create a `.env` file in the root of the project.
    -   Add your API key to the `.env` file:
        ```
        VITE_API_KEY=your_google_ai_api_key_here
        ```
        *(Note: The variable name might differ based on your build tool, e.g., `REACT_APP_API_KEY` for Create React App).*
    -   Install dependencies and run the development server:
        ```bash
        npm install
        npm run dev
        ```

## File Structure

The project is organized to separate concerns and make the codebase easy to navigate.

```
/
├── public/               # Public assets
├── src/
│   ├── components/       # Reusable React components for each step
│   │   ├── Step1_Spark.tsx
│   │   ├── Step2_CharacterLab.tsx
│   │   ├── ... (and so on)
│   │   └── LandingPage.tsx
│   ├── services/         # API interaction logic
│   │   └── geminiService.ts
│   ├── App.tsx           # Main application component, manages state and flow
│   ├── index.tsx         # Entry point for the React app
│   └── types.ts          # TypeScript type definitions
├── index.html            # The main HTML file
└── README.md             # You are here!
```

---

## Contributing

Feedback, bug reports, and pull requests are welcome! If you have ideas for new features or improvements, please open an issue to discuss it first.