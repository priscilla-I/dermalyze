import { AnalysisResult, Rating, ShelfScanResult, BeautyAnalysisResult, NaturalRemedyResult } from '../types';

// High-aesthetic SVG mock image generators for samples
export const SAMPLE_IMAGES = {
  skinSensitiveDry: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F7D2C4"/><stop offset="100%" stop-color="%23EBB8A6"/></linearGradient></defs><rect width="400" height="300" rx="20" fill="url(%23skin)"/><circle cx="200" cy="150" r="80" fill="%23E69E8C" opacity="0.3"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="%239E4C38">Clinical Sample: Dry Sensitive Cheek</text><text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%239E4C38" opacity="0.85">Slight redness & compromised barrier</text></svg>',
  
  skinAcneProne: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="skinOily" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23E8C4B8"/><stop offset="100%" stop-color="%23D9A698"/></linearGradient></defs><rect width="400" height="300" rx="20" fill="url(%23skinOily)"/><circle cx="160" cy="130" r="12" fill="%23D9534F" opacity="0.6"/><circle cx="230" cy="170" r="10" fill="%23D9534F" opacity="0.5"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="%238C3B2B">Clinical Sample: Congested T-Zone</text><text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%238C3B2B" opacity="0.85">Excess sebum & inflammatory papules</text></svg>',
  
  productBarrierCream: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="bot1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23EEF2F6"/><stop offset="100%" stop-color="%23CFD9E3"/></linearGradient></defs><rect width="400" height="300" rx="20" fill="url(%23bot1)"/><rect x="140" y="50" width="120" height="200" rx="16" fill="%23FFFFFF" stroke="%23B0BEC5" stroke-width="2"/><rect x="170" y="30" width="60" height="20" rx="6" fill="%2337474F"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="14" fill="%23263238">CeraRepair Cream</text><text x="50%" y="55%" text-anchor="middle" font-family="sans-serif" font-size="11" fill="%23607D8B">Ceramide NP + Squalane</text></svg>',
  
  productHarshAstringent: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="bot2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FBE9E7"/><stop offset="100%" stop-color="%23FFCCBC"/></linearGradient></defs><rect width="400" height="300" rx="20" fill="url(%23bot2)"/><rect x="140" y="50" width="120" height="200" rx="16" fill="%23FFFFFF" stroke="%23FF8A65" stroke-width="2"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="13" fill="%23BF360C">Deep Pore Astringent</text><text x="50%" y="55%" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%23E64A19">Contains Alcohol Denat & Fragrance</text></svg>',

  shelfCollection: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 500 300"><rect width="500" height="300" rx="20" fill="%23F3F4F6"/><line x1="40" y1="240" x2="460" y2="240" stroke="%239CA3AF" stroke-width="8" stroke-linecap="round"/><rect x="70" y="100" width="50" height="135" rx="8" fill="%23FFFFFF" stroke="%23CBD5E1" stroke-width="2"/><rect x="140" y="70" width="60" height="165" rx="8" fill="%23E0F2FE" stroke="%2338BDF8" stroke-width="2"/><rect x="220" y="110" width="55" height="125" rx="8" fill="%23FEF3C7" stroke="%23FBBF24" stroke-width="2"/><rect x="295" y="60" width="65" height="175" rx="8" fill="%23DCFCE7" stroke="%234ADE80" stroke-width="2"/><rect x="380" y="120" width="50" height="115" rx="8" fill="%23FEE2E2" stroke="%23F87171" stroke-width="2"/><text x="50%" y="15%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="15" fill="%23374151">Sample: Complete Skincare Shelf</text></svg>',

  faceBeautyScan: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="monk4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23D8AB8D"/><stop offset="100%" stop-color="%23C69575"/></linearGradient></defs><rect width="400" height="300" rx="20" fill="url(%23monk4)"/><ellipse cx="200" cy="150" rx="75" ry="95" fill="%23B88463" opacity="0.25"/><text x="50%" y="45%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="16" fill="%235D3924">Monk Tone 4 - Neutral Golden</text><text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="12" fill="%235D3924" opacity="0.9">Natural daylight portrait sample</text></svg>',

  cosmeticShelf: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300" viewBox="0 0 500 300"><rect width="500" height="300" rx="20" fill="%23FFF1F2"/><rect x="60" y="110" width="40" height="110" rx="6" fill="%23BE123C"/><rect x="130" y="70" width="50" height="150" rx="10" fill="%23E2A384"/><rect x="210" y="130" width="60" height="90" rx="12" fill="%23FB7185"/><rect x="300" y="80" width="45" height="140" rx="8" fill="%23D49B78"/><rect x="375" y="125" width="45" height="95" rx="10" fill="%239F1239"/><text x="50%" y="18%" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="15" fill="%239F1239">Sample: Beauty Shelf (Foundation, Lip, Blush)</text></svg>'
};

