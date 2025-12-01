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
      system: `Tu es un assistant qui génère des poèmes au format strict. Tu dois TOUJOURS respecter EXACTEMENT le format demandé sans aucune déviation.`,
      prompt: `Génère un poème de 4 lignes pour l'élève "${studentName}".

FORMAT STRICT - COPIE CET EXEMPLE EN ADAPTANT POUR ${studentName}:

[FR] ${studentName}, ton cœur s'ouvre à la langue des anciens
[FR] Chaque mot latin fait grandir ta lumière
[LA] ${studentName}, cor tuum linguae antiquorum aperitur
[LA] Quodlibet verbum Latinum lucem tuam crescere facit

RÈGLES ABSOLUES:
1. Écris EXACTEMENT 4 lignes, ni plus ni moins
2. Ligne 1 commence par [FR] espace puis une phrase française avec le prénom ${studentName}
3. Ligne 2 commence par [FR] espace puis une phrase française
4. Ligne 3 commence par [LA] espace puis traduction latine ligne 1
5. Ligne 4 commence par [LA] espace puis traduction latine ligne 2
6. JAMAIS mélanger français et latin dans une même ligne
7. Chaque ligne [LA] doit être SEULEMENT en latin, AUCUN mot français
8. Français grammaticalement parfait
9. Ton positif et encourageant
10. PAS de texte avant, après, ou entre les lignes

Génère maintenant le poème:`,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Poem generation error:", error)
    return new Response(
      `[FR] Bienvenue ${(await request.json()).studentName || "cher élève"}, dans ce voyage enchanté\n[FR] Le latin t'ouvre ses portes dorées\n[LA] Salve in hoc itinere magnifico\n[LA] Lingua Latina portas tibi aperit`,
      { headers: { "Content-Type": "text/plain" } }
    )
  }
}

