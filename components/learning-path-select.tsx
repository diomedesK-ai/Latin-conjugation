"use client"

import type React from "react"
import { useState } from "react"

export type LearningPath = "conjugaison" | "declinaison" | "preposition"

type LearningPathSelectProps = {
  studentName: string
  onSubmit: (path: LearningPath) => void
  onBack?: () => void
}

const PATH_INFO = {
  conjugaison: {
    label: "Conjugaison",
    description: "Verbes latins",
    details: "Infectum & Perfectum",
    subdetails: "6 temps de l'indicatif",
    examples: ["amo, amas, amat...", "amavi, amavisti..."],
  },
  declinaison: {
    label: "Déclinaison",
    description: "Noms & adjectifs",
    details: "1ère, 2ème, 3ème",
    subdetails: "6 cas • Singulier/Pluriel",
    examples: ["rosa, rosae, rosam...", "dominus, domini..."],
  },
  preposition: {
    label: "Prépositions",
    description: "Régimes des cas",
    details: "Accusatif & Ablatif",
    subdetails: "Prépositions latines",
    examples: ["ad + acc", "ab + abl", "in + acc/abl"],
  }
}

// Professional minimal icons - circles with line icons, no fill
const ConjugaisonIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-black" : "border-gray-400 dark:border-gray-500"
  }`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-black" : "text-gray-500 dark:text-gray-400"}>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </svg>
  </div>
)

const DeclinaisonIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-gray-700" : "border-gray-400"
  }`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-gray-700" : "text-gray-500"}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M8 3v3" />
      <path d="M16 18v3" />
    </svg>
  </div>
)

const PrepositionIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-white" : "border-gray-500"
  }`}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-white" : "text-gray-400"}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </div>
)

export function LearningPathSelect({ studentName, onSubmit, onBack }: LearningPathSelectProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPath) {
      onSubmit(selectedPath)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          Choisissez votre exercice
        </label>
        
        {/* Side by side - 3 columns */}
        <div className="grid grid-cols-3 gap-8">
          {/* Conjugaison - WHITE when selected */}
          <button
            type="button"
            onClick={() => setSelectedPath("conjugaison")}
            className={`rounded-2xl p-8 text-left transition-all duration-300 min-h-[280px] ${
              selectedPath === "conjugaison"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4 h-full">
              <ConjugaisonIcon selected={selectedPath === "conjugaison"} />
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center justify-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "conjugaison" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                  <span className={`font-bold text-lg ${selectedPath === "conjugaison" ? "text-black" : ""}`}>
                    {PATH_INFO.conjugaison.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedPath === "conjugaison" ? "text-gray-700" : "text-muted-foreground"}`}>
                  {PATH_INFO.conjugaison.description}
                </p>
                <p className={`text-sm font-medium ${selectedPath === "conjugaison" ? "text-gray-600" : "text-muted-foreground/80"}`}>
                  {PATH_INFO.conjugaison.details}
                </p>
                <p className={`text-xs ${selectedPath === "conjugaison" ? "text-gray-500" : "text-muted-foreground/60"}`}>
                  {PATH_INFO.conjugaison.subdetails}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-auto">
                {PATH_INFO.conjugaison.examples.map((ex, i) => (
                  <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full font-mono ${
                    selectedPath === "conjugaison" 
                      ? "bg-gray-200 text-gray-700" 
                      : "bg-gray-300/80 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                  }`}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Déclinaison - GREY when selected */}
          <button
            type="button"
            onClick={() => setSelectedPath("declinaison")}
            className={`rounded-2xl p-8 text-left transition-all duration-300 min-h-[280px] ${
              selectedPath === "declinaison"
                ? "scale-[1.02] rainbow-glow-selected-grey"
                : "bg-[#c8c8c8] dark:bg-gray-300 text-gray-700 border-2 border-gray-300 dark:border-gray-400 hover:border-gray-400"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4 h-full">
              <DeclinaisonIcon selected={selectedPath === "declinaison"} />
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center justify-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "declinaison" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                  <span className={`font-bold text-lg ${selectedPath === "declinaison" ? "text-gray-800" : "text-gray-700"}`}>
                    {PATH_INFO.declinaison.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedPath === "declinaison" ? "text-gray-700" : "text-gray-500"}`}>
                  {PATH_INFO.declinaison.description}
                </p>
                <p className={`text-sm font-medium ${selectedPath === "declinaison" ? "text-gray-600" : "text-gray-500"}`}>
                  {PATH_INFO.declinaison.details}
                </p>
                <p className={`text-xs ${selectedPath === "declinaison" ? "text-gray-500" : "text-gray-400"}`}>
                  {PATH_INFO.declinaison.subdetails}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-auto">
                {PATH_INFO.declinaison.examples.map((ex, i) => (
                  <span key={i} className={`text-[10px] px-2.5 py-1 rounded-full font-mono ${
                    selectedPath === "declinaison" 
                      ? "bg-gray-300 text-gray-700" 
                      : "bg-white/50 text-gray-500"
                  }`}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Prépositions - BLACK when selected */}
          <button
            type="button"
            onClick={() => setSelectedPath("preposition")}
            className={`rounded-2xl p-8 text-left transition-all duration-300 min-h-[280px] ${
              selectedPath === "preposition"
                ? "scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 dark:bg-gray-950 text-gray-300 border-2 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="flex flex-col items-center text-center gap-4 h-full">
              <PrepositionIcon selected={selectedPath === "preposition"} />
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center justify-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "preposition" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                  <span className="font-bold text-lg text-white">
                    {PATH_INFO.preposition.label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {PATH_INFO.preposition.description}
                </p>
                <p className="text-sm font-medium text-gray-400">
                  {PATH_INFO.preposition.details}
                </p>
                <p className="text-xs text-gray-500">
                  {PATH_INFO.preposition.subdetails}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-auto">
                {PATH_INFO.preposition.examples.map((ex, i) => (
                  <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 font-mono">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        {onBack && (
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
          disabled={!selectedPath}
          className={`disabled:cursor-not-allowed ${
            !selectedPath
              ? "pill-button-disabled" 
              : selectedPath === "preposition"
                ? "pill-button-rainbow-dark"
                : selectedPath === "declinaison"
                  ? "pill-button-rainbow-grey"
                  : "pill-button-rainbow-light"
          }`}
        >
          Continuer
        </button>
      </div>
    </form>
  )
}
