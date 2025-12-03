import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const TranslationSchema = z.object({
  words: z.array(
    z.object({
      sourceWord: z.string().describe("Le mot source à traduire"),
      targetWord: z.string().describe("La traduction correcte"),
      hint: z.string().optional().describe("Un indice grammatical ou contextuel"),
      category: z.string().describe("Catégorie: nom, verbe, adjectif, etc."),
      exampleSentence: z.string().optional().describe("Exemple d'utilisation"),
    }),
  ),
})

export async function POST(request: Request) {
  try {
    const { count, direction } = await request.json()

    const isFrToLa = direction === "fr-la"
    const sourceLabel = isFrToLa ? "français" : "latin"
    const targetLabel = isFrToLa ? "latin" : "français"

    const prompt = `Tu es un expert en latin classique et en enseignement du vocabulaire latin.

Génère exactement ${count} mots de vocabulaire pour un exercice de traduction du ${sourceLabel} vers le ${targetLabel}.

EXIGENCES:
- Varie les catégories de mots (noms, verbes, adjectifs, prépositions)
- Inclus des mots de difficulté variée (débutant à intermédiaire)
- Pour chaque mot, fournis:
  * Le mot source (en ${sourceLabel})
  * La traduction correcte (en ${targetLabel})
  * Un indice grammatical optionnel (genre, déclinaison, conjugaison)
  * La catégorie grammaticale
  * Un exemple d'utilisation optionnel

EXEMPLES DE VOCABULAIRE:
${isFrToLa ? `
- eau → aqua (nom féminin, 1ère déclinaison)
- aimer → amare (verbe, 1ère conjugaison)
- grand → magnus (adjectif, bonus type)
- guerre → bellum (nom neutre, 2ème déclinaison)
- roi → rex (nom masculin, 3ème déclinaison)
- avec → cum (préposition + ablatif)
` : `
- aqua → eau (nom féminin)
- amare → aimer (verbe)
- magnus → grand (adjectif)
- bellum → guerre (nom neutre)
- rex → roi (nom masculin)
- cum → avec (préposition)
`}

Assure-toi que les traductions sont exactes et adaptées au niveau d'un étudiant de latin.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: TranslationSchema,
      prompt,
    })

    return Response.json({ words: object.words, direction })
  } catch (error) {
    console.error("Translation generation error:", error)
    return Response.json({ error: "Failed to generate translations" }, { status: 500 })
  }
}

