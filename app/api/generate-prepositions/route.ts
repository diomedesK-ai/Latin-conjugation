import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const PrepositionSchema = z.object({
  questions: z.array(
    z.object({
      sentence: z.string().describe("Phrase latine avec ___ pour la place du nom à décliner"),
      preposition: z.string().describe("La préposition utilisée dans la phrase"),
      nounNominative: z.string().describe("Le nom au nominatif singulier"),
      nounGenitive: z.string().describe("Le nom au génitif singulier"),
      correctForm: z.string().describe("La forme correctement déclinée du nom"),
      correctCase: z.string().describe("Le cas grammatical requis par la préposition"),
      translation: z.string().describe("Traduction française de la phrase"),
    })
  ),
})

export async function POST(request: Request) {
  try {
    const { count } = await request.json()

    const prompt = `Tu es un expert en latin classique. Génère exactement ${count} exercices sur les prépositions latines.

Pour chaque exercice, tu dois :
1. Choisir une préposition latine (ad, ab, in, ex, cum, contra, per, sine, super, etc.)
2. Créer une phrase latine qui MONTRE LA PRÉPOSITION et utilise ___ pour le nom à décliner
3. Indiquer un nom entre parenthèses (nominatif, génitif) qui doit être décliné
4. Fournir la forme correctement déclinée selon le cas requis par la préposition
5. Indiquer quel cas grammatical est requis
6. Donner la traduction française

EXEMPLES DE FORMAT ATTENDU (LA PRÉPOSITION DOIT ÊTRE VISIBLE):

1. Phrase: "Miles pugnat contra ___"
   Préposition: "contra"
   Nom: "hostis, hostis" (ennemi)
   Forme correcte: "hostes"
   Cas requis: "accusatif"
   Traduction: "Le soldat combat contre les ennemis"

2. Phrase: "Regina venit cum ___"
   Préposition: "cum"
   Nom: "amica, amicae" (amie)
   Forme correcte: "amica"
   Cas requis: "ablatif"
   Traduction: "La reine vient avec l'amie"

3. Phrase: "Servus currit ad ___"
   Préposition: "ad"
   Nom: "domus, domus" (maison)
   Forme correcte: "domum"
   Cas requis: "accusatif"
   Traduction: "L'esclave court vers la maison"

4. Phrase: "Canis saltat super ___"
   Préposition: "super"
   Nom: "mensa, mensae" (table)
   Forme correcte: "mensam"
   Cas requis: "accusatif"
   Traduction: "Le chien saute par-dessus la table"

RÈGLES IMPORTANTES:
- Varie les prépositions (ad, ab/a, in, ex/e, cum, contra, per, sine, sub, super, etc.)
- Certaines prépositions régissent l'accusatif (ad, ante, apud, circa, contra, inter, per, post, super, etc.)
- D'autres régissent l'ablatif (ab/a, cum, de, ex/e, sine, pro, etc.)
- "in" et "sub" peuvent régir les deux cas selon le sens (mouvement = acc, lieu = abl)
- Utilise des noms de différentes déclinaisons
- Les phrases doivent être grammaticalement correctes et naturelles
- TRÈS IMPORTANT: Dans "sentence", la PRÉPOSITION doit être VISIBLE dans la phrase, et ___ marque où le NOM DÉCLINÉ doit être placé
- Format: "Verbe + PRÉPOSITION + ___" (ex: "currit ad ___", PAS "currit ___ domum")
- Assure-toi que la forme déclinée soit correcte selon la déclinaison du nom

Génère ${count} exercices variés et pédagogiques où la préposition est TOUJOURS visible dans la phrase.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: PrepositionSchema,
      prompt,
    })

    return Response.json({ questions: object.questions })
  } catch (error) {
    console.error("Preposition generation error:", error)
    return Response.json({ error: "Failed to generate preposition questions" }, { status: 500 })
  }
}