export const MOCK_SINGLE_ANALYSIS_SAFE: AnalysisResult = {
  skinAnalysis: {
    bodyPart: "Facial Cheek & Nasolabial Fold",
    condition: "Dehydration with localized erythema (redness) & compromised lipid moisture barrier",
    type: "Dry / Sensitive (Fitzpatrick Type III)",
    fitzpatrickScale: "Type III",
    needs: [
      "Barrier Lipids & Ceramides",
      "Squalane Moisture Sealing",
      "Anti-Inflammatory Calming",
      "Zero Alcohol & Fragrance"
    ],
    metrics: {
      hydrationScore: 38,
      rednessScore: 68,
      oilinessScore: 24,
      barrierHealth: "Compromised",
      textureScore: 62
    }
  },
  productAnalysis: {
    name: "Ceramide Barrier Defense Cream",
    brand: "Dermalyze Clinical",
    category: "Moisturizer",
    ingredients: [
      "Water / Aqua",
      "Ceramide NP",
      "Ceramide AP",
      "Ceramide EOP",
      "Squalane",
      "Hyaluronic Acid",
      "Centella Asiatica Extract",
      "Cholesterol",
      "Glycerin"
    ],
    detailedIngredients: [
      { name: "Ceramide NP", comedogenicRating: 0, ewgScore: 1, fungalAcneSafe: true, purpose: "Lipid barrier reconstruction", isToxicOrIrritant: false },
      { name: "Squalane", comedogenicRating: 0, ewgScore: 1, fungalAcneSafe: true, purpose: "Biomimetic hydration shield", isToxicOrIrritant: false },
      { name: "Centella Asiatica", comedogenicRating: 0, ewgScore: 1, fungalAcneSafe: true, purpose: "Redness soothing & wound repair", isToxicOrIrritant: false },
      { name: "Hyaluronic Acid", comedogenicRating: 0, ewgScore: 1, fungalAcneSafe: true, purpose: "Deep epidermal humectant", isToxicOrIrritant: false }
    ],
    toxicIngredients: [],
    overallComedogenicScore: 0,
    safetyScore: 98
  },
  comparison: {
    rating: Rating.GREEN,
    score: 96,
    reasoning: "Exceptional biocompatibility. The formulation contains the ideal 3:1:1 physiological ratio of Ceramides, Cholesterol, and Fatty Acids required to heal trans-epidermal water loss without pore clogging.",
    recommendation: "Apply twice daily (AM and PM) over damp skin. Seal with broad-spectrum SPF in the morning. Noticeable redness reduction expected within 7-10 days.",
    patchTestRequired: false,
    sunSensitivityAlert: false
  },
  timestamp: Date.now()
};

