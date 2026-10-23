export interface MealAxis {
  cuisine: string;      // e.g. Italian, Thai, Mexican, Nigerian / West African, Levantine, Indian, Japanese, French Bistro, American
  technique: string;    // e.g. sear, roast, simmer/braise, steam, pan-fry, broil/char, raw/no-cook, bake
  format: string;       // e.g. bowl, soup, wrap/taco, skillet hash, crisp salad, sandwich, noodles/pasta, sheet-pan
  texture: string;      // e.g. crispy, creamy, brothy, crunchy, charred, velvety saucy
  effort: string;       // e.g. 5-min assembly, 15-20 min, 35-min oven
  role: string;         // e.g. quick dinner, comfort main, light fresh plate
}

export interface MealCard {
  id: string;
  name: string;
  description: string;
  whyDifferent: string;
  cookTimeMinutes: number;
  axis: MealAxis;
  ingredientsYouHave: string[];
  ingredientsMissing: string[];
  cheapSwap?: string;
  balanceNote?: string;
  steps: string[];
  videoSearchQuery: string;
  isFavorite?: boolean;
  isCooked?: boolean;
}

export interface DayPlan {
  breakfast: MealCard;
  lunch: MealCard;
  dinner: MealCard;
  dayBalanceNote: string;
}

export interface PantryFilterState {
  assumeBasicPantry: boolean;
  nigerianMode: boolean;
  under20Mins: boolean;
  spoilFirstItems: string[];
}

export interface RecipeGenerationResponse {
  meals: MealCard[];
  varietyScore: string;
  varietyExplanation: string;
  source: 'gemma4' | 'engine-fallback';
}
