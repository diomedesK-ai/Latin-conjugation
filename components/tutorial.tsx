"use client"

import { useState, useEffect } from "react"

type TutorialProps = {
  onComplete: () => void
}

type TutorialStep = {
  title: string
  description: string
  content?: React.ReactNode
}

const steps: TutorialStep[] = [
  {
    title: "Bienvenue",
    description: "Maîtrisez le latin avec la conjugaison, les déclinaisons et les prépositions",
  },
  {
    title: "Entrez votre nom",
    description: "Personnalisez votre expérience d'apprentissage",
  },
  {
    title: "3 exercices",
    description: "Choisissez votre type d'entraînement",
    content: (
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="rounded-xl p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-300 dark:border-gray-700 text-left">
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 dark:text-gray-400">
              <path d="M12 3v18M3 12h18M7 7l10 10M17 7l-10 10" />
            </svg>
          </div>
          <div className="font-bold text-foreground text-xs">Conjugaison</div>
          <div className="text-[9px] text-muted-foreground mt-1">6 temps</div>
        </div>
        <div className="rounded-xl p-3 bg-white border border-gray-200 text-left">
          <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
              <path d="M4 6h16M4 12h16M4 18h16M8 3v3M16 18v3" />
            </svg>
          </div>
          <div className="font-bold text-gray-800 text-xs">Déclinaison</div>
          <div className="text-[9px] text-gray-500 mt-1">6 cas</div>
        </div>
        <div className="rounded-xl p-3 bg-gray-900 border border-gray-700 text-left">
          <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center mb-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="font-bold text-white text-xs">Prépositions</div>
          <div className="text-[9px] text-gray-400 mt-1">Acc/Abl</div>
        </div>
      </div>
    )
  },
  {
    title: "Conjugaison",
    description: "Infectum (non accompli) ou Perfectum (accompli)",
    content: (
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl p-3 bg-white border border-gray-200 text-left">
          <div className="font-bold text-black text-xs mb-1.5">Infectum</div>
          <div className="text-[9px] text-gray-500 space-y-0.5">
            <div>• Présent</div>
            <div>• Imparfait</div>
            <div>• Futur</div>
          </div>
        </div>
        <div className="rounded-xl p-3 bg-gray-900 border border-gray-700 text-left">
          <div className="font-bold text-white text-xs mb-1.5">Perfectum</div>
          <div className="text-[9px] text-gray-400 space-y-0.5">
            <div>• Parfait</div>
            <div>• Plus-que-parfait</div>
            <div>• Futur antérieur</div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Déclinaison",
    description: "Pratiquez les 6 cas latins au singulier ou pluriel",
    content: (
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-left">
            <div className="font-medium text-xs text-foreground mb-2">Les 6 cas :</div>
            <div className="text-[9px] text-muted-foreground space-y-0.5">
              <div>• <span className="font-bold">N</span> Nominatif (sujet)</div>
              <div>• <span className="font-bold">V</span> Vocatif (appel)</div>
              <div>• <span className="font-bold">Ac</span> Accusatif (COD)</div>
              <div>• <span className="font-bold">G</span> Génitif (du/de la)</div>
              <div>• <span className="font-bold">D</span> Datif (à/pour)</div>
              <div>• <span className="font-bold">Ab</span> Ablatif (par/avec)</div>
            </div>
          </div>
          <div className="text-left">
            <div className="font-medium text-xs text-foreground mb-2">Exemple (1ère) :</div>
            <div className="text-[9px] text-muted-foreground font-mono">
              rosa, rosae →<br/>
              rosa, rosa, rosam,<br/>
              rosae, rosae, rosā
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Prépositions",
    description: "Maîtrisez les cas régis par chaque préposition",
    content: (
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-left">
          <div className="font-bold text-blue-700 dark:text-blue-300 text-xs mb-1.5">+ Accusatif</div>
          <div className="text-[9px] text-blue-600 dark:text-blue-400 space-y-0.5 font-mono">
            <div>ad, ante, per</div>
            <div>post, trans...</div>
          </div>
          <div className="text-[8px] text-blue-500 mt-1.5">→ mouvement</div>
        </div>
        <div className="rounded-xl p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-left">
          <div className="font-bold text-purple-700 dark:text-purple-300 text-xs mb-1.5">+ Ablatif</div>
          <div className="text-[9px] text-purple-600 dark:text-purple-400 space-y-0.5 font-mono">
            <div>a/ab, cum, de</div>
            <div>e/ex, sine...</div>
          </div>
          <div className="text-[8px] text-purple-500 mt-1.5">→ origine/moyen</div>
        </div>
      </div>
    )
  },
  {
    title: "Progressez",
    description: "L'IA génère des exercices et vous donne un feedback personnalisé",
  },
]

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("latin-tutorial-seen")
    if (hasSeenTutorial === "true") {
      onComplete()
    }
  }, [onComplete])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsVisible(true)
      }, 300)
    } else {
      // Last step - complete tutorial
      localStorage.setItem("latin-tutorial-seen", "true")
      setIsVisible(false)
      setTimeout(onComplete, 300)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("latin-tutorial-seen", "true")
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  const step = steps[currentStep]

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div
          className={`w-full max-w-md space-y-8 px-6 transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
        <div className="space-y-6 text-center">
          <div className="space-y-3">
            <h2 className="text-4xl font-semibold text-foreground">{step.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
          </div>

          {step.content}

          <div className="flex justify-center gap-2 pt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  index === currentStep
                    ? "w-8 bg-foreground shadow-[0_2px_12px_rgba(0,0,0,0.3)] dark:shadow-[0_2px_12px_rgba(255,255,255,0.3)]"
                    : "w-1.5 bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handleNext} className="pill-glow w-full">
            {currentStep < steps.length - 1 ? "Suivant" : "Commencer"}
          </button>
          {currentStep === 0 && (
            <button
              onClick={handleSkip}
              className="w-full rounded-2xl px-6 py-3 text-sm text-muted-foreground transition-all duration-300 hover:text-foreground"
            >
              Passer le tutoriel
            </button>
          )}
        </div>
        </div>
      </div>
  )
}
