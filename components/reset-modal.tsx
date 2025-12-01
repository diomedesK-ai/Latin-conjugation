"use client"

import { useState } from "react"

type ResetModalProps = {
  onClose: () => void
  onConfirm: () => void
}

export function ResetModal({ onClose, onConfirm }: ResetModalProps) {
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState("")
  const PARENT_PASSCODE = "1234" // Simple passcode for parents

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === PARENT_PASSCODE) {
      onConfirm()
      onClose()
    } else {
      setError("Code incorrect")
      setPasscode("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Réinitialiser</h2>
          <p className="text-sm text-muted-foreground">Code parent requis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value)
                setError("")
              }}
              placeholder="Entrez le code (1234)"
              className="pill-input w-full text-center text-lg tracking-widest"
              autoFocus
              maxLength={4}
            />
            {error && <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>}
          </div>

          <div className="space-y-2">
            <button type="submit" className="pill-glow w-full">
              Confirmer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl px-6 py-3 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


