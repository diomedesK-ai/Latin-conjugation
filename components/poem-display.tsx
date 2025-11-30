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
    // Clean up the text and extract only complete lines
    const cleanText = streamedText.replace(/\[FR\]/gi, "\n[FR]").replace(/\[LA\]/gi, "\n[LA]")
    const lines = cleanText.split("\n").filter((line) => line.trim())
    
    const seenLines = new Set<string>()
    const renderedLines: JSX.Element[] = []
    
    lines.forEach((line, index) => {
      const frMatch = line.match(/\[FR\]\s*(.+)/i)
      const laMatch = line.match(/\[LA\]\s*(.+)/i)

      if (frMatch) {
        const text = frMatch[1].trim()
        // Only show lines with at least 10 characters (to avoid partial fragments)
        if (text.length >= 10 && !seenLines.has(`fr:${text}`)) {
          seenLines.add(`fr:${text}`)
          renderedLines.push(
            <p key={`fr-${index}`} className="poem-line poem-french">
              {text}
            </p>
          )
        }
      } else if (laMatch) {
        const text = laMatch[1].trim()
        // Only show lines with at least 10 characters (to avoid partial fragments)
        if (text.length >= 10 && !seenLines.has(`la:${text}`)) {
          seenLines.add(`la:${text}`)
          renderedLines.push(
            <p key={`la-${index}`} className="poem-line poem-latin">
              {text}
            </p>
          )
        }
      }
    })
    
    return renderedLines
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
