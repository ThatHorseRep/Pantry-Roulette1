# Pantry Roulette — Gemma 4 AI Meal Variety Engine

A culinary decision engine that turns whatever is left in your fridge into 5 genuinely distinct dinners. Powered by open-source **Gemma 4** (Apache 2.0) and a mathematical 6-axis variety algorithm that guarantees dinner never collapses into the same repetitive meal.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following choices were confirmed based on your requirements and initial Q&A:

- **Core Concept**: **Pantry Roulette with Variety Guarantee & Gemma 4 AI**, synthesizing the best elements of all 4 PRDs:
  - *6-Axis Variety Engine* (PRD 2): Guarantees $\ge 3$ of 6 axis differentiators (Cuisine, Technique, Format, Texture, Effort, Role) with zero technique repeats.
  - *Gemma 4 Open-Source AI Core* (PRD 4): Powers tailored meal naming, numbered preparation steps, budget-friendly ingredient swaps, and a student balance score (carbs/protein/veg check).
  - *Interactive Cooking & Media Link* (PRD 3): One-click YouTube cooking search link for every meal card to watch visual demonstrations.
  - *Local Cuisine & Speed Controls* (PRD 1 & PRD 4): Nigerian food mode toggle (jollof, plantain, egusi, beans, pepper base), "Use it up" urgent ingredient flags, and "Plan My Day" (Breakfast, Lunch, Dinner).
  - *Interactive Actions*: Individual meal reroll (preserving the other 4 while maintaining diversity), one-click aggregated shopping list copy, and cooked meal memory in `localStorage`.
- **Visual Aesthetic**: Warm organic culinary theme with rich terracotta (`#C2593F`), golden amber (`#E08726`), creamy oatmeal parchment backgrounds, and refined typography.
- **License Compliance**: Prominent **Apache-2.0 & Gemma Terms of Use** badge in the header/footer with an interactive modal detailing the open-source Gemma 4 license and GitHub repository export readiness.

***

## 1. Overview & Core Concept

When users stare into their fridge, standard recipe tools suggest 5 minor variations of the same dish (e.g. stir-fry with rice, stir-fry with noodles, chicken rice bowl). **Pantry Roulette** solves culinary boredom and food waste through **transformation rather than shopping**:

1. **Input Available Items**: The user clicks common ingredient chips or types custom items. A "Basic Pantry Assumed" toggle (oil, salt, garlic, soy, vinegar, pepper) eliminates tedious typing.
2. **Gemma 4 Culinary Intelligence**: Our server-side Gemma 4 engine crafts customized recipes, provides cheap ingredient swaps for missing items, and writes concise steps.
3. **6-Axis Variety Guarantee**: The engine calculates mathematical distance across Cuisine, Technique, Format, Texture, Effort, and Role. If two dishes are too similar, the engine strictly refuses clones.
4. **Actionable Utility**: Single-click card reroll, aggregated shopping list generation for only what's missing, direct YouTube tutorial search links, and a full "Plan My Day" mode.

***

## 2. User Experience & Visual Design

### Key User Flows

1. **Hero & Pantry Input**:
   - Clean, inviting interface with a headline: *"Same fridge. Five completely different dinners."*
   - Ingredient bar with quick-add chips (e.g., Chicken, Eggs, Rice, Tomato, Beans, Plantain, Spinach, Tofu, Pasta, Potatoes, Lime, Yogurt).
   - "Use It Up First" toggle/badge to mark items close to spoiling.
   - Quick toggles: *Basic Pantry Assumed*, *Nigerian Food Mode*, and *Under 20 Mins*.
2. **Generation & Variety Feed**:
   - Primary action: **"Generate 5 Distinct Meals"** or secondary **"Plan My Day (Breakfast, Lunch, Dinner)"**.
   - Interactive variety badge showing live diversity index (e.g. *"Variety: 5/5 Distinct (0 Repeat Techniques)"*).
   - 5 responsive meal cards arranged in a clear grid.
3. **Meal Card Architecture**:
   - Card Badge: Leading card is tagged `"Best Match"`; subsequent cards explicitly state *"Why it's different"* (e.g., `"Cold & Crunchy Salad vs. Sear"`).
   - Axis Indicators: Subtle typographic metadata for Cuisine, Technique, Format, Texture, and Time.
   - Core Content: Dish title, 1-sentence description, ingredients you have, missing ingredients with **Gemma 4 Cheap Swaps**.
   - Balance Note: Student-friendly nutritional balance reminder.
   - Card Actions: `Reroll This Dish` (swaps just this card while maintaining variety), `Watch Video` (opens verified YouTube search), and `Cooked Today` (saves to history).
4. **Footer & Compliance Utility**:
   - Aggregated shopping list modal / copy button.
   - Open-source Gemma 4 Apache 2.0 license modal with complete legal text, model weights attribution, and GitHub push/export bundle info.

