"use client"

import type React from "react"
import { useState } from "react"

export type TranslationDirection = "fr-la" | "la-fr"

type TranslationSelectProps = {
  studentName: string
  onSubmit: (direction: TranslationDirection) => void
  onBack?: () => void
}

const DIRECTION_INFO = {
  "fr-la": {
    label: "Français → Latin",
    description: "Traduire du français vers le latin",
    examples: ["eau → aqua", "guerre → bellum", "roi → rex"],
  },
  "la-fr": {
    label: "Latin → Français", 
    description: "Traduire du latin vers le français",
    examples: ["rosa → rose", "dominus → maître", "pax → paix"],
  }
}

export function TranslationSelect({ studentName, onSubmit, onBack }: TranslationSelectProps) {
  const [selectedDirection, setSelectedDirection] = useState<TranslationDirection | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDirection) {
      onSubmit(selectedDirection)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          Choisissez la direction de traduction
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          {/* FR → LA - White theme */}
          <button
            type="button"
            onClick={() => setSelectedDirection("fr-la")}
            className={`rounded-2xl p-6 text-left transition-all duration-300 ${
              selectedDirection === "fr-la"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  selectedDirection === "fr-la" ? "border-black" : "border-gray-400 dark:border-gray-500"
                }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedDirection === "fr-la" ? "text-black" : "text-gray-500 dark:text-gray-400"}>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`indicator-dot ${selectedDirection === "fr-la" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                    <span className={`font-bold text-lg ${selectedDirection === "fr-la" ? "text-black" : ""}`}>
                      {DIRECTION_INFO["fr-la"].label}
                    </span>
                  </div>
                  <p className={`text-sm ${selectedDirection === "fr-la" ? "text-gray-600" : "text-muted-foreground"}`}>
                    {DIRECTION_INFO["fr-la"].description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {DIRECTION_INFO["fr-la"].examples.map((ex, i) => (
                  <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                    selectedDirection === "fr-la" 
                      ? "bg-gray-200 text-gray-700" 
                      : "bg-gray-300/80 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* LA → FR - Dark theme */}
          <button
            type="button"
            onClick={() => setSelectedDirection("la-fr")}
            className={`rounded-2xl p-6 text-left transition-all duration-300 ${
              selectedDirection === "la-fr"
                ? "scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 dark:bg-gray-950 text-gray-300 border-2 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                  selectedDirection === "la-fr" ? "border-white" : "border-gray-500"
                }`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedDirection === "la-fr" ? "text-white" : "text-gray-400"}>
                    <path d="M19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`indicator-dot ${selectedDirection === "la-fr" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                    <span className="font-bold text-lg text-white">
                      {DIRECTION_INFO["la-fr"].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {DIRECTION_INFO["la-fr"].description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {DIRECTION_INFO["la-fr"].examples.map((ex, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 font-mono">
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
          disabled={!selectedDirection}
          className={`disabled:cursor-not-allowed ${
            !selectedDirection
              ? "pill-button-disabled" 
              : selectedDirection === "la-fr"
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

