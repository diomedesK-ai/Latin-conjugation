import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const VerbSchema = z.object({
  verbs: z.array(
    z.object({
      firstPerson: z.string().describe("1ère personne du singulier au présent (ex: amo)"),
      secondPerson: z.string().describe("2ème personne du singulier au présent (ex: amas)"),
      infinitive: z.string().describe("Infinitif présent (ex: amare)"),
      perfectStem: z.string().optional().describe("Radical du parfait (ex: amav-)"),
      meaning: z.string().describe("Sens en français"),
      conjugation: z.union([
        z.literal(1), z.literal(2), z.literal(3), z.literal(4),
        z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"),
        z.literal("irregular"), z.literal("compound")
      ]).describe("Type de conjugaison"),
      // The requested tense conjugation
      conjugatedForms: z.array(z.string()).length(6).describe("Les 6 formes conjuguées: ego, tu, is/ea/id, nos, vos, ei/eae/ea"),
      isCompound: z.boolean().optional().describe("Est-ce un verbe composé?"),
      category: z.string().describe("Catégorie du verbe (1, 2, 3, 3-io, 4, compound, irregular)"),
    }),
  ),
})

const TENSE_INSTRUCTIONS: Record<string, string> = {
  // Infectum tenses
  present: `PRÉSENT DE L'INDICATIF (Infectum):
- 1ère conjugaison (-are): -o, -as, -at, -amus, -atis, -ant (ex: amo, amas, amat, amamus, amatis, amant)
- 2ème conjugaison (-ēre): -eo, -es, -et, -emus, -etis, -ent (ex: moneo, mones, monet, monemus, monetis, monent)
- 3ème conjugaison (-ere): -o, -is, -it, -imus, -itis, -unt (ex: duco, ducis, ducit, ducimus, ducitis, ducunt)
- 3ème conjugaison mixte: -io, -is, -it, -imus, -itis, -iunt (ex: capio, capis, capit, capimus, capitis, capiunt)
- 4ème conjugaison (-ire): -io, -is, -it, -imus, -itis, -iunt (ex: audio, audis, audit, audimus, auditis, audiunt)
- esse (être): sum, es, est, sumus, estis, sunt`,

  imperfect: `IMPARFAIT DE L'INDICATIF (Infectum):
- 1ère conjugaison: radical + -abam, -abas, -abat, -abamus, -abatis, -abant (ex: amabam, amabas, amabat...)
- 2ème conjugaison: radical + -ebam, -ebas, -ebat, -ebamus, -ebatis, -ebant (ex: monebam, monebas...)
- 3ème conjugaison: radical + -ebam, -ebas, -ebat, -ebamus, -ebatis, -ebant (ex: ducebam, ducebas...)
- 3ème conjugaison mixte: radical + -iebam, -iebas, -iebat, -iebamus, -iebatis, -iebant (ex: capiebam...)
- 4ème conjugaison: radical + -iebam, -iebas, -iebat, -iebamus, -iebatis, -iebant (ex: audiebam...)
- esse: eram, eras, erat, eramus, eratis, erant`,

  future: `FUTUR SIMPLE DE L'INDICATIF (Infectum):
- 1ère conjugaison: radical + -abo, -abis, -abit, -abimus, -abitis, -abunt (ex: amabo, amabis, amabit...)
- 2ème conjugaison: radical + -ebo, -ebis, -ebit, -ebimus, -ebitis, -ebunt (ex: monebo, monebis...)
- 3ème conjugaison: radical + -am, -es, -et, -emus, -etis, -ent (ex: ducam, duces, ducet...)
- 3ème conjugaison mixte: radical + -iam, -ies, -iet, -iemus, -ietis, -ient (ex: capiam, capies...)
- 4ème conjugaison: radical + -iam, -ies, -iet, -iemus, -ietis, -ient (ex: audiam, audies...)
- esse: ero, eris, erit, erimus, eritis, erunt`,

  // Perfectum tenses
  perfect: `PARFAIT DE L'INDICATIF (Perfectum):
Formation: radical du parfait + terminaisons -i, -isti, -it, -imus, -istis, -erunt
- 1ère conjugaison: amav- + terminaisons (ex: amavi, amavisti, amavit, amavimus, amavistis, amaverunt)
- 2ème conjugaison: monu- + terminaisons (ex: monui, monuisti, monuit...)
- 3ème conjugaison: dux- + terminaisons (ex: duxi, duxisti, duxit...)
- 4ème conjugaison: audiv- + terminaisons (ex: audivi, audivisti, audivit...)
- esse: fui, fuisti, fuit, fuimus, fuistis, fuerunt`,

  pluperfect: `PLUS-QUE-PARFAIT DE L'INDICATIF (Perfectum):
Formation: radical du parfait + -eram, -eras, -erat, -eramus, -eratis, -erant
- 1ère conjugaison: amav- + terminaisons (ex: amaveram, amaveras, amaverat...)
- 2ème conjugaison: monu- + terminaisons (ex: monueram, monueras...)
- 3ème conjugaison: dux- + terminaisons (ex: duxeram, duxeras...)
- 4ème conjugaison: audiv- + terminaisons (ex: audiveram, audiveras...)
- esse: fueram, fueras, fuerat, fueramus, fueratis, fuerant`,

  futurePerfect: `FUTUR ANTÉRIEUR DE L'INDICATIF (Perfectum):
Formation: radical du parfait + -ero, -eris, -erit, -erimus, -eritis, -erint
- 1ère conjugaison: amav- + terminaisons (ex: amavero, amaveris, amaverit...)
- 2ème conjugaison: monu- + terminaisons (ex: monuero, monueris...)
- 3ème conjugaison: dux- + terminaisons (ex: duxero, duxeris...)
- 4ème conjugaison: audiv- + terminaisons (ex: audivero, audiveris...)
- esse: fuero, fueris, fuerit, fuerimus, fueritis, fuerint`
}