### Visual Identity & Theme Tokens

- **Dominant Neutral Canvas (60%)**: Warm linen / cream parchment (`#FDFBF7` in light mode, deep warm espresso `#191614` in dark mode).
- **Structural Surfaces (30%)**: Soft stone card containers (`#FFFFFF` / `#24201D`) with 1px hairline borders (`rgba(0,0,0,0.06)`).
- **Accent Budget (10%)**: Artisanal terracotta (`#C2593F`) and roasted amber (`#E08726`) for primary interactive triggers and active filter states.
- **Typography**: Refined display font pairing with clean geometric body text and tabular numerals for timing/metrics.
- **Anti-Slop Restraint**: Zero floating capsule sandwiches, zero decorative pulsing neon dots, zero pseudo-code comments.

***

## 3. Key Product Decisions & Trade-Offs

- **Hybrid AI + Deterministic Variety Engine**:
  - *Chosen Approach*: The mathematical 6-axis distance matrix acts as the invariant gatekeeper, while Gemma 4 AI generates rich, contextual recipe instructions, substitutions, and nutritional balance notes.
  - *Why*: Guarantees instant diversity without hallucinated repeats, while giving users rich, creative cooking guidance tailored to unusual ingredient combinations.
- **Zero-Break YouTube Integration**:
  - *Chosen Approach*: Generating clean, URL-encoded video search queries (`https://www.youtube.com/results?search_query=...`) directly from dish name + primary technique.
  - *Why*: Eliminates hallucinated 404 YouTube video IDs without requiring heavy Google API keys.
- **Local Persistence & Memory**:
  - *Chosen Approach*: `localStorage` holds recent cooked meals and pantry preferences.
  - *Why*: Instant, offline-capable, zero latency, and protects user privacy without forced login barriers.

***

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Pantry Roulette UI (React)                      │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Ingredient Input &    │  │       Toggles & Mode Switches       │  │
│  │   Quick-Add Chips       │  │  (Pantry, Nigerian Mode, Quick 20m) │  │
│  └────────────┬────────────┘  └──────────────────┬──────────────────┘  │
│               │                                  │                     │
│               ▼                                  ▼                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Variety Selection Engine                      │  │
│  │      - 6-Axis Distance Matrix (Cuisine, Technique, Vessel...)    │  │
│  │      - R1 (Distance >= 3/6) & R2 (Unique Technique & Format)     │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
│                                 │                                      │
│                                 ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Server Proxy Route (/api/generate-meals)            │  │
│  │            Google GenAI SDK (Gemma 4 / Gemini Backend)           │  │
│  │      - Structured JSON Recipes, Cheap Swaps, Balance Notes       │  │
│  └──────────────────────────────┬───────────────────────────────────┘  │
│                                 │                                      │
│                                 ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Results Grid & Action System                     │  │
│  │  - 5 Distinct Meal Cards       - Single-Card Reroll Handler      │  │
│  │  - One-Click Shopping Copy     - Day Planner (Breakfast/Lunch/Din)│ │
│  │  - YouTube Search Launcher     - Gemma 4 Apache 2.0 Modal        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema & Types

```typescript
interface MealAxis {
  cuisine: string;      // Italian, Thai, Mexican, West African / Nigerian, Levantine, Indian, Japanese, American
  technique: string;    // sear, roast, braise/simmer, steam, fry, broil/char, raw/no-cook, bake
  format: string;       // bowl, soup, wrap/taco, skillet hash, salad, sandwich, noodles/pasta, sheet-pan
  texture: string;      // crispy, creamy, brothy, crunchy, charred, saucy
  effort: string;       // 5-min assembly, 15-20 min, 35-min bake
  role: string;         // quick dinner, comfort main, light fresh plate
}

interface MealCard {
  id: string;
  name: string;
  description: string;
  whyDifferent: string;
  cookTimeMinutes: number;
  axis: MealAxis;
  ingredientsYouHave: string[];
  ingredientsMissing: string[];
  cheapSwap: string;
  balanceNote: string;
  steps: string[];
  videoSearchQuery: string;
}

interface DayPlan {
  breakfast: MealCard;
  lunch: MealCard;
  dinner: MealCard;
  dayBalanceNote: string;
}
```

### GitHub Export & Public Repo Push

To satisfy the requirement of pushing to a new public GitHub repo under `github.com/thathorserep`:
- We will include a dedicated `LICENSE` file containing the full **Apache License 2.0** text with Google Gemma Terms of Use.
- We will provide a clean, complete `README.md` with demo script, architecture documentation, screenshots guide, and single-click export script.
- We will provide an in-app "Export to GitHub" one-click action and copyable `git` push commands so the user can push directly to their GitHub account immediately.

***
