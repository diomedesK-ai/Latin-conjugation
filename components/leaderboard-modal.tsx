"use client"

import type { SessionHistory } from "@/app/page"

type LeaderboardModalProps = {
  history: SessionHistory[]
  onClose: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

export function LeaderboardModal({ history, onClose }: LeaderboardModalProps) {
  const sortedHistory = [...history].sort((a, b) => {
    const scoreA = a.correct / a.total
    const scoreB = b.correct / b.total
    if (scoreB !== scoreA) return scoreB - scoreA
    return a.timeInSeconds - b.timeInSeconds
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 px-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-foreground">Classement</h2>
          <p className="text-sm text-muted-foreground">{history.length} sessions complétées</p>
        </div>

        <div className="max-h-[60vh] space-y-2 overflow-y-auto rounded-2xl">
          {sortedHistory.map((session, index) => {
            const percentage = Math.round((session.correct / session.total) * 100)
            const date = new Date(session.date)
            const formattedDate = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

            return (
              <div
                key={session.date}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/50 px-4 py-3.5 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-foreground">
                      {session.correct}/{session.total}
                    </span>
                    <span className="text-sm text-muted-foreground">({percentage}%)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{formatTime(session.timeInSeconds)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">{percentage}%</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <button onClick={onClose} className="pill-glow">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

