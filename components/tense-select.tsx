"use client"

import type React from "react"
import { useState } from "react"
import { TENSE_INFO, type TenseSystem, type LatinTense } from "@/lib/latin-verbs"

type TenseSelectProps = {
  studentName: string
  onSubmit: (tenseSystem: TenseSystem, tense: LatinTense) => void
  onBack?: () => void
}

export function TenseSelect({ studentName, onSubmit, onBack }: TenseSelectProps) {
  const [selectedSystem, setSelectedSystem] = useState<TenseSystem | null>(null)
  const [selectedTense, setSelectedTense] = useState<LatinTense | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSystem && selectedTense) {
      onSubmit(selectedSystem, selectedTense)
    }
  }

  const handleSystemSelect = (system: TenseSystem) => {
    setSelectedSystem(system)
    setSelectedTense(null) // Reset tense when system changes
  }

  const handleTenseSelect = (tense: LatinTense) => {
    setSelectedTense(tense)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="font-semibold">{studentName}</span> !
      </p>

      {/* Step 1: Select System (Infectum or Perfectum) */}
      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          1. Choisissez le système verbal
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Infectum - White/Light theme with rainbow glow when selected */}
          <button
            type="button"
            onClick={() => handleSystemSelect("infectum")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedSystem === "infectum"
                ? "text-black scale-[1.02] rainbow-glow-selected"
                : "bg-white/80 text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${selectedSystem === "infectum" ? "indicator-dot-infectum" : "bg-gray-200 border border-gray-300"}`} />
                <span className="font-bold text-lg">{TENSE_INFO.infectum.label}</span>
              </div>
              <p className="text-xs text-gray-500">{TENSE_INFO.infectum.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(TENSE_INFO.infectum.tenses).map(([key, tense]) => (
                  <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {tense.label}
                  </span>
                ))}
              </div>
            </div>
          </button>

          {/* Perfectum - Black/Dark theme with rainbow glow when selected */}
          <button
            type="button"
            onClick={() => handleSystemSelect("perfectum")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedSystem === "perfectum"
                ? "text-white scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${selectedSystem === "perfectum" ? "indicator-dot-perfectum" : "bg-gray-700 border border-gray-500"}`} />
                <span className="font-bold text-lg">{TENSE_INFO.perfectum.label}</span>
              </div>
              <p className="text-xs text-gray-400">{TENSE_INFO.perfectum.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(TENSE_INFO.perfectum.tenses).map(([key, tense]) => (
                  <span key={key} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                    {tense.label}
                  </span>
                ))}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Select specific tense within the system */}
      {selectedSystem && (
        <div className="space-y-5 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">
            2. Choisissez le temps
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(TENSE_INFO[selectedSystem].tenses).map(([key, tense]) => {
              const isInfectum = selectedSystem === "infectum"
              const isSelected = selectedTense === key
              
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTenseSelect(key as LatinTense)}
                  className={`rounded-xl p-4 text-left transition-all duration-300 ${
                    isInfectum
                      ? isSelected
                        ? "text-black scale-[1.02] rainbow-glow-selected-subtle"
                        : "bg-white/60 text-gray-600 border-2 border-gray-200 hover:bg-white hover:border-gray-300"
                      : isSelected
                        ? "text-white scale-[1.02] rainbow-glow-selected-subtle-dark"
                        : "bg-gray-900/80 text-gray-300 border-2 border-gray-700 hover:bg-gray-900 hover:border-gray-600"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full rainbow-dot" />
                      )}
                      <span className={`font-semibold text-sm ${isInfectum ? "text-black" : "text-white"}`}>
                        {tense.label}
                      </span>
                    </div>
                    <div className={`text-[10px] ${isInfectum ? "text-gray-500" : "text-gray-400"}`}>
                      {tense.description}
                    </div>
                    <div className={`text-[9px] font-mono mt-1 ${isInfectum ? "text-gray-400" : "text-gray-500"}`}>
                      {tense.example}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected summary */}
      {selectedSystem && selectedTense && (
        <div className={`rounded-xl p-4 animate-fade-in ${
          selectedSystem === "infectum"
            ? "rainbow-glow-selected-subtle"
            : "rainbow-glow-selected-subtle-dark"
        }`}>
          <p className={`text-sm ${selectedSystem === "infectum" ? "text-gray-700" : "text-gray-300"}`}>
            <span className="font-medium">Sélection :</span>{" "}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
              selectedSystem === "infectum"
                ? "bg-white text-black border border-gray-300"
                : "bg-black text-white border border-gray-600"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full rainbow-dot" />
              {TENSE_INFO[selectedSystem].label}
            </span>
            {" → "}
            <span className={`font-semibold ${selectedSystem === "infectum" ? "text-black" : "text-white"}`}>
              {TENSE_INFO[selectedSystem].tenses[selectedTense as keyof typeof TENSE_INFO.infectum.tenses]?.label}
            </span>
          </p>
          <p className={`text-xs mt-2 font-mono ${selectedSystem === "infectum" ? "text-gray-500" : "text-gray-400"}`}>
            Terminaisons : {TENSE_INFO[selectedSystem].tenses[selectedTense as keyof typeof TENSE_INFO.infectum.tenses]?.endings}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-3 pt-2">
        {onBack && (
          <button 
            type="button" 
            onClick={onBack}
            className="rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
          >
            Retour
          </button>
        )}
        <button 
          type="submit" 
          disabled={!selectedSystem || !selectedTense}
          className="pill-glow disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continuer
        </button>
      </div>
    </form>
  )
}
