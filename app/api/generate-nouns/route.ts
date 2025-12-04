import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
})

const NounSchema = z.object({
  nouns: z.array(
    z.object({
      nominativeSingular: z.string().describe("Nominatif singulier (ex: rosa)"),
      genitiveSingular: z.string().describe("Génitif singulier (ex: rosae)"),
      gender: z.enum(["masculine", "feminine", "neuter"]).describe("Genre du nom"),
      meaning: z.string().describe("Sens en français"),
      declension: z.enum(["1", "2", "3"]).describe("Numéro de la déclinaison"),
      singularForms: z.array(z.string()).length(6).describe("Les 6 formes au singulier dans l'ordre: Nominatif, Vocatif, Accusatif, Génitif, Datif, Ablatif"),
      pluralForms: z.array(z.string()).length(6).describe("Les 6 formes au pluriel dans l'ordre: Nominatif, Vocatif, Accusatif, Génitif, Datif, Ablatif"),
    }),
  ),
})

const DECLENSION_INSTRUCTIONS: Record<string, string> = {
  "1": `PREMIÈRE DÉCLINAISON (Noms féminins en -a):
Thème: rosa, rosae (la rose)
TERMINAISONS SINGULIER: -a, -a, -am, -ae, -ae, -ā
TERMINAISONS PLURIEL: -ae, -ae, -as, -arum, -is, -is
Exemples: puella (fille), aqua (eau), terra (terre), via (route), vita (vie), filia (fille), silva (forêt), lingua (langue), porta (porte), regina (reine)`,

  "2": `DEUXIÈME DÉCLINAISON (Noms masculins en -us/-er, neutres en -um):
Thème masculin: dominus, domini (le maître)
Thème neutre: templum, templi (le temple)
TERMINAISONS SINGULIER MASC: -us/-er, -e, -um, -i, -o, -o
TERMINAISONS PLURIEL MASC: -i, -i, -os, -orum, -is, -is
TERMINAISONS SINGULIER NEUTRE: -um, -um, -um, -i, -o, -o
TERMINAISONS PLURIEL NEUTRE: -a, -a, -a, -orum, -is, -is
Exemples masc: servus (esclave), filius (fils), amicus (ami), lupus (loup), equus (cheval), ager (champ), puer (enfant)
Exemples neutre: bellum (guerre), donum (don), verbum (mot), oppidum (ville), auxilium (aide)`,

  "3": `TROISIÈME DÉCLINAISON (Thèmes variés en consonne ou -i):
Thèmes consonantiques: rex, regis (le roi), miles, militis (le soldat)
Thèmes en -i: civis, civis (le citoyen), mare, maris (la mer)
TERMINAISONS SINGULIER: -, -, -em/-e(neutre), -is, -i, -e
TERMINAISONS PLURIEL: -es/-a(neutre), -es/-a, -es/-a, -um/-ium, -ibus, -ibus
Exemples: rex (roi), lex (loi), pax (paix), vox (voix), nomen (nom), corpus (corps), tempus (temps), homo (homme), virtus (vertu), urbs (ville), mons (mont)`
}

export async function POST(request: Request) {
  try {
    const { count, declension, number } = await request.json()

    const declInstruction = DECLENSION_INSTRUCTIONS[declension] || DECLENSION_INSTRUCTIONS["1"]

    const prompt = `Tu es un expert en latin classique. Génère exactement ${count} noms latins de la ${declension}ère déclinaison pour un exercice de déclinaison.

${declInstruction}

EXIGENCES:
- Génère UNIQUEMENT des noms de la ${declension}ère déclinaison
- Varie les noms (courants et moins courants)
- Pour chaque nom, fournis:
  * Le nominatif singulier
  * Le génitif singulier
  * Le genre (masculine, feminine, neuter)
  * Le sens en français
  * Le numéro de déclinaison ("${declension}")
  * Les 6 formes au SINGULIER dans cet ordre EXACT: Nominatif, Vocatif, Accusatif, Génitif, Datif, Ablatif
  * Les 6 formes au PLURIEL dans cet ordre EXACT: Nominatif, Vocatif, Accusatif, Génitif, Datif, Ablatif

TRÈS IMPORTANT: 
- L'ordre des cas est: N (Nominatif), V (Vocatif), Ac (Accusatif), G (Génitif), D (Datif), Ab (Ablatif)
- Fournis TOUTES les 12 formes (6 singulier + 6 pluriel) pour chaque nom
- Pour l'ablatif singulier de la 1ère déclinaison, utilise -ā (avec macron) si possible, sinon -a
- Pour la 2ème déclinaison neutre: les nominatif, vocatif et accusatif sont identiques au singulier (-um) et au pluriel (-a)

Assure-toi que les déclinaisons sont EXACTES et conformes à la grammaire latine classique.`

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: NounSchema,
      prompt,
    })

    return Response.json({ nouns: object.nouns, declension, number })
  } catch (error) {
    console.error("Noun generation error:", error)
    return Response.json({ error: "Failed to generate nouns" }, { status: 500 })
  }
}
