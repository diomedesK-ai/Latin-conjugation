"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import { TENSE_INFO, type TenseSystem, type LatinTense } from "@/lib/latin-verbs"

type VerbData = {
  firstPerson: string
  secondPerson: string
  infinitive: string
  perfectStem?: string
  meaning: string
  conjugation: number | string
  conjugatedForms: string[]
  isCompound?: boolean
  category?: string
}

type VerbExerciseProps = {
  studentName: string
  verbCount: number
  categories: string[]
  tenseSystem: TenseSystem
  tense: LatinTense
  verificationMode: "per-step" | "at-end"
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
}

export function VerbExercise({ studentName, verbCount, categories, tenseSystem, tense, verificationMode, onComplete }: VerbExerciseProps) {
  const [verbs, setVerbs] = useState<VerbData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({
    singular1: "",
    singular2: "",
    singular3: "",
    plural1: "",
    plural2: "",
    plural3: "",
  })
  const [allAnswers, setAllAnswers] = useState<
    Array<{
      verb: VerbData
      answer: typeof answers
    }>
  >([])
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [startTime] = useState<number>(Date.now())
  const [incorrectFields, setIncorrectFields] = useState<Set<string>>(new Set())

  const tenseInfo = TENSE_INFO[tenseSystem]
  const currentTenseInfo = tenseInfo.tenses[tense as keyof typeof tenseInfo.tenses]
  const isInfectum = tenseSystem === "infectum"

  useEffect(() => {
    async function generateVerbs() {
      try {
        const response = await fetch("/api/generate-verbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: verbCount, categories, difficulty: "mixed", tense }),
        })

        if (response.ok) {
          const data = await response.json()
          setVerbs(data.verbs)
        } else {
          throw new Error("Failed to generate verbs")
        }
      } catch (error) {
        console.error("Error generating verbs:", error)
        // No fallback - LLM is required
        setVerbs([])
      } finally {
        setIsGenerating(false)
      }
    }

    generateVerbs()
  }, [verbCount, categories, tense])

  const currentVerb = verbs[currentIndex]

  const getConjugation = useCallback((verb: VerbData): string[] => {
    return verb.conjugatedForms || []
  }, [])

  const validateAnswer = useCallback(
    async (verbToValidate: VerbData, answerToValidate: typeof answers) => {
      const userAnswer = `${answerToValidate.singular1}, ${answerToValidate.singular2}, ${answerToValidate.singular3}, ${answerToValidate.plural1}, ${answerToValidate.plural2}, ${answerToValidate.plural3}`
      const conjugation = getConjugation(verbToValidate)
      const correctAnswer = conjugation.join(", ")

      try {
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            verb: verbToValidate.infinitive,
            principalParts: `${verbToValidate.firstPerson}, ${verbToValidate.secondPerson}, ${verbToValidate.infinitive}`,
            userAnswer,
            correctAnswer,
            studentName,
            category: verbToValidate.category,
            tense,
            tenseSystem,
          }),
        })

        const data = await response.json()

        return {
          verb: verbToValidate.infinitive,
          principalParts: `${verbToValidate.firstPerson}, ${verbToValidate.secondPerson}, ${verbToValidate.infinitive}`,
          userAnswer,
          correctAnswer,
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          category: verbToValidate.category,
        }
      } catch {
        const isCorrect =
          answerToValidate.singular1.toLowerCase().trim() === conjugation[0]?.toLowerCase() &&
          answerToValidate.singular2.toLowerCase().trim() === conjugation[1]?.toLowerCase() &&
          answerToValidate.singular3.toLowerCase().trim() === conjugation[2]?.toLowerCase() &&
          answerToValidate.plural1.toLowerCase().trim() === conjugation[3]?.toLowerCase() &&
          answerToValidate.plural2.toLowerCase().trim() === conjugation[4]?.toLowerCase() &&
          answerToValidate.plural3.toLowerCase().trim() === conjugation[5]?.toLowerCase()

        const fallbackFeedback = isCorrect ? "Correct ! Bien joué." : `La bonne réponse est : ${correctAnswer}`

        return {
          verb: verbToValidate.infinitive,
          principalParts: `${verbToValidate.firstPerson}, ${verbToValidate.secondPerson}, ${verbToValidate.infinitive}`,
          userAnswer,
          correctAnswer,
          isCorrect,
          feedback: fallbackFeedback,
          category: verbToValidate.category,
        }
      }
    },
    [studentName, getConjugation, tense, tenseSystem],
  )

  const handleSubmitCurrent = async () => {
    if (!currentVerb) return

    if (verificationMode === "per-step") {
      setIsValidating(true)
      setFeedback(null)
      setIncorrectFields(new Set())

      // Check each field individually
      const incorrect = new Set<string>()
      const userAnswers = [
        answers.singular1,
        answers.singular2,
        answers.singular3,
        answers.plural1,
        answers.plural2,
        answers.plural3,
      ]
      const correctAnswers = getConjugation(currentVerb)

      userAnswers.forEach((userAnswer, index) => {
        if (userAnswer.toLowerCase().trim() !== correctAnswers[index]?.toLowerCase()) {
          incorrect.add(
            ["singular1", "singular2", "singular3", "plural1", "plural2", "plural3"][index]
          )
        }
      })

      if (incorrect.size > 0) {
        setIncorrectFields(incorrect)
        
        // Generate helpful hint without giving the answer
        const hints = [
          `Attention aux terminaisons du ${currentTenseInfo?.label || tense}`,
          "Vérifie le radical du verbe",
          "Pense à la voyelle de liaison",
          `Rappelle-toi les terminaisons : ${currentTenseInfo?.endings || ""}`,
          "Vérifie la conjugaison du verbe",
        ]
        const randomHint = hints[Math.floor(Math.random() * hints.length)]
        
        setFeedback(`Il y a ${incorrect.size} erreur${incorrect.size > 1 ? "s" : ""}. ${randomHint}.`)
        setIsValidating(false)
        return
      }

      // All correct
      const result = await validateAnswer(currentVerb, answers)
      setFeedback(result.feedback)
      setShowNext(true)
      setResults((prev) => [...prev, result])
      setIsValidating(false)
    } else {
      // at-end mode: just store the answer and move on
      setAllAnswers((prev) => [...prev, { verb: currentVerb, answer: { ...answers } }])
      handleNext()
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= verbs.length) {
      if (verificationMode === "at-end") {
        // Validate all at once
        validateAllAnswers()
      } else {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        onComplete(results, elapsedSeconds)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
      setAnswers({
        singular1: "",
        singular2: "",
        singular3: "",
        plural1: "",
        plural2: "",
        plural3: "",
      })
      setFeedback(null)
      setShowNext(false)
      setIncorrectFields(new Set())
    }
  }

  const validateAllAnswers = async () => {
    setIsValidating(true)

    const validationResults: ExerciseResult[] = []

    for (const { verb, answer } of allAnswers) {
      const result = await validateAnswer(verb, answer)
      validationResults.push(result)
    }

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
        <p className="text-muted-foreground">Génération des verbes au {currentTenseInfo?.label || tense}...</p>
      </div>
    )
  }

  if (!currentVerb || verbs.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Erreur lors de la génération des verbes.</p>
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
          Verbe {currentIndex + 1} sur {verbs.length}
        </span>
        <div className="flex items-center gap-2">
          {/* Tense system badge */}
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isInfectum
              ? "bg-white text-black border border-gray-300 shadow-sm"
              : "bg-black text-white border border-gray-600 shadow-sm"
          }`}>
            {tenseInfo.label} • {currentTenseInfo?.label}
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${
        isInfectum
          ? "border-gray-200 bg-white"
          : "border-gray-700 bg-gray-900"
      }`}>
        <p className={`mb-1 text-sm ${isInfectum ? "text-gray-500" : "text-gray-400"}`}>
          Conjuguez au {currentTenseInfo?.label || tense} :
        </p>
        <p className={`text-xl font-medium ${isInfectum ? "text-black" : "text-white"}`}>
          {currentVerb.firstPerson}, {currentVerb.secondPerson}, {currentVerb.infinitive}
        </p>
        <p className={`mt-1 text-sm ${isInfectum ? "text-gray-500" : "text-gray-400"}`}>
          ({currentVerb.meaning})
        </p>
        {currentVerb.perfectStem && tenseSystem === "perfectum" && (
          <p className={`mt-2 text-xs ${isInfectum ? "text-gray-400" : "text-gray-500"}`}>
            Radical du parfait : {currentVerb.perfectStem}-
          </p>
        )}
        {currentVerb.isCompound && (
          <p className={`mt-2 text-xs ${isInfectum ? "text-gray-400" : "text-gray-500"}`}>
            Composé de « esse » (être)
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Singulier</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">ego</label>
                <input
                  value={answers.singular1}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, singular1: e.target.value }))
                    if (incorrectFields.has("singular1")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("singular1")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("singular1") ? "input-error" : ""}`}
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">tu</label>
                <input
                  value={answers.singular2}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, singular2: e.target.value }))
                    if (incorrectFields.has("singular2")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("singular2")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("singular2") ? "input-error" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">is/ea/id</label>
                <input
                  value={answers.singular3}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, singular3: e.target.value }))
                    if (incorrectFields.has("singular3")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("singular3")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("singular3") ? "input-error" : ""}`}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-foreground">Pluriel</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">nos</label>
                <input
                  value={answers.plural1}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, plural1: e.target.value }))
                    if (incorrectFields.has("plural1")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("plural1")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("plural1") ? "input-error" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">vos</label>
                <input
                  value={answers.plural2}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, plural2: e.target.value }))
                    if (incorrectFields.has("plural2")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("plural2")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("plural2") ? "input-error" : ""}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">ei/eae/ea</label>
                <input
                  value={answers.plural3}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, plural3: e.target.value }))
                    if (incorrectFields.has("plural3")) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete("plural3")
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder=""
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has("plural3") ? "input-error" : ""}`}
                />
              </div>
            </div>
          </div>
        </div>

        {feedback && verificationMode === "per-step" && (
          <div
            className={`rounded-2xl p-4 flex items-start gap-3 ${
              showNext
                ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100"
                : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"
            }`}
          >
            {showNext && (
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
          <button type="submit" disabled={isValidating} className="pill-glow disabled:opacity-50">
            {isValidating
              ? verificationMode === "at-end"
                ? "Vérification de tous les verbes..."
                : "Vérification..."
              : showNext && verificationMode === "per-step"
                ? currentIndex + 1 >= verbs.length
                  ? "Voir les résultats"
                  : "Verbe suivant"
                : verificationMode === "at-end"
                  ? currentIndex + 1 >= verbs.length
                    ? "Terminer et voir les résultats"
                    : "Suivant"
                  : "Vérifier"}
          </button>
        </div>
      </form>
    </div>
  )
}
