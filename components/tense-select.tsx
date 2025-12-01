"use client"

import type React from "react"

import { useState } from "react"

type TenseSelectProps = {
  studentName: string
  onSubmit: (tense: "present" | "imperfect") => void
}

export function TenseSelect({ studentName, onSubmit }: TenseSelectProps) {
  const [selectedTense, setSelectedTense] = useState<"present" | "imperfect">("present")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(selectedTense)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-lg text-foreground">
        Excellent, <span className="font-semibold">{studentName}</span> !
      </p>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Quel temps souhaitez-vous pratiquer ?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedTense("present")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedTense === "present"
                ? "bg-white text-black shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:shadow-[0_4px_20px_rgba(255,255,255,0.2)] scale-[1.02]"
                : "bg-background/50 text-muted-foreground border border-border/60 hover:bg-background/80 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            }`}
          >
            <div className="space-y-2">
              <div className={`font-semibold text-base ${selectedTense === "present" ? "text-black" : "text-foreground"}`}>
                Présent
              </div>
              <div className={`text-xs leading-relaxed ${selectedTense === "present" ? "text-black/70" : "text-muted-foreground"}`}>
                Actions actuelles ou habituelles
              </div>
              <div className={`text-[11px] font-mono ${selectedTense === "present" ? "text-black/60" : "text-muted-foreground/70"}`}>
                amo, amas, amat...
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTense("imperfect")}
            className={`rounded-2xl p-5 text-left transition-all duration-300 ${
              selectedTense === "imperfect"
                ? "bg-white text-black shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:shadow-[0_4px_20px_rgba(255,255,255,0.2)] scale-[1.02]"
                : "bg-background/50 text-muted-foreground border border-border/60 hover:bg-background/80 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            }`}
          >
            <div className="space-y-2">
              <div className={`font-semibold text-base ${selectedTense === "imperfect" ? "text-black" : "text-foreground"}`}>
                Imparfait
              </div>
              <div className={`text-xs leading-relaxed ${selectedTense === "imperfect" ? "text-black/70" : "text-muted-foreground"}`}>
                Actions passées continues
              </div>
              <div className={`text-[11px] font-mono ${selectedTense === "imperfect" ? "text-black/60" : "text-muted-foreground/70"}`}>
                amabam, amabas, amabat...
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button type="submit" className="pill-glow">
          Continuer
        </button>
      </div>
    </form>
  )
}

