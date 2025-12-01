import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const VerbSchema = z.object({
  verbs: z.array(
    z.object({
      firstPerson: z.string().describe("1ère personne du singulier (ex: amo)"),
      secondPerson: z.string().describe("2ème personne du singulier (ex: amas)"),
      infinitive: z.string().describe("Infinitif présent (ex: amare)"),
      meaning: z.string().describe("Sens en français"),
      conjugation: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal("irregular")]).describe("Type de conjugaison"),
      presentConjugation: z.array(z.string()).length(6).describe("Les 6 formes du présent: ego, tu, is/ea/id, nos, vos, ei/eae/ea"),
      isCompound: z.boolean().optional().describe("Est-ce un verbe composé?"),
      category: z.string().describe("Catégorie du verbe (1, 2, 3, 3-io, 4, compound, irregular)"),
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const { count, categories, difficulty } = await request.json()

    const categoryMap: Record<string, string> = {
      "1": "Première conjugaison (-are, ex: amo, amas, amare)",
      "2": "Deuxième conjugaison (-ēre, ex: video, vides, videre)",
      "3": "Troisième conjugaison (-ere, ex: duco, ducis, ducere)",
      "3-io": "Troisième conjugaison mixte (-io, ex: capio, capis, capere)",
      "4": "Quatrième conjugaison (-ire, ex: audio, audis, audire)",
      "compound": "Composés de esse (ex: possum, absum, adsum)",
      "irregular": "Verbes irréguliers (ex: esse, ire, ferre, velle)",
    }

    const categoryDescriptions = categories.map((c: string) => categoryMap[c]).join(", ")

    const prompt = `Tu es un expert en latin. Génère exactement ${count} verbes latins pour un exercice de conjugaison au présent de l'indicatif.

CATÉGORIES DEMANDÉES: ${categoryDescriptions}

EXIGENCES:
- Génère UNIQUEMENT des verbes des catégories suivantes: ${categories.join(", ")}
- Répartis les verbes de manière équilibrée entre les catégories demandées
- ${difficulty === "beginner" ? "Privilégie les verbes courants" : "Inclus des verbes variés"}
- Pour chaque verbe, fournis:
  * Les 3 temps primitifs (1ère pers. sing., 2ème pers. sing., infinitif)
  * Le sens en français
  * Le type de conjugaison
  * La conjugaison complète au présent (ego, tu, is/ea/id, nos, vos, ei/eae/ea)
  * Si c'est un composé (comme possum, absum)
  * La catégorie exacte (utilise les IDs: 1, 2, 3, 3-io, 4, compound, irregular)

EXEMPLES DE STRUCTURE PAR CATÉGORIE:
- Catégorie "1": amo, amas, amare (aimer) - category: "1" - amo, amas, amat, amamus, amatis, amant
- Catégorie "2": video, vides, videre (voir) - category: "2" - video, vides, videt, videmus, videtis, vident
- Catégorie "3": duco, ducis, ducere (conduire) - category: "3" - duco, ducis, ducit, ducimus, ducitis, ducunt
- Catégorie "3-io": capio, capis, capere (prendre) - category: "3-io" - capio, capis, capit, capimus, capitis, capiunt
- Catégorie "4": audio, audis, audire (entendre) - category: "4" - audio, audis, audit, audimus, auditis, audiunt
- Catégorie "compound": possum, potes, posse (pouvoir) - category: "compound" - possum, potes, potest, possumus, potestis, possunt
- Catégorie "irregular": sum, es, esse (être) - category: "irregular" - sum, es, est, sumus, estis, sunt

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

