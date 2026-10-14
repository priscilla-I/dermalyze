import { IngredientDetail } from '../types';

export const INGREDIENT_KNOWLEDGE_BASE: Record<string, Partial<IngredientDetail>> = {
  // Actives & Exfoliants
  "retinol": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Cellular renewal, collagen production, anti-aging",
    isToxicOrIrritant: false,
    concernNote: "Causes UV sensitivity; use only in PM routine and always follow with SPF."
  },
  "retinoid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Advanced anti-acne and anti-aging cell regulator",
    isToxicOrIrritant: false,
    concernNote: "Do not mix with strong AHAs or Benzoyl Peroxide in same application."
  },
  "salicylic acid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "BHA exfoliant, unclogs pores, anti-inflammatory",
    isToxicOrIrritant: false,
    concernNote: "May cause dryness if overused; avoid stacking with pure L-Ascorbic Acid."
  },
  "glycolic acid": {
    comedogenicRating: 0,
    ewgScore: 2,
    fungalAcneSafe: true,
    purpose: "AHA chemical peel, texture smoothing, hyperpigmentation",
    isToxicOrIrritant: false,
    concernNote: "Increases sun sensitivity; always wear high-spectrum SPF."
  },
  "lactic acid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Gentle AHA exfoliation and surface hydration",
    isToxicOrIrritant: false
  },
  "benzoyl peroxide": {
    comedogenicRating: 0,
    ewgScore: 2,
    fungalAcneSafe: true,
    purpose: "Antibacterial P. acnes eradication",
    isToxicOrIrritant: false,
    concernNote: "Can bleach fabrics and inactivate unbuffered Retinol if applied simultaneously."
  },
  "ascorbic acid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Pure Vitamin C antioxidant, brightening, photo-protection",
    isToxicOrIrritant: false,
    concernNote: "Low pH may sting compromised skin barriers. Store away from heat/light."
  },
  "vitamin c": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Antioxidant shield against environmental free radicals",
    isToxicOrIrritant: false
  },
  "niacinamide": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Barrier repair, sebum control, pore tightening, redness reduction",
    isToxicOrIrritant: false
  },
  "hyaluronic acid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Intense moisture binding (holds 1000x weight in water)",
    isToxicOrIrritant: false
  },
  "ceramides": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Lipid barrier fortification and hydration lock",
    isToxicOrIrritant: false
  },
  "centella asiatica": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Soothing cica, wound healing, redness suppression",
    isToxicOrIrritant: false
  },
  "snail secretion filtrate": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Deep mucin hydration, skin repair, elasticity boost",
    isToxicOrIrritant: false
  },
  "squalane": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Biomimetic lightweight oil, barrier softner",
    isToxicOrIrritant: false
  },
  "zinc oxide": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Broad-spectrum physical mineral UV filter, anti-inflammatory",
    isToxicOrIrritant: false
  },
  "titanium dioxide": {
    comedogenicRating: 0,
    ewgScore: 2,
    fungalAcneSafe: true,
    purpose: "Physical UV reflector and pigment base",
    isToxicOrIrritant: false
  },
  "azelaic acid": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Rosacea treatment, melasma fading, anti-inflammatory",
    isToxicOrIrritant: false
  },
  "peptides": {
    comedogenicRating: 0,
    ewgScore: 1,
    fungalAcneSafe: true,
    purpose: "Collagen signaling, skin firmness, matrix elasticity",
    isToxicOrIrritant: false
  },

  // High Comedogenic & Irritating Ingredients
  "coconut oil": {
    comedogenicRating: 4,
    ewgScore: 1,
    fungalAcneSafe: false,
    purpose: "Occlusive emollient",
    isToxicOrIrritant: false,
    concernNote: "Very high comedogenic rating (4/5); strictly avoid on acne-prone facial skin."
  },
  "isopropyl myristate": {
    comedogenicRating: 5,
    ewgScore: 2,
    fungalAcneSafe: true,
    purpose: "Texture enhancer and penetration booster",
    isToxicOrIrritant: false,
    concernNote: "Severe pore-clogging potential (5/5 rating). Triggers rapid comedones."
  },
  "isopropyl palmitate": {
    comedogenicRating: 4,
    ewgScore: 2,
    fungalAcneSafe: false,
    purpose: "Thickening emollient",
    isToxicOrIrritant: false,
    concernNote: "High pore clogging index (4/5). Often causes blackheads."
  },
  "algae extract": {
    comedogenicRating: 5,
    ewgScore: 2,
    fungalAcneSafe: true,
    purpose: "Mineral moisturizer",
    isToxicOrIrritant: false,
    concernNote: "Can be severely comedogenic (5/5) in concentrated amounts."
  },
  "ethylhexyl palmitate": {
    comedogenicRating: 4,
    ewgScore: 1,
    fungalAcneSafe: false,
    purpose: "Silky emollient",
    isToxicOrIrritant: false,
    concernNote: "Known to clog pores and trigger fungal acne proliferation."
  },
  "parabens": {
    comedogenicRating: 0,
    ewgScore: 6,
    fungalAcneSafe: true,
    purpose: "Synthetic antimicrobial preservative",
    isToxicOrIrritant: true,
    concernNote: "Potential endocrine disruptor; strongly flagged by clean beauty standards."
  },
  "methylparaben": {
    comedogenicRating: 0,
    ewgScore: 4,
    fungalAcneSafe: true,
    purpose: "Preservative",
    isToxicOrIrritant: true,
    concernNote: "Allergenic potential and preservative flag."
  },
  "propylparaben": {
    comedogenicRating: 0,
    ewgScore: 7,
    fungalAcneSafe: true,
    purpose: "Preservative",
    isToxicOrIrritant: true,
    concernNote: "High hazard rating for hormone mimicry."
  },
  "sodium lauryl sulfate": {
    comedogenicRating: 3,
    ewgScore: 5,
    fungalAcneSafe: true,
    purpose: "Harsh surfactant and foaming agent",
    isToxicOrIrritant: true,
    concernNote: "Strips natural skin lipid barrier; causes trans-epidermal water loss."
  },
  "sls": {
    comedogenicRating: 3,
    ewgScore: 5,
    fungalAcneSafe: true,
    purpose: "Aggressive foaming surfactant",
    isToxicOrIrritant: true,
    concernNote: "Disrupts acid mantle; high irritation trigger."
  },
  "synthetic fragrance": {
    comedogenicRating: 0,
    ewgScore: 8,
    fungalAcneSafe: true,
    purpose: "Olfactory masking agent",
    isToxicOrIrritant: true,
    concernNote: "#1 cause of contact dermatitis and allergic skin reactions."
  },
  "parfum": {
    comedogenicRating: 0,
    ewgScore: 8,
    fungalAcneSafe: true,
    purpose: "Fragrance blend",
    isToxicOrIrritant: true,
    concernNote: "Undisclosed chemical blend; high allergen risk."
  },
  "denatured alcohol": {
    comedogenicRating: 0,
    ewgScore: 4,
    fungalAcneSafe: true,
    purpose: "Solvent, quick-dry matting agent",
    isToxicOrIrritant: true,
    concernNote: "Dehydrates cells and destroys long-term barrier resilience."
  },
  "phthalates": {
    comedogenicRating: 0,
    ewgScore: 8,
    fungalAcneSafe: true,
    purpose: "Plasticizer and fragrance stabilizer",
    isToxicOrIrritant: true,
    concernNote: "Endocrine disruptor; banned in EU cosmetics."
  },
  "oxybenzone": {
    comedogenicRating: 0,
    ewgScore: 8,
    fungalAcneSafe: true,
    purpose: "Chemical UV absorber",
    isToxicOrIrritant: true,
    concernNote: "High skin allergen; harms aquatic coral reefs."
  }
};

