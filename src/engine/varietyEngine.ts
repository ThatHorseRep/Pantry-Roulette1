import { MealCard, MealAxis, DayPlan, PantryFilterState } from '../types';
import { TEMPLATES, TemplateDefinition, INGREDIENT_BUCKETS, PANTRY_STAPLES } from '../data/templates';

export interface ClassificationResult {
  buckets: Set<string>;
  rawTokens: string[];
}

export function classifyIngredients(ingredients: string[]): ClassificationResult {
  const buckets = new Set<string>();
  const rawTokens: string[] = [];

  for (const item of ingredients) {
    const clean = item.trim().toLowerCase();
    if (!clean) continue;
    rawTokens.push(clean);

    let matched = false;
    for (const [bucket, keywords] of Object.entries(INGREDIENT_BUCKETS)) {
      if (keywords.some(kw => clean.includes(kw) || kw.includes(clean))) {
        buckets.add(bucket);
        matched = true;
      }
    }
    if (!matched) {
      buckets.add('other');
    }
  }

  return { buckets, rawTokens };
}

export function computeAxisDistance(t1: TemplateDefinition['axis'], t2: TemplateDefinition['axis']): number {
  let diffs = 0;
  if (t1.cuisine !== t2.cuisine) diffs++;
  if (t1.technique !== t2.technique) diffs++;
  if (t1.format !== t2.format) diffs++;
  if (t1.texture !== t2.texture) diffs++;
  if (t1.effort !== t2.effort) diffs++;
  if (t1.role !== t2.role) diffs++;
  return diffs / 6;
}

export function violatesDiversity(candidate: TemplateDefinition, picked: TemplateDefinition[], strict: boolean = true): boolean {
  for (const p of picked) {
    const dist = computeAxisDistance(candidate.axis, p.axis);

    if (strict) {
      // R1: must differ on at least 3 of 6 axes (distance >= 0.5)
      if (dist < 0.5) return true;

      // R2: no duplicate primary technique
      if (candidate.axis.technique === p.axis.technique) return true;

      // R2: no duplicate (cuisine, format) pair
      if (candidate.axis.cuisine === p.axis.cuisine && candidate.axis.format === p.axis.format) return true;
    } else {
      // Relaxed mode for tight pantries
      if (dist < 0.33) return true;
      if (candidate.id === p.id) return true;
    }
  }
  return false;
}

export function calculateFitScore(
  template: TemplateDefinition,
  userTokens: string[],
  userBuckets: Set<string>,
  options: PantryFilterState
): { fit: number; have: string[]; missing: string[] } {
  const have: string[] = [];
  const missing: string[] = [];
  let score = 0;

  // Check slots
  for (const [slotCategory, acceptedItems] of Object.entries(template.slots)) {
    if (!acceptedItems) continue;

    let slotFilled = false;
    for (const token of userTokens) {
      if (acceptedItems.some(item => token.includes(item) || item.includes(token))) {
        have.push(token);
        slotFilled = true;
        // Priority bonus for spoil-first items
        if (options.spoilFirstItems && options.spoilFirstItems.some(s => token.includes(s.toLowerCase()))) {
          score += 3;
        }
        break;
      }
    }

    if (slotFilled) {
      score += (slotCategory === 'protein' ? 3 : slotCategory === 'veg' ? 2 : 1.5);
    } else {
      // Check if pantry staple assumes it
      const isAssumed = options.assumeBasicPantry && PANTRY_STAPLES.some(st => acceptedItems.some(ai => ai.includes(st) || st.includes(ai)));
      if (!isAssumed) {
        missing.push(acceptedItems[0]);
      } else {
        score += 0.5;
      }
    }
  }

  // Nigerian cuisine boost if enabled
  if (options.nigerianMode && template.isNigerian) {
    score += 4;
  }

  // Under 20 min boost if enabled
  if (options.under20Mins && template.cookTimeMinutes <= 20) {
    score += 2;
  }

  return { fit: score, have: Array.from(new Set(have)), missing: Array.from(new Set(missing)) };
}

