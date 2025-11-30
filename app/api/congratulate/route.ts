import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { studentName, correct, total, timeInSeconds, percentage } = await request.json()

    const performanceLevel =
      percentage >= 90 ? "excellent" : percentage >= 75 ? "très bon" : percentage >= 60 ? "bon" : "à améliorer"

    const prompt = `Tu es un professeur de latin bienveillant et encourageant. L'élève ${studentName} vient de terminer un exercice de conjugaison.

RÉSULTATS:
- Score: ${correct}/${total} (${percentage}%)
- Temps: ${Math.floor(timeInSeconds / 60)}m ${timeInSeconds % 60}s
- Performance: ${performanceLevel}

INSTRUCTIONS:
- Écris un message de félicitations personnalisé et chaleureux (2-3 phrases maximum)
- Sois positif et encourageant, même si le score n'est pas parfait
- Mentionne quelque chose de spécifique sur leur performance
- Si le score est excellent (90%+): célèbre leur maîtrise
- Si le score est bon (60-89%): encourage les progrès et mentionne les points forts
- Si le score est faible (<60%): sois très encourageant et rappelle que la pratique mène à la perfection
- Utilise un ton amical et motivant
- N'utilise PAS d'emojis
- Adresse-toi directement à l'élève par son prénom`

    const { text } = await generateText({
      model: openai("gpt-4.1-turbo"),
      prompt,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error("Congratulation generation error:", error)
    const { studentName, percentage } = await request.json().catch(() => ({ studentName: "", percentage: 0 }))

    const fallbackMessage =
      percentage >= 90
        ? `Félicitations ${studentName} ! Tu as une excellente maîtrise des conjugaisons latines. Continue comme ça !`
        : percentage >= 60
          ? `Bravo ${studentName} ! Tu fais de beaux progrès. Continue de pratiquer régulièrement.`
          : `Bon travail ${studentName} ! Chaque exercice te rapproche de la maîtrise. La persévérance est la clé !`

    return Response.json({ message: fallbackMessage })
  }
}

