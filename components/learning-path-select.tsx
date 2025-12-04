"use client"

import type React from "react"
import { useState } from "react"
import type { TenseSystem } from "@/lib/latin-verbs"
import type { TranslationDirection } from "@/components/translation-select"

export type LearningPath = "conjugaison" | "declinaison" | "traduction"

export type DeclensionSubOption = "1" | "2" | "3" | "preposition"

type LearningPathSelectProps = {
  studentName: string
  onConjugaisonSubmit: (tenseSystem: TenseSystem) => void
  onDeclinaisonSubmit: (declension: DeclensionSubOption) => void
  onPrepositionSubmit: () => void
  onTraductionSubmit: (direction: TranslationDirection) => void
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
    description: "Noms & Adjectifs",
    details: "1ère, 2ème, 3ème",
    subdetails: "6 cas • Singulier/Pluriel",
    examples: ["rosa, rosae...", "dominus, domini..."],
  },
  traduction: {
    label: "Traduction",
    description: "Thème et Version",
    details: "FR ↔ LA",
    subdetails: "Vocabulaire & prépositions",
    examples: ["aqua → eau", "ad + acc", "ab + abl"],
  }
}

// Professional minimal icons - circles with line icons, no fill
const ConjugaisonIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-black" : "border-gray-400 dark:border-gray-500"
  }`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-black" : "text-gray-500 dark:text-gray-400"}>
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="m7 7 10 10" />
      <path d="m17 7-10 10" />
    </svg>
  </div>
)

const DeclinaisonIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-gray-700" : "border-gray-400"
  }`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-gray-700" : "text-gray-500"}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <path d="M8 3v3" />
      <path d="M16 18v3" />
    </svg>
  </div>
)

