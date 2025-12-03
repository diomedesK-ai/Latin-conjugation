"use client"

import type React from "react"
import { useState } from "react"
import { DECLENSION_INFO, CASE_INFO, type DeclensionNumber, type DeclensionNumber2 } from "@/lib/latin-declensions"
import type { PrepositionCase } from "@/lib/latin-prepositions"

export type DeclensionSubType = "1" | "2" | "3" | "preposition"

type DeclensionSelectProps = {
  studentName: string
  onSubmit: (declension: DeclensionNumber, number: DeclensionNumber2) => void
  onPrepositionSubmit: (caseType: PrepositionCase) => void
  onBack?: () => void
}

const PREPOSITION_INFO = {
  label: "Prépositions",
  description: "Régimes des cas",
  theme: "ad, ab, in...",
}

export function DeclensionSelect({ studentName, onSubmit, onPrepositionSubmit, onBack }: DeclensionSelectProps) {
  const [selectedSubType, setSelectedSubType] = useState<DeclensionSubType | null>(null)
  const [selectedNumber, setSelectedNumber] = useState<DeclensionNumber2 | null>(null)
  const [selectedPrepositionCase, setSelectedPrepositionCase] = useState<PrepositionCase | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSubType === "preposition" && selectedPrepositionCase) {
      onPrepositionSubmit(selectedPrepositionCase)
    } else if (selectedSubType && selectedSubType !== "preposition" && selectedNumber) {
      onSubmit(selectedSubType as DeclensionNumber, selectedNumber)
    }
  }

  const isPreposition = selectedSubType === "preposition"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      {/* Step 1: Select Declension type (1st, 2nd, 3rd, Prépositions) */}
      <div className="space-y-5">
        <label className="block text-sm font-medium text-foreground">
          1. Choisissez le type d&apos;exercice
        </label>
        <div className="grid grid-cols-4 gap-3">
          {(["1", "2", "3"] as DeclensionNumber[]).map((decl, idx) => {
            const info = DECLENSION_INFO[decl]
            const isSelected = selectedSubType === decl
            // Colors: 1st=white, 2nd=grey, 3rd=dark
            const colorClass = idx === 0 
              ? (isSelected ? "rainbow-glow-selected" : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600")
              : idx === 1
                ? (isSelected ? "rainbow-glow-selected-grey" : "bg-[#c8c8c8] text-gray-700 border-2 border-gray-300 hover:border-gray-400")
                : (isSelected ? "rainbow-glow-selected-dark" : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600")
            
            return (
              <button
                key={decl}
                type="button"
                onClick={() => {
                  setSelectedSubType(decl)
                  setSelectedNumber(null)
                  setSelectedPrepositionCase(null)
                }}
                className={`rounded-2xl p-4 text-left transition-all duration-300 ${
                  isSelected ? "scale-[1.02]" : ""
                } ${colorClass}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`indicator-dot ${
                      isSelected ? "rainbow-dot" : 
                      idx === 2 ? "bg-gray-700 border border-gray-500" : "bg-gray-200 border border-gray-300"
                    }`} />
                    <span className={`font-bold text-base ${
                      isSelected ? (idx === 2 ? "text-white" : "text-black") : 
                      idx === 2 ? "text-white" : "text-gray-700"
                    }`}>
                      {decl}ère
                    </span>
                  </div>
                  <p className={`text-[10px] ${
                    isSelected ? (idx === 2 ? "text-gray-300" : "text-gray-600") : 
                    idx === 2 ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {info.description}
                  </p>
                  <p className={`text-[10px] font-mono ${
                    isSelected ? (idx === 2 ? "text-gray-400" : "text-gray-500") : 
                    idx === 2 ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {info.theme}
                  </p>
                </div>
              </button>
            )
          })}
          {/* Prépositions option */}
          <button
            type="button"
            onClick={() => {
              setSelectedSubType("preposition")
              setSelectedNumber(null)
              setSelectedPrepositionCase(null)
            }}
            className={`rounded-2xl p-4 text-left transition-all duration-300 ${
              selectedSubType === "preposition" ? "scale-[1.02]" : ""
            } ${
              selectedSubType === "preposition"
                ? "rainbow-glow-selected"
                : "bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-foreground border-2 border-blue-300 dark:border-purple-700 hover:border-blue-400 dark:hover:border-purple-600"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`indicator-dot ${selectedSubType === "preposition" ? "rainbow-dot" : "bg-blue-200 border border-blue-300 dark:bg-purple-700 dark:border-purple-600"}`} />
                <span className={`font-bold text-base ${selectedSubType === "preposition" ? "text-black" : ""}`}>
                  Prép.
                </span>
              </div>
              <p className={`text-[10px] ${selectedSubType === "preposition" ? "text-gray-600" : "text-gray-500 dark:text-gray-400"}`}>
                {PREPOSITION_INFO.description}
              </p>
              <p className={`text-[10px] font-mono ${selectedSubType === "preposition" ? "text-gray-500" : "text-gray-400 dark:text-gray-500"}`}>
                {PREPOSITION_INFO.theme}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Select Number (Singular/Plural) for declensions, or Case for prepositions */}
      {selectedSubType && !isPreposition && (
        <div className="space-y-5 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">
            2. Choisissez le nombre
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
      )}

      {/* Step 2 for Prepositions: Select Case type */}
      {isPreposition && (
        <div className="space-y-5 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">
            2. Choisissez le type de prépositions
          </label>
          <div className="grid grid-cols-3 gap-4">
            {/* Accusatif - White */}
            <button
              type="button"
              onClick={() => setSelectedPrepositionCase("accusative")}
              className={`rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPrepositionCase === "accusative"
                  ? "scale-[1.02] rainbow-glow-selected"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPrepositionCase === "accusative" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                  <span className={`font-bold text-base ${selectedPrepositionCase === "accusative" ? "text-black" : ""}`}>
                    Accusatif
                  </span>
                </div>
                <p className={`text-xs ${selectedPrepositionCase === "accusative" ? "text-gray-600" : "text-muted-foreground"}`}>
                  Mouvement, direction
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "accusative" ? "bg-gray-100 text-gray-600" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>ad</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "accusative" ? "bg-gray-100 text-gray-600" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>per</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "accusative" ? "bg-gray-100 text-gray-600" : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}>post</span>
                </div>
              </div>
            </button>

            {/* Ablatif - Grey */}
            <button
              type="button"
              onClick={() => setSelectedPrepositionCase("ablative")}
              className={`rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPrepositionCase === "ablative"
                  ? "scale-[1.02] rainbow-glow-selected-grey"
                  : "bg-[#c8c8c8] text-gray-700 border-2 border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPrepositionCase === "ablative" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                  <span className={`font-bold text-base ${selectedPrepositionCase === "ablative" ? "text-gray-800" : "text-gray-700"}`}>
                    Ablatif
                  </span>
                </div>
                <p className={`text-xs ${selectedPrepositionCase === "ablative" ? "text-gray-600" : "text-gray-500"}`}>
                  Lieu, accompagnement
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "ablative" ? "bg-gray-300 text-gray-700" : "bg-white/50 text-gray-500"}`}>ab</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "ablative" ? "bg-gray-300 text-gray-700" : "bg-white/50 text-gray-500"}`}>cum</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${selectedPrepositionCase === "ablative" ? "bg-gray-300 text-gray-700" : "bg-white/50 text-gray-500"}`}>de</span>
                </div>
              </div>
            </button>

            {/* Both - Black */}
            <button
              type="button"
              onClick={() => setSelectedPrepositionCase("both")}
              className={`rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPrepositionCase === "both"
                  ? "scale-[1.02] rainbow-glow-selected-dark"
                  : "bg-gray-900/90 text-gray-300 border-2 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`indicator-dot ${selectedPrepositionCase === "both" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                  <span className="font-bold text-base text-white">
                    Mixte
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Acc. & Abl. mélangés
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">in</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">sub</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-300">+</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Cases Preview for declensions */}
      {selectedSubType && !isPreposition && selectedNumber && (
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
              Object.values(DECLENSION_INFO[selectedSubType as DeclensionNumber].endings[selectedNumber]).join(", ")
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
          disabled={isPreposition ? !selectedPrepositionCase : (!selectedSubType || !selectedNumber)}
          className={`disabled:cursor-not-allowed ${
            (isPreposition ? !selectedPrepositionCase : (!selectedSubType || !selectedNumber))
              ? "pill-button-disabled" 
              : isPreposition
                ? (selectedPrepositionCase === "both" ? "pill-button-rainbow-dark" : selectedPrepositionCase === "ablative" ? "pill-button-rainbow-grey" : "pill-button-rainbow-light")
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

