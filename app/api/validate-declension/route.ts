import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const DECLENSION_LABELS: Record<string, string> = {
  "1": "1ère déclinaison",
  "2": "2ème déclinaison",
  "3": "3ème déclinaison"
}

const NUMBER_LABELS: Record<string, string> = {
  singular: "singulier",
  plural: "pluriel"
}

export async function POST(request: Request) {
  try {
    const { noun, genitive, userAnswer, correctAnswer, studentName, declension, number } = await request.json()

    // Simple comparison
    const userForms = userAnswer.toLowerCase().split(",").map((s: string) => s.trim())
    const correctForms = correctAnswer.toLowerCase().split(",").map((s: string) => s.trim())
    const isCorrect = userForms.every((form: string, i: number) => form === correctForms[i])

    if (isCorrect) {
      // Generate positive feedback
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Tu es un professeur de latin encourageant. L'élève ${studentName} a correctement décliné "${noun}, ${genitive}" (${DECLENSION_LABELS[declension]}) au ${NUMBER_LABELS[number]}.

Génère une courte phrase de félicitation (1-2 lignes max) en français, encourageante et précise. Mentionne brièvement un point positif sur la déclinaison.`,
      })

      return Response.json({
        isCorrect: true,
        feedback: text.trim(),
      })
    } else {
      // Find specific errors
      const errors: string[] = []
      const cases = ["Nominatif", "Vocatif", "Accusatif", "Génitif", "Datif", "Ablatif"]
      
      userForms.forEach((form: string, i: number) => {
        if (form !== correctForms[i]) {
          errors.push(`${cases[i]}: "${form}" → "${correctForms[i]}"`)
        }
      })

      // Generate helpful feedback
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Tu es un professeur de latin bienveillant. L'élève ${studentName} a fait des erreurs en déclinant "${noun}, ${genitive}" (${DECLENSION_LABELS[declension]}) au ${NUMBER_LABELS[number]}.

Erreurs trouvées:
${errors.join("\n")}

Génère un conseil court (2-3 lignes max) en français pour aider l'élève à corriger ses erreurs. Sois précis sur les terminaisons de cette déclinaison. Ne donne PAS directement la réponse complète, donne un indice.`,
      })

      return Response.json({
        isCorrect: false,
        feedback: text.trim(),
      })
    }
  } catch (error) {
    console.error("Validation error:", error)
    
    // Fallback validation
    const { userAnswer, correctAnswer } = await request.json()
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    
    return Response.json({
      isCorrect,
      feedback: isCorrect 
        ? "Correct ! Bien joué." 
        : `La bonne réponse est : ${correctAnswer}`,
    })
  }
}

