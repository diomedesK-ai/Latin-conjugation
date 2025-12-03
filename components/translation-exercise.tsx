"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import type { TranslationDirection } from "@/components/translation-select"

type WordData = {
  sourceWord: string
  targetWord: string
  hint?: string
  category: string
  exampleSentence?: string
}

type TranslationExerciseProps = {
  studentName: string
  wordCount: number
  direction: TranslationDirection
  verificationMode: "per-step" | "at-end"
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
}

export function TranslationExercise({ 
  studentName, 
  wordCount, 
  direction, 
  verificationMode, 
  onComplete 
}: TranslationExerciseProps) {
  const [words, setWords] = useState<WordData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [allAnswers, setAllAnswers] = useState<Array<{ word: WordData; answer: string }>>([])
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [startTime] = useState<number>(Date.now())

  const isFrToLa = direction === "fr-la"

  useEffect(() => {
    async function generateWords() {
      try {
        const response = await fetch("/api/generate-translation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: wordCount, direction }),
        })

        if (response.ok) {
          const data = await response.json()
          setWords(data.words)
        } else {
          throw new Error("Failed to generate words")
        }
      } catch (error) {
        console.error("Error generating words:", error)
        setWords([])
      } finally {
        setIsGenerating(false)
      }
    }

    generateWords()
  }, [wordCount, direction])

  const currentWord = words[currentIndex]

  const validateAnswer = useCallback(
    (wordToValidate: WordData, userAnswer: string) => {
      const normalizedUser = userAnswer.toLowerCase().trim()
      const normalizedCorrect = wordToValidate.targetWord.toLowerCase().trim()
      
      // Allow for slight variations (accents, etc.)
      const isCorrectAnswer = normalizedUser === normalizedCorrect || 
        normalizedUser.replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u') === 
        normalizedCorrect.replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')

      const feedbackText = isCorrectAnswer
        ? `Correct ! "${wordToValidate.sourceWord}" se traduit bien par "${wordToValidate.targetWord}".`
        : `La bonne réponse était "${wordToValidate.targetWord}".${wordToValidate.hint ? ` (${wordToValidate.hint})` : ""}`

      return {
        verb: wordToValidate.sourceWord,
        principalParts: wordToValidate.category,
        userAnswer,
        correctAnswer: wordToValidate.targetWord,
        isCorrect: isCorrectAnswer,
        feedback: feedbackText,
        category: wordToValidate.category,
      }
    },
    [],
  )

  const handleSubmitCurrent = async () => {
    if (!currentWord) return

    if (verificationMode === "per-step") {
      setIsValidating(true)
      setFeedback(null)

      const result = validateAnswer(currentWord, answer)
      setFeedback(result.feedback)
      setIsCorrect(result.isCorrect)
      setShowNext(true)
      setResults((prev) => [...prev, result])
      setIsValidating(false)
    } else {
      const updatedAnswers = [...allAnswers, { word: currentWord, answer }]
      setAllAnswers(updatedAnswers)
      handleNext(updatedAnswers)
    }
  }

  const handleNext = (updatedAnswers?: typeof allAnswers) => {
    if (currentIndex + 1 >= words.length) {
      if (verificationMode === "at-end") {
        validateAllAnswers(updatedAnswers || allAnswers)
      } else {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        onComplete(results, elapsedSeconds)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
      setAnswer("")
      setFeedback(null)
      setShowNext(false)
      setIsCorrect(false)
    }
  }

  const validateAllAnswers = (answersToValidate: typeof allAnswers) => {
    setIsValidating(true)

    const validationResults: ExerciseResult[] = answersToValidate.map(({ word, answer: userAnswer }) => 
      validateAnswer(word, userAnswer)
    )

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
    setIsValidating(false)
    onComplete(validationResults, elapsedSeconds)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!showNext && verificationMode === "per-step") {
      handleSubmitCurrent()
    } else {
      handleNext()
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <p className="text-muted-foreground">
          Génération du vocabulaire ({isFrToLa ? "FR → LA" : "LA → FR"})...
        </p>
      </div>
    )
  }

  if (!currentWord || words.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Erreur lors de la génération du vocabulaire.</p>
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
          Mot {currentIndex + 1} sur {words.length}
        </span>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isFrToLa
              ? "bg-white text-black border border-gray-300 shadow-sm"
              : "bg-black text-white border border-gray-600 shadow-sm"
          }`}>
            {isFrToLa ? "FR → LA" : "LA → FR"}
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${
        isFrToLa
          ? "border-gray-200 bg-white"
          : "border-gray-700 bg-gray-900"
      }`}>
        <p className={`mb-1 text-sm ${isFrToLa ? "text-gray-500" : "text-gray-400"}`}>
          Traduisez en {isFrToLa ? "latin" : "français"} :
        </p>
        <p className={`text-2xl font-medium ${isFrToLa ? "text-black" : "text-white"}`}>
          {currentWord.sourceWord}
        </p>
        <p className={`mt-2 text-xs ${isFrToLa ? "text-gray-400" : "text-gray-500"}`}>
          ({currentWord.category})
        </p>
        {currentWord.hint && !showNext && (
          <p className={`mt-2 text-xs italic ${isFrToLa ? "text-gray-400" : "text-gray-500"}`}>
            💡 {currentWord.hint}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-muted-foreground">
            Votre traduction
          </label>
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={isFrToLa ? "Entrez le mot latin..." : "Entrez le mot français..."}
            disabled={showNext && verificationMode === "per-step"}
            className="pill-input w-full"
            autoFocus
          />
        </div>

        {feedback && verificationMode === "per-step" && (
          <div
            className={`rounded-2xl p-4 flex items-start gap-3 ${
              isCorrect
                ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100"
                : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"
            }`}
          >
            {isCorrect && (
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

        <div className="flex justify-center">
          <button 
            type="submit" 
            disabled={isValidating || (!answer.trim() && !showNext)} 
            className={`${isFrToLa ? "pill-button-rainbow-light" : "pill-button-rainbow-dark"} disabled:opacity-50`}
          >
            {isValidating
              ? verificationMode === "at-end"
                ? "Vérification..."
                : "Vérification..."
              : showNext && verificationMode === "per-step"
                ? currentIndex + 1 >= words.length
                  ? "Voir les résultats"
                  : "Mot suivant"
                : verificationMode === "at-end"
                  ? currentIndex + 1 >= words.length
                    ? "Terminer et voir les résultats"
                    : "Suivant"
                  : "Vérifier"}
          </button>
        </div>
      </form>
    </div>
  )
}

