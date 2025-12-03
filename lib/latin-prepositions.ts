// Preposition types
export type PrepositionCase = "accusative" | "ablative" | "both"

export type LatinPreposition = {
  preposition: string
  case: PrepositionCase
  meaning: string
  examples: string[]
  notes?: string
}

// Preposition metadata for UI
export const PREPOSITION_INFO = {
  accusative: {
    label: "Accusatif",
    description: "Prépositions régissant l'accusatif",
    theme: "light" as const,
    color: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  ablative: {
    label: "Ablatif",
    description: "Prépositions régissant l'ablatif",
    theme: "dark" as const,
    color: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300"
  },
  both: {
    label: "Accusatif & Ablatif",
    description: "Prépositions à double régime",
    theme: "gradient" as const,
    color: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
    textColor: "text-gray-700 dark:text-gray-300"
  }
}

// All prepositions with their cases
export const LATIN_PREPOSITIONS: LatinPreposition[] = [
  // Accusative prepositions
  {
    preposition: "ad",
    case: "accusative",
    meaning: "vers, à, près de",
    examples: ["ad urbem (vers la ville)", "ad flumen (près du fleuve)"],
    notes: "Mouvement vers"
  },
  {
    preposition: "ante",
    case: "accusative",
    meaning: "avant, devant",
    examples: ["ante templum (devant le temple)", "ante bellum (avant la guerre)"]
  },
  {
    preposition: "apud",
    case: "accusative",
    meaning: "chez, auprès de",
    examples: ["apud Caesarem (chez César)", "apud Romanos (chez les Romains)"]
  },
  {
    preposition: "circa",
    case: "accusative",
    meaning: "autour de, environ",
    examples: ["circa forum (autour du forum)", "circa meridiem (vers midi)"]
  },
  {
    preposition: "contra",
    case: "accusative",
    meaning: "contre, en face de",
    examples: ["contra hostes (contre les ennemis)", "contra legem (contre la loi)"]
  },
  {
    preposition: "inter",
    case: "accusative",
    meaning: "entre, parmi",
    examples: ["inter amicos (entre amis)", "inter bella (parmi les guerres)"]
  },
  {
    preposition: "ob",
    case: "accusative",
    meaning: "à cause de, devant",
    examples: ["ob causam (à cause de)", "ob oculos (devant les yeux)"]
  },
  {
    preposition: "per",
    case: "accusative",
    meaning: "à travers, par",
    examples: ["per silvam (à travers la forêt)", "per deos (par les dieux)"]
  },
  {
    preposition: "post",
    case: "accusative",
    meaning: "après, derrière",
    examples: ["post bellum (après la guerre)", "post tergum (derrière le dos)"]
  },
  {
    preposition: "praeter",
    case: "accusative",
    meaning: "devant, au-delà de, sauf",
    examples: ["praeter castra (devant le camp)", "praeter spem (au-delà de l'espoir)"]
  },
  {
    preposition: "propter",
    case: "accusative",
    meaning: "à cause de, près de",
    examples: ["propter metum (à cause de la peur)", "propter viam (près du chemin)"]
  },
  {
    preposition: "trans",
    case: "accusative",
    meaning: "au-delà de, à travers",
    examples: ["trans Alpes (au-delà des Alpes)", "trans flumen (au-delà du fleuve)"]
  },
  {
    preposition: "ultra",
    case: "accusative",
    meaning: "au-delà de",
    examples: ["ultra fines (au-delà des frontières)", "ultra modum (au-delà de la mesure)"]
  },

  // Ablative prepositions
  {
    preposition: "a/ab",
    case: "ablative",
    meaning: "de, par (agent)",
    examples: ["ab urbe (de la ville)", "a patre (par le père)"],
    notes: "ab devant voyelle"
  },
  {
    preposition: "cum",
    case: "ablative",
    meaning: "avec",
    examples: ["cum amicis (avec les amis)", "cum gladio (avec l'épée)"]
  },
  {
    preposition: "de",
    case: "ablative",
    meaning: "de, au sujet de",
    examples: ["de monte (du mont)", "de bello (au sujet de la guerre)"]
  },
  {
    preposition: "e/ex",
    case: "ablative",
    meaning: "hors de, de",
    examples: ["ex urbe (hors de la ville)", "e castris (du camp)"],
    notes: "ex devant voyelle"
  },
  {
    preposition: "prae",
    case: "ablative",
    meaning: "devant, à cause de",
    examples: ["prae metu (à cause de la peur)", "prae gaudio (de joie)"]
  },
  {
    preposition: "pro",
    case: "ablative",
    meaning: "pour, devant, en faveur de",
    examples: ["pro patria (pour la patrie)", "pro castris (devant le camp)"]
  },
  {
    preposition: "sine",
    case: "ablative",
    meaning: "sans",
    examples: ["sine aqua (sans eau)", "sine dubio (sans doute)"]
  },
  {
    preposition: "coram",
    case: "ablative",
    meaning: "en présence de",
    examples: ["coram populo (en présence du peuple)", "coram iudice (devant le juge)"]
  },

  // Both cases (accusative for motion, ablative for location)
  {
    preposition: "in",
    case: "both",
    meaning: "dans, sur (+ abl: lieu où l'on est / + acc: lieu où l'on va)",
    examples: ["in urbe (dans la ville - abl)", "in urbem (vers la ville - acc)"],
    notes: "Accusatif = mouvement, Ablatif = lieu"
  },
  {
    preposition: "sub",
    case: "both",
    meaning: "sous (+ abl: lieu / + acc: mouvement)",
    examples: ["sub terra (sous la terre - abl)", "sub montem (vers le pied de la montagne - acc)"],
    notes: "Accusatif = mouvement, Ablatif = lieu"
  },
  {
    preposition: "super",
    case: "both",
    meaning: "sur, au-dessus de",
    examples: ["super terram (sur la terre)", "super his rebus (au sujet de ces choses)"],
    notes: "Accusatif plus fréquent"
  }
]

// Get prepositions by case
export function getPrepositionsByCase(caseType: PrepositionCase): LatinPreposition[] {
  return LATIN_PREPOSITIONS.filter(p => p.case === caseType)
}

// Get all accusative prepositions
export function getAccusativePrepositions(): LatinPreposition[] {
  return LATIN_PREPOSITIONS.filter(p => p.case === "accusative" || p.case === "both")
}

// Get all ablative prepositions
export function getAblativePrepositions(): LatinPreposition[] {
  return LATIN_PREPOSITIONS.filter(p => p.case === "ablative" || p.case === "both")
}