const TENSE_LABELS: Record<string, string> = {
  present: "présent",
  imperfect: "imparfait",
  future: "futur simple",
  perfect: "parfait",
  pluperfect: "plus-que-parfait",
  futurePerfect: "futur antérieur"
}

export async function POST(request: Request) {
  try {
    const { count, categories, difficulty, tense = "present" } = await request.json()

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
    const tenseInstruction = TENSE_INSTRUCTIONS[tense] || TENSE_INSTRUCTIONS.present
    const tenseLabel = TENSE_LABELS[tense] || "présent"

    const prompt = `Tu es un expert en latin classique. Génère exactement ${count} verbes latins pour un exercice de conjugaison au ${tenseLabel}.

CATÉGORIES DEMANDÉES: ${categoryDescriptions}

TEMPS DEMANDÉ: ${tenseLabel.toUpperCase()}

${tenseInstruction}

EXIGENCES:
- Génère UNIQUEMENT des verbes des catégories suivantes: ${categories.join(", ")}
- Répartis les verbes de manière équilibrée entre les catégories demandées
- ${difficulty === "beginner" ? "Privilégie les verbes courants" : "Inclus des verbes variés"}
- Pour chaque verbe, fournis:
  * Les temps primitifs (1ère pers. sing., 2ème pers. sing., infinitif)
  * Le radical du parfait (pour les temps du perfectum)
  * Le sens en français
  * Le type de conjugaison
  * Les 6 formes CONJUGUÉES au ${tenseLabel} (ego, tu, is/ea/id, nos, vos, ei/eae/ea)
  * Si c'est un composé
  * La catégorie exacte (1, 2, 3, 3-io, 4, compound, irregular)

IMPORTANT: Les formes conjuguées doivent être au ${tenseLabel}, PAS au présent (sauf si le temps demandé est le présent).

Assure-toi que les conjugaisons sont EXACTES et conformes à la grammaire latine classique.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: VerbSchema,
      prompt,
    })

    // Map the response to include the conjugation in the expected format
    const verbs = object.verbs.map(verb => ({
      ...verb,
      // Store the conjugated forms under a generic key that the exercise component will use
      [`${tense}Conjugation`]: verb.conjugatedForms,
    }))

    return Response.json({ verbs, tense })
  } catch (error) {
    console.error("Verb generation error:", error)
    return Response.json({ error: "Failed to generate verbs" }, { status: 500 })
  }
}
