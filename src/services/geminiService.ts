import { GoogleGenAI, Type } from "@google/genai";
import { 
  AnalysisResult, 
  ShelfScanResult, 
  BeautyAnalysisResult, 
  NaturalRemedyResult, 
  LanguageCode 
} from "../types";
import { storageService } from "./storageService";
import { 
  MOCK_SINGLE_ANALYSIS_SAFE, 
  MOCK_SHELF_SCAN, 
  MOCK_BEAUTY_ANALYSIS, 
  MOCK_NATURAL_REMEDY 
} from "./mockDataService";
import { analyzeIngredientList, getAverageComedogenicScore } from "./ingredientDatabase";

/**
 * Retrieves the currently active Gemini API key
 */
export function getActiveApiKey(): string {
  const prefs = storageService.getPreferences();
  return (prefs.apiKey || process.env.GEMINI_API_KEY || "").trim();
}

/**
 * Checks if live API mode is ready
 */
export function isLiveApiReady(): boolean {
  const key = getActiveApiKey();
  const prefs = storageService.getPreferences();
  return Boolean(key && !prefs.demoMode);
}

function getGenAIClient(): GoogleGenAI {
  const key = getActiveApiKey();
  return new GoogleGenAI({ apiKey: key });
}

function getSelectedModel(): string {
  const prefs = storageService.getPreferences();
  return prefs.selectedModel || "gemini-2.5-flash";
}

/**
 * Analyze Single Skin Image vs Single Product
 */
