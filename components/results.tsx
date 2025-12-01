"use client"

import { useEffect, useState } from "react"
import type { ExerciseResult, SessionHistory } from "@/app/page"

type ResultsProps = {
  studentName: string
  results: ExerciseResult[]
  timeInSeconds: number
  history: SessionHistory[]
  onRestart: () => void
}

function Confetti() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([])

  useEffect(() => {
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2.5 h-2.5 animate-confetti"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function LeaderboardRow({ rank, session, isCurrent }: { rank: number; session: SessionHistory; isCurrent?: boolean }) {
  const percentage = Math.round((session.correct / session.total) * 100)
  const date = new Date(session.date)
  const formattedDate = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  const formattedTime = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })

  return (
    <div
      className={`group flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all ${
        isCurrent
          ? "border-foreground/20 bg-foreground/5 shadow-sm"
          : "border-border/50 bg-card/50 hover:border-foreground/10"
      }`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium text-foreground">
        {rank}
      </div>
      <div className="flex-1 space-y-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">
            {session.correct}/{session.total}
          </span>
          <span className="text-xs text-muted-foreground">({percentage}%)</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {formattedDate} à {formattedTime}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-foreground">{formatTime(session.timeInSeconds)}</div>
        <div className="text-xs text-muted-foreground">{Math.round(session.timeInSeconds / session.total)}s/verbe</div>
      </div>
    </div>
  )
}

