"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import { 
  CASE_INFO, 
  CASES_ORDER, 
  DECLENSION_INFO, 
  type DeclensionNumber, 
  type DeclensionCase 
} from "@/lib/latin-declensions"

type NounData = {
  nominativeSingular: string
  genitiveSingular: string
  gender: string
  meaning: string
  declension: DeclensionNumber
  singularForms: string[] // 6 forms: N, V, Ac, G, D, Ab
  pluralForms: string[]   // 6 forms: N, V, Ac, G, D, Ab
}

type DeclensionExerciseProps = {
  studentName: string
  nounCount: number
  declension: DeclensionNumber
  verificationMode: "per-step" | "at-end"
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
  onBack?: () => void
}

export function DeclensionExercise({ 
  studentName, 
  nounCount, 
  declension, 
  verificationMode, 
  onComplete,
  onBack 
}: DeclensionExerciseProps) {
  const [nouns, setNouns] = useState<NounData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answersSingular, setAnswersSingular] = useState({
    nominative: "",
    vocative: "",
    accusative: "",
    genitive: "",
    dative: "",
    ablative: "",
  })
  const [answersPlural, setAnswersPlural] = useState({
    nominative: "",
    vocative: "",
    accusative: "",
    genitive: "",
    dative: "",
    ablative: "",
  })
  const [allAnswers, setAllAnswers] = useState<
    Array<{
      noun: NounData
      singular: typeof answersSingular
      plural: typeof answersPlural
    }>
  >([])
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [startTime] = useState<number>(Date.now())
  const [incorrectFields, setIncorrectFields] = useState<Set<string>>(new Set())

  const declInfo = DECLENSION_INFO[declension]

  useEffect(() => {
    async function generateNouns() {
      try {
        const response = await fetch("/api/generate-nouns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: nounCount, declension, number: "both" }),
        })

        if (response.ok) {
          const data = await response.json()
          setNouns(data.nouns)
        } else {
          throw new Error("Failed to generate nouns")
        }
      } catch (error) {
        console.error("Error generating nouns:", error)
        setNouns([])
      } finally {
        setIsGenerating(false)
      }
    }

    generateNouns()
  }, [nounCount, declension])

  const currentNoun = nouns[currentIndex]

  const validateAnswer = useCallback(
    async (nounToValidate: NounData, singularAnswer: typeof answersSingular, pluralAnswer: typeof answersPlural) => {
      const userAnswerSingular = CASES_ORDER.map(c => singularAnswer[c]).join(", ")
      const userAnswerPlural = CASES_ORDER.map(c => pluralAnswer[c]).join(", ")
      const userAnswer = userAnswerSingular + " | " + userAnswerPlural
      
      const correctAnswerSingular = nounToValidate.singularForms.join(", ")
      const correctAnswerPlural = nounToValidate.pluralForms.join(", ")
      const correctAnswer = correctAnswerSingular + " | " + correctAnswerPlural

      try {
        const response = await fetch("/api/validate-declension", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noun: nounToValidate.nominativeSingular,
            genitive: nounToValidate.genitiveSingular,
            userAnswer,
            correctAnswer,
            studentName,
            declension,
            number: "both",
          }),
        })

        const data = await response.json()

        return {
          verb: nounToValidate.nominativeSingular,
          principalParts: `${nounToValidate.nominativeSingular}, ${nounToValidate.genitiveSingular}`,
          userAnswer,
          correctAnswer,
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          category: `${declension}ère déclinaison`,
        }
      } catch {
        const isCorrectSingular = CASES_ORDER.every((c, i) => 
          singularAnswer[c].toLowerCase().trim() === nounToValidate.singularForms[i]?.toLowerCase()
        )
        const isCorrectPlural = CASES_ORDER.every((c, i) => 
          pluralAnswer[c].toLowerCase().trim() === nounToValidate.pluralForms[i]?.toLowerCase()
        )
        const isCorrect = isCorrectSingular && isCorrectPlural

        const fallbackFeedback = isCorrect 
          ? "Correct ! Bien joué." 
          : `La bonne réponse est : ${correctAnswer}`

        return {
          verb: nounToValidate.nominativeSingular,
          principalParts: `${nounToValidate.nominativeSingular}, ${nounToValidate.genitiveSingular}`,
          userAnswer,
          correctAnswer,
          isCorrect,
          feedback: fallbackFeedback,
          category: `${declension}ère déclinaison`,
        }
      }
    },
    [studentName, declension],
  )

  const handleSubmitCurrent = async () => {
    if (!currentNoun) return

    if (verificationMode === "per-step") {
      setIsValidating(true)
      setFeedback(null)
      setIncorrectFields(new Set())

      // Check each field individually (both singular and plural)
      const incorrect = new Set<string>()
      CASES_ORDER.forEach((c, index) => {
        if (answersSingular[c].toLowerCase().trim() !== currentNoun.singularForms[index]?.toLowerCase()) {
          incorrect.add(`singular-${c}`)
        }
        if (answersPlural[c].toLowerCase().trim() !== currentNoun.pluralForms[index]?.toLowerCase()) {
          incorrect.add(`plural-${c}`)
        }
      })

      if (incorrect.size > 0) {
        setIncorrectFields(incorrect)
        
        // Generate intelligent hint from LLM based on actual errors
        const errorDetails = CASES_ORDER
          .map((c, index) => {
            const errors = []
            if (incorrect.has(`singular-${c}`)) {
              errors.push(`Singulier ${CASE_INFO[c].label}: "${answersSingular[c]}" (attendu: "${currentNoun.singularForms[index]}")`)
            }
            if (incorrect.has(`plural-${c}`)) {
              errors.push(`Pluriel ${CASE_INFO[c].label}: "${answersPlural[c]}" (attendu: "${currentNoun.pluralForms[index]}")`)
            }
            return errors.length > 0 ? errors.join("; ") : null
          })
          .filter(Boolean)
          .join(", ")
        
        try {
          const hintResponse = await fetch("/api/generate-hint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verb: currentNoun.nominativeSingular,
              tense: `${declension}ème déclinaison`,
              tenseSystem: "declension",
              errors: errorDetails,
              studentName,
            }),
          })
          
          if (hintResponse.ok) {
            const hintData = await hintResponse.json()
            setFeedback(`Il y a ${incorrect.size} erreur${incorrect.size > 1 ? "s" : ""}. ${hintData.hint}`)
          } else {
            setFeedback(`Il y a ${incorrect.size} erreur${incorrect.size > 1 ? "s" : ""}. Vérifie les terminaisons de la ${declension}ème déclinaison.`)
          }
        } catch {
          setFeedback(`Il y a ${incorrect.size} erreur${incorrect.size > 1 ? "s" : ""}. Vérifie les terminaisons de la ${declension}ème déclinaison.`)
        }
        
        setIsValidating(false)
        return
      }

      // All correct
      const result = await validateAnswer(currentNoun, answersSingular, answersPlural)
      setFeedback(result.feedback)
      setShowNext(true)
      setResults((prev) => [...prev, result])
      setIsValidating(false)
    } else {
      // Store current answer and pass to handleNext to avoid stale state issue
      const updatedAnswers = [...allAnswers, { 
        noun: currentNoun, 
        singular: { ...answersSingular },
        plural: { ...answersPlural }
      }]
      setAllAnswers(updatedAnswers)
      handleNext(updatedAnswers)
    }
  }

  const handleNext = (updatedAnswers?: typeof allAnswers) => {
    if (currentIndex + 1 >= nouns.length) {
      if (verificationMode === "at-end") {
        validateAllAnswers(updatedAnswers || allAnswers)
      } else {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        onComplete(results, elapsedSeconds)
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
      setAnswersSingular({
        nominative: "",
        vocative: "",
        accusative: "",
        genitive: "",
        dative: "",
        ablative: "",
      })
      setAnswersPlural({
        nominative: "",
        vocative: "",
        accusative: "",
        genitive: "",
        dative: "",
        ablative: "",
      })
      setFeedback(null)
      setShowNext(false)
      setIncorrectFields(new Set())
    }
  }

  const validateAllAnswers = async (answersToValidate: typeof allAnswers) => {
    setIsValidating(true)

    const validationResults: ExerciseResult[] = []

    for (const { noun, singular, plural } of answersToValidate) {
      const result = await validateAnswer(noun, singular, plural)
      validationResults.push(result)
    }

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
    setIsValidating(false)
    onComplete(validationResults, elapsedSeconds)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!showNext) {
      // For ANY mode, store/validate the answer first
      handleSubmitCurrent()
    } else {
      // Only move to next after validation (per-step mode only)
      handleNext()
    }
  }

  if (isGenerating) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
        <p className="text-muted-foreground">
          Génération des noms de la {declension}ère déclinaison...
        </p>
      </div>
    )
  }

  if (!currentNoun || nouns.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Erreur lors de la génération des noms.</p>
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
          Nom {currentIndex + 1} sur {nouns.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
            {declension}ère décl. • Singulier & Pluriel
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 shadow-sm dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 dark:border-gray-700">
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          Déclinez au singulier et au pluriel :
        </p>
        <p className="text-xl font-medium text-black dark:text-white">
          {currentNoun.nominativeSingular}, {currentNoun.genitiveSingular}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ({currentNoun.meaning}) - {currentNoun.gender === "masculine" ? "m." : currentNoun.gender === "feminine" ? "f." : "n."}
        </p>
        <p className="mt-2 text-xs font-mono text-gray-400 dark:text-gray-500">
          {declInfo.theme}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Table with 2 columns: Singular | Plural */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="bg-gray-50 dark:bg-gray-800 py-3 px-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Cas
                </th>
                <th className="bg-white dark:bg-gray-800/50 py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Singulier
                </th>
                <th className="bg-gray-900 dark:bg-gray-950 py-3 px-4 text-left text-xs font-semibold text-gray-100">
                  Pluriel
                </th>
              </tr>
            </thead>
            <tbody>
              {CASES_ORDER.map((caseKey, index) => {
                const caseInfo = CASE_INFO[caseKey]
                
                return (
                  <tr key={caseKey} className={`border-b border-gray-100 dark:border-gray-800 ${index % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-900/30' : 'bg-white dark:bg-gray-900/50'}`}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-700 dark:text-gray-300">{caseInfo.abbrev}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{caseInfo.label}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <input
                        value={answersSingular[caseKey]}
                        onChange={(e) => {
                          setAnswersSingular((prev) => ({ ...prev, [caseKey]: e.target.value }))
                          if (incorrectFields.has(`singular-${caseKey}`)) {
                            const newIncorrect = new Set(incorrectFields)
                            newIncorrect.delete(`singular-${caseKey}`)
                            setIncorrectFields(newIncorrect)
                          }
                        }}
                        placeholder="..."
                        disabled={showNext && verificationMode === "per-step"}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border bg-white dark:bg-gray-800 transition-all ${
                          incorrectFields.has(`singular-${caseKey}`) 
                            ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30" 
                            : "border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                        }`}
                        autoFocus={index === 0}
                      />
                    </td>
                    <td className="py-2 px-4 bg-gray-900/5 dark:bg-gray-950/50">
                      <input
                        value={answersPlural[caseKey]}
                        onChange={(e) => {
                          setAnswersPlural((prev) => ({ ...prev, [caseKey]: e.target.value }))
                          if (incorrectFields.has(`plural-${caseKey}`)) {
                            const newIncorrect = new Set(incorrectFields)
                            newIncorrect.delete(`plural-${caseKey}`)
                            setIncorrectFields(newIncorrect)
                          }
                        }}
                        placeholder="..."
                        disabled={showNext && verificationMode === "per-step"}
                        className={`w-full px-3 py-1.5 text-sm rounded-lg border bg-gray-50 dark:bg-gray-900 transition-all ${
                          incorrectFields.has(`plural-${caseKey}`) 
                            ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30" 
                            : "border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500"
                        }`}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
            disabled={isValidating} 
            className="pill-button-rainbow-grey disabled:opacity-50"
          >
            {isValidating
              ? verificationMode === "at-end"
                ? "Vérification de tous les noms..."
                : "Vérification..."
              : showNext && verificationMode === "per-step"
                ? currentIndex + 1 >= nouns.length
                  ? "Voir les résultats"
                  : "Nom suivant"
                : verificationMode === "at-end"
                  ? currentIndex + 1 >= nouns.length
                    ? "Terminer et voir les résultats"
                    : "Suivant"
                  : "Vérifier"}
          </button>
        </div>
      </form>
    </div>
  )
}