export async function analyzeDermatology(
  skinImageBase64: string, 
  productImageBase64: string, 
  language: LanguageCode = 'en'
): Promise<AnalysisResult> {
  const prefs = storageService.getPreferences();

  // If Demo Mode is turned on or no API key, return curated clinical sample immediately
  if (prefs.demoMode || !getActiveApiKey()) {
    // Artificial realistic analysis delay
    await new Promise(r => setTimeout(r, 1200));
    return {
      ...MOCK_SINGLE_ANALYSIS_SAFE,
      timestamp: Date.now()
    };
  }

  const ai = getGenAIClient();
  const model = getSelectedModel();

  const systemInstruction = `You are a Senior Clinical Dermatologist, Cosmetic Chemist, and Multilingual Expert.
Your purpose is to protect consumers from toxic, comedogenic, or incompatible cosmetic ingredients.

Language Directive:
You must provide all descriptions, reasoning, and recommendations in ${language.toUpperCase()}.
Keep all JSON property keys strictly in English as dictated by the schema.

Analysis Tasks:
1. Identify Skin Area: Identify body part, dermatological condition (e.g. eczema, dryness, acne vulgaris, erythema), skin type, and clinical needs.
2. Analyze Product Bottle / Label: Extract product name, brand, full ingredient list, and isolate toxic/irritating chemicals (e.g. Sulfates, Parabens, Phthalates, Denatured Alcohol, Synthetic Fragrance).
3. Evaluate Safety & Comedogenicity: Rate as GREEN (Safe & highly synergistic), YELLOW (Safe but ineffective or mild irritant), or RED (Toxic, comedogenic hazard, or counterproductive for this specific skin condition).
4. Provide actionable clinical advice, patch-test guidance, and sun-sensitivity alerts.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Perform an in-depth dermatological and cosmetic chemical compatibility evaluation on these two images: the first is skin, the second is the cosmetic product." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: skinImageBase64.split(",")[1] || skinImageBase64
            }
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: productImageBase64.split(",")[1] || productImageBase64
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skinAnalysis: {
            type: Type.OBJECT,
            properties: {
              bodyPart: { type: Type.STRING },
              condition: { type: Type.STRING },
              type: { type: Type.STRING },
              fitzpatrickScale: { type: Type.STRING },
              needs: { type: Type.ARRAY, items: { type: Type.STRING } },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  hydrationScore: { type: Type.NUMBER },
                  rednessScore: { type: Type.NUMBER },
                  oilinessScore: { type: Type.NUMBER },
                  barrierHealth: { type: Type.STRING, enum: ["Optimal", "Compromised", "Sensitive", "Normal"] },
                  textureScore: { type: Type.NUMBER }
                },
                required: ["hydrationScore", "rednessScore", "oilinessScore", "barrierHealth", "textureScore"]
              }
            },
            required: ["bodyPart", "condition", "type", "needs"]
          },
          productAnalysis: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              brand: { type: Type.STRING },
              category: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              toxicIngredients: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "brand", "ingredients", "toxicIngredients"]
          },
          comparison: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.STRING, enum: ["RED", "YELLOW", "GREEN"] },
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              patchTestRequired: { type: Type.BOOLEAN },
              sunSensitivityAlert: { type: Type.BOOLEAN }
            },
            required: ["rating", "score", "reasoning", "recommendation", "patchTestRequired", "sunSensitivityAlert"]
          }
        },
        required: ["skinAnalysis", "productAnalysis", "comparison"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response returned by the AI vision model.");
  }

  const raw: AnalysisResult = JSON.parse(response.text);

  // Enrich with deep ingredient knowledge base
  const detailedIngredients = analyzeIngredientList(raw.productAnalysis.ingredients || []);
  raw.productAnalysis.detailedIngredients = detailedIngredients;
  raw.productAnalysis.overallComedogenicScore = getAverageComedogenicScore(detailedIngredients);
  raw.timestamp = Date.now();

  return raw;
}

/**
 * Scan entire cosmetic shelf against user skin profile
 */
export async function scanShelf(
  shelfImageBase64: string, 
  skinImageBase64: string, 
  language: LanguageCode = 'en'
): Promise<ShelfScanResult> {
  const prefs = storageService.getPreferences();

  if (prefs.demoMode || !getActiveApiKey()) {
    await new Promise(r => setTimeout(r, 1400));
    return {
      ...MOCK_SHELF_SCAN,
      timestamp: Date.now()
    };
  }

  const ai = getGenAIClient();
  const model = getSelectedModel();

  const systemInstruction = `You are a Master Dermatological VLM and Skincare Routine Architect.
Language: Respond in ${language.toUpperCase()}. JSON keys must remain in English.

1. Analyze the skin photo to accurately diagnose the user's skin type (e.g. Oily / Acne-Prone, Sensitive / Dry, Combination, Rosacea-prone, Mature).
2. Scan the shelf photo: Identify every bottle, tub, or serum present.
3. Categorize each product into a standard routine step: 'Oil Cleanser', 'Water Cleanser', 'Toner / Essence', 'Active Serum', 'Exfoliant', 'Eye Cream', 'Moisturizer', 'Sunscreen', or 'Night Treatment / Oil'.
4. Rate each product: GREEN (ideal match), YELLOW (caution or minor irritants), RED (contraindicated, comedogenic, or toxic for this skin type).
5. Extract key active ingredients and suggest optimal timing ('AM', 'PM', or 'Both').`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Analyze the skin photo to diagnose skin type, then perform an exhaustive shelf scan identifying all skincare products, rating their safety and suitability for this skin." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: skinImageBase64.split(",")[1] || skinImageBase64
            }
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: shelfImageBase64.split(",")[1] || shelfImageBase64
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedSkinType: { type: Type.STRING },
          routineScore: { type: Type.NUMBER },
          shelf_products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                category: { 
                  type: Type.STRING, 
                  enum: [
                    "Oil Cleanser", 
                    "Water Cleanser", 
                    "Toner / Essence", 
                    "Active Serum", 
                    "Exfoliant", 
                    "Eye Cream", 
                    "Moisturizer", 
                    "Sunscreen", 
                    "Night Treatment / Oil"
                  ] 
                },
                rating: { type: Type.STRING, enum: ["RED", "YELLOW", "GREEN"] },
                reasoning: { type: Type.STRING },
                keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedTime: { type: Type.STRING, enum: ["AM", "PM", "Both"] }
              },
              required: ["name", "brand", "category", "rating", "reasoning", "keyIngredients", "suggestedTime"]
            }
          }
        },
        required: ["detectedSkinType", "shelf_products"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response returned by the AI vision model.");
  }

  const result: ShelfScanResult = JSON.parse(response.text);
  result.timestamp = Date.now();
  return result;
}

/**
 * Analyze Beauty Products & Monk Scale Shade Matching
 */
export async function analyzeBeauty(
  shelfImageBase64: string, 
  skinImageBase64: string, 
  language: LanguageCode = 'en'
): Promise<BeautyAnalysisResult> {
  const prefs = storageService.getPreferences();

  if (prefs.demoMode || !getActiveApiKey()) {
    await new Promise(r => setTimeout(r, 1300));
    return {
      ...MOCK_BEAUTY_ANALYSIS,
      timestamp: Date.now()
    };
  }

  const ai = getGenAIClient();
  const model = getSelectedModel();

  const systemInstruction = `You are an elite Celebrity Makeup Artist, Cosmetic Color Theorist, and VLM Expert.
Language: Provide shade advice in ${language.toUpperCase()}.

Color Theory Rules:
1. Skin Tone: Classify on the official 10-point Monk Skin Tone scale (1 to 10). Provide the representative HEX code for the user's skin tone.
2. Undertone: Identify Warm (yellow/golden/peachy), Cool (pink/blue/red), Neutral, or Olive.
3. For each cosmetic (Lipstick, Foundation, Nail Polish, Blush, Concealer, Primer):
   - Identify the exact product shade and extract the closest HEX color code (e.g. #A8535E).
   - Evaluate undertone harmony:
     * GREEN: Harmonious shade match that complements tone and undertone.
     * YELLOW: Wearable but slightly neutral/requires blending.
     * RED: Clashes (e.g. chalky ashy foundation or cool violet on warm golden undertones).
   - Detail the finish (Matte, Dewy, Satin, Velvet, Glossy) and oxidation risk.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Detect Monk skin tone (1-10) and undertone from the face photo, then scan the cosmetic shelf to match shades with hex codes and indicator ratings." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: skinImageBase64.split(",")[1] || skinImageBase64
            }
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: shelfImageBase64.split(",")[1] || shelfImageBase64
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedSkinTone: { type: Type.NUMBER, description: "Monk Skin Tone Scale (1-10)" },
          monkHex: { type: Type.STRING, description: "HEX color code representing the user skin tone" },
          detectedUndertone: { type: Type.STRING, enum: ["Warm", "Cool", "Neutral", "Olive"] },
          undertoneExplanation: { type: Type.STRING },
          shelf_analysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                brand: { type: Type.STRING },
                product_type: { 
                  type: Type.STRING, 
                  enum: ["Lipstick", "Foundation", "Nail Polish", "Blush", "Concealer", "Primer"] 
                },
                indicator_color: { type: Type.STRING, enum: ["RED", "YELLOW", "GREEN"] },
                shade_advice: { type: Type.STRING },
                hex_code: { type: Type.STRING },
                finish: { type: Type.STRING, enum: ["Matte", "Dewy", "Satin", "Velvet", "Glossy"] },
                oxidationRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
              },
              required: ["name", "brand", "product_type", "indicator_color", "shade_advice", "hex_code"]
            }
          }
        },
        required: ["detectedSkinTone", "monkHex", "detectedUndertone", "shelf_analysis"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response returned by the AI vision model.");
  }

  const result: BeautyAnalysisResult = JSON.parse(response.text);
  result.timestamp = Date.now();
  return result;
}

