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
import { TenseSelect } from "@/components/tense-select"
import { LearningPathSelect, type LearningPath } from "@/components/learning-path-select"
import { DeclensionSelect } from "@/components/declension-select"
import { DeclensionExercise } from "@/components/declension-exercise"
import { PrepositionExercise } from "@/components/preposition-exercise"
import { TranslationSelect, type TranslationDirection } from "@/components/translation-select"
import { TranslationExercise } from "@/components/translation-exercise"
import type { TenseSystem, LatinTense } from "@/lib/latin-verbs"
import type { DeclensionNumber, DeclensionNumber2 } from "@/lib/latin-declensions"
import type { PrepositionCase } from "@/lib/latin-prepositions"

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

type Step = 
  | "name" 
  | "poem" 
  | "path"
  // Conjugation path
  | "tense" 
  | "categories" 
  | "count" 
  | "exercise"
  // Declension path (includes prepositions as sub-option)
  | "declension-select"
  | "declension-count"
  | "declension-exercise"
  | "preposition-count"
  | "preposition-exercise"
  // Translation path
  | "translation-select"
  | "translation-count"
  | "translation-exercise"
  // Shared
  | "results"

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true)
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [step, setStep] = useState<Step>("name")
  const [studentName, setStudentName] = useState("")
  
  // Learning path
  const [learningPath, setLearningPath] = useState<LearningPath>("conjugaison")
  
  // Conjugation state
  const [selectedTenseSystem, setSelectedTenseSystem] = useState<TenseSystem>("infectum")
  const [selectedTense, setSelectedTense] = useState<LatinTense>("present")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Declension state
  const [selectedDeclension, setSelectedDeclension] = useState<DeclensionNumber>("1")
  const [selectedNumber, setSelectedNumber] = useState<DeclensionNumber2>("singular")
  
  // Preposition state (now sub-option of declension)
  const [selectedPrepositionCase, setSelectedPrepositionCase] = useState<PrepositionCase>("accusative")
  
  // Translation state
  const [selectedTranslationDirection, setSelectedTranslationDirection] = useState<TranslationDirection>("fr-la")
  
  // Shared state
  const [itemCount, setItemCount] = useState(10)
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
    setLearningPath("conjugaison")
    setSelectedTenseSystem("infectum")
    setSelectedTense("present")
    setSelectedCategories([])
    setSelectedDeclension("1")
    setSelectedNumber("singular")
    setSelectedPrepositionCase("accusative")
    setSelectedTranslationDirection("fr-la")
    setItemCount(10)
    setVerificationMode("per-step")
    setResults([])
    setTimeInSeconds(0)
  }

  const handleNameSubmit = (name: string) => {
    setStudentName(name)
    setStep("poem")
  }

  const handlePoemComplete = () => {
    setStep("path")
  }

  // New handlers for inline sub-options in path select
  const handleConjugaisonPathSubmit = (tenseSystem: TenseSystem) => {
    setLearningPath("conjugaison")
    setSelectedTenseSystem(tenseSystem)
    setStep("tense") // Go to tense select to pick specific tense
  }

  const handleDeclinaisonPathSubmit = (declension: "1" | "2" | "3") => {
    setLearningPath("declinaison")
    setSelectedDeclension(declension as DeclensionNumber)
    // Skip singular/plural selection, go directly to count
    setStep("declension-count")
  }

  const handlePrepositionPathSubmit = () => {
    setLearningPath("declinaison")
    // Skip case selection, go directly to count
    setStep("preposition-count")
  }

  const handleTraductionPathSubmit = (direction: TranslationDirection) => {
    setLearningPath("traduction")
    setSelectedTranslationDirection(direction)
    setStep("translation-count") // Skip translation-select, go straight to count
  }

  // Conjugation handlers
  const handleTenseSubmit = (tenseSystem: TenseSystem, tense: LatinTense) => {
    setSelectedTenseSystem(tenseSystem)
    setSelectedTense(tense)
    setStep("categories")
  }

  const handleCategoriesSubmit = (categories: string[]) => {
    setSelectedCategories(categories)
    setStep("count")
  }

  const handleCountSubmit = (count: number, mode: "per-step" | "at-end") => {
    setItemCount(count)
    setVerificationMode(mode)
    setStep("exercise")
  }

  // Declension handlers - no longer needed since we skip singular/plural selection
  // const handleDeclensionSelect = (declension: DeclensionNumber, number: DeclensionNumber2) => {
  //   setSelectedDeclension(declension)
  //   setSelectedNumber(number)
  //   setStep("declension-count")
  // }

  const handleDeclensionCountSubmit = (count: number, mode: "per-step" | "at-end") => {
    setItemCount(count)
    setVerificationMode(mode)
    setStep("declension-exercise")
  }

  // Preposition handlers (prepositions are now under declension)
  const handlePrepositionSelect = (caseType: PrepositionCase) => {
    setSelectedPrepositionCase(caseType)
    setStep("preposition-count")
  }

  const handlePrepositionCountSubmit = (count: number, mode: "per-step" | "at-end") => {
    setItemCount(count)
    setVerificationMode(mode)
    setStep("preposition-exercise")
  }

  // Translation handlers
  const handleTranslationSelect = (direction: TranslationDirection) => {
    setSelectedTranslationDirection(direction)
    setStep("translation-count")
  }

  const handleTranslationCountSubmit = (count: number, mode: "per-step" | "at-end") => {
    setItemCount(count)
    setVerificationMode(mode)
    setStep("translation-exercise")
  }

  // Shared handlers
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
    handleReset()
  }

  // Get title based on learning path
  const getTitle = () => {
    switch (learningPath) {
      case "conjugaison":
        return { title: "Conjugaison Latine", subtitle: "Infectum & Perfectum" }
      case "declinaison":
        return { title: "Déclinaison Latine", subtitle: "Noms & Adjectifs" }
      case "traduction":
        return { title: "Traduction Latine", subtitle: "Thème et Version" }
      default:
        return { title: "Latin", subtitle: "Pratiquez votre latin" }
    }
  }

  const { title, subtitle } = getTitle()

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

      <div className={`mx-auto pt-8 md:pt-12 ${step === "path" ? "max-w-6xl px-4" : "max-w-2xl"}`}>
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {step === "name" || step === "poem" || step === "path" ? "Latin" : title}
          </h1>
          <p className="text-base text-muted-foreground md:text-lg">
            {step === "name" || step === "poem" ? "Conjugaison, Déclinaison & Traduction" : 
             step === "path" ? "Choisissez votre exercice" : subtitle}
          </p>
        </div>

        {step === "name" && <NameEntry onSubmit={handleNameSubmit} />}

        {step === "poem" && <PoemDisplay studentName={studentName} onComplete={handlePoemComplete} onBack={() => setStep("name")} />}

        {step === "path" && (
          <LearningPathSelect 
            studentName={studentName} 
            onConjugaisonSubmit={handleConjugaisonPathSubmit}
            onDeclinaisonSubmit={handleDeclinaisonPathSubmit}
            onPrepositionSubmit={handlePrepositionPathSubmit}
            onTraductionSubmit={handleTraductionPathSubmit}
            onBack={() => setStep("poem")}
          />
        )}

        {/* Conjugation path */}
        {step === "tense" && (
          <TenseSelect 
            studentName={studentName}
            preSelectedSystem={selectedTenseSystem}
            onSubmit={handleTenseSubmit}
            onBack={() => setStep("path")}
          />
        )}

        {step === "categories" && (
          <VerbCategorySelect 
            studentName={studentName} 
            onSubmit={handleCategoriesSubmit} 
            onBack={() => setStep("tense")}
          />
        )}

        {step === "count" && (
          <VerbCountSelect 
            studentName={studentName} 
            onSubmit={handleCountSubmit}
            onBack={() => setStep("categories")}
          />
        )}

        {step === "exercise" && (
          <VerbExercise
            studentName={studentName}
            verbCount={itemCount}
            categories={selectedCategories}
            tenseSystem={selectedTenseSystem}
            tense={selectedTense}
            verificationMode={verificationMode}
            onComplete={handleExerciseComplete}
            onBack={() => setStep("count")}
          />
        )}

        {/* Declension path - skip singular/plural selection, go directly to count */}

        {step === "declension-count" && (
          <VerbCountSelect 
            studentName={studentName} 
            onSubmit={handleDeclensionCountSubmit}
            onBack={() => setStep("path")}
            label="Combien de noms voulez-vous décliner ?"
          />
        )}

        {step === "declension-exercise" && (
          <DeclensionExercise
            studentName={studentName}
            nounCount={itemCount}
            declension={selectedDeclension}
            verificationMode={verificationMode}
            onComplete={handleExerciseComplete}
            onBack={() => setStep("declension-count")}
          />
        )}

        {step === "preposition-count" && (
          <VerbCountSelect 
            studentName={studentName} 
            onSubmit={handlePrepositionCountSubmit}
            onBack={() => setStep("path")}
            label="Combien de questions voulez-vous ?"
          />
        )}

        {step === "preposition-exercise" && (
          <PrepositionExercise
            studentName={studentName}
            questionCount={itemCount}
            onComplete={handleExerciseComplete}
            onBack={() => setStep("preposition-count")}
          />
        )}

        {/* Translation path */}
        {step === "translation-select" && (
          <TranslationSelect
            studentName={studentName}
            onSubmit={handleTranslationSelect}
            onBack={() => setStep("path")}
          />
        )}

        {step === "translation-count" && (
          <VerbCountSelect 
            studentName={studentName} 
            onSubmit={handleTranslationCountSubmit}
            onBack={() => setStep("translation-select")}
            label="Combien de mots voulez-vous traduire ?"
          />
        )}

        {step === "translation-exercise" && (
          <TranslationExercise
            studentName={studentName}
            wordCount={itemCount}
            direction={selectedTranslationDirection}
            verificationMode={verificationMode}
            onComplete={handleExerciseComplete}
            onBack={() => setStep("translation-count")}
          />
        )}

        {/* Shared results */}
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
