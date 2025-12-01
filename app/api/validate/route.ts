import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { verb, principalParts, userAnswer, correctAnswer, studentName, category } = await request.json()

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

    const { text } = await generateText({
      model: openai("gpt-5.1"),
      prompt: `Tu es un professeur de latin qui aide un élève nommé ${studentName} à pratiquer les conjugaisons.

Le verbe est : ${principalParts} (${verb})${category ? ` - ${categoryShort}` : ''}
L'élève a répondu : ${userAnswer}
La bonne réponse est : ${correctAnswer}

La réponse est ${isCorrect ? "CORRECTE" : "INCORRECTE"}.

${
  isCorrect
    ? `Réponds EXACTEMENT dans ce format:
Bravo, un verbe de [CATEGORY]${category ? ` où [CATEGORY] = "${categoryShort}"` : ''}.
Puis ajoute UNE SEULE phrase courte (maximum 10 mots) avec un détail intéressant.`
    : "Explique brièvement ce qui était faux et donne un conseil utile pour retenir la bonne conjugaison. Sois encourageant mais pédagogique. Maximum 2 phrases courtes."
}

Réponds sur un ton amical et bienveillant. N'utilise pas d'emojis.`,
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
