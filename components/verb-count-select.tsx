"use client"

import type React from "react"

import { useState } from "react"

type VerbCountSelectProps = {
  studentName: string
  onSubmit: (count: number, mode: "per-step" | "at-end") => void
}

export function VerbCountSelect({ studentName, onSubmit }: VerbCountSelectProps) {
  const [count, setCount] = useState("10")
  const [mode, setMode] = useState<"per-step" | "at-end">("per-step")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numCount = Number.parseInt(count, 10)
    if (isNaN(numCount) || numCount < 1) {
      setError("Minimum : 1 verbe")
      return
    }
    if (numCount > 50) {
      setError("Maximum : 50 verbes")
      return
    }
    onSubmit(numCount, mode)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-lg text-foreground">
        Bienvenue, <span className="font-semibold">{studentName}</span> !
      </p>

      <div className="space-y-3">
        <label htmlFor="count" className="block text-sm font-medium text-foreground">
          Combien de verbes souhaitez-vous pratiquer ?
        </label>
        <input
          id="count"
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => {
            setCount(e.target.value)
            setError("")
          }}
          className="pill-input w-full text-base"
          autoFocus
        />
        <p className="text-sm text-muted-foreground">Minimum : 1, Maximum : 50</p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Mode de vérification</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("per-step")}
            className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${
              mode === "per-step"
                ? "bg-white text-black shadow-[0_3px_15px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:shadow-[0_3px_15px_rgba(255,255,255,0.2)] scale-[1.02]"
                : "bg-background/50 text-muted-foreground border border-border/60 hover:bg-background/80 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            }`}
          >
            <div className="text-left">
              <div className={`font-medium text-xs ${mode === "per-step" ? "text-black" : "text-muted-foreground/50"}`}>Par étape</div>
              <div className={`mt-0.5 text-[10px] leading-tight ${mode === "per-step" ? "text-black/70" : "text-muted-foreground/50"}`}>Feedback immédiat après chaque verbe</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode("at-end")}
            className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${
              mode === "at-end"
                ? "bg-white text-black shadow-[0_3px_15px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:shadow-[0_3px_15px_rgba(255,255,255,0.2)] scale-[1.02]"
                : "bg-background/50 text-muted-foreground border border-border/60 hover:bg-background/80 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            }`}
          >
            <div className="text-left">
              <div className={`font-medium text-xs ${mode === "at-end" ? "text-black" : "text-muted-foreground/50"}`}>À la fin</div>
              <div className={`mt-0.5 text-[10px] leading-tight ${mode === "at-end" ? "text-black/70" : "text-muted-foreground/50"}`}>Résultats complets en une seule fois</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button type="submit" className="pill-glow">
          Commencer
        </button>
      </div>
    </form>
  )
}