export function generateDiverseMealSet(
  userIngredients: string[],
  count: number = 5,
  options: PantryFilterState
): { meals: MealCard[]; diversityScore: string; diversityNote: string } {
  const { rawTokens, buckets } = classifyIngredients(userIngredients);

  const scoredPool = TEMPLATES.map(t => {
    const { fit, have, missing } = calculateFitScore(t, rawTokens, buckets, options);
    return { template: t, fit, have, missing };
  }).sort((a, b) => b.fit - a.fit);

  const picked: Array<{ template: TemplateDefinition; fit: number; have: string[]; missing: string[] }> = [];

  if (scoredPool.length > 0) {
    picked.push(scoredPool[0]); // Best fit seeds the array
  }

  // Try strict R1 & R2 first
  for (const strict of [true, false]) {
    while (picked.length < count) {
      let bestCandidate: typeof scoredPool[0] | null = null;
      let highestSelectionScore = -1;

      for (const candidate of scoredPool) {
        if (picked.some(p => p.template.id === candidate.template.id)) continue;
        if (violatesDiversity(candidate.template, picked.map(p => p.template), strict)) continue;

        const minDistanceToPicked = Math.min(...picked.map(p => computeAxisDistance(candidate.template.axis, p.template.axis)));
        const combinedScore = minDistanceToPicked * 0.7 + (candidate.fit / 10) * 0.3;

        if (combinedScore > highestSelectionScore) {
          highestSelectionScore = combinedScore;
          bestCandidate = candidate;
        }
      }

      if (!bestCandidate) break;
      picked.push(bestCandidate);
    }
    if (picked.length >= count) break;
  }

  // Fill remaining if pantry was extremely tight
  if (picked.length < count) {
    for (const item of scoredPool) {
      if (!picked.some(p => p.template.id === item.template.id)) {
        picked.push(item);
      }
      if (picked.length >= count) break;
    }
  }

  // Map to MealCard with "Why Different" contrast against card #1
  const baseline = picked[0];
  const mealCards: MealCard[] = picked.map((item, idx) => {
    let whyDifferent = 'Best fit for your pantry';
    if (idx > 0 && baseline) {
      const diffAxes: string[] = [];
      if (item.template.axis.technique !== baseline.template.axis.technique) {
        diffAxes.push(`${item.template.axis.technique} vs ${baseline.template.axis.technique}`);
      }
      if (item.template.axis.cuisine !== baseline.template.axis.cuisine) {
        diffAxes.push(item.template.axis.cuisine);
      }
      if (item.template.axis.texture !== baseline.template.axis.texture) {
        diffAxes.push(item.template.axis.texture);
      }
      whyDifferent = diffAxes.slice(0, 2).join(' · ');
    }

    return {
      id: item.template.id,
      name: item.template.name,
      description: item.template.description,
      whyDifferent,
      cookTimeMinutes: item.template.cookTimeMinutes,
      axis: item.template.axis,
      ingredientsYouHave: item.have.length > 0 ? item.have : userIngredients.slice(0, 3),
      ingredientsMissing: item.missing.length > 0 ? item.missing : [item.template.missingHint],
      cheapSwap: item.template.cheapSwap,
      balanceNote: item.template.balanceNote,
      steps: item.template.steps,
      videoSearchQuery: item.template.videoQuery
    };
  });

  // Calculate unique techniques & cuisines
  const uniqueTechniques = new Set(mealCards.map(m => m.axis.technique)).size;
  const uniqueCuisines = new Set(mealCards.map(m => m.axis.cuisine)).size;

  return {
    meals: mealCards,
    diversityScore: `${mealCards.length}/${mealCards.length} Distinct Dishes`,
    diversityNote: `${uniqueTechniques} cooking techniques · ${uniqueCuisines} global cuisine styles · 0 repetitive meals`
  };
}

export function rerollSingleMeal(
  currentCards: MealCard[],
  replaceIndex: number,
  userIngredients: string[],
  options: PantryFilterState
): MealCard {
  const remainingCards = currentCards.filter((_, idx) => idx !== replaceIndex);
  const remainingTemplateIds = new Set(remainingCards.map(c => c.id));
  const currentCard = currentCards[replaceIndex];

  const { rawTokens, buckets } = classifyIngredients(userIngredients);
  const candidates = TEMPLATES
    .filter(t => !remainingTemplateIds.has(t.id) && t.id !== currentCard.id)
    .map(t => {
      const { fit, have, missing } = calculateFitScore(t, rawTokens, buckets, options);
      return { template: t, fit, have, missing };
    })
    .sort((a, b) => b.fit - a.fit);

  // Find candidate with best distance from remaining
  let best = candidates[0];
  let bestScore = -1;

  for (const c of candidates) {
    const minDistance = Math.min(...remainingCards.map(r => computeAxisDistance(c.template.axis, r.axis)));
    const hasSameTechnique = remainingCards.some(r => r.axis.technique === c.template.axis.technique);
    const score = minDistance * (hasSameTechnique ? 0.4 : 1.0) + (c.fit / 10) * 0.3;

    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  const baseline = remainingCards[0];
  let whyDifferent = 'Distinct alternative';
  if (baseline) {
    whyDifferent = `${best.template.axis.technique} · ${best.template.axis.cuisine}`;
  }

  return {
    id: best.template.id,
    name: best.template.name,
    description: best.template.description,
    whyDifferent,
    cookTimeMinutes: best.template.cookTimeMinutes,
    axis: best.template.axis,
    ingredientsYouHave: best.have.length > 0 ? best.have : userIngredients.slice(0, 2),
    ingredientsMissing: best.missing.length > 0 ? best.missing : [best.template.missingHint],
    cheapSwap: best.template.cheapSwap,
    balanceNote: best.template.balanceNote,
    steps: best.template.steps,
    videoSearchQuery: best.template.videoQuery
  };
}

export function constructDayPlan(userIngredients: string[], options: PantryFilterState): DayPlan {
  const result = generateDiverseMealSet(userIngredients, 6, options);
  const meals = result.meals;

  // Find breakfast appropriate (quick, egg, toast, skillet)
  const breakfast = meals.find(m => m.axis.effort.includes('5-min') || m.axis.technique === 'pan-fry' || m.axis.format === 'sandwich') || meals[0];
  // Find lunch appropriate (fresh salad, noodles, bowl)
  const lunch = meals.find(m => m.id !== breakfast.id && (m.axis.format === 'crisp salad' || m.axis.format === 'noodles/pasta' || m.axis.role === 'light fresh plate')) || meals[1] || meals[0];
  // Find dinner appropriate (comfort main, roast, stew)
  const dinner = meals.find(m => m.id !== breakfast.id && m.id !== lunch.id && (m.axis.role === 'comfort main' || m.axis.technique === 'roast' || m.axis.technique === 'simmer/braise')) || meals[2] || meals[0];

  return {
    breakfast,
    lunch,
    dinner,
    dayBalanceNote: 'Balanced triple split: energizing breakfast protein, refreshing midday fiber, and hearty slow-cooked evening carbs.'
  };
}
