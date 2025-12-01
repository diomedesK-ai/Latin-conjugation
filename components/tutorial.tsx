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
    description: "Maîtrisez la conjugaison latine avec l'Infectum et le Perfectum",
  },
  {
    title: "Entrez votre nom",
    description: "Personnalisez votre expérience d'apprentissage",
  },
  {
    title: "Infectum ou Perfectum",
    description: "Choisissez le système verbal à pratiquer",
    content: (
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="rounded-xl p-4 bg-white border border-gray-200 text-left">
          <div className="font-bold text-black text-sm mb-2">Infectum</div>
          <div className="text-[10px] text-gray-500 space-y-1">
            <div>• Présent : amo, amas...</div>
            <div>• Imparfait : amabam...</div>
            <div>• Futur : amabo...</div>
          </div>
          <div className="text-[9px] text-gray-400 mt-2">Action non accomplie</div>
        </div>
        <div className="rounded-xl p-4 bg-gray-900 border border-gray-700 text-left">
          <div className="font-bold text-white text-sm mb-2">Perfectum</div>
          <div className="text-[10px] text-gray-400 space-y-1">
            <div>• Parfait : amavi...</div>
            <div>• Plus-que-parf. : amaveram...</div>
            <div>• Futur ant. : amavero...</div>
          </div>
          <div className="text-[9px] text-gray-500 mt-2">Action accomplie</div>
        </div>
      </div>
    )
  },
  {
    title: "Choisissez le temps",
    description: "Sélectionnez le temps précis à pratiquer dans le système choisi",
  },
  {
    title: "Sélectionnez les catégories",
    description: "1ère, 2ème, 3ème, 4ème conjugaison ou verbes irréguliers",
  },
  {
    title: "Conjuguez",
    description: "Pratiquez les 6 formes du temps choisi (minimum 1 verbe)",
    content: (
      <div className="rounded-xl border border-border/50 bg-card/50 p-4 mt-4 text-left">
        <p className="text-xs font-medium text-foreground mb-2">Exemple au parfait :</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">video, vides, videre</span> (voir)
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Réponse : <span className="font-medium text-foreground">vidi, vidisti, vidit, vidimus, vidistis, viderunt</span>
        </p>
      </div>
    )
  },
  {
    title: "Progressez",
    description: "L'IA génère des verbes et vous donne un feedback personnalisé",
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
