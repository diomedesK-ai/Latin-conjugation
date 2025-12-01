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
      conjugation: z.union([
        z.literal(1), z.literal(2), z.literal(3), z.literal(4),
        z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"),
        z.literal("irregular"), z.literal("compound")
      ]).describe("Type de conjugaison (1, 2, 3, 4, ou 'irregular')"),
      presentConjugation: z.array(z.string()).length(6).describe("Les 6 formes du présent: ego, tu, is/ea/id, nos, vos, ei/eae/ea"),
      imperfectConjugation: z.array(z.string()).length(6).describe("Les 6 formes de l'imparfait: ego, tu, is/ea/id, nos, vos, ei/eae/ea"),
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

    const prompt = `Tu es un expert en latin. Génère exactement ${count} verbes latins pour un exercice de conjugaison.

CATÉGORIES DEMANDÉES: ${categoryDescriptions}

EXIGENCES:
- Génère UNIQUEMENT des verbes des catégories suivantes: ${categories.join(", ")}
- Répartis les verbes de manière équilibrée entre les catégories demandées
- ${difficulty === "beginner" ? "Privilégie les verbes courants" : "Inclus des verbes variés"}
- Pour chaque verbe, fournis:
  * Les 3 temps primitifs (1ère pers. sing., 2ème pers. sing., infinitif)
  * Le sens en français
  * Le type de conjugaison
  * La conjugaison complète au PRÉSENT (ego, tu, is/ea/id, nos, vos, ei/eae/ea)
  * La conjugaison complète à l'IMPARFAIT (ego, tu, is/ea/id, nos, vos, ei/eae/ea)
  * Si c'est un composé (comme possum, absum)
  * La catégorie exacte (utilise les IDs: 1, 2, 3, 3-io, 4, compound, irregular)

RÈGLES DE CONJUGAISON À L'IMPARFAIT:
- 1ère conjugaison (-are): radical + -abam, -abas, -abat, -abamus, -abatis, -abant
- 2ème conjugaison (-ēre): radical + -ebam, -ebas, -ebat, -ebamus, -ebatis, -ebant
- 3ème conjugaison (-ere): radical + -ebam, -ebas, -ebat, -ebamus, -ebatis, -ebant
- 3ème conjugaison mixte (-io): radical + -iebam, -iebas, -iebat, -iebamus, -iebatis, -iebant
- 4ème conjugaison (-ire): radical + -iebam, -iebas, -iebat, -iebamus, -iebatis, -iebant
- esse (être): eram, eras, erat, eramus, eratis, erant
- Composés de esse: préfixe + eram, eras, etc. (ex: poteram, aderam, aberam)

EXEMPLES DE STRUCTURE PAR CATÉGORIE:
- Catégorie "1": amo, amas, amare (aimer)
  * Présent: amo, amas, amat, amamus, amatis, amant
  * Imparfait: amabam, amabas, amabat, amabamus, amabatis, amabant

- Catégorie "2": video, vides, videre (voir)
  * Présent: video, vides, videt, videmus, videtis, vident
  * Imparfait: videbam, videbas, videbat, videbamus, videbatis, videbant

- Catégorie "3": duco, ducis, ducere (conduire)
  * Présent: duco, ducis, ducit, ducimus, ducitis, ducunt
  * Imparfait: ducebam, ducebas, ducebat, ducebamus, ducebatis, ducebant

- Catégorie "3-io": capio, capis, capere (prendre)
  * Présent: capio, capis, capit, capimus, capitis, capiunt
  * Imparfait: capiebam, capiebas, capiebat, capiebamus, capiebatis, capiebant

- Catégorie "4": audio, audis, audire (entendre)
  * Présent: audio, audis, audit, audimus, auditis, audiunt
  * Imparfait: audiebam, audiebas, audiebat, audiebamus, audiebatis, audiebant

- Catégorie "compound": possum, potes, posse (pouvoir)
  * Présent: possum, potes, potest, possumus, potestis, possunt
  * Imparfait: poteram, poteras, poterat, poteramus, poteratis, poterant

- Catégorie "irregular": sum, es, esse (être)
  * Présent: sum, es, est, sumus, estis, sunt
  * Imparfait: eram, eras, erat, eramus, eratis, erant

- Catégorie "irregular": eo, is, ire (aller)
  * Présent: eo, is, it, imus, itis, eunt
  * Imparfait: ibam, ibas, ibat, ibamus, ibatis, ibant

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

