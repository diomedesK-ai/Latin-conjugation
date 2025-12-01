"use client"

type HeaderIconsProps = {
  onShowTutorial: () => void
  onShowLeaderboard: () => void
  onReset: () => void
}

export function HeaderIcons({ onShowTutorial, onShowLeaderboard, onReset }: HeaderIconsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Reset Icon - Minimal */}
      <button onClick={onReset} className="icon-button" aria-label="Réinitialiser" title="Réinitialiser">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6 2.3" strokeWidth="1.5" />
          <path d="M3 7v5h5" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Tutorial Icon - Minimal */}
      <button
        onClick={onShowTutorial}
        className="icon-button"
        aria-label="Voir le tutoriel"
        title="Tutoriel"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <path d="M12 16v.01" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 13a1.5 1.5 0 0 1 1.5-2.5 1.5 1.5 0 1 1-1.5 2.5z" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Leaderboard Icon - Minimal */}
      <button
        onClick={onShowLeaderboard}
        className="icon-button"
        aria-label="Voir le classement"
        title="Classement"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <path d="M5 20V14" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 20V8" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 20V4" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

