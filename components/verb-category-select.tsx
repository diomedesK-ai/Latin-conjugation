"use client"

import { useState } from "react"

type VerbCategorySelectProps = {
  studentName: string
  onSubmit: (categories: string[]) => void
}

const categories = [
  { id: "1", label: "Première conjugaison", description: "verbes en -are (amo, amas, amare)" },
  { id: "2", label: "Deuxième conjugaison", description: "verbes en -ēre (video, vides, videre)" },
  { id: "3", label: "Troisième conjugaison", description: "verbes en -ere (duco, ducis, ducere)" },
  { id: "3-io", label: "Troisième mixte", description: "verbes en -io (capio, capis, capere)" },
  { id: "4", label: "Quatrième conjugaison", description: "verbes en -ire (audio, audis, audire)" },
  { id: "compound", label: "Composés de verbe être", description: "possum, absum, adsum..." },
  { id: "irregular", label: "Verbes irréguliers", description: "esse, ire, ferre, velle..." },
]

export function VerbCategorySelect({ studentName, onSubmit }: VerbCategorySelectProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(categories.map((c) => c.id)))

  const toggleCategory = (id: string) => {
    const newSelected = new Set(selected)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelected(newSelected)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selected.size === 0) {
      alert("Veuillez sélectionner au moins une catégorie")
      return
    }
    onSubmit(Array.from(selected))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-lg text-foreground">
          Bonjour, <span className="font-semibold">{studentName}</span> !
        </p>
        <p className="text-sm text-muted-foreground">Sélectionne les types de verbes à pratiquer</p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => toggleCategory(category.id)}
            className={`w-full rounded-full px-6 py-4 text-left transition-all duration-300 ${
              selected.has(category.id)
                ? "bg-white text-black shadow-[0_3px_15px_rgba(0,0,0,0.15)] dark:bg-white dark:text-black dark:shadow-[0_3px_15px_rgba(255,255,255,0.2)] scale-[1.01]"
                : "bg-background/50 text-muted-foreground border border-border/60 hover:bg-background/80 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className={`text-sm font-medium ${selected.has(category.id) ? "text-black" : "text-muted-foreground/50"}`}>
                  {category.label}
                </p>
                <p className={`mt-1 text-xs ${selected.has(category.id) ? "text-black/70" : "text-muted-foreground/50"}`}>
                  {category.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`h-6 w-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    selected.has(category.id)
                      ? "border-black bg-black"
                      : "border-muted-foreground/30 bg-transparent"
                  }`}
                >
                  {selected.has(category.id) && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button type="submit" className="pill-glow">
          Continuer
        </button>
      </div>
    </form>
  )
}

