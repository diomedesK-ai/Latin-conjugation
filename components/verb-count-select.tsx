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
    if (isNaN(numCount) || numCount < 10) {
      setError("Minimum : 10 verbes")
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

      <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium text-foreground">Exemple :</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">moneo, mones, monere</span> (avertir, conseiller)
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Réponse attendue :{" "}
          <span className="font-medium text-foreground">moneo, mones, monet, monemus, monetis, monent</span>
        </p>
      </div>

      <div className="space-y-3">
        <label htmlFor="count" className="block text-sm font-medium text-foreground">
          Combien de verbes souhaitez-vous pratiquer ?
        </label>
        <input
          id="count"
          type="number"
          min={10}
          max={50}
          value={count}
          onChange={(e) => {
            setCount(e.target.value)
            setError("")
          }}
          className="pill-input w-full text-base"
          autoFocus
        />
        <p className="text-sm text-muted-foreground">Minimum : 10, Maximum : 50</p>
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Mode de vérification</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("per-step")}
            className={`rounded-2xl border px-4 py-4 text-sm transition-all duration-200 ${
              mode === "per-step"
                ? "border-foreground/30 bg-foreground/5 font-medium text-foreground shadow-md"
                : "border-border/50 bg-transparent text-muted-foreground hover:border-foreground/20 hover:bg-foreground/[0.02]"
            }`}
          >
            <div className="text-left">
              <div className="font-medium">Par étape</div>
              <div className="mt-1 text-xs opacity-70 leading-relaxed">Feedback immédiat après chaque verbe</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode("at-end")}
            className={`rounded-2xl border px-4 py-4 text-sm transition-all duration-200 ${
              mode === "at-end"
                ? "border-foreground/30 bg-foreground/5 font-medium text-foreground shadow-md"
                : "border-border/50 bg-transparent text-muted-foreground hover:border-foreground/20 hover:bg-foreground/[0.02]"
            }`}
          >
            <div className="text-left">
              <div className="font-medium">À la fin</div>
              <div className="mt-1 text-xs opacity-70 leading-relaxed">Résultats complets en une seule fois</div>
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
