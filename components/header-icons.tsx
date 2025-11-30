"use client"

type HeaderIconsProps = {
  onShowTutorial: () => void
  onShowLeaderboard: () => void
  onReset: () => void
}

export function HeaderIcons({ onShowTutorial, onShowLeaderboard, onReset }: HeaderIconsProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Reset Icon */}
      <button onClick={onReset} className="icon-button" aria-label="Réinitialiser" title="Réinitialiser">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>

      {/* Tutorial Icon - Bigger */}
      <button
        onClick={onShowTutorial}
        className="icon-button"
        aria-label="Voir le tutoriel"
        title="Tutoriel"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      </button>

      {/* Leaderboard Icon - Always visible */}
      <button
        onClick={onShowLeaderboard}
        className="icon-button"
        aria-label="Voir le classement"
        title="Classement"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="icon-stroke">
          <rect x="3" y="13" width="4" height="8" />
          <rect x="10" y="7" width="4" height="14" />
          <rect x="17" y="3" width="4" height="18" />
        </svg>
      </button>
    </div>
  )
}

