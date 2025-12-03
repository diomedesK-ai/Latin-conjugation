"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { ExerciseResult } from "@/app/page"
import { 
  CASE_INFO, 
  CASES_ORDER, 
  DECLENSION_INFO, 
  type DeclensionNumber, 
  type DeclensionNumber2,
  type DeclensionCase 
} from "@/lib/latin-declensions"

type NounData = {
  nominativeSingular: string
  genitiveSingular: string
  gender: string
  meaning: string
  declension: DeclensionNumber
  forms: string[] // 6 forms in order: N, V, Ac, G, D, Ab
}

type DeclensionExerciseProps = {
  studentName: string
  nounCount: number
  declension: DeclensionNumber
  number: DeclensionNumber2
  verificationMode: "per-step" | "at-end"
  onComplete: (results: ExerciseResult[], timeInSeconds: number) => void
}

export function DeclensionExercise({ 
  studentName, 
  nounCount, 
  declension, 
  number, 
  verificationMode, 
  onComplete 
}: DeclensionExerciseProps) {
  const [nouns, setNouns] = useState<NounData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({
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

  const isSingular = number === "singular"
  const declInfo = DECLENSION_INFO[declension]

  useEffect(() => {
    async function generateNouns() {
      try {
        const response = await fetch("/api/generate-nouns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: nounCount, declension, number }),
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
  }, [nounCount, declension, number])

  const currentNoun = nouns[currentIndex]

  const validateAnswer = useCallback(
    async (nounToValidate: NounData, answerToValidate: typeof answers) => {
      const userAnswer = CASES_ORDER.map(c => answerToValidate[c]).join(", ")
      const correctAnswer = nounToValidate.forms.join(", ")

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
            number,
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
          category: `${declension}ème déclinaison`,
        }
      } catch {
        const isCorrect = CASES_ORDER.every((c, i) => 
          answerToValidate[c].toLowerCase().trim() === nounToValidate.forms[i]?.toLowerCase()
        )

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
          category: `${declension}ème déclinaison`,
        }
      }
    },
    [studentName, declension, number],
  )

  const handleSubmitCurrent = async () => {
    if (!currentNoun) return

    if (verificationMode === "per-step") {
      setIsValidating(true)
      setFeedback(null)
      setIncorrectFields(new Set())

      // Check each field individually
      const incorrect = new Set<string>()
      CASES_ORDER.forEach((c, index) => {
        if (answers[c].toLowerCase().trim() !== currentNoun.forms[index]?.toLowerCase()) {
          incorrect.add(c)
        }
      })

      if (incorrect.size > 0) {
        setIncorrectFields(incorrect)
        
        // Generate intelligent hint from LLM based on actual errors
        const errorDetails = CASES_ORDER
          .map((c, index) => {
            if (incorrect.has(c)) {
              return `${CASE_INFO[c].label}: "${answers[c]}" (attendu: "${currentNoun.forms[index]}")`
            }
            return null
          })
          .filter(Boolean)
          .join(", ")
        
        try {
          const hintResponse = await fetch("/api/generate-hint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              verb: currentNoun.nominativeSingular,
              tense: `${declension}ème déclinaison au ${number === "singular" ? "singulier" : "pluriel"}`,
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
      const result = await validateAnswer(currentNoun, answers)
      setFeedback(result.feedback)
      setShowNext(true)
      setResults((prev) => [...prev, result])
      setIsValidating(false)
    } else {
      // Store current answer and pass to handleNext to avoid stale state issue
      const updatedAnswers = [...allAnswers, { noun: currentNoun, answer: { ...answers } }]
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
      setAnswers({
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

    for (const { noun, answer } of answersToValidate) {
      const result = await validateAnswer(noun, answer)
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
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            isSingular
              ? "bg-white text-black border border-gray-300 shadow-sm"
              : "bg-black text-white border border-gray-600 shadow-sm"
          }`}>
            {declension}ère décl. • {isSingular ? "Singulier" : "Pluriel"}
          </span>
          <span className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
            {studentName}
          </span>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 shadow-sm ${
        isSingular
          ? "border-gray-200 bg-white"
          : "border-gray-700 bg-gray-900"
      }`}>
        <p className={`mb-1 text-sm ${isSingular ? "text-gray-500" : "text-gray-400"}`}>
          Déclinez au {isSingular ? "singulier" : "pluriel"} :
        </p>
        <p className={`text-xl font-medium ${isSingular ? "text-black" : "text-white"}`}>
          {currentNoun.nominativeSingular}, {currentNoun.genitiveSingular}
        </p>
        <p className={`mt-1 text-sm ${isSingular ? "text-gray-500" : "text-gray-400"}`}>
          ({currentNoun.meaning}) - {currentNoun.gender === "masculine" ? "m." : currentNoun.gender === "feminine" ? "f." : "n."}
        </p>
        <p className={`mt-2 text-xs font-mono ${isSingular ? "text-gray-400" : "text-gray-500"}`}>
          {declInfo.theme}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {CASES_ORDER.map((caseKey, index) => {
            const caseInfo = CASE_INFO[caseKey]
            const isFirstColumn = index < 3
            
            return (
              <div key={caseKey} className={isFirstColumn ? "" : ""}>
                <label className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-bold">{caseInfo.abbrev}</span>
                  <span>{caseInfo.label}</span>
                </label>
                <input
                  value={answers[caseKey]}
                  onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [caseKey]: e.target.value }))
                    if (incorrectFields.has(caseKey)) {
                      const newIncorrect = new Set(incorrectFields)
                      newIncorrect.delete(caseKey)
                      setIncorrectFields(newIncorrect)
                    }
                  }}
                  placeholder={caseInfo.question}
                  disabled={showNext && verificationMode === "per-step"}
                  className={`pill-input w-full ${incorrectFields.has(caseKey) ? "input-error" : ""}`}
                  autoFocus={index === 0}
                />
              </div>
            )
          })}
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
          <button 
            type="submit" 
            disabled={isValidating} 
            className={`${isSingular ? "pill-button-rainbow-light" : "pill-button-rainbow-dark"} disabled:opacity-50`}
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

