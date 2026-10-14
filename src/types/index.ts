export enum Rating {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  RED = "RED"
}

export type AppTab = 'shelf' | 'beauty' | 'single' | 'routine' | 'natural' | 'vanity' | 'chat';

export type LanguageCode = 'en' | 'es' | 'fr' | 'ja' | 'hi';

export type Undertone = 'Warm' | 'Cool' | 'Neutral' | 'Olive';

export type RoutineStep = 
  | 'Oil Cleanser' 
  | 'Water Cleanser' 
  | 'Toner / Essence' 
  | 'Active Serum' 
  | 'Exfoliant' 
  | 'Eye Cream' 
  | 'Moisturizer' 
  | 'Sunscreen' 
  | 'Night Treatment / Oil';

export interface IngredientDetail {
  name: string;
  comedogenicRating: number; // 0 (non-comedogenic) to 5 (high pore clogging)
  ewgScore: number; // 1 (safest) to 10 (high hazard)
  fungalAcneSafe: boolean;
  purpose: string;
  isToxicOrIrritant: boolean;
  concernNote?: string;
}

export interface SkinMetrics {
  hydrationScore: number; // 0-100
  rednessScore: number; // 0-100
  oilinessScore: number; // 0-100
  barrierHealth: 'Optimal' | 'Compromised' | 'Sensitive' | 'Normal';
  textureScore: number; // 0-100
}

export interface SkinAnalysis {
  bodyPart: string;
  condition: string;
  type: string;
  fitzpatrickScale?: string; // I - VI
  needs: string[];
  metrics?: SkinMetrics;
}

export interface ProductAnalysis {
  name: string;
  brand: string;
  category?: RoutineStep | string;
  ingredients: string[];
  detailedIngredients?: IngredientDetail[];
  toxicIngredients: string[];
  overallComedogenicScore?: number;
  safetyScore?: number; // 0-100
}

export interface Comparison {
  rating: Rating;
  score: number; // 0-100
  reasoning: string;
  recommendation: string;
  patchTestRequired: boolean;
  sunSensitivityAlert: boolean;
}

export interface AnalysisResult {
  skinAnalysis: SkinAnalysis;
  productAnalysis: ProductAnalysis;
  comparison: Comparison;
  timestamp?: number;
}

export interface ShelfProduct {
  id?: string;
  name: string;
  brand: string;
  category: RoutineStep;
  rating: Rating;
  reasoning: string;
  keyIngredients: string[];
  comedogenicRating?: number;
  conflictsWith?: string[];
  suggestedTime?: 'AM' | 'PM' | 'Both';
}

export interface ShelfScanResult {
  detectedSkinType: string;
  shelf_products: ShelfProduct[];
  routineScore?: number;
  timestamp?: number;
}

export interface BeautyProduct {
  id?: string;
  name: string;
  brand: string;
  product_type: 'Lipstick' | 'Foundation' | 'Nail Polish' | 'Blush' | 'Concealer' | 'Primer';
  indicator_color: Rating;
  shade_advice: string;
  hex_code: string;
  finish?: 'Matte' | 'Dewy' | 'Satin' | 'Velvet' | 'Glossy';
  oxidationRisk?: 'Low' | 'Medium' | 'High';
  complementaryShades?: string[];
}

export interface BeautyAnalysisResult {
  detectedSkinTone: number; // Monk Skin Tone 1-10
  monkHex: string;
  detectedUndertone: Undertone;
  undertoneExplanation?: string;
  shelf_analysis: BeautyProduct[];
  timestamp?: number;
}

export interface NaturalRemedyStep {
  stepNumber: number;
  instruction: string;
  durationSeconds?: number;
}

export interface NaturalRemedyResult {
  diagnosis: string;
  remedy_name: string;
  prep_time: string;
  difficulty: 'Easy' | 'Medium';
  ingredients: string[];
  steps: string[];
  stepDetails?: NaturalRemedyStep[];
  pro_tip: string;
  patchTestAdvice: string;
  culturalOrigin?: string;
  timestamp?: number;
}

export interface RoutineConflict {
  id: string;
  productA: string;
  productB: string;
  ingredientA: string;
  ingredientB: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  resolution: string;
}

export interface RoutinePlan {
  am: ShelfProduct[];
  pm: ShelfProduct[];
  conflicts: RoutineConflict[];
  synergyScore: number; // 0-100
  missingSteps: string[];
}

export interface VanityItem {
  id: string;
  name: string;
  brand: string;
  category: RoutineStep;
  rating: Rating;
  image?: string;
  openedDate?: string;
  paoMonths?: number; // Period After Opening (e.g. 6, 12)
  notes?: string;
  isFavorite: boolean;
  inAMRoutine: boolean;
  inPMRoutine: boolean;
  addedAt: number;
}

export interface SkinJournalEntry {
  id: string;
  date: string;
  photoUrl?: string;
  skinType: string;
  concerns: string[];
  notes: string;
  rating: 'Radiant' | 'Calm' | 'Irritated' | 'Breakout' | 'Dry';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestions?: string[];
}

export interface UserPreferences {
  apiKey: string;
  selectedModel: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash';
  demoMode: boolean;
  language: LanguageCode;
}
