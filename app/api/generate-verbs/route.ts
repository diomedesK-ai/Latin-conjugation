import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const VerbSchema = z.object({
  verbs: z.array(
    z.object({
      firstPerson: z.string(),
      secondPerson: z.string(),
      infinitive: z.string(),
      meaning: z.string(),
      conjugation: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal("irregular")]),
      presentConjugation: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string(), z.string()]),
      isCompound: z.boolean().optional(),
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const { count, difficulty } = await request.json()

    const prompt = `Tu es un expert en latin. Génère exactement ${count} verbes latins pour un exercice de conjugaison au présent de l'indicatif.

EXIGENCES:
- Mélange de conjugaisons (1ère en -are, 2ème en -ēre, 3ème en -ere, 4ème en -ire)
- Inclus quelques verbes irréguliers (esse, ire, ferre, velle, etc.)
- ${difficulty === "beginner" ? "Privilégie les verbes courants et réguliers" : "Inclus des verbes plus avancés et irréguliers"}
- Pour chaque verbe, fournis:
  * Les 3 temps primitifs (1ère pers. sing., 2ème pers. sing., infinitif)
  * Le sens en français
  * Le type de conjugaison
  * La conjugaison complète au présent (ego, tu, is/ea/id, nos, vos, ei/eae/ea)
  * Si c'est un composé (comme possum, absum)

EXEMPLES DE STRUCTURE:
- amo, amas, amare (aimer) - 1ère conjugaison: amo, amas, amat, amamus, amatis, amant
- video, vides, videre (voir) - 2ème conjugaison: video, vides, videt, videmus, videtis, vident
- duco, ducis, ducere (conduire) - 3ème conjugaison: duco, ducis, ducit, ducimus, ducitis, ducunt
- audio, audis, audire (entendre) - 4ème conjugaison: audio, audis, audit, audimus, auditis, audiunt

Assure-toi que les conjugaisons sont EXACTES et conformes à la grammaire latine classique.`

    const { object } = await generateObject({
      model: openai("gpt-5.1"),
      schema: VerbSchema,
      prompt,
    })

    return Response.json({ verbs: object.verbs })
  } catch (error) {
    console.error("Verb generation error:", error)
    return Response.json({ error: "Failed to generate verbs" }, { status: 500 })
  }
}