export const MOCK_SINGLE_ANALYSIS_HAZARD: AnalysisResult = {
  skinAnalysis: {
    bodyPart: "Cheek & Jawline",
    condition: "Active inflammatory papules with sensitive barrier",
    type: "Acne-Prone / Sensitive",
    needs: ["Pore clearing without stripping", "Non-comedogenic hydrators", "Anti-microbial defense"]
  },
  productAnalysis: {
    name: "Intense Pore Astringent & Clarifier",
    brand: "GlowAroma Laboratories",
    category: "Toner / Essence",
    ingredients: [
      "Alcohol Denat",
      "Water",
      "Synthetic Fragrance (Parfum)",
      "Propylparaben",
      "Sodium Lauryl Sulfate",
      "Limonene",
      "Eucalyptus Leaf Oil"
    ],
    detailedIngredients: [
      { name: "Alcohol Denat", comedogenicRating: 0, ewgScore: 4, fungalAcneSafe: true, purpose: "Solvent", isToxicOrIrritant: true, concernNote: "Severely dehydrates skin cells and triggers rebound oil production." },
      { name: "Synthetic Fragrance", comedogenicRating: 0, ewgScore: 8, fungalAcneSafe: true, purpose: "Fragrance", isToxicOrIrritant: true, concernNote: "High contact dermatitis allergen." },
      { name: "Propylparaben", comedogenicRating: 0, ewgScore: 7, fungalAcneSafe: true, purpose: "Preservative", isToxicOrIrritant: true, concernNote: "Flagged endocrine disruptor." }
    ],
    toxicIngredients: ["Alcohol Denat (40% vol)", "Synthetic Fragrance", "Propylparaben", "Sodium Lauryl Sulfate (SLS)"],
    overallComedogenicScore: 2,
    safetyScore: 22
  },
  comparison: {
    rating: Rating.RED,
    score: 18,
    reasoning: "Critical hazard alert: The high concentration of denatured alcohol will dissolve your skin's protective lipid bilayer, provoking rebound hyper-seborrhea (more oil) and worsening inflammatory acne.",
    recommendation: "Immediately discontinue use on facial skin. Replace with an alcohol-free, low-percentage Salicylic Acid (1-2%) or Hypochlorous Acid spray.",
    patchTestRequired: true,
    sunSensitivityAlert: true
  },
  timestamp: Date.now()
};

export const MOCK_SHELF_SCAN: ShelfScanResult = {
  detectedSkinType: "Combination (Oily T-Zone with Dehydrated Cheeks)",
  shelf_products: [
    {
      id: "prod_1",
      name: "Hydrating Gentle Foaming Cleanser",
      brand: "CeraVe",
      category: "Water Cleanser",
      rating: Rating.GREEN,
      reasoning: "Contains 3 essential ceramides and hyaluronic acid. Perfectly cleanses sebum without stripping moisture.",
      keyIngredients: ["Ceramides 1, 3, 6-II", "Hyaluronic Acid", "Niacinamide"],
      comedogenicRating: 0,
      suggestedTime: "Both"
    },
    {
      id: "prod_2",
      name: "2% BHA Liquid Exfoliant",
      brand: "Paula's Choice",
      category: "Exfoliant",
      rating: Rating.GREEN,
      reasoning: "Salicylic Acid penetrates lipid-filled pores to dissolve blackheads and refine skin texture.",
      keyIngredients: ["Salicylic Acid (BHA 2%)", "Green Tea Extract", "Methylpropanediol"],
      comedogenicRating: 0,
      conflictsWith: ["Retinol 0.5% (do not stack simultaneously)"],
      suggestedTime: "PM"
    },
    {
      id: "prod_3",
      name: "Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      category: "Active Serum",
      rating: Rating.GREEN,
      reasoning: "Excellent for sebum regulation and hyperpigmentation fading on combination skin.",
      keyIngredients: ["Niacinamide (10%)", "Zinc PCA (1%)"],
      comedogenicRating: 0,
      suggestedTime: "AM"
    },
    {
      id: "prod_4",
      name: "Retinol 0.5% in Squalane",
      brand: "The Ordinary",
      category: "Night Treatment / Oil",
      rating: Rating.YELLOW,
      reasoning: "Potent anti-aging and acne prevention, but requires careful night scheduling. Avoid applying on the same night as the 2% BHA Liquid.",
      keyIngredients: ["Pure Retinol 0.5%", "Squalane", "Jojoba Extract"],
      comedogenicRating: 1,
      conflictsWith: ["Paula's Choice 2% BHA"],
      suggestedTime: "PM"
    },
    {
      id: "prod_5",
      name: "Watery Essence SPF 50+ PA++++",
      brand: "Bioré UV",
      category: "Sunscreen",
      rating: Rating.GREEN,
      reasoning: "Ultra-lightweight invisible shield. Non-comedogenic for oily T-zones with highest level UVA/UVB protection.",
      keyIngredients: ["Tinosorb S", "Uvinul A Plus", "Royal Jelly", "Hyaluronic Acid"],
      comedogenicRating: 0,
      suggestedTime: "AM"
    }
  ],
  routineScore: 92,
  timestamp: Date.now()
};

