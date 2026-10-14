import { ShelfProduct, RoutineConflict, RoutinePlan } from '../types';

interface ConflictRule {
  ingredientA: string;
  ingredientB: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  resolution: string;
}

const CONFLICT_RULES: ConflictRule[] = [
  {
    ingredientA: 'retinol',
    ingredientB: 'glycolic acid',
    severity: 'High',
    description: 'Combining Retinol with Glycolic Acid (AHA) dramatically increases cellular turnover, leading to severe barrier compromise, peeling, and chemical irritation.',
    resolution: 'Separate them: Use Glycolic Acid 2 nights a week, and Retinol on alternate nights.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'salicylic acid',
    severity: 'High',
    description: 'Stacking Retinoids with BHA peels strips lipid layers, inducing extreme dryness and contact erythema.',
    resolution: 'Move Salicylic Acid to your AM routine, and keep Retinol exclusively in the PM.'
  },
  {
    ingredientA: 'retinol',
    ingredientB: 'benzoyl peroxide',
    severity: 'High',
    description: 'Benzoyl Peroxide oxidizes and deactivates standard Retinol molecules, rendering both ineffective while maximizing surface irritation.',
    resolution: 'Use Benzoyl Peroxide in the morning as an antibacterial wash, and Retinol at night.'
  },
  {
    ingredientA: 'ascorbic acid',
    ingredientB: 'retinol',
    severity: 'High',
    description: 'Pure Vitamin C requires an acidic pH (approx 3.0), whereas Retinol works at a neutral pH (5.5-6.0). Layering causes irritation and cancels out stability.',
    resolution: 'Apply Vitamin C in the Morning for antioxidant UV defense; apply Retinol strictly at Bedtime.'
  },
  {
    ingredientA: 'peptides',
    ingredientB: 'glycolic acid',
    severity: 'Medium',
    description: 'Direct acids hydrolyze fragile peptide peptide-bonds, destroying collagen-stimulating efficacy.',
    resolution: 'Apply Peptides after gentle non-acid serums or use them at alternating times of day.'
  },
  {
    ingredientA: 'peptides',
    ingredientB: 'ascorbic acid',
    severity: 'Medium',
    description: 'Direct L-Ascorbic Acid denatures copper peptides and protein chains.',
    resolution: 'Use Peptides in the PM with Ceramides and Vitamin C in the AM.'
  },
  {
    ingredientA: 'salicylic acid',
    ingredientB: 'glycolic acid',
    severity: 'Medium',
    description: 'Simultaneous AHA + BHA multi-acid stacking can cause excessive chemical peeling for sensitive or dry skin types.',
    resolution: 'If using both, choose a balanced low-percentage hybrid formula rather than layering two separate high-strength acids.'
  }
];

function hasIngredient(product: ShelfProduct, ingredientKeyword: string): boolean {
  const allText = [
    product.name,
    product.reasoning,
    ...(product.keyIngredients || [])
  ].join(' ').toLowerCase();

  return allText.includes(ingredientKeyword.toLowerCase());
}

/**
 * Analyzes an array of shelf products to detect contraindications,
 * assigns optimal AM/PM scheduling, and calculates a routine synergy score.
 */
export function analyzeRoutine(products: ShelfProduct[]): RoutinePlan {
  const conflicts: RoutineConflict[] = [];

  // Pairwise conflict check
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const prodA = products[i];
      const prodB = products[j];

      for (const rule of CONFLICT_RULES) {
        const matchForward = hasIngredient(prodA, rule.ingredientA) && hasIngredient(prodB, rule.ingredientB);
        const matchReverse = hasIngredient(prodA, rule.ingredientB) && hasIngredient(prodB, rule.ingredientA);

        if (matchForward || matchReverse) {
          const matchedA = matchForward ? rule.ingredientA : rule.ingredientB;
          const matchedB = matchForward ? rule.ingredientB : rule.ingredientA;

          conflicts.push({
            id: `${prodA.name}-${prodB.name}-${rule.severity}`,
            productA: prodA.name,
            productB: prodB.name,
            ingredientA: matchedA,
            ingredientB: matchedB,
            severity: rule.severity,
            description: rule.description,
            resolution: rule.resolution
          });
        }
      }
    }
  }

  // Smart AM / PM Slotting
  const am: ShelfProduct[] = [];
  const pm: ShelfProduct[] = [];

  products.forEach((product) => {
    const text = (product.name + ' ' + (product.category || '')).toLowerCase();
    const isSunscreen = text.includes('sunscreen') || text.includes('spf') || product.category === 'Sunscreen';
    const isRetinoid = text.includes('retinol') || text.includes('retinoid') || text.includes('tretinoin');
    const isHeavyNightCream = text.includes('night') || text.includes('sleeping');
    const isVitC = text.includes('vitamin c') || text.includes('ascorbic');

    if (isSunscreen) {
      am.push(product);
    } else if (isRetinoid || isHeavyNightCream) {
      pm.push(product);
    } else if (isVitC) {
      am.push(product);
    } else {
      // By default suitable for both or AM/PM based on existing tags
      if (product.suggestedTime === 'AM') {
        am.push(product);
      } else if (product.suggestedTime === 'PM') {
        pm.push(product);
      } else {
        am.push(product);
        pm.push(product);
      }
    }
  });

  // Check for missing foundational routine steps
  const missingSteps: string[] = [];
  const allCategories = products.map(p => p.category?.toLowerCase() || p.name.toLowerCase());

  if (!allCategories.some(c => c.includes('cleanser'))) {
    missingSteps.push('Gentle Hydrating Cleanser (Essential for removing impurities without stripping)');
  }
  if (!allCategories.some(c => c.includes('moisturizer') || c.includes('cream'))) {
    missingSteps.push('Barrier Repair Moisturizer (Locks in transepidermal hydration)');
  }
  if (!allCategories.some(c => c.includes('sunscreen') || c.includes('spf'))) {
    missingSteps.push('Broad-Spectrum SPF 50+ Sunscreen (Non-negotiable daily photo-protection)');
  }

  // Synergy Score Calculation (Starts at 100, drops with conflicts and missing core pillars)
  let penalty = 0;
  conflicts.forEach(c => {
    if (c.severity === 'High') penalty += 25;
    else if (c.severity === 'Medium') penalty += 15;
    else penalty += 8;
  });

  if (missingSteps.length > 0) {
    penalty += missingSteps.length * 10;
  }

  const synergyScore = Math.max(10, Math.min(100, 100 - penalty));

  return {
    am,
    pm,
    conflicts,
    synergyScore,
    missingSteps
  };
}
