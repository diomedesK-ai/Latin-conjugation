import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { 
      preposition, 
      nounNominative, 
      nounGenitive,
      userAnswer, 
      correctAnswer, 
      correctCase,
      sentence,
      isCorrect,
      studentName 
    } = await request.json()

    let feedback = ""

    if (isCorrect) {
      // Generate encouraging feedback
      const prompt = `Tu es un professeur de latin bienveillant. L'élève ${studentName} a correctement décliné le nom "${nounNominative}" en "${userAnswer}" après la préposition "${preposition}".

La phrase était : "${sentence.replace('___', userAnswer)}"

Écris un feedback court et encourageant (1-2 phrases maximum) qui :
- Félicite l'élève
- Confirme que "${preposition}" régit le ${correctCase}
- Reste simple et motivant

Exemple : "Excellent ! Tu as bien reconnu que '${preposition}' régit le ${correctCase}. Continue comme ça !"`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
      })

      feedback = text.trim()
    } else {
      // Generate corrective feedback
      const prompt = `Tu es un professeur de latin pédagogue. L'élève ${studentName} a essayé de décliner le nom "${nounNominative}, ${nounGenitive}" mais a répondu "${userAnswer}" au lieu de "${correctAnswer}" après la préposition "${preposition}".

La phrase était : "${sentence}"
La bonne réponse est : "${sentence.replace('___', correctAnswer)}"

Écris un feedback pédagogique (2-3 phrases maximum) qui :
- Explique gentiment l'erreur
- Rappelle que "${preposition}" régit le ${correctCase}
- Donne la bonne forme déclinée : "${correctAnswer}"
- Reste encourageant et constructif

Exemple : "Attention, '${preposition}' régit le ${correctCase}. La bonne réponse est '${correctAnswer}'. N'oublie pas de vérifier quel cas la préposition demande !"`

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
      })

      feedback = text.trim()
    }

    return Response.json({
      isCorrect,
      feedback,
      correctCase,
    })
  } catch (error) {
    console.error("Preposition validation error:", error)
    
    // Fallback feedback
    const { isCorrect, correctAnswer, preposition, correctCase } = await request.json()
    const feedback = isCorrect
      ? `Excellent ! "${preposition}" régit bien le ${correctCase}.`
      : `La bonne réponse est "${correctAnswer}". "${preposition}" régit le ${correctCase}.`
    
    return Response.json({
      isCorrect,
      feedback,
      correctCase,
    })
  }
}

