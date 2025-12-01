"use client"

import { useState, useEffect } from "react"
import { NameEntry } from "@/components/name-entry"
import { VerbCategorySelect } from "@/components/verb-category-select"
import { VerbCountSelect } from "@/components/verb-count-select"
import { VerbExercise } from "@/components/verb-exercise"
import { Results } from "@/components/results"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tutorial } from "@/components/tutorial"
import { HeaderIcons } from "@/components/header-icons"
import { LeaderboardModal } from "@/components/leaderboard-modal"
import { ResetModal } from "@/components/reset-modal"
import { PoemDisplay } from "@/components/poem-display"

export type ExerciseResult = {
  verb: string
  principalParts: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  feedback: string
  category?: string
}

export type SessionHistory = {
  date: string
  correct: number
  total: number
  timeInSeconds: number
}

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [step, setStep] = useState<"name" | "poem" | "categories" | "count" | "exercise" | "results">("name")
  const [studentName, setStudentName] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [verbCount, setVerbCount] = useState(10)
  const [verificationMode, setVerificationMode] = useState<"per-step" | "at-end">("per-step")
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [timeInSeconds, setTimeInSeconds] = useState(0)
  const [history, setHistory] = useState<SessionHistory[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("latin-conjugation-history")
    if (saved) {
      setHistory(JSON.parse(saved))
    }
    const hasSeenTutorial = localStorage.getItem("latin-tutorial-seen")
    if (hasSeenTutorial === "true") {
      setShowTutorial(false)
    }
  }, [])

  const handleShowTutorial = () => {
    localStorage.removeItem("latin-tutorial-seen")
    setShowTutorial(true)
  }

  const handleReset = () => {
    setStep("name")
    setStudentName("")
    setSelectedCategories([])
    setVerbCount(10)
    setVerificationMode("per-step")
    setResults([])
    setTimeInSeconds(0)
  }

  const handleNameSubmit = (name: string) => {
    setStudentName(name)
    setStep("poem")
  }

  const handlePoemComplete = () => {
    setStep("categories")
  }

  const handleCategoriesSubmit = (categories: string[]) => {
    setSelectedCategories(categories)
    setStep("count")
  }

  const handleCountSubmit = (count: number, mode: "per-step" | "at-end") => {
    setVerbCount(count)
    setVerificationMode(mode)
    setStep("exercise")
  }

  const handleExerciseComplete = (exerciseResults: ExerciseResult[], time: number) => {
    setResults(exerciseResults)
    setTimeInSeconds(time)

    const newSession: SessionHistory = {
      date: new Date().toISOString(),
      correct: exerciseResults.filter((r) => r.isCorrect).length,
      total: exerciseResults.length,
      timeInSeconds: time,
    }

    const updatedHistory = [...history, newSession]
    setHistory(updatedHistory)
    localStorage.setItem("latin-conjugation-history", JSON.stringify(updatedHistory))

    setStep("results")
  }

  const handleRestart = () => {
    setStep("name")
    setStudentName("")
    setSelectedCategories([])
    setVerbCount(10)
    setVerificationMode("per-step")
    setResults([])
    setTimeInSeconds(0)
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} />}
      {showLeaderboardModal && (
        <LeaderboardModal history={history} onClose={() => setShowLeaderboardModal(false)} />
      )}
      {showResetModal && (
        <ResetModal onClose={() => setShowResetModal(false)} onConfirm={handleReset} />
      )}

      <div className="absolute right-4 top-4 flex items-center gap-3">
        <HeaderIcons
          onReset={() => setShowResetModal(true)}
          onShowTutorial={handleShowTutorial}
          onShowLeaderboard={() => setShowLeaderboardModal(true)}
        />
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-2xl pt-8 md:pt-12">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Conjugaison Latine
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">Pratiquez vos conjugaisons au présent</p>
        </div>

        {step === "name" && <NameEntry onSubmit={handleNameSubmit} />}

        {step === "poem" && <PoemDisplay studentName={studentName} onComplete={handlePoemComplete} />}

        {step === "categories" && <VerbCategorySelect studentName={studentName} onSubmit={handleCategoriesSubmit} />}

        {step === "count" && <VerbCountSelect studentName={studentName} onSubmit={handleCountSubmit} />}

        {step === "exercise" && (
          <VerbExercise
            studentName={studentName}
            verbCount={verbCount}
            categories={selectedCategories}
            verificationMode={verificationMode}
            onComplete={handleExerciseComplete}
          />
        )}

        {step === "results" && (
          <Results
            studentName={studentName}
            results={results}
            timeInSeconds={timeInSeconds}
            history={history}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  )
}
