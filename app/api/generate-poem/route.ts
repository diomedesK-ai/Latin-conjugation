import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { studentName } = await request.json()

    const result = await streamText({
      model: openai("gpt-5.1"),
      prompt: `Tu es un poète bienveillant qui écrit pour des enfants qui apprennent le latin.

Écris un très court poème personnalisé (4 lignes) pour un élève nommé "${studentName}" qui commence son apprentissage du latin.

FORMAT STRICT - Chaque ligne DOIT commencer sur une nouvelle ligne:
[FR] Première ligne poétique en français avec le prénom ${studentName}
[LA] Traduction latine de la première ligne
[FR] Deuxième ligne poétique en français
[LA] Traduction latine de la deuxième ligne

RÈGLES STRICTES:
- Positif, encourageant, adapté aux enfants
- Français simple et élégant
- Latin correct niveau débutant
- Exactement 4 lignes au total (2 FR + 2 LA)
- Chaque ligne DOIT commencer par [FR] ou [LA]
- Une seule phrase courte par ligne
- Pas d'emojis, pas de guillemets, pas de répétitions
- Commence directement avec [FR]
- IMPORTANT: Retour à la ligne après chaque phrase`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Poem generation error:", error)
    return new Response(
      `[FR] Bienvenue ${(await request.json()).studentName || "cher élève"}, dans ce voyage enchanté\n[LA] Salve in hoc itinere magnifico\n[FR] Le latin t'ouvre ses portes dorées\n[LA] Lingua Latina portas tibi aperit`,
      { headers: { "Content-Type": "text/plain" } }
    )
  }
}

