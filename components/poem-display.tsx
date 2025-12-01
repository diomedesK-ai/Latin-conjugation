"use client"

import { useEffect, useState } from "react"

type PoemDisplayProps = {
  studentName: string
  onComplete: () => void
}

export function PoemDisplay({ studentName, onComplete }: PoemDisplayProps) {
  const [streamedText, setStreamedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const response = await fetch("/api/generate-poem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentName }),
        })

        if (!response.ok || !response.body) {
          throw new Error("Failed to generate poem")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            setIsComplete(true)
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          setStreamedText((prev) => prev + chunk)
        }
      } catch (err) {
        console.error("Poem generation error:", err)
        // Fallback
        const fallback = `[FR] Bienvenue ${studentName}, dans ce voyage enchanté\n[LA] Salve in hoc itinere magnifico\n[FR] Le latin t'ouvre ses portes dorées\n[LA] Lingua Latina portas tibi aperit`
        
        // Simulate streaming for fallback
        for (let i = 0; i < fallback.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 30))
          setStreamedText(fallback.slice(0, i + 1))
        }
        setIsComplete(true)
      }
    }

    fetchPoem()
  }, [studentName])

  const renderPoem = () => {
    if (!isComplete) return null // Only show when complete to avoid fragments
    
    // Clean up the text and extract only complete, valid lines
    const cleanText = streamedText
      .replace(/\[FR\]/gi, "\n[FR]")
      .replace(/\[LA\]/gi, "\n[LA]")
      .replace(/\n+/g, "\n") // Remove duplicate newlines
    
    const lines = cleanText.split("\n").filter((line) => line.trim())
    
    const frenchLines: string[] = []
    const latinLines: string[] = []
    const seenContent = new Set<string>()
    
    lines.forEach((line) => {
      // Match [FR] or [LA] at the start, capture everything after
      const frMatch = line.match(/^\[FR\]\s*(.+)$/i)
      const laMatch = line.match(/^\[LA\]\s*(.+)$/i)

      if (frMatch) {
        let text = frMatch[1]
          .trim()
          .replace(/\[.*?\]/g, '') // Remove any bracket tags
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim()
        
        // Only show lines with at least 15 characters and not seen before
        if (text.length >= 15 && !seenContent.has(text.toLowerCase())) {
          seenContent.add(text.toLowerCase())
          frenchLines.push(text)
        }
      } else if (laMatch) {
        let text = laMatch[1]
          .trim()
          .replace(/\[.*?\]/g, '') // Remove any bracket tags
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim()
        
        // Only show lines with at least 15 characters and not seen before
        if (text.length >= 15 && !seenContent.has(text.toLowerCase())) {
          seenContent.add(text.toLowerCase())
          latinLines.push(text)
        }
      }
    })
    
    // Limit to 2 French and 2 Latin lines
    return (
      <>
        {frenchLines.slice(0, 2).map((line, index) => (
          <p key={`fr-${index}`} className="poem-line poem-french">
            {line}
          </p>
        ))}
        {latinLines.slice(0, 2).map((line, index) => (
          <p key={`la-${index}`} className="poem-line poem-latin">
            {line}
          </p>
        ))}
      </>
    )
  }

  return (
    <div className="poem-wrapper">
      <div className="poem-container">
        {renderPoem()}
        {!isComplete && <span className="poem-cursor">|</span>}
      </div>

      {isComplete && (
        <div className="mt-12 flex justify-center animate-fade-in">
          <button onClick={onComplete} className="pill-glow">
            Commencer l'aventure
          </button>
        </div>
      )}
    </div>
  )
}
