# Latin Verb Conjugator - Setup Guide

## Features Implemented ✨

### 1. **Dynamic Verb Generation**
- Verbs are now generated dynamically by GPT-4.1 for each session
- Customizable difficulty levels
- Falls back to static verbs if API fails

### 2. **Intelligent Verification with GPT-4.1**
- Uses your OpenAI API key from `.env.local`
- Provides personalized feedback for each answer
- Two verification modes:
  - **Per-step**: Get immediate feedback after each verb
  - **At the end**: Complete all verbs then see all results at once

### 3. **Performance Leaderboard**
- Tracks all your sessions
- Shows top 5 performances ranked by score and time
- Highlights your current session
- Displays detailed stats: score, time, average per verb

### 4. **Dynamic Congratulations**
- AI-generated personalized messages based on your performance
- Adapts tone based on score (excellent/good/needs improvement)
- Always positive and encouraging

### 5. **Enhanced Confetti**
- Celebrates good performance (60%+ score)
- Smooth animations with 80 particles
- Auto-dismisses after 6 seconds

### 6. **Apple-like Design**
- Clean, minimal, elegant interface
- Subtle borders and shadows
- Smooth transitions and hover states
- Rounded corners and proper spacing
- Executive-grade aesthetic
- No icons (clean text and shapes only)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key from: https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter your name** - Start by entering your name
2. **Choose settings**:
   - Number of verbs (10-50)
   - Verification mode (per-step or at the end)
3. **Practice** - Conjugate verbs in the present tense
4. **Review** - See your results, leaderboard, and detailed feedback

## API Endpoints

- `/api/generate-verbs` - Generates dynamic verbs using GPT-4.1
- `/api/validate` - Validates answers with AI feedback
- `/api/congratulate` - Generates personalized congratulations

## Technical Stack

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Vercel AI SDK** with OpenAI GPT-4.1
- **Tailwind CSS** for styling
- **LocalStorage** for session history

## Notes

- The app uses GPT-4.1-turbo for optimal performance and cost
- All sessions are saved locally in your browser
- Verification can happen per-step or at the end of the exercise
- The design follows Apple's minimal aesthetic principles