const TraductionIcon = ({ selected }: { selected: boolean }) => (
  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
    selected ? "border-white" : "border-gray-500"
  }`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selected ? "text-white" : "text-gray-400"}>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  </div>
)

export function LearningPathSelect({ studentName, onConjugaisonSubmit, onDeclinaisonSubmit, onPrepositionSubmit, onTraductionSubmit, onBack }: LearningPathSelectProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null)
  
  // Sub-options
  const [selectedTenseSystem, setSelectedTenseSystem] = useState<TenseSystem | null>(null)
  const [selectedDeclension, setSelectedDeclension] = useState<DeclensionSubOption | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<TranslationDirection | null>(null)

  const handlePathClick = (path: LearningPath) => {
    if (selectedPath === path) {
      // Toggle off
      setSelectedPath(null)
      setSelectedTenseSystem(null)
      setSelectedDeclension(null)
      setSelectedDirection(null)
    } else {
      setSelectedPath(path)
      // Reset sub-options when changing path
      setSelectedTenseSystem(null)
      setSelectedDeclension(null)
      setSelectedDirection(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPath === "conjugaison" && selectedTenseSystem) {
      onConjugaisonSubmit(selectedTenseSystem)
    } else if (selectedPath === "declinaison" && selectedDeclension) {
      if (selectedDeclension === "preposition") {
        onPrepositionSubmit()
      } else {
        onDeclinaisonSubmit(selectedDeclension)
      }
    } else if (selectedPath === "traduction" && selectedDirection) {
      onTraductionSubmit(selectedDirection)
    }
  }

  const canSubmit = 
    (selectedPath === "conjugaison" && selectedTenseSystem) ||
    (selectedPath === "declinaison" && selectedDeclension) ||
    (selectedPath === "traduction" && selectedDirection)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <p className="text-lg text-foreground">
        Excellent, <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-black text-white text-base font-medium dark:bg-white dark:text-black">{studentName}</span> !
      </p>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          Choisissez votre exercice
        </label>
        
        {/* Side by side - 3 columns */}
        <div className="grid grid-cols-3 gap-6">
          {/* Conjugaison - WHITE when selected */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handlePathClick("conjugaison")}
              className={`w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPath === "conjugaison"
                  ? "scale-[1.02] rainbow-glow-selected"
                  : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-foreground border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <ConjugaisonIcon selected={selectedPath === "conjugaison"} />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`indicator-dot ${selectedPath === "conjugaison" ? "rainbow-dot" : "bg-gray-300 dark:bg-gray-600 border border-gray-400 dark:border-gray-500"}`} />
                    <span className={`font-bold text-base ${selectedPath === "conjugaison" ? "text-black" : ""}`}>
                      {PATH_INFO.conjugaison.label}
                    </span>
                  </div>
                  <p className={`text-xs ${selectedPath === "conjugaison" ? "text-gray-700" : "text-muted-foreground"}`}>
                    {PATH_INFO.conjugaison.description}
                  </p>
                </div>
              </div>
            </button>

            {/* Sub-options for Conjugaison */}
            {selectedPath === "conjugaison" && (
              <div className="space-y-2 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setSelectedTenseSystem("infectum")}
                  className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedTenseSystem === "infectum"
                      ? "rainbow-glow-selected scale-[1.01]"
                      : "bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedTenseSystem === "infectum" ? "rainbow-dot" : "bg-gray-300"}`} />
                    <span className={`font-medium text-sm ${selectedTenseSystem === "infectum" ? "text-black" : "text-foreground"}`}>Infectum</span>
                  </div>
                  <p className={`text-[10px] mt-1 ml-4 ${selectedTenseSystem === "infectum" ? "text-gray-600" : "text-muted-foreground"}`}>Présent, Imparfait, Futur</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTenseSystem("perfectum")}
                  className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedTenseSystem === "perfectum"
                      ? "rainbow-glow-selected-dark scale-[1.01]"
                      : "bg-gray-900/90 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedTenseSystem === "perfectum" ? "rainbow-dot" : "bg-gray-600"}`} />
                    <span className="font-medium text-sm text-white">Perfectum</span>
                  </div>
                  <p className="text-[10px] mt-1 ml-4 text-gray-400">Parfait, Plus-que-parfait, Futur ant.</p>
                </button>
              </div>
            )}
          </div>

          {/* Déclinaison - GREY when selected */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handlePathClick("declinaison")}
              className={`w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPath === "declinaison"
                  ? "scale-[1.02] rainbow-glow-selected-grey"
                  : "bg-[#c8c8c8] dark:bg-gray-300 text-gray-700 border-2 border-gray-300 dark:border-gray-400 hover:border-gray-400"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <DeclinaisonIcon selected={selectedPath === "declinaison"} />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`indicator-dot ${selectedPath === "declinaison" ? "rainbow-dot" : "bg-gray-200 border border-gray-300"}`} />
                    <span className={`font-bold text-base ${selectedPath === "declinaison" ? "text-gray-800" : "text-gray-700"}`}>
                      {PATH_INFO.declinaison.label}
                    </span>
                  </div>
                  <p className={`text-xs ${selectedPath === "declinaison" ? "text-gray-700" : "text-gray-500"}`}>
                    {PATH_INFO.declinaison.description}
                  </p>
                </div>
              </div>
            </button>

            {/* Sub-options for Déclinaison */}
            {selectedPath === "declinaison" && (
              <div className="space-y-2 animate-fade-in">
                {(["1", "2", "3"] as DeclensionSubOption[]).map((decl, idx) => (
                  <button
                    key={decl}
                    type="button"
                    onClick={() => setSelectedDeclension(decl)}
                    className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                      selectedDeclension === decl
                        ? idx === 0 ? "rainbow-glow-selected scale-[1.01]" 
                          : idx === 1 ? "rainbow-glow-selected-grey scale-[1.01]"
                          : "rainbow-glow-selected-dark scale-[1.01]"
                        : idx === 0 ? "bg-white/80 border border-gray-200 hover:border-gray-300"
                          : idx === 1 ? "bg-[#d4d4d4] border border-gray-300 hover:border-gray-400"
                          : "bg-gray-800 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedDeclension === decl ? "rainbow-dot" 
                        : idx === 2 ? "bg-gray-600" : "bg-gray-300"
                      }`} />
                      <span className={`font-medium text-sm ${
                        selectedDeclension === decl 
                          ? idx === 2 ? "text-white" : "text-black"
                          : idx === 2 ? "text-gray-300" : "text-gray-700"
                      }`}>{decl}ère déclinaison</span>
                    </div>
                    <p className={`text-[10px] mt-1 ml-4 ${
                      idx === 2 ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {decl === "1" ? "rosa, rosae (fém.)" : decl === "2" ? "dominus, domini (masc.)" : "rex, regis (cons.)"}
                    </p>
                  </button>
                ))}
                
                {/* Prépositions option */}
                <button
                  type="button"
                  onClick={() => setSelectedDeclension("preposition")}
                  className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedDeclension === "preposition"
                      ? "rainbow-glow-selected-blue scale-[1.01]"
                      : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedDeclension === "preposition" ? "rainbow-dot" : "bg-blue-300"
                    }`} />
                    <span className={`font-medium text-sm ${
                      selectedDeclension === "preposition" ? "text-blue-900 dark:text-blue-100" : "text-blue-700 dark:text-blue-300"
                    }`}>Prépositions</span>
                  </div>
                  <p className={`text-[10px] mt-1 ml-4 ${
                    selectedDeclension === "preposition" ? "text-blue-700 dark:text-blue-300" : "text-blue-600 dark:text-blue-400"
                  }`}>
                    Régimes grammaticaux
                  </p>
                </button>
              </div>
            )}
          </div>

          {/* Traduction - BLACK when selected */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handlePathClick("traduction")}
              className={`w-full rounded-2xl p-5 text-left transition-all duration-300 ${
                selectedPath === "traduction"
                  ? "scale-[1.02] rainbow-glow-selected-dark"
                  : "bg-gray-900/90 dark:bg-gray-950 text-gray-300 border-2 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <TraductionIcon selected={selectedPath === "traduction"} />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`indicator-dot ${selectedPath === "traduction" ? "rainbow-dot" : "bg-gray-700 border border-gray-500"}`} />
                    <span className="font-bold text-base text-white">
                      {PATH_INFO.traduction.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {PATH_INFO.traduction.description}
                  </p>
                </div>
              </div>
            </button>

            {/* Sub-options for Traduction */}
            {selectedPath === "traduction" && (
              <div className="space-y-2 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setSelectedDirection("fr-la")}
                  className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedDirection === "fr-la"
                      ? "rainbow-glow-selected scale-[1.01]"
                      : "bg-white/90 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedDirection === "fr-la" ? "rainbow-dot" : "bg-gray-300"}`} />
                    <span className={`font-medium text-sm ${selectedDirection === "fr-la" ? "text-black" : "text-gray-700"}`}>Thème (FR → LA)</span>
                  </div>
                  <p className={`text-[10px] mt-1 ml-4 ${selectedDirection === "fr-la" ? "text-gray-600" : "text-gray-500"}`}>Traduire du français vers le latin</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDirection("la-fr")}
                  className={`w-full rounded-xl p-3 text-left transition-all duration-200 ${
                    selectedDirection === "la-fr"
                      ? "rainbow-glow-selected-dark scale-[1.01]"
                      : "bg-gray-900/90 border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedDirection === "la-fr" ? "rainbow-dot" : "bg-gray-600"}`} />
                    <span className="font-medium text-sm text-white">Version (LA → FR)</span>
                  </div>
                  <p className="text-[10px] mt-1 ml-4 text-gray-400">Traduire du latin vers le français</p>
                </button>
              </div>
            )}
          </div>
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
          disabled={!canSubmit}
          className={`disabled:cursor-not-allowed ${
            !canSubmit
              ? "pill-button-disabled" 
              : selectedPath === "traduction"
                ? selectedDirection === "la-fr" ? "pill-button-rainbow-dark" : "pill-button-rainbow-light"
                : selectedPath === "declinaison"
                  ? selectedDeclension === "preposition" ? "pill-button-rainbow-blue"
                    : selectedDeclension === "3" ? "pill-button-rainbow-dark" 
                    : selectedDeclension === "2" ? "pill-button-rainbow-grey" 
                    : "pill-button-rainbow-light"
                  : selectedTenseSystem === "perfectum" ? "pill-button-rainbow-dark" : "pill-button-rainbow-light"
          }`}
        >
          Continuer
        </button>
      </div>
    </form>
  )
}