/**
 * Normalizes and analyzes a list of ingredient strings
 */
export function analyzeIngredientList(ingredients: string[]): IngredientDetail[] {
  return ingredients.map((raw) => {
    const clean = raw.trim().toLowerCase();
    
    // Look up direct or partial match
    let matchKey = Object.keys(INGREDIENT_KNOWLEDGE_BASE).find(
      key => clean === key || clean.includes(key) || key.includes(clean)
    );

    if (matchKey && INGREDIENT_KNOWLEDGE_BASE[matchKey]) {
      const match = INGREDIENT_KNOWLEDGE_BASE[matchKey];
      return {
        name: raw.trim(),
        comedogenicRating: match.comedogenicRating ?? 0,
        ewgScore: match.ewgScore ?? 1,
        fungalAcneSafe: match.fungalAcneSafe ?? true,
        purpose: match.purpose || "Skin conditioning agent",
        isToxicOrIrritant: match.isToxicOrIrritant ?? false,
        concernNote: match.concernNote
      };
    }

    // Heuristics for unknown ingredients
    const isFragrance = /fragrance|parfum|aroma|limonene|linalool|citronellol|geraniol/i.test(clean);
    const isParaben = /paraben/i.test(clean);
    const isSulfate = /sulfate|sulphate/i.test(clean);
    const isAlcohol = /alcohol denat|denatured alcohol|sd alcohol/i.test(clean);
    const isHeavyOil = /oil|butter|triglyceride/i.test(clean) && !/tea tree|jojoba|squalane/i.test(clean);

    const isToxicOrIrritant = isFragrance || isParaben || isSulfate || isAlcohol;

    return {
      name: raw.trim(),
      comedogenicRating: isHeavyOil ? 3 : 0,
      ewgScore: isToxicOrIrritant ? 5 : 1,
      fungalAcneSafe: !isHeavyOil,
      purpose: isFragrance ? "Fragrance" : isParaben ? "Preservative" : isSulfate ? "Surfactant" : "Skin conditioning",
      isToxicOrIrritant,
      concernNote: isToxicOrIrritant ? "Flagged for potential skin irritation or sensitivity." : undefined
    };
  });
}

/**
 * Calculates average comedogenic score (0-5)
 */
export function getAverageComedogenicScore(details: IngredientDetail[]): number {
  if (!details.length) return 0;
  const maxScore = Math.max(...details.map(d => d.comedogenicRating));
  return maxScore;
}
