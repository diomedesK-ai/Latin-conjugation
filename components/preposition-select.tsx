"use client"

import type React from "react"
import { useState } from "react"
import { PREPOSITION_INFO, type PrepositionCase } from "@/lib/latin-prepositions"

type PrepositionSelectProps = {
  studentName: string
  onSubmit: (caseType: PrepositionCase) => void
  onBack?: () => void
}

export function PrepositionSelect({ studentName, onSubmit, onBack }: PrepositionSelectProps) {
  const [selectedCase, setSelectedCase] = useState<PrepositionCase | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCase) {
      onSubmit(selectedCase)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          Choisissez le type de prépositions
        </label>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Accusative - Light/White theme */}
          <button
            type="button"
            onClick={() => setSelectedCase("accusative")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedCase === "accusative"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-[#c8c8c8] text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                selectedCase === "accusative" 
                  ? "bg-blue-100 text-blue-700" 
                  : "bg-white/50 text-gray-600"
              }`}>
                Acc
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedCase === "accusative" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                  <span className={`font-bold text-lg ${selectedCase === "accusative" ? "text-black" : "text-gray-700"}`}>
                    {PREPOSITION_INFO.accusative.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedCase === "accusative" ? "text-gray-700" : "text-gray-500"}`}>
                  {PREPOSITION_INFO.accusative.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["ad", "ante", "per", "post", "trans"].map((prep) => (
                    <span key={prep} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      selectedCase === "accusative" 
                        ? "bg-blue-100 text-blue-700" 
                        : "bg-white/50 text-gray-500"
                    }`}>
                      {prep} + acc
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Ablative - Dark/Black theme */}
          <button
            type="button"
            onClick={() => setSelectedCase("ablative")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedCase === "ablative"
                ? "scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                selectedCase === "ablative" 
                  ? "bg-purple-900/50 text-purple-300" 
                  : "bg-gray-800 text-gray-400"
              }`}>
                Abl
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedCase === "ablative" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                  <span className="font-bold text-lg text-white">
                    {PREPOSITION_INFO.ablative.label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  {PREPOSITION_INFO.ablative.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["a/ab", "cum", "de", "e/ex", "sine"].map((prep) => (
                    <span key={prep} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-purple-300 font-mono">
                      {prep} + abl
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>

          {/* Both - Gradient theme */}
          <button
            type="button"
            onClick={() => setSelectedCase("both")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedCase === "both"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-xl font-bold px-2 py-1 rounded-lg ${
                selectedCase === "both" 
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700" 
                  : "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                Acc/Abl
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedCase === "both" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                  <span className={`font-bold text-lg ${selectedCase === "both" ? "text-black" : ""}`}>
                    {PREPOSITION_INFO.both.label}
                  </span>
                </div>
                <p className={`text-sm ${selectedCase === "both" ? "text-gray-700" : "text-muted-foreground"}`}>
                  {PREPOSITION_INFO.both.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["in + acc/abl", "sub + acc/abl", "super + acc/abl"].map((prep) => (
                    <span key={prep} className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      selectedCase === "both" 
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700" 
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-muted-foreground"
                    }`}>
                      {prep}
                    </span>
                  ))}
                </div>
                <p className={`text-[10px] mt-1 ${selectedCase === "both" ? "text-gray-500" : "text-muted-foreground/70"}`}>
                  Accusatif = mouvement • Ablatif = lieu
                </p>
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
          disabled={!selectedCase}
          className={`disabled:cursor-not-allowed ${
            !selectedCase
              ? "pill-button-disabled" 
              : selectedCase === "ablative"
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