export const MOCK_BEAUTY_ANALYSIS: BeautyAnalysisResult = {
  detectedSkinTone: 4,
  monkHex: "#C69575",
  detectedUndertone: "Warm",
  undertoneExplanation: "Golden/peach underlying pigments detected with natural olive-gold radiance under diffuse lighting.",
  shelf_analysis: [
    {
      id: "beauty_1",
      name: "Luminous Silk Foundation - Shade 4.5",
      brand: "Giorgio Armani",
      product_type: "Foundation",
      indicator_color: Rating.GREEN,
      shade_advice: "Flawless match! The warm golden undertone seamlessly melts into your jawline without any ashy or pink cast.",
      hex_code: "#C79374",
      finish: "Dewy",
      oxidationRisk: "Low"
    },
    {
      id: "beauty_2",
      name: "Matte Revolution - Pillow Talk Medium",
      brand: "Charlotte Tilbury",
      product_type: "Lipstick",
      indicator_color: Rating.GREEN,
      shade_advice: "Warm berry-rose undertones enhance your natural lip color with rich definition and sophisticated harmony.",
      hex_code: "#A8535E",
      finish: "Matte",
      complementaryShades: ["#8B3A42", "#C26B76"]
    },
    {
      id: "beauty_3",
      name: "Soft Pinch Liquid Blush - Joy (Muted Peach)",
      brand: "Rare Beauty",
      product_type: "Blush",
      indicator_color: Rating.GREEN,
      shade_advice: "Peachy-coral warmth lifts the high cheekbones and emphasizes your natural golden undertone effortlessly.",
      hex_code: "#E07C61",
      finish: "Dewy"
    },
    {
      id: "beauty_4",
      name: "Cool Frost Lavender Nail Polish",
      brand: "OPI",
      product_type: "Nail Polish",
      indicator_color: Rating.RED,
      shade_advice: "Strong icy-blue undertone clashes with your warm golden skin, creating a dull grayish contrast against hands.",
      hex_code: "#B5A7C8",
      finish: "Glossy"
    }
  ],
  timestamp: Date.now()
};

export const MOCK_NATURAL_REMEDY: NaturalRemedyResult = {
  diagnosis: "Surface hyperpigmentation with dullness and mild oxidative stress following sun exposure.",
  remedy_name: "Golden Turmeric, Raw Honey & Greek Yogurt Clarifying Mask",
  prep_time: "5 Minutes",
  difficulty: "Easy",
  culturalOrigin: "Ayurvedic & Mediterranean Tradition",
  ingredients: [
    "1/2 teaspoon Wild Turmeric (Curcuma aromatica / Kasturi Manjal)",
    "1 tablespoon Raw Organic Unpasteurized Honey (antibacterial humectant)",
    "1 tablespoon Plain Greek Yogurt (natural Lactic Acid gently dissolves dead cells)",
    "3 drops Cold-Pressed Rosehip Seed Oil (rich in trans-retinoic acid)"
  ],
  steps: [
    "In a non-metallic glass bowl, blend wild turmeric powder with raw honey until smooth.",
    "Whisk in plain Greek yogurt and rosehip seed oil until a creamy golden emulsion forms.",
    "Cleanse face thoroughly with warm water and pat gently with a clean towel.",
    "Using a soft applicator brush or clean fingertips, spread an even layer across face and neck (avoiding immediate eye contour).",
    "Relax for 15 minutes. Rinse with lukewarm water using gentle circular motions, then splash with cool water."
  ],
  stepDetails: [
    { stepNumber: 1, instruction: "Blend wild turmeric powder with raw honey in glass bowl", durationSeconds: 60 },
    { stepNumber: 2, instruction: "Whisk in yogurt and rosehip oil until silky", durationSeconds: 60 },
    { stepNumber: 3, instruction: "Cleanse face with warm water", durationSeconds: 60 },
    { stepNumber: 4, instruction: "Apply even mask layer across face and neck", durationSeconds: 120 },
    { stepNumber: 5, instruction: "Rest and let active enzymes work", durationSeconds: 900 }
  ],
  pro_tip: "Use Kasturi Manjal (wild turmeric) if available, as it provides all anti-inflammatory benefits without leaving yellow pigment stains on skin.",
  patchTestAdvice: "Perform a 24-hour wrist patch test prior to full face application to verify zero sensitivity to raw bee pollen or active enzymes.",
  timestamp: Date.now()
};
