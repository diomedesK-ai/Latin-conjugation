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
    icon: "🔄",
    details: "Infectum & Perfectum • 6 temps",
    examples: ["amo, amas, amat...", "amavi, amavisti..."],
    theme: "gradient" as const
  },
  declinaison: {
    label: "Déclinaison",
    description: "Noms & adjectifs",
    icon: "📝",
    details: "1ère, 2ème, 3ème • 6 cas",
    examples: ["rosa, rosae, rosam...", "dominus, domini..."],
    theme: "light" as const
  },
  preposition: {
    label: "Prépositions",
    description: "Régimes des cas",
    icon: "🔗",
    details: "Accusatif & Ablatif",
    examples: ["ad + acc", "ab + abl", "in + acc/abl"],
    theme: "dark" as const
  }
}

export function LearningPathSelect({ studentName, onSubmit, onBack }: LearningPathSelectProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPath) {
      onSubmit(selectedPath)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          Choisissez votre exercice
        </label>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Conjugaison - Gradient theme */}
          <button
            type="button"
            onClick={() => setSelectedPath("conjugaison")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedPath === "conjugaison"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-3xl ${selectedPath === "conjugaison" ? "animate-pulse" : ""}`}>
                {PATH_INFO.conjugaison.icon}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "conjugaison" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                  <span className={`font-bold text-lg ${selectedPath === "conjugaison" ? "text-black" : ""}`}>
                    {PATH_INFO.conjugaison.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedPath === "conjugaison" ? "text-gray-700" : "text-muted-foreground"}`}>
                  {PATH_INFO.conjugaison.description}
                </p>
                <p className={`text-xs ${selectedPath === "conjugaison" ? "text-gray-500" : "text-muted-foreground/70"}`}>
                  {PATH_INFO.conjugaison.details}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PATH_INFO.conjugaison.examples.map((ex, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      selectedPath === "conjugaison" 
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-muted-foreground"
                    }`}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Déclinaison - Light/White theme */}
          <button
            type="button"
            onClick={() => setSelectedPath("declinaison")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedPath === "declinaison"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-[#c8c8c8] dark:bg-gray-200 text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-3xl ${selectedPath === "declinaison" ? "animate-pulse" : ""}`}>
                {PATH_INFO.declinaison.icon}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "declinaison" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                  <span className={`font-bold text-lg ${selectedPath === "declinaison" ? "text-black" : "text-gray-700"}`}>
                    {PATH_INFO.declinaison.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedPath === "declinaison" ? "text-gray-700" : "text-gray-500"}`}>
                  {PATH_INFO.declinaison.description}
                </p>
                <p className={`text-xs ${selectedPath === "declinaison" ? "text-gray-500" : "text-gray-400"}`}>
                  {PATH_INFO.declinaison.details}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PATH_INFO.declinaison.examples.map((ex, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      selectedPath === "declinaison" 
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-white/50 text-gray-500"
                    }`}>
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Prépositions - Dark/Black theme */}
          <button
            type="button"
            onClick={() => setSelectedPath("preposition")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedPath === "preposition"
                ? "scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 dark:bg-gray-950 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-3xl ${selectedPath === "preposition" ? "animate-pulse" : ""}`}>
                {PATH_INFO.preposition.icon}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPath === "preposition" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                  <span className="font-bold text-lg text-white">
                    {PATH_INFO.preposition.label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {PATH_INFO.preposition.description}
                </p>
                <p className="text-xs text-gray-500">
                  {PATH_INFO.preposition.details}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PATH_INFO.preposition.examples.map((ex, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-mono">
                      {ex}
                    </span>
                  ))}
                </div>
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
                : "pill-button-rainbow-light"
          }`}
        >
          Continuer
        </button>
      </div>
    </form>
  )
}

