import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { verb, tense, tenseSystem, errors, studentName } = await request.json()

    // Different prompt based on exercise type
    const isDeclension = tenseSystem === "declension"
    
    const prompt = isDeclension
      ? `Tu es un professeur de latin bienveillant. ${studentName} a fait des erreurs en déclinant "${verb}" (${tense}).

Erreurs détectées:
${errors}

Génère UN conseil COURT et PRÉCIS (1-2 phrases max) en français qui aide l'élève à corriger son erreur SANS donner la réponse directement.

RÈGLES:
- Analyse les erreurs spécifiques (mauvaise terminaison de cas? confusion entre cas?)
- Donne un indice grammatical PERTINENT à l'erreur
- Mentionne la règle de déclinaison si utile
- NE DONNE PAS la bonne réponse
- Sois encourageant mais direct

Exemple de bon conseil: "Attention, à la 1ère déclinaison le génitif singulier se termine en -ae, pas -a."
Exemple de bon conseil: "L'accusatif singulier de la 2ème déclinaison prend -um, pas -us comme le nominatif."`
      : `Tu es un professeur de latin bienveillant. ${studentName} a fait des erreurs en conjuguant "${verb}" au ${tense} (système ${tenseSystem === "infectum" ? "Infectum" : "Perfectum"}).

Erreurs détectées:
${errors}

Génère UN conseil COURT et PRÉCIS (1-2 phrases max) en français qui aide l'élève à corriger son erreur SANS donner la réponse directement.

RÈGLES:
- Analyse les erreurs spécifiques (mauvaise terminaison? mauvais radical? confusion de personne?)
- Donne un indice grammatical PERTINENT à l'erreur
- Sois encourageant mais direct
- NE DONNE PAS la bonne réponse
- Mentionne la règle de formation si utile

Exemple de bon conseil: "Attention, au parfait la 3ème personne pluriel se termine en -erunt, pas -unt."
Exemple de bon conseil: "Le radical du parfait de ce verbe est différent du présent. Pense au radical en v-."`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return Response.json({ hint: text.trim() })
  } catch (error) {
    console.error("Hint generation error:", error)
    return Response.json({ hint: "Vérifie attentivement les terminaisons." })
  }
}

