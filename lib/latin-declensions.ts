// Declension types
export type DeclensionNumber = "1" | "2" | "3"
export type DeclensionCase = "nominative" | "vocative" | "accusative" | "genitive" | "dative" | "ablative"
export type DeclensionNumber2 = "singular" | "plural"

export type LatinNoun = {
  nominativeSingular: string
  genitiveSingular: string
  gender: "masculine" | "feminine" | "neuter"
  meaning: string
  declension: DeclensionNumber
  // Full declension table
  singular: {
    nominative: string
    vocative: string
    accusative: string
    genitive: string
    dative: string
    ablative: string
  }
  plural: {
    nominative: string
    vocative: string
    accusative: string
    genitive: string
    dative: string
    ablative: string
  }
}

// Case metadata for UI
export const CASE_INFO = {
  nominative: {
    label: "Nominatif",
    abbrev: "N",
    description: "Sujet du verbe",
    question: "Qui ? Quoi ?"
  },
  vocative: {
    label: "Vocatif",
    abbrev: "V",
    description: "Interpellation",
    question: "Ô... !"
  },
  accusative: {
    label: "Accusatif",
    abbrev: "Ac",
    description: "COD",
    question: "Qui ? Quoi ? (complément)"
  },
  genitive: {
    label: "Génitif",
    abbrev: "G",
    description: "Complément du nom",
    question: "De qui ? De quoi ?"
  },
  dative: {
    label: "Datif",
    abbrev: "D",
    description: "COI / Attribution",
    question: "À qui ? À quoi ?"
  },
  ablative: {
    label: "Ablatif",
    abbrev: "Ab",
    description: "Complément circonstanciel",
    question: "Par, avec, dans..."
  }
}

// Declension metadata for UI
export const DECLENSION_INFO = {
  "1": {
    label: "1ère déclinaison",
    description: "Noms féminins en -a",
    theme: "rosa, rosae",
    endings: {
      singular: { nominative: "-a", vocative: "-a", accusative: "-am", genitive: "-ae", dative: "-ae", ablative: "-ā" },
      plural: { nominative: "-ae", vocative: "-ae", accusative: "-as", genitive: "-arum", dative: "-is", ablative: "-is" }
    },
    examples: ["rosa (rose)", "aqua (eau)", "terra (terre)", "puella (fille)"]
  },
  "2": {
    label: "2ème déclinaison",
    description: "Noms masculins en -us/-er, neutres en -um",
    theme: "dominus, domini",
    endings: {
      singular: { nominative: "-us", vocative: "-e", accusative: "-um", genitive: "-i", dative: "-o", ablative: "-o" },
      plural: { nominative: "-i", vocative: "-i", accusative: "-os", genitive: "-orum", dative: "-is", ablative: "-is" }
    },
    examples: ["dominus (maître)", "servus (esclave)", "ager (champ)", "templum (temple)"]
  },
  "3": {
    label: "3ème déclinaison",
    description: "Noms à thèmes variés",
    theme: "rex, regis",
    endings: {
      singular: { nominative: "-", vocative: "-", accusative: "-em", genitive: "-is", dative: "-i", ablative: "-e" },
      plural: { nominative: "-es", vocative: "-es", accusative: "-es", genitive: "-um/-ium", dative: "-ibus", ablative: "-ibus" }
    },
    examples: ["rex (roi)", "lex (loi)", "miles (soldat)", "nomen (nom)"]
  }
}

// All 6 cases in order
export const CASES_ORDER: DeclensionCase[] = [
  "nominative",
  "vocative", 
  "accusative",
  "genitive",
  "dative",
  "ablative"
]

// Helper to get case label
export function getCaseLabel(caseType: DeclensionCase): string {
  return CASE_INFO[caseType].label
}

// Helper to get case abbreviation
export function getCaseAbbrev(caseType: DeclensionCase): string {
  return CASE_INFO[caseType].abbrev
}

// Sample nouns (used as fallback)
export const SAMPLE_NOUNS: LatinNoun[] = [
  {
    nominativeSingular: "rosa",
    genitiveSingular: "rosae",
    gender: "feminine",
    meaning: "la rose",
    declension: "1",
    singular: {
      nominative: "rosa",
      vocative: "rosa",
      accusative: "rosam",
      genitive: "rosae",
      dative: "rosae",
      ablative: "rosā"
    },
    plural: {
      nominative: "rosae",
      vocative: "rosae",
      accusative: "rosas",
      genitive: "rosarum",
      dative: "rosis",
      ablative: "rosis"
    }
  },
  {
    nominativeSingular: "dominus",
    genitiveSingular: "domini",
    gender: "masculine",
    meaning: "le maître",
    declension: "2",
    singular: {
      nominative: "dominus",
      vocative: "domine",
      accusative: "dominum",
      genitive: "domini",
      dative: "domino",
      ablative: "domino"
    },
    plural: {
      nominative: "domini",
      vocative: "domini",
      accusative: "dominos",
      genitive: "dominorum",
      dative: "dominis",
      ablative: "dominis"
    }
  },
  {
    nominativeSingular: "rex",
    genitiveSingular: "regis",
    gender: "masculine",
    meaning: "le roi",
    declension: "3",
    singular: {
      nominative: "rex",
      vocative: "rex",
      accusative: "regem",
      genitive: "regis",
      dative: "regi",
      ablative: "rege"
    },
    plural: {
      nominative: "reges",
      vocative: "reges",
      accusative: "reges",
      genitive: "regum",
      dative: "regibus",
      ablative: "regibus"
    }
  }
]

