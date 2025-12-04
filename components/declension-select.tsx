"use client"

import type React from "react"
import { useState } from "react"
import { DECLENSION_INFO, CASE_INFO, type DeclensionNumber, type DeclensionNumber2 } from "@/lib/latin-declensions"

type DeclensionSelectProps = {
  studentName: string
  preSelectedDeclension: DeclensionNumber
  onSubmit: (declension: DeclensionNumber, number: DeclensionNumber2) => void
  onBack?: () => void
}

export function DeclensionSelect({ studentName, preSelectedDeclension, onSubmit, onBack }: DeclensionSelectProps) {
  const [selectedNumber, setSelectedNumber] = useState<DeclensionNumber2 | null>(null)

  const declInfo = DECLENSION_INFO[preSelectedDeclension]
  const declIndex = parseInt(preSelectedDeclension) - 1

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedNumber) {
      onSubmit(preSelectedDeclension, selectedNumber)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      {/* Show selected declension */}
      <div className={`rounded-2xl p-5 ${
        declIndex === 0 ? "rainbow-glow-selected" 
        : declIndex === 1 ? "rainbow-glow-selected-grey"
        : "rainbow-glow-selected-dark"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="indicator-dot rainbow-dot" />
              <span className={`font-bold text-lg ${declIndex === 2 ? "text-white" : "text-black"}`}>
                {preSelectedDeclension}ère déclinaison
              </span>
            </div>
            <p className={`text-sm mt-1 ${declIndex === 2 ? "text-gray-300" : "text-gray-600"}`}>
              {declInfo.description}
            </p>
          </div>
          <p className={`text-sm font-mono ${declIndex === 2 ? "text-gray-400" : "text-gray-500"}`}>
            {declInfo.theme}
          </p>
        </div>
      </div>

      {/* Select Number (Singular/Plural) */}
      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          Choisissez le nombre
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Singular - White theme */}
          <button
            type="button"
            onClick={() => setSelectedNumber("singular")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedNumber === "singular"
                ? "scale-[1.02] rainbow-glow-selected"
                : "bg-[#c8c8c8] text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${selectedNumber === "singular" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                <span className={`font-bold text-lg ${selectedNumber === "singular" ? "text-black" : "text-gray-700"}`}>
                  Singulier
                </span>
              </div>
              <p className={`text-xs ${selectedNumber === "singular" ? "text-gray-600" : "text-gray-500"}`}>
                Un seul élément
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.keys(CASE_INFO).slice(0, 3).map((c) => (
                  <span key={c} className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    selectedNumber === "singular" 
                      ? "bg-gray-100 text-gray-600" 
                      : "bg-white/50 text-gray-500"
                  }`}>
                    {CASE_INFO[c as keyof typeof CASE_INFO].abbrev}
                  </span>
                ))}
                <span className={`text-[9px] px-1.5 py-0.5 ${
                  selectedNumber === "singular" ? "text-gray-400" : "text-gray-400"
                }`}>...</span>
              </div>
            </div>
          </button>

          {/* Plural - Dark theme */}
          <button
            type="button"
            onClick={() => setSelectedNumber("plural")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedNumber === "plural"
                ? "scale-[1.02] rainbow-glow-selected-dark"
                : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600 hover:shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${selectedNumber === "plural" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                <span className="font-bold text-lg text-white">
                  Pluriel
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Plusieurs éléments
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.keys(CASE_INFO).slice(0, 3).map((c) => (
                  <span key={c} className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">
                    {CASE_INFO[c as keyof typeof CASE_INFO].abbrev}
                  </span>
                ))}
                <span className="text-[9px] px-1.5 py-0.5 text-gray-500">...</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Cases Preview */}
      {selectedNumber && (
        <div className={`rounded-xl p-4 animate-fade-in ${
          selectedNumber === "singular"
            ? "rainbow-glow-selected-subtle"
            : "rainbow-glow-selected-subtle-dark"
        }`}>
          <p className={`text-sm font-medium mb-3 ${selectedNumber === "singular" ? "text-gray-700" : "text-gray-300"}`}>
            Les 6 cas à décliner :
          </p>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(CASE_INFO).map(([key, info]) => (
              <div key={key} className={`text-center p-2 rounded-lg ${
                selectedNumber === "singular"
                  ? "bg-white/50"
                  : "bg-black/30"
              }`}>
                <div className={`font-bold text-sm ${selectedNumber === "singular" ? "text-black" : "text-white"}`}>
                  {info.abbrev}
                </div>
                <div className={`text-[8px] ${selectedNumber === "singular" ? "text-gray-500" : "text-gray-400"}`}>
                  {info.label}
                </div>
              </div>
            ))}
          </div>
          <p className={`text-xs mt-3 font-mono ${selectedNumber === "singular" ? "text-gray-500" : "text-gray-400"}`}>
            Terminaisons {selectedNumber === "singular" ? "singulier" : "pluriel"} : {
              Object.values(declInfo.endings[selectedNumber]).join(", ")
            }
          </p>
        </div>
      )}

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
          disabled={!selectedNumber}
          className={`disabled:cursor-not-allowed ${
            !selectedNumber
              ? "pill-button-disabled" 
              : selectedNumber === "plural"
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
