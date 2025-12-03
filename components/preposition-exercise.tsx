"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import { PREPOSITION_INFO, type PrepositionCase } from "@/lib/latin-prepositions"

type PrepositionQuestion = {
  preposition: string
  meaning: string
  correctCase: "accusative" | "ablative"
  exampleSentence: string
  notes?: string
}

type PrepositionExerciseProps = {
  studentName: string
  questionCount: number
  caseType: PrepositionCase
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
}

export function PrepositionExercise({ 
  studentName, 
  questionCount, 
  caseType, 
  onComplete 
}: PrepositionExerciseProps) {
  const [questions, setQuestions] = useState<PrepositionQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<"accusative" | "ablative" | null>(null)
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [startTime] = useState<number>(Date.now())

  const isAccusativeTheme = caseType === "accusative"
  const caseInfo = PREPOSITION_INFO[caseType]

  useEffect(() => {
    async function generateQuestions() {
      try {
        const response = await fetch("/api/generate-prepositions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: questionCount, caseType }),
        })

        if (response.ok) {
          const data = await response.json()
          setQuestions(data.questions)
        } else {
          throw new Error("Failed to generate questions")
        }
      } catch (error) {
        console.error("Error generating questions:", error)
        setQuestions([])
      } finally {
        setIsGenerating(false)
      }
    }

    generateQuestions()
  }, [questionCount, caseType])

  const currentQuestion = questions[currentIndex]

  const handleSelectAnswer = (answer: "accusative" | "ablative") => {
    if (showNext) return
    setSelectedAnswer(answer)
  }

  const validateAnswer = useCallback(() => {
    if (!currentQuestion || !selectedAnswer) return null

    const isCorrect = selectedAnswer === currentQuestion.correctCase
    const feedbackText = isCorrect 
      ? `Correct ! "${currentQuestion.preposition}" régit l'${currentQuestion.correctCase === "accusative" ? "accusatif" : "ablatif"}.`
      : `Incorrect. "${currentQuestion.preposition}" régit l'${currentQuestion.correctCase === "accusative" ? "accusatif" : "ablatif"}, pas l'${selectedAnswer === "accusative" ? "accusatif" : "ablatif"}.`

    return {
      verb: currentQuestion.preposition,
      principalParts: currentQuestion.meaning,
      userAnswer: selectedAnswer === "accusative" ? "Accusatif" : "Ablatif",
      correctAnswer: currentQuestion.correctCase === "accusative" ? "Accusatif" : "Ablatif",
      isCorrect,
      feedback: feedbackText,
      category: caseInfo.label,
    }
  }, [currentQuestion, selectedAnswer, caseInfo.label])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!showNext) {
      // Validate
      const result = validateAnswer()
      if (result) {
        setFeedback(result.feedback)
        setResults((prev) => [...prev, result])
        setShowNext(true)
      }
    } else {
      // Next question
      if (currentIndex + 1 >= questions.length) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        onComplete(results, elapsedSeconds)
      } else {
        setCurrentIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setFeedback(null)
        setShowNext(false)
      }
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <p className="text-muted-foreground">
          Génération des questions sur les prépositions...
        </p>
      </div>
    )
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Erreur lors de la génération des questions.</p>
        <button onClick={() => window.location.reload()} className="pill-glow">
          Réessayer
        </button>
      </div>
    )
  }

  const isCorrectAnswer = showNext && selectedAnswer === currentQuestion.correctCase

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} sur {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isAccusativeTheme
              ? "bg-white text-black border border-gray-300 shadow-sm"
              : caseType === "ablative"
                ? "bg-black text-white border border-gray-600 shadow-sm"
                : "bg-gradient-to-r from-white to-black text-gray-600 border border-gray-400 shadow-sm"
          }`}>
            Prépositions • {caseInfo.label}
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${
        isAccusativeTheme
          ? "border-gray-200 bg-white"
          : caseType === "ablative"
            ? "border-gray-700 bg-gray-900"
            : "border-gray-300 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600"
      }`}>
        <p className={`mb-1 text-sm ${
          isAccusativeTheme ? "text-gray-500" : caseType === "ablative" ? "text-gray-400" : "text-muted-foreground"
        }`}>
          Quel cas régit cette préposition ?
        </p>
        <p className={`text-3xl font-bold ${
          isAccusativeTheme ? "text-black" : caseType === "ablative" ? "text-white" : "text-foreground"
        }`}>
          {currentQuestion.preposition}
        </p>
        <p className={`mt-2 text-sm ${
          isAccusativeTheme ? "text-gray-500" : caseType === "ablative" ? "text-gray-400" : "text-muted-foreground"
        }`}>
          ({currentQuestion.meaning})
        </p>
        {currentQuestion.exampleSentence && (
          <p className={`mt-3 text-xs italic ${
            isAccusativeTheme ? "text-gray-400" : caseType === "ablative" ? "text-gray-500" : "text-muted-foreground/70"
          }`}>
            Ex: {currentQuestion.exampleSentence}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Accusative option */}
          <button
            type="button"
            onClick={() => handleSelectAnswer("accusative")}
            disabled={showNext}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedAnswer === "accusative"
                ? showNext
                  ? isCorrectAnswer
                    ? "scale-[1.02] bg-green-100 border-2 border-green-500 dark:bg-green-900/30"
                    : "scale-[1.02] bg-red-100 border-2 border-red-500 dark:bg-red-900/30"
                  : "scale-[1.02] rainbow-glow-selected"
                : showNext && currentQuestion.correctCase === "accusative"
                  ? "bg-green-50 border-2 border-green-300 dark:bg-green-900/20"
                  : "bg-[#c8c8c8] text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] disabled:hover:border-gray-300 disabled:hover:shadow-none"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${
                  selectedAnswer === "accusative" 
                    ? showNext
                      ? isCorrectAnswer ? "bg-green-500" : "bg-red-500"
                      : "rainbow-dot"
                    : "bg-gray-200 border border-gray-300"
                }`} />
                <span className={`font-bold text-lg ${
                  selectedAnswer === "accusative" 
                    ? showNext
                      ? isCorrectAnswer ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                      : "text-black"
                    : "text-gray-700"
                }`}>
                  Accusatif
                </span>
              </div>
              <p className={`text-xs ${
                selectedAnswer === "accusative" ? "text-gray-600" : "text-gray-500"
              }`}>
                Mouvement, direction
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {["ad", "per", "trans"].map((p) => (
                  <span key={p} className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Ablative option */}
          <button
            type="button"
            onClick={() => handleSelectAnswer("ablative")}
            disabled={showNext}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedAnswer === "ablative"
                ? showNext
                  ? !isCorrectAnswer && selectedAnswer === "ablative"
                    ? "scale-[1.02] bg-red-100 border-2 border-red-500 dark:bg-red-900/30"
                    : isCorrectAnswer
                      ? "scale-[1.02] bg-green-100 border-2 border-green-500 dark:bg-green-900/30"
                      : "scale-[1.02] rainbow-glow-selected-dark"
                  : "scale-[1.02] rainbow-glow-selected-dark"
                : showNext && currentQuestion.correctCase === "ablative"
                  ? "bg-green-50 border-2 border-green-300 dark:bg-green-900/20"
                  : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)] disabled:hover:border-gray-700 disabled:hover:shadow-none"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${
                  selectedAnswer === "ablative"
                    ? showNext
                      ? (selectedAnswer === currentQuestion.correctCase) ? "bg-green-500" : "bg-red-500"
                      : "rainbow-dot"
                    : "bg-gray-700 border border-gray-500"
                }`} />
                <span className={`font-bold text-lg ${
                  selectedAnswer === "ablative"
                    ? showNext
                      ? (selectedAnswer === currentQuestion.correctCase) 
                        ? "text-green-700 dark:text-green-300" 
                        : "text-red-700 dark:text-red-300"
                      : "text-white"
                    : "text-white"
                }`}>
                  Ablatif
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Origine, moyen, lieu
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {["ab", "cum", "de"].map((p) => (
                  <span key={p} className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-900/50 text-purple-300 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>

        {feedback && (
          <div
            className={`rounded-2xl p-4 flex items-start gap-3 ${
              isCorrectAnswer
                ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100"
                : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"
            }`}
          >
            {isCorrectAnswer && (
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
            )}
            <div className="text-sm leading-relaxed flex-1">
              {feedback}
              {currentQuestion.notes && (
                <p className="mt-2 text-xs opacity-75">
                  💡 {currentQuestion.notes}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button 
            type="submit" 
            disabled={!selectedAnswer}
            className={`${
              caseType === "ablative" 
                ? "pill-button-rainbow-dark" 
                : "pill-button-rainbow-light"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {showNext
              ? currentIndex + 1 >= questions.length
                ? "Voir les résultats"
                : "Question suivante"
              : "Vérifier"}
          </button>
        </div>
      </form>
    </div>
  )
}

