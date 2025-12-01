import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const TENSE_LABELS: Record<string, string> = {
  present: "présent",
  imperfect: "imparfait",
  future: "futur simple",
  perfect: "parfait",
  pluperfect: "plus-que-parfait",
  futurePerfect: "futur antérieur"
}

const SYSTEM_LABELS: Record<string, string> = {
  infectum: "Infectum (action non accomplie)",
  perfectum: "Perfectum (action accomplie)"
}

export async function POST(request: Request) {
  try {
    const { verb, principalParts, userAnswer, correctAnswer, studentName, category, tense, tenseSystem } = await request.json()

    const normalizedUser = userAnswer.toLowerCase().replace(/\s+/g, " ").trim()
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/\s+/g, " ").trim()

    const isCorrect = normalizedUser === normalizedCorrect

    const categoryLabels: Record<string, string> = {
      "1": "1ère conj.",
      "2": "2ème conj.",
      "3": "3ème conj.",
      "3-io": "3ème mixte",
      "4": "4ème conj.",
      "compound": "composé",
      "irregular": "irrégulier"
    }

    const categoryShort = category ? categoryLabels[category] || "" : ""
    const tenseLabel = tense ? TENSE_LABELS[tense] || "présent" : "présent"
    const systemLabel = tenseSystem ? SYSTEM_LABELS[tenseSystem] || "" : ""

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Tu es un professeur de latin qui aide un élève nommé ${studentName} à pratiquer les conjugaisons.

Le verbe est : ${principalParts} (${verb})
Temps demandé : ${tenseLabel}
L'élève a répondu : ${userAnswer}
La bonne réponse est : ${correctAnswer}

La réponse est ${isCorrect ? "CORRECTE" : "INCORRECTE"}.

${
  isCorrect
    ? `Écris une réponse courte et encourageante (maximum 15 mots). 
Mentionne que c'est correct et ajoute un détail intéressant sur ce verbe latin ou son étymologie.
Ne répète pas la catégorie ou le type de conjugaison.`
    : `Explique brièvement l'erreur (maximum 20 mots) et donne un conseil pour retenir les terminaisons du ${tenseLabel}. Sois encourageant.`
}

Réponds sur un ton amical. N'utilise pas d'emojis. Ne mentionne pas "composé", "irrégulier" ou le numéro de conjugaison.`,
    })

    return Response.json({
      isCorrect,
      feedback: text,
    })
  } catch (error) {
    console.error("Validation error:", error)

    const { userAnswer, correctAnswer } = await request.json().catch(() => ({ userAnswer: "", correctAnswer: "" }))
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

    return Response.json({
      isCorrect,
      feedback: isCorrect ? "Correct ! Bien joué." : `Pas tout à fait. La bonne réponse est : ${correctAnswer}`,
    })
  }
}
