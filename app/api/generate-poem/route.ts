import { createOpenAI } from "@ai-sdk/openai"
import { generateText } from "ai"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { studentName } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-5.1"),
      prompt: `Generate a 4-line welcome poem for student "${studentName}" learning Latin.

OUTPUT FORMAT (follow EXACTLY):
[FR] ${studentName}, [French sentence about curiosity/learning]
[FR] [French sentence about perseverance/growth]
[LA] ${studentName}, [Latin translation of line 1]
[LA] [Latin translation of line 2]

RULES:
1. Output ONLY 4 lines, nothing else
2. Each line starts with [FR] or [LA] tag
3. Lines 1-2 are in French (grammatically perfect)
4. Lines 3-4 are in Latin (classical Latin only)
5. No mixing of languages within a line
6. Positive, encouraging tone about learning

Example output:
[FR] Marie, ta curiosité éclaire le chemin du savoir
[FR] Chaque défi relevé fait grandir ta confiance
[LA] Maria, curiositas tua viam scientiae illuminat
[LA] Quodlibet certamen superatum fiduciam tuam auget`,
    })

    // Return the poem as plain text
    return new Response(text, { headers: { "Content-Type": "text/plain" } })
  } catch (error) {
    console.error("Poem generation error:", error)
    const body = await request.clone().json().catch(() => ({}))
    const name = body.studentName || "cher élève"
    return new Response(
      `[FR] ${name}, ta curiosité ouvre les portes du savoir\n[FR] Chaque effort te rapproche des trésors de la connaissance\n[LA] ${name}, curiositas tua portas scientiae aperit\n[LA] Quodlibet studium te ad thesauros cognitionis propius ducit`,
      { headers: { "Content-Type": "text/plain" } }
    )
  }
}

