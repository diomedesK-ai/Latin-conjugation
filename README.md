# 🏛️ Latin Verb Conjugator

An interactive, AI-powered Latin verb conjugation learning platform designed for students. Built with Next.js, featuring personalized learning experiences powered by GPT-5.1.

## ✨ Features

### 🎯 Core Learning
- **Dynamic Verb Generation**: Latin verbs generated on-the-fly by AI
- **AI-Powered Verification**: Instant feedback with pedagogical explanations
- **Flexible Verification Modes**: Choose per-step or end-of-exercise verification
- **Personalized Poems**: Welcome each student with a custom French/Latin poem

### 📊 Progress Tracking
- **Leaderboard**: Track performance with scores, dates, and timing
- **Session History**: Review past exercises and see improvement over time
- **Visual Results**: Color-coded feedback with checkmarks and outlines

### 🎨 Beautiful Design
- **Apple-Inspired UI**: Clean, minimal, and elegant design
- **Dark/Light Themes**: Seamless theme switching
- **Smooth Animations**: Apple "Hello" animation, confetti celebrations, and fluid transitions
- **Responsive Layout**: Works perfectly on all devices

### 👨‍🏫 Teacher Features
- **Tutorial System**: Onboarding for new students
- **Reset Functionality**: Passcode-protected reset (default: 1234)
- **French Interface**: All instructions and feedback in French

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/diomedesK-ai/Latin-conjugation.git
cd Latin-conjugation
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with Turbopack
- **AI**: [OpenAI GPT-5.1](https://openai.com/) via Vercel AI SDK
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Language**: TypeScript

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate-verbs/    # Dynamic verb generation
│   │   ├── validate/          # Answer validation
│   │   ├── congratulate/      # Positive feedback
│   │   └── generate-poem/     # Personalized poems
│   ├── globals.css            # Global styles & animations
│   └── page.tsx               # Main application page
├── components/
│   ├── name-entry.tsx         # Student name input
│   ├── verb-count-select.tsx  # Exercise configuration
│   ├── verb-exercise.tsx      # Conjugation practice
│   ├── results.tsx            # Results & leaderboard
│   ├── tutorial.tsx           # Onboarding experience
│   ├── poem-display.tsx       # Streaming poem display
│   ├── theme-toggle.tsx       # Dark/light mode
│   └── header-icons.tsx       # Navigation icons
└── public/                    # Static assets
```

## 🎮 How to Use

1. **Enter Your Name**: Start by entering your name for a personalized experience
2. **Enjoy Your Poem**: Read your custom French/Latin welcome poem
3. **Choose Settings**: Select number of verbs and verification mode
4. **Practice**: Conjugate verbs with real-time or end-of-exercise verification
5. **Review**: See your results, score, and areas for improvement
6. **Track Progress**: Check the leaderboard to see your improvement over time

## 🔑 Teacher Controls

- **Tutorial Icon** (📖): Replay the onboarding tutorial
- **Leaderboard Icon** (📊): View full performance history
- **Theme Toggle** (🌙/☀️): Switch between dark and light modes
- **Reset Button** (🔄): Clear all data (requires passcode: 1234)

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/diomedesK-ai/Latin-conjugation)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel settings
4. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Theme Colors
Edit CSS variables in `app/globals.css`:
```css
:root {
  --background: ...
  --foreground: ...
  /* ... more colors */
}
```

### Reset Passcode
Update in `components/reset-modal.tsx`:
```typescript
const PARENT_PASSCODE = "1234" // Change this
```

### AI Models
Switch models in API routes (e.g., `app/api/generate-verbs/route.ts`):
```typescript
model: openai("gpt-5.1") // or "gpt-4o", etc.
```

## 📝 License

MIT License - feel free to use this project for educational purposes!

## 🙏 Acknowledgments

- Inspired by Apple's design philosophy
- Built for students learning Latin
- Powered by OpenAI's language models

## 📧 Contact

Created by [diomedesK-ai](https://github.com/diomedesK-ai)

---

**Note**: This application requires an OpenAI API key. Usage may incur costs based on your OpenAI plan. Monitor your usage at [platform.openai.com](https://platform.openai.com/).




