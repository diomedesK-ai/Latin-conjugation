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
      prompt: `Tu es un poète francophone expert et professeur de latin. Écris EXACTEMENT 4 lignes de poème pour un élève nommé "${studentName}".

FORMAT OBLIGATOIRE (à suivre EXACTEMENT):
Ligne 1: [FR] suivi d'UNE phrase en français avec le prénom ${studentName}
Ligne 2: [FR] suivi d'UNE phrase en français
Ligne 3: [LA] suivi de la traduction latine de la ligne 1
Ligne 4: [LA] suivi de la traduction latine de la ligne 2

RÈGLES CRITIQUES:
1. Commence directement avec [FR] - PAS d'introduction
2. EXACTEMENT 4 lignes, PAS PLUS, PAS MOINS
3. Chaque ligne commence par [FR] ou [LA] suivi d'UN ESPACE puis le texte
4. D'ABORD les 2 lignes [FR], PUIS les 2 lignes [LA]
5. UNE SEULE phrase par ligne
6. JAMAIS de texte avant ou après les 4 lignes
7. JAMAIS de répétitions ou duplications
8. Français grammaticalement parfait (accords, conjugaisons)
9. Latin correct niveau débutant
10. Ton positif et encourageant pour enfants
11. PAS d'emojis, PAS de guillemets, PAS de tags supplémentaires

EXEMPLE EXACT (suis ce format précisément):
[FR] Marie, ton cœur s'ouvre à la langue des anciens
[FR] Chaque mot latin fait grandir ta lumière
[LA] Maria, cor tuum linguae antiquorum aperitur
[LA] Quodlibet verbum Latinum lucem tuam crescere facit

GÉNÈRE MAINTENANT EXACTEMENT 4 LIGNES pour ${studentName}:`,
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

