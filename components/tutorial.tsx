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

function TutorialCelebration() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200)
  }, [])

  // Path coordinates from the article: https://thisdevbrain.com/apple-hello-animation/
  // Converted from SwiftUI normalized coordinates to SVG
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ width: '70%', maxWidth: '600px' }}>
        <svg
          viewBox="0 0 1000 900"
          xmlns="http://www.w3.org/2000/svg"
          className="apple-hello-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="15%" stopColor="#eab308" />
              <stop offset="30%" stopColor="#f97316" />
              <stop offset="45%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#ec4899" />
              <stop offset="75%" stopColor="#a855f7" />
              <stop offset="90%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* Apple's "hello" path - from the article */}
          <path
            d="M 189.42 649.16
               C 274.18 516.69 238.09 593.94 274.18 516.69
               C 301.96 457.22 316.51 377.24 305.36 342.81
               C 264.79 217.53 240.62 674.07 246.51 674.14
               C 252.4 674.2 252.06 541.25 281.92 511.1
               C 311.78 480.94 322.3 521.11 323.67 539.84
               C 325.89 570.11 316.87 618.04 318.39 635.5
               C 324.73 708.54 427.87 636.82 435.99 553.98
               C 444.71 464.92 368.3 469.17 383.4 611.47
               C 388.95 663.77 423.46 677.24 441.8 669.42
               C 508.13 641.15 553.63 496.71 552.0 385.75
               C 549.88 242.03 478.56 387.29 495.71 608.64
               C 502.32 693.93 558.41 666.19 574.99 643.51
               C 605.64 601.57 659.66 480.59 649.78 363.14
               C 639.47 240.62 561.81 442.49 597.45 626.07
               C 609.34 687.33 645.02 666.6 654.8 657.17
               C 678.02 634.8 685.5 553.6 704.74 518.17
               C 729.06 473.4 767.38 506.86 768.96 560.1
               C 772.46 677.42 721.59 677.49 702.63 651.05
               C 686.27 628.23 682.44 560.22 704.48 518.17
               C 719.54 489.42 743.63 488.71 775.3 520.99
               C 788.25 534.19 799.35 531.83 808.07 510.63"
            stroke="url(#appleGradient)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            className="apple-hello-path"
          />
        </svg>
      </div>
    </div>
  )
}

export function Tutorial({ onComplete }: TutorialProps) {
  const [showHelloAnimation, setShowHelloAnimation] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Show hello animation for 4 seconds, then show tutorial
    const timer = setTimeout(() => {
      setShowHelloAnimation(false)
      setIsVisible(true)
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

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

  // Show hello animation at the beginning
  if (showHelloAnimation) {
    return <TutorialCelebration />
  }

  return (
    <>
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
    </>
  )
}

