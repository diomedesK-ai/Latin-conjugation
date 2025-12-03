import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const PrepositionSchema = z.object({
  questions: z.array(
    z.object({
      preposition: z.string().describe("La préposition latine (ex: ad, cum, in)"),
      meaning: z.string().describe("Sens en français"),
      correctCase: z.enum(["accusative", "ablative"]).describe("Le cas régit par cette préposition"),
      exampleSentence: z.string().describe("Un exemple d'utilisation en latin avec traduction"),
      notes: z.string().optional().describe("Note grammaticale optionnelle"),
    }),
  ),
})

const CASE_INSTRUCTIONS: Record<string, string> = {
  accusative: `PRÉPOSITIONS RÉGISSANT L'ACCUSATIF:
- ad: vers, à, près de (ad urbem - vers la ville)
- ante: avant, devant (ante templum - devant le temple)
- apud: chez, auprès de (apud Caesarem - chez César)
- circa: autour de, environ (circa forum - autour du forum)
- contra: contre (contra hostes - contre les ennemis)
- inter: entre, parmi (inter amicos - entre amis)
- ob: à cause de (ob causam - à cause de)
- per: à travers, par (per silvam - à travers la forêt)
- post: après, derrière (post bellum - après la guerre)
- praeter: devant, au-delà de, sauf (praeter castra - devant le camp)
- propter: à cause de (propter metum - à cause de la peur)
- trans: au-delà de (trans Alpes - au-delà des Alpes)
- ultra: au-delà de (ultra fines - au-delà des frontières)`,

  ablative: `PRÉPOSITIONS RÉGISSANT L'ABLATIF:
- a/ab: de, par (ab urbe - de la ville) - ab devant voyelle
- cum: avec (cum amicis - avec les amis)
- de: de, au sujet de (de bello - au sujet de la guerre)
- e/ex: hors de, de (ex urbe - hors de la ville) - ex devant voyelle
- prae: devant, à cause de (prae metu - à cause de la peur)
- pro: pour, devant (pro patria - pour la patrie)
- sine: sans (sine aqua - sans eau)
- coram: en présence de (coram populo - en présence du peuple)`,

  both: `PRÉPOSITIONS À DOUBLE RÉGIME (Accusatif OU Ablatif):
- in: + acc = mouvement vers (in urbem - vers la ville), + abl = lieu où l'on est (in urbe - dans la ville)
- sub: + acc = mouvement vers le bas (sub montem - vers le pied de la montagne), + abl = lieu (sub terra - sous la terre)
- super: sur, au-dessus de (peut régir les deux cas selon le sens)

RÈGLE GÉNÉRALE:
- Accusatif = mouvement, direction vers
- Ablatif = lieu statique, position, moyen`
}

export async function POST(request: Request) {
  try {
    const { count, caseType } = await request.json()

    let instruction = ""
    let targetCases = ""
    
    if (caseType === "accusative") {
      instruction = CASE_INSTRUCTIONS.accusative
      targetCases = "UNIQUEMENT des prépositions régissant l'ACCUSATIF"
    } else if (caseType === "ablative") {
      instruction = CASE_INSTRUCTIONS.ablative
      targetCases = "UNIQUEMENT des prépositions régissant l'ABLATIF"
    } else {
      instruction = `${CASE_INSTRUCTIONS.both}\n\n${CASE_INSTRUCTIONS.accusative}\n\n${CASE_INSTRUCTIONS.ablative}`
      targetCases = "un MÉLANGE de prépositions (accusatif, ablatif, et à double régime). Pour les prépositions à double régime (in, sub), choisis aléatoirement si la bonne réponse est accusatif ou ablatif"
    }

    const prompt = `Tu es un expert en latin classique. Génère exactement ${count} questions sur les prépositions latines.

${instruction}

EXIGENCES:
- Génère ${targetCases}
- Varie les prépositions (ne répète pas la même)
- Pour chaque question, fournis:
  * La préposition latine
  * Son sens en français
  * Le cas qu'elle régit (accusative ou ablative)
  * Un exemple d'utilisation en latin avec sa traduction française
  * Une note grammaticale optionnelle (astuce pour se souvenir)

${caseType === "both" ? `
IMPORTANT pour le mode "mixte":
- Pour "in" et "sub", indique SOIT accusatif SOIT ablatif selon l'exemple que tu donnes
- Si l'exemple montre un mouvement: correctCase = "accusative"
- Si l'exemple montre un lieu statique: correctCase = "ablative"
` : ""}

L'objectif est de tester si l'étudiant sait quel cas utiliser avec chaque préposition.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: PrepositionSchema,
      prompt,
    })

    return Response.json({ questions: object.questions, caseType })
  } catch (error) {
    console.error("Preposition generation error:", error)
    return Response.json({ error: "Failed to generate prepositions" }, { status: 500 })
  }
}