/**
 * Analyze skin for 100% natural DIY kitchen-based remedies
 */
export async function analyzeNaturalRemedy(
  skinImageBase64: string, 
  language: LanguageCode = 'en'
): Promise<NaturalRemedyResult> {
  const prefs = storageService.getPreferences();

  if (prefs.demoMode || !getActiveApiKey()) {
    await new Promise(r => setTimeout(r, 1100));
    return {
      ...MOCK_NATURAL_REMEDY,
      timestamp: Date.now()
    };
  }

  const ai = getGenAIClient();
  const model = getSelectedModel();

  const systemInstruction = `You are the Dermalyze Natural Apothecary & Herbal Dermatology Specialist.
Language: Write the remedy name, diagnosis, steps, and tips in ${language.toUpperCase()}.

Rule: Absolutely NO store-bought cosmetic chemicals. Focus 100% on potent, research-backed DIY kitchen & natural pantry remedies (e.g. Wild Turmeric, Raw Honey, Colloidal Oats, Plain Yogurt, Aloe Vera, Rosewater, Green Tea).
Provide:
1. Visual Diagnosis from the skin photo.
2. Remedy Name and Cultural/Botanical Origin.
3. Prep Time and Difficulty (Easy or Medium).
4. Exact measured kitchen ingredients with botanical properties.
5. Chronological preparation and application steps with timed durations (seconds).
6. Essential patch-test warning and pro tips.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: "Examine this skin image for visible concerns (dullness, redness, acne, sun exposure) and formulate a potent 100% natural kitchen-based remedy recipe." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: skinImageBase64.split(",")[1] || skinImageBase64
            }
          }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: { type: Type.STRING },
          remedy_name: { type: Type.STRING },
          prep_time: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium"] },
          culturalOrigin: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          stepDetails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.NUMBER },
                instruction: { type: Type.STRING },
                durationSeconds: { type: Type.NUMBER }
              },
              required: ["stepNumber", "instruction"]
            }
          },
          pro_tip: { type: Type.STRING },
          patchTestAdvice: { type: Type.STRING }
        },
        required: ["diagnosis", "remedy_name", "prep_time", "difficulty", "ingredients", "steps", "pro_tip", "patchTestAdvice"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response returned by the AI vision model.");
  }

  const result: NaturalRemedyResult = JSON.parse(response.text);
  result.timestamp = Date.now();
  return result;
}

/**
 * Creates a stateful chat session with the Dermalyze AI Assistant
 */
export function createChatSession(language: LanguageCode = 'en') {
  const prefs = storageService.getPreferences();

  if (prefs.demoMode || !getActiveApiKey()) {
    // Return a smart offline mock chat simulator
    return {
      async sendMessage({ message }: { message: string }) {
        await new Promise(r => setTimeout(r, 700));
        const q = message.toLowerCase();
        let reply = "Hello! I am your Dermalyze AI assistant. In demo mode, I can explain ingredients, routine conflicts, and natural recipes. Try asking: 'Can I use Retinol with Vitamin C?' or 'What is Salicylic Acid good for?'";

        if (q.includes("retinol") && (q.includes("vitamin c") || q.includes("vit c") || q.includes("ascorbic"))) {
          reply = "Great question! Retinol and pure Vitamin C (L-Ascorbic Acid) should NOT be layered directly together. Vitamin C requires a low, acidic pH (~3.0) to penetrate, while Retinol functions best at neutral skin pH (~5.5 - 6.0). Applying them simultaneously causes stinging and instability. **The gold standard routine:** Apply Vitamin C in the morning (AM) under sunscreen for antioxidant protection, and apply Retinol strictly at night (PM) to repair skin while you sleep.";
        } else if (q.includes("salicylic") || q.includes("bha")) {
          reply = "Salicylic Acid is an oil-soluble Beta Hydroxy Acid (BHA). Unlike water-soluble AHAs that only work on the skin surface, BHA penetrates deep inside sebaceous pores to dissolve clogged sebum, dead keratinocytes, and inflammatory acne bacteria. It is the #1 recommended active for blackheads and congested T-zones.";
        } else if (q.includes("niacinamide")) {
          reply = "Niacinamide (Vitamin B3) is a multi-tasking powerhouse: it reinforces the ceramide lipid barrier, regulates sebum production, visibly shrinks enlarged pores, and suppresses melanin transfer to fade stubborn post-inflammatory hyperpigmentation.";
        } else if (q.includes("sunscreen") || q.includes("spf")) {
          reply = "Sunscreen is the single most critical step in dermatology! Up to 80% of premature facial aging and hyperpigmentation is induced by daily UVA/UVB exposure. If you use exfoliating acids (AHA/BHA) or Retinoids, your skin is photo-sensitized and requires SPF 50+ broad-spectrum daily.";
        } else if (q.includes("turmeric") || q.includes("honey") || q.includes("natural")) {
          reply = "Natural remedies work wonderfully when backed by botanical science! Raw honey contains hydrogen peroxide precursors and methylglyoxal which are naturally antimicrobial. Turmeric contains curcumin, a potent NF-kB inhibitor that calms inflammatory redness. Always remember to do a 24-hour wrist patch test before full application!";
        }

        return { text: reply };
      }
    };
  }

  const ai = getGenAIClient();
  const model = getSelectedModel();

  const systemInstruction = `You are Dermalyze AI, a world-class dermatological consultant, cosmetic chemist, and aesthetic beauty advisor.
Respond fluently in ${language.toUpperCase()}.
Capabilities:
- In-depth ingredient chemistry (comedogenic index, EWG ratings, contraindications)
- AM/PM routine order and conflict resolution
- Monk scale shade matching principles
- Research-backed DIY botanical remedies
- Provide safe, evidence-based guidance.
Constraint: Always maintain a warm, empathetic, and professional tone. If the user presents severe medical symptoms (such as rapidly changing irregular moles, blistering burns, or open lesions), advise them to seek an in-person board-certified dermatologist.`;

  return ai.chats.create({
    model,
    config: {
      systemInstruction
    }
  });
}
