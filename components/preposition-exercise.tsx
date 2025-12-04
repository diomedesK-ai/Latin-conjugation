"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"

type PrepositionQuestion = {
  sentence: string
  preposition: string
  nounNominative: string
  nounGenitive: string
  correctForm: string
  correctCase: string
  translation: string
}

type PrepositionExerciseProps = {
  studentName: string
  questionCount: number
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
  onBack?: () => void
}

export function PrepositionExercise({ 
  studentName, 
  questionCount, 
  onComplete,
  onBack 
}: PrepositionExerciseProps) {
  const [questions, setQuestions] = useState<PrepositionQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [isGenerating, setIsGenerating] = useState(true)
  const [isValidating, setIsValidating] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [isCurrentCorrect, setIsCurrentCorrect] = useState(false)
  const [hasHadHint, setHasHadHint] = useState(false)
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    async function generateQuestions() {
      try {
        const response = await fetch("/api/generate-prepositions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: questionCount }),
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
  }, [questionCount])

  const currentQuestion = questions[currentIndex]

  const validateAnswer = useCallback(async () => {
    if (!currentQuestion || !answer.trim()) return null

    const userAnswerTrimmed = answer.trim().toLowerCase()
    const correctAnswerLower = currentQuestion.correctForm.toLowerCase()
    const isCorrect = userAnswerTrimmed === correctAnswerLower

    // Generate feedback from LLM for more detailed explanation
    let feedbackText = ""
    try {
      const response = await fetch("/api/validate-preposition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preposition: currentQuestion.preposition,
          nounNominative: currentQuestion.nounNominative,
          nounGenitive: currentQuestion.nounGenitive,
          userAnswer: answer.trim(),
          correctAnswer: currentQuestion.correctForm,
          correctCase: currentQuestion.correctCase,
          sentence: currentQuestion.sentence,
          isCorrect,
          studentName,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        feedbackText = data.feedback
      } else {
        feedbackText = isCorrect 
          ? `Excellent ! "${currentQuestion.preposition}" régit le ${currentQuestion.correctCase}.`
          : `La bonne réponse est "${currentQuestion.correctForm}". "${currentQuestion.preposition}" régit le ${currentQuestion.correctCase}.`
      }
    } catch {
      feedbackText = isCorrect 
        ? `Excellent ! "${currentQuestion.preposition}" régit le ${currentQuestion.correctCase}.`
        : `La bonne réponse est "${currentQuestion.correctForm}". "${currentQuestion.preposition}" régit le ${currentQuestion.correctCase}.`
    }

    return {
      verb: currentQuestion.preposition,
      principalParts: `${currentQuestion.nounNominative}, ${currentQuestion.nounGenitive}`,
      userAnswer: answer.trim(),
      correctAnswer: currentQuestion.correctForm,
      isCorrect,
      feedback: feedbackText,
      category: "Prépositions",
    }
  }, [currentQuestion, answer, studentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!showNext) {
      // Validate
      setIsValidating(true)
      
      const userAnswerTrimmed = answer.trim().toLowerCase()
      const correctAnswerLower = currentQuestion.correctForm.toLowerCase()
      const isCorrect = userAnswerTrimmed === correctAnswerLower

      if (isCorrect) {
        // Correct answer - proceed normally
        const result = await validateAnswer()
        if (result) {
          setFeedback(result.feedback)
          setIsCurrentCorrect(true)
          setResults((prev) => [...prev, result])
          setShowNext(true)
        }
      } else {
        // Wrong answer
        if (!hasHadHint) {
          // First mistake - give a hint, allow retry
          const hintFeedback = `Pas tout à fait ! Réfléchis au cas que "${currentQuestion.preposition}" régit. Rappel : les prépositions comme "ad", "contra", "per" régissent l'accusatif, tandis que "cum", "sine", "ab" régissent l'ablatif. Essaie encore !`
          setFeedback(hintFeedback)
          setHasHadHint(true)
          setAnswer("") // Clear answer for retry
        } else {
          // Second mistake - show answer and mark as wrong
          const result = await validateAnswer()
          if (result) {
            setFeedback(result.feedback)
            setIsCurrentCorrect(false)
            setResults((prev) => [...prev, result])
            setShowNext(true)
          }
        }
      }
      
      setIsValidating(false)
    } else {
      // Next question
      handleNext()
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
      onComplete(results, elapsedSeconds)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setAnswer("")
      setFeedback(null)
      setShowNext(false)
      setIsCurrentCorrect(false)
      setHasHadHint(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <p className="text-muted-foreground">
          Génération des exercices de prépositions...
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} sur {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
            Prépositions
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800 p-6 shadow-sm">
        <p className="mb-1 text-sm text-blue-600 dark:text-blue-400">
          Complétez la phrase en déclinant correctement le nom :
        </p>
        <p className="text-xl font-medium text-blue-900 dark:text-blue-100 mt-4">
          {currentQuestion.sentence}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
          ({currentQuestion.nounNominative}, {currentQuestion.nounGenitive})
        </p>
        <p className="text-xs text-blue-500 dark:text-blue-500 mt-2 italic">
          « {currentQuestion.translation} »
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Votre réponse :
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Déclinez le nom..."
            disabled={showNext}
            className="pill-input w-full"
            autoFocus
          />
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Indice : Quel cas la préposition "<span className="font-semibold text-blue-600 dark:text-blue-400">{currentQuestion.preposition}</span>" régit-elle ?
          </p>
        </div>

        {feedback && (
          <div
            className={`rounded-2xl p-4 flex items-start gap-3 ${
              showNext && isCurrentCorrect
                ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100"
                : showNext && !isCurrentCorrect
                  ? "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"
                  : "bg-yellow-50 text-yellow-900 dark:bg-yellow-950/30 dark:text-yellow-100"
            }`}
          >
            {isCurrentCorrect && (
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
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {onBack && currentIndex === 0 && !showNext && (
            <button 
              type="button" 
              onClick={onBack}
              className="rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            >
              Retour
            </button>
          )}
          <button 
            type="submit" 
            disabled={isValidating || (!answer.trim() && !showNext)}
            className="pill-button-rainbow-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating
              ? "Vérification..."
              : showNext
                ? currentIndex + 1 >= questions.length
                  ? "Voir les résultats"
                  : "Question suivante"
                : hasHadHint
                  ? "Vérifier à nouveau"
                  : "Vérifier"}
          </button>
        </div>
      </form>
    </div>
  )
}
