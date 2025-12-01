"use client"

import type React from "react"

import { useState } from "react"

type NameEntryProps = {
  onSubmit: (name: string) => void
}

export function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError("Veuillez entrer votre nom (au moins 2 caractères)")
      return
    }
    onSubmit(name.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Quel est votre nom ?
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError("")
          }}
          placeholder="Entrez votre nom"
          className="pill-input-rainbow w-full text-base"
          autoFocus
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
      <div className="flex justify-center pt-4">
        <button type="submit" className="pill-glow">
          Continuer
        </button>
      </div>
    </form>
  )
}
