# Dermalyze 2.0 ✨
> **Next-Generation Clinical AI Dermatology & Cosmetic Intelligence Studio**

Dermalyze 2.0 is a complete reimagining of the original AI Studio Dermalyze prototype, transformed into a production-grade, multimodal clinical platform. It combines Google Gemini Vision intelligence with a deterministic cosmetic chemistry database, AM/PM routine contraindication engine, Monk Skin Tone shade matching, and 100% kitchen-based botanical remedy lab.

---

## 🚀 Key Upgrades & New Architecture

### 1. 🛡️ Dual-Engine Ingredient Analysis & Comedogenic Index
- **0–5 Pore Clogging Scale**: Automatically assesses comedogenic hazard to prevent closed comedones and acne flare-ups.
- **EWG & Toxic Flagging**: Detects hidden sensitizers, harsh sulfates (SLS), endocrine-disrupting parabens, drying denatured alcohols, and synthetic fragrances.
- **Biomarker Suitability**: Rates safety across GREEN, YELLOW, and RED indicators with biocompatibility scores (0–100).

### 2. ⚡ AM/PM Routine Builder & Conflict Matrix
- **Chemical Contraindication Detection**: Flags dangerous active combinations (e.g., *Retinoids + Direct AHA Glycolic Acid*, *Benzoyl Peroxide + Pure Retinol*, *L-Ascorbic Acid + Retinol*).
- **Clinical Chrono-Scheduling**: Automatically slots UV-protective antioxidants (Vitamin C, Sunscreen) to morning routines and barrier-repair cell regulators (Retinol, Ceramides) to evening routines.
- **Routine Synergy Score**: Visual radial progress indicator rating overall formulation balance.

### 3. 🎨 Monk Skin Tone (1–10) & Virtual Swatch Studio
- **Inclusive Spectrum Matching**: Maps facial skin against the official 10-point Monk Skin Tone scale.
- **Undertone Harmonizer**: Identifies Warm, Cool, Neutral, or Olive pigments and warns against ashy or orange oxidation.
- **Side-by-Side Swatching**: Live digital swatch viewer comparing cosmetic HEX shades directly against the user's skin tone.

### 4. 🌿 Natural Apothecary & Interactive Mask Timer
- **100% Kitchen Superfoods**: Formulates potent remedies strictly from natural pantry ingredients (Raw Honey, Wild Turmeric, Plain Yogurt, Colloidal Oats, Rosehip Oil).
- **Interactive Step Timer**: In-app digital countdown timer for facial mask resting and enzyme activation.
- **24-Hour Allergy Protocol**: Safety guidance to verify botanical tolerance before facial contact.

### 5. 🛁 My Digital Vanity & Skin Health Journal
- **Digital Vanity Shelf**: Save products from scans, track Period After Opening (PAO) expiration, and filter by routine steps.
- **Daily Skin Journal**: Log daily skin sensations (*Radiant, Calm, Irritated, Breakout, Dry*) with notes.
- **LocalStorage Sync**: Persistent offline-first architecture — never lose your scans on page refresh.

### 6. 🌐 Multilingual & Zero-Cost Demo Mode
- **Language Switcher**: Native support for **English**, **Español**, **Français**, **日本語**, and **हिन्दी**.
- **Instant Demo Mode**: Test all clinical features immediately with pre-loaded high-resolution samples without needing an active API key or burning quota.
- **In-App API Key Manager**: Securely save your personal Gemini API key locally in the browser and choose between `gemini-2.5-flash`, `gemini-2.5-pro`, or `gemini-1.5-flash`.

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- npm / pnpm / yarn

### Installation
```bash
# 1. Navigate to the project directory
cd dermalyze

# 2. Install dependencies
npm install

# 3. (Optional) Set your Gemini API key in .env.local
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Disclaimer
This project is open-source under the MIT License.

*Disclaimer: Dermalyze 2.0 provides optical and cosmetic formulation intelligence for educational and consumer guidance. It is not a medical device and does not replace consultation with a board-certified dermatologist.*
