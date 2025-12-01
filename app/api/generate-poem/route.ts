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
      prompt: `Tu es un poète francophone expert et professeur de latin. Écris un très court poème personnalisé (4 lignes) pour un élève nommé "${studentName}" qui commence son apprentissage du latin.

FORMAT STRICT - TOUT le français D'ABORD, puis TOUT le latin:
[FR] Première phrase complète en français GRAMMATICALEMENT PARFAIT avec le prénom ${studentName}
[FR] Deuxième phrase complète en français GRAMMATICALEMENT PARFAIT
[LA] Traduction latine complète de la première phrase française
[LA] Traduction latine complète de la deuxième phrase française

RÈGLES ABSOLUES:
- Exactement 4 lignes (2 FR puis 2 LA)
- D'ABORD les 2 lignes françaises [FR]
- ENSUITE les 2 lignes latines [LA]
- JAMAIS alterner FR/LA/FR/LA
- Les lignes [FR] contiennent SEULEMENT du français grammaticalement correct (pas de fautes!)
- Les lignes [LA] contiennent SEULEMENT du latin correct
- Vérifie l'accord des adjectifs, conjugaisons, et syntaxe française
- Positif, encourageant, poétique, adapté aux enfants
- Pas d'emojis, pas de guillemets
- Commence directement avec [FR]

EXEMPLE DU BON FORMAT:
[FR] Marie, ton cœur s'ouvre à la langue des anciens
[FR] Chaque mot latin fait grandir ta lumière
[LA] Maria, cor tuum linguae antiquorum aperitur
[LA] Quodlibet verbum Latinum lucem tuam crescere facit`,
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

