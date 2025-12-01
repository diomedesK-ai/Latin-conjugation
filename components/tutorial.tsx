"use client"

import { useState, useEffect } from "react"

type TutorialProps = {
  onComplete: () => void
}

type TutorialStep = {
  title: string
  description: string
  example?: {
    verb: string
    answer: string
  }
}

const steps: TutorialStep[] = [
  {
    title: "Bienvenue",
    description: "Apprenez la conjugaison latine de manière interactive et personnalisée",
  },
  {
    title: "Entrez votre nom",
    description: "Personnalisez votre expérience d'apprentissage",
  },
  {
    title: "Choisissez votre mode",
    description: "Feedback immédiat ou résultats complets à la fin - à vous de choisir",
  },
  {
    title: "Conjuguez",
    description: "Pratiquez les 6 formes du présent de l'indicatif",
    example: {
      verb: "moneo, mones, monere (avertir, conseiller)",
      answer: "moneo, mones, monet, monemus, monetis, monent"
    }
  },
  {
    title: "Progressez",
    description: "Suivez vos performances et améliorez-vous au fil du temps",
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

          {step.example && (
            <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm text-left">
              <p className="mb-3 text-sm font-medium text-foreground">Exemple :</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{step.example.verb}</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Réponse attendue :{" "}
                <span className="font-medium text-foreground">{step.example.answer}</span>
              </p>
            </div>
          )}

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