export function Results({ studentName, results, timeInSeconds, history, onRestart }: ResultsProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [congratsMessage, setCongratsMessage] = useState<string | null>(null)
  const [isLoadingMessage, setIsLoadingMessage] = useState(true)
  const correctCount = results.filter((r) => r.isCorrect).length
  const percentage = Math.round((correctCount / results.length) * 100)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    async function generateCongrats() {
      try {
        const response = await fetch("/api/congratulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName,
            correct: correctCount,
            total: results.length,
            timeInSeconds,
            percentage,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setCongratsMessage(data.message)
        } else {
          throw new Error("Failed to generate message")
        }
      } catch {
        const fallbackMessage =
          percentage >= 90
            ? `Félicitations ${studentName} ! Tu as une excellente maîtrise des conjugaisons latines. Continue comme ça !`
            : percentage >= 60
              ? `Bravo ${studentName} ! Tu fais de beaux progrès. Continue de pratiquer régulièrement.`
              : `Bon travail ${studentName} ! Chaque exercice te rapproche de la maîtrise. La persévérance est la clé !`
        setCongratsMessage(fallbackMessage)
      } finally {
        setIsLoadingMessage(false)
      }
    }

    generateCongrats()
  }, [studentName, correctCount, results.length, timeInSeconds, percentage])

  const sortedHistory = [...history].sort((a, b) => {
    const scoreA = a.correct / a.total
    const scoreB = b.correct / b.total
    if (scoreB !== scoreA) return scoreB - scoreA
    return a.timeInSeconds - b.timeInSeconds
  })

  const currentSessionRank = sortedHistory.findIndex(
    (s) => s.date === history[history.length - 1].date && s.correct === correctCount && s.total === results.length,
  )

  return (
    <div className="space-y-8">
      {showConfetti && percentage >= 60 && <Confetti />}

      {/* Badge-style congratulations */}
      <div className="relative mx-auto max-w-2xl">
        <div className="result-badge">
          <div className="space-y-4 text-center">
            {/* Student name with checkmark for 100% */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bravo</p>
              <div className="flex items-center justify-center gap-3">
                <h2 className="text-4xl font-bold text-foreground">{studentName}</h2>
                {percentage === 100 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-500">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Score and time - elegant and minimal */}
            <div className="space-y-2">
              <div className="text-6xl font-light text-foreground tracking-tight score-glow">
                {percentage}%
              </div>
              <p className="text-sm text-muted-foreground">
                {correctCount}/{results.length} · {formatTime(timeInSeconds)}
              </p>
            </div>

            {/* Category badges */}
            {results.some(r => r.category) && (
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {Array.from(new Set(results.map(r => r.category).filter(Boolean))).map((category) => {
                  const categoryLabels: Record<string, string> = {
                    "1": "1ère conj.",
                    "2": "2ème conj.",
                    "3": "3ème conj.",
                    "3-io": "3ème mixte",
                    "4": "4ème conj.",
                    "compound": "Composés",
                    "irregular": "Irréguliers"
                  }
                  return (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-full bg-black text-white px-3 py-1 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
                    >
                      {categoryLabels[category || ""] || category}
                    </span>
                  )
                })}
              </div>
            )}

            {/* AI-generated congratulations message */}
            {isLoadingMessage ? (
              <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            ) : (
              <div className="pt-4">
                <p className="text-base text-foreground/90 leading-relaxed max-w-xl mx-auto">
                  {congratsMessage?.split(/(\d+\s*%)|(\b[A-ZÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ][a-zàâäéèêëïîôùûüÿç]+\b)/g).map((part, index) => {
                    if (!part) return null
                    // Check if it's a percentage
                    if (/\d+\s*%/.test(part)) {
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-sm font-semibold text-green-600 dark:bg-green-500/20 dark:text-green-400 mx-1"
                        >
                          {part}
                        </span>
                      )
                    }
                    // Check if it's the student name
                    if (part === studentName) {
                      return (
                        <span 
                          key={index} 
                          className="inline-flex items-center rounded-full bg-foreground/10 px-2.5 py-0.5 text-sm font-semibold text-foreground mx-1"
                        >
                          {part}
                        </span>
                      )
                    }
                    return <span key={index}>{part}</span>
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/50 bg-card/50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-foreground">{formatTime(timeInSeconds)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Temps total</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-foreground">{Math.round(timeInSeconds / results.length)}s</p>
          <p className="mt-1 text-xs text-muted-foreground">Moyenne/verbe</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/50 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-foreground">#{currentSessionRank + 1}</p>
          <p className="mt-1 text-xs text-muted-foreground">Classement</p>
        </div>
      </div>

      {history.length > 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Tableau des performances</h3>
            <span className="inline-flex items-center rounded-full bg-black text-white px-2.5 py-0.5 text-xs font-medium shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:bg-white dark:text-black dark:shadow-[0_2px_10px_rgba(255,255,255,0.3)]">
              {history.length} sessions
            </span>
          </div>
          <div className="space-y-2">
            {sortedHistory.slice(0, 5).map((session, index) => (
              <LeaderboardRow
                key={session.date}
                rank={index + 1}
                session={session}
                isCurrent={session.date === history[history.length - 1].date}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Révision détaillée</p>
        {results.map((result, index) => (
          <div key={index} className="rounded-2xl border border-border/50 bg-card/50 p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{result.principalParts}</p>
                {result.category && (
                  <span className="text-xs text-muted-foreground">
                    ({(() => {
                      const labels: Record<string, string> = {
                        "1": "1ère", "2": "2ème", "3": "3ème", "3-io": "3ème mixte",
                        "4": "4ème", "compound": "composé", "irregular": "irr."
                      }
                      return labels[result.category] || result.category
                    })()})
                  </span>
                )}
              </div>
              {result.isCorrect ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                  aria-label="Correct"
                >
                  <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2" />
                  <path d="M8 12l3 3 5-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                  aria-label="Incorrect"
                >
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                </svg>
              )}
            </div>
            <p className="mb-1 text-sm text-muted-foreground">Votre réponse : {result.userAnswer}</p>
            {!result.isCorrect && (
              <p className="mb-2 text-sm text-muted-foreground">Bonne réponse : {result.correctAnswer}</p>
            )}
            <p className="mt-3 text-sm text-foreground leading-relaxed">{result.feedback}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button onClick={onRestart} className="pill-glow">
          Nouvelle session
        </button>
      </div>
    </div>
  )
}
