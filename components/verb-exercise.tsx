"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import type { LatinVerb } from "@/lib/latin-verbs"

type VerbExerciseProps = {
  studentName: string
  verbCount: number
  verificationMode: "per-step" | "at-end"
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
}

export function VerbExercise({ studentName, verbCount, verificationMode, onComplete }: VerbExerciseProps) {
  const [verbs, setVerbs] = useState<LatinVerb[]>([])
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
      verb: LatinVerb
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

  useEffect(() => {
    async function generateVerbs() {
      try {
        const response = await fetch("/api/generate-verbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: verbCount, difficulty: "mixed" }),
        })

        if (response.ok) {
          const data = await response.json()
          setVerbs(data.verbs)
        } else {
          throw new Error("Failed to generate verbs")
        }
      } catch (error) {
        console.error("Error generating verbs:", error)
        // Fallback: use static verbs
        const { LATIN_VERBS } = await import("@/lib/latin-verbs")
        const shuffled = [...LATIN_VERBS].sort(() => Math.random() - 0.5)
        setVerbs(shuffled.slice(0, verbCount))
      } finally {
        setIsGenerating(false)
      }
    }

    generateVerbs()
  }, [verbCount])

  const currentVerb = verbs[currentIndex]

  const validateAnswer = useCallback(
    async (verbToValidate: LatinVerb, answerToValidate: typeof answers) => {
      const userAnswer = `${answerToValidate.singular1}, ${answerToValidate.singular2}, ${answerToValidate.singular3}, ${answerToValidate.plural1}, ${answerToValidate.plural2}, ${answerToValidate.plural3}`
      const correctAnswer = verbToValidate.presentConjugation.join(", ")

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
        }
      } catch {
        const isCorrect =
          answerToValidate.singular1.toLowerCase().trim() === verbToValidate.presentConjugation[0].toLowerCase() &&
          answerToValidate.singular2.toLowerCase().trim() === verbToValidate.presentConjugation[1].toLowerCase() &&
          answerToValidate.singular3.toLowerCase().trim() === verbToValidate.presentConjugation[2].toLowerCase() &&
          answerToValidate.plural1.toLowerCase().trim() === verbToValidate.presentConjugation[3].toLowerCase() &&
          answerToValidate.plural2.toLowerCase().trim() === verbToValidate.presentConjugation[4].toLowerCase() &&
          answerToValidate.plural3.toLowerCase().trim() === verbToValidate.presentConjugation[5].toLowerCase()

        const fallbackFeedback = isCorrect ? "Correct ! Bien joué." : `La bonne réponse est : ${correctAnswer}`

        return {
          verb: verbToValidate.infinitive,
          principalParts: `${verbToValidate.firstPerson}, ${verbToValidate.secondPerson}, ${verbToValidate.infinitive}`,
          userAnswer,
          correctAnswer,
          isCorrect,
          feedback: fallbackFeedback,
        }
      }
    },
    [studentName],
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
      const correctAnswers = currentVerb.presentConjugation

      userAnswers.forEach((userAnswer, index) => {
        if (userAnswer.toLowerCase().trim() !== correctAnswers[index].toLowerCase()) {
          incorrect.add(
            ["singular1", "singular2", "singular3", "plural1", "plural2", "plural3"][index]
          )
        }
      })

      if (incorrect.size > 0) {
        setIncorrectFields(incorrect)
        setFeedback(`Il y a ${incorrect.size} erreur${incorrect.size > 1 ? "s" : ""}. Corrigez les champs en rouge.`)
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
        <p className="text-muted-foreground">Génération des verbes...</p>
      </div>
    )
  }

  if (!currentVerb) {
    return <p className="text-muted-foreground">Chargement des verbes...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Verbe {currentIndex + 1} sur {verbs.length}
        </span>
        <span>{studentName}</span>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <p className="mb-1 text-sm text-muted-foreground">Conjuguez au présent :</p>
        <p className="text-xl font-medium text-foreground">
          {currentVerb.firstPerson}, {currentVerb.secondPerson}, {currentVerb.infinitive}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">({currentVerb.meaning})</p>
        {currentVerb.isCompound && <p className="mt-2 text-xs text-muted-foreground">Composé de « esse » (être)</p>}
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
            className={`rounded-2xl p-4 ${
              results[results.length - 1]?.isCorrect
                ? "bg-green-50 text-green-900 dark:bg-green-950/30 dark:text-green-100"
                : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100"
            }`}
          >
            <p className="text-sm leading-relaxed">{feedback}</p>
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
