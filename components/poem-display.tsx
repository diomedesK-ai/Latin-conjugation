"use client"

import { useEffect, useState } from "react"

type PoemDisplayProps = {
  studentName: string
  onComplete: () => void
  onBack?: () => void
}

export function PoemDisplay({ studentName, onComplete, onBack }: PoemDisplayProps) {
  const [poemText, setPoemText] = useState("")
  const [displayedChars, setDisplayedChars] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const response = await fetch("/api/generate-poem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentName }),
        })

        if (!response.ok) {
          throw new Error("Failed to generate poem")
        }

        const text = await response.text()
        setPoemText(text)
      } catch (err) {
        console.error("Poem generation error:", err)
        // Fallback poem
        setPoemText(`[FR] ${studentName}, ta curiosité ouvre les portes du savoir\n[FR] Chaque effort te rapproche des trésors de la connaissance\n[LA] ${studentName}, curiositas tua portas scientiae aperit\n[LA] Quodlibet studium te ad thesauros cognitionis propius ducit`)
      }
    }

    fetchPoem()
  }, [studentName])

  // Typewriter effect
  useEffect(() => {
    if (!poemText) return

    if (displayedChars < poemText.length) {
      const timer = setTimeout(() => {
        setDisplayedChars(prev => prev + 1)
      }, 25)
      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
    }
  }, [poemText, displayedChars])

  const parsePoem = () => {
    if (!poemText) return { frenchLines: [], latinLines: [] }
    
    const lines = poemText.split("\n").filter((line) => line.trim())
    
    const frenchLines: string[] = []
    const latinLines: string[] = []
    
    lines.forEach((line) => {
      const frMatch = line.match(/^\[FR\]\s*(.+)$/i)
      const laMatch = line.match(/^\[LA\]\s*(.+)$/i)

      if (frMatch) {
        const text = frMatch[1].trim()
        if (text.length > 10) frenchLines.push(text)
      } else if (laMatch) {
        const text = laMatch[1].trim()
        if (text.length > 10) latinLines.push(text)
      }
    })
    
    return { frenchLines: frenchLines.slice(0, 2), latinLines: latinLines.slice(0, 2) }
  }

  const renderPoem = () => {
    const { frenchLines, latinLines } = parsePoem()
    const displayText = poemText.slice(0, displayedChars)
    
    // Parse the currently displayed text to show typewriter effect
    const displayLines = displayText.split("\n").filter((line) => line.trim())
    
    const displayedFrench: string[] = []
    const displayedLatin: string[] = []
    
    displayLines.forEach((line) => {
      const frMatch = line.match(/^\[FR\]\s*(.*)$/i)
      const laMatch = line.match(/^\[LA\]\s*(.*)$/i)

      if (frMatch) {
        displayedFrench.push(frMatch[1])
      } else if (laMatch) {
        displayedLatin.push(laMatch[1])
      }
    })
    
    return (
      <>
        {frenchLines.map((line, index) => (
          <p key={`fr-${index}`} className="poem-line poem-french">
            {displayedFrench[index] || ""}
            {!isComplete && displayedFrench.length === index + 1 && displayedFrench[index]?.length < line.length && (
              <span className="poem-cursor">|</span>
            )}
          </p>
        ))}
        {latinLines.map((line, index) => (
          <p key={`la-${index}`} className="poem-line poem-latin">
            {displayedLatin[index] || ""}
            {!isComplete && displayedLatin.length === index + 1 && displayedLatin[index]?.length < line.length && (
              <span className="poem-cursor">|</span>
            )}
          </p>
        ))}
      </>
    )
  }

  return (
    <div className="poem-wrapper">
      <div className="poem-container">
        {poemText && renderPoem()}
        {!poemText && <span className="poem-cursor">|</span>}
      </div>

      {isComplete && (
        <div className="mt-12 flex justify-center gap-3 animate-fade-in">
          {onBack && (
            <button 
              onClick={onBack}
              className="rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            >
              Retour
            </button>
          )}
          <button onClick={onComplete} className="pill-glow">
            Commencer l'aventure
          </button>
        </div>
      )}
    </div>
  )
}
