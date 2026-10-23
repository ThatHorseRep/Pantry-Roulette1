import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { generateDiverseMealSet, rerollSingleMeal, constructDayPlan } from './src/engine/varietyEngine.ts';
import { PantryFilterState } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client, fallback engine active:', err);
  }
}

// Helper to sanitize array of strings
function cleanStringArray(arr: any): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => String(item).trim()).filter(Boolean);
}

// POST /api/generate-meals
app.post('/api/generate-meals', async (req, res) => {
  try {
    const rawIngredients = cleanStringArray(req.body.ingredients);
    const filterOptions: PantryFilterState = {
      assumeBasicPantry: Boolean(req.body.assumeBasicPantry ?? true),
      nigerianMode: Boolean(req.body.nigerianMode ?? false),
      under20Mins: Boolean(req.body.under20Mins ?? false),
      spoilFirstItems: cleanStringArray(req.body.spoilFirstItems),
    };

    if (rawIngredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least 1 ingredient' });
    }

    // Baseline deterministic generation
    const engineBaseline = generateDiverseMealSet(rawIngredients, 5, filterOptions);

    // If Gemini/Gemma API is available, enhance with LLM copy & creative twists
    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are Gemma 4, an open-source culinary nutritionist and meal variety engine (Apache 2.0).
The user has the following ingredients in their fridge:
${rawIngredients.join(', ')}
${filterOptions.spoilFirstItems.length > 0 ? `Urgent items to use up first: ${filterOptions.spoilFirstItems.join(', ')}` : ''}
${filterOptions.assumeBasicPantry ? 'Assumed pantry staples available: salt, black pepper, cooking oil, water, garlic, onion, soy sauce, vinegar, butter.' : ''}
${filterOptions.nigerianMode ? 'Preference: Prioritize authentic Nigerian and West African flavors and cooking techniques where applicable (Jollof, plantain/dodo, beans, pepper soup, egusi, efo riro).' : ''}
${filterOptions.under20Mins ? 'Preference: Under 20 minutes cook time.' : ''}

Generate 5 GENUINELY DIFFERENT dinners.
Strict Variety Invariants:
1. Rule 1 (No Clones): Any two meals in this 5-set must differ on >= 3 of 6 axes: Cuisine, Technique, Format/Vessel, Texture, Effort, Role.
2. Rule 2 (No Repeats): Zero duplicate primary cooking techniques across all 5 meals.
3. Contrast: Label each dish from #2 onwards with why it differs from #1 (e.g. "Cold & crunchy salad vs sear").
4. Cheap Swaps: For any missing ingredient, provide a cheap student-friendly swap.
5. Nutrition Note: A concise 1-sentence macronutrient balance note.
6. YouTube Search Query: A realistic search phrase for cooking video instructions (e.g. "how to cook authentic smoky jollof rice").

Return strictly valid JSON conforming to the requested schema.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                varietyScore: { type: Type.STRING },
                varietyExplanation: { type: Type.STRING },
                meals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      whyDifferent: { type: Type.STRING },
                      cookTimeMinutes: { type: Type.INTEGER },
                      axis: {
                        type: Type.OBJECT,
                        properties: {
                          cuisine: { type: Type.STRING },
                          technique: { type: Type.STRING },
                          format: { type: Type.STRING },
                          texture: { type: Type.STRING },
                          effort: { type: Type.STRING },
                          role: { type: Type.STRING },
                        },
                        required: ['cuisine', 'technique', 'format', 'texture', 'effort', 'role'],
                      },
                      ingredientsYouHave: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      ingredientsMissing: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      cheapSwap: { type: Type.STRING },
                      balanceNote: { type: Type.STRING },
                      steps: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      videoSearchQuery: { type: Type.STRING },
                    },
                    required: [
                      'id', 'name', 'description', 'whyDifferent', 'cookTimeMinutes',
                      'axis', 'ingredientsYouHave', 'ingredientsMissing', 'cheapSwap',
                      'balanceNote', 'steps', 'videoSearchQuery'
                    ],
                  },
                },
              },
              required: ['varietyScore', 'varietyExplanation', 'meals'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed && Array.isArray(parsed.meals) && parsed.meals.length >= 3) {
            return res.json({
              meals: parsed.meals,
              varietyScore: parsed.varietyScore || engineBaseline.diversityScore,
              varietyExplanation: parsed.varietyExplanation || engineBaseline.diversityNote,
              source: 'gemma4',
            });
          }
        }
      } catch (genAiError) {
        console.warn('Gemini/Gemma API error, falling back to deterministic variety engine:', genAiError);
      }
    }

    // Default to the deterministic 6-axis engine
    return res.json({
      meals: engineBaseline.meals,
      varietyScore: engineBaseline.diversityScore,
      varietyExplanation: engineBaseline.diversityNote,
      source: 'engine-fallback',
    });
  } catch (error: any) {
    console.error('Server error generating meals:', error);
    res.status(500).json({ error: error.message || 'Failed to generate meals' });
  }
});

// POST /api/reroll-meal
app.post('/api/reroll-meal', (req, res) => {
  try {
    const currentCards = req.body.currentCards;
    const replaceIndex = Number(req.body.replaceIndex);
    const rawIngredients = cleanStringArray(req.body.ingredients);
    const filterOptions: PantryFilterState = {
      assumeBasicPantry: Boolean(req.body.assumeBasicPantry ?? true),
      nigerianMode: Boolean(req.body.nigerianMode ?? false),
      under20Mins: Boolean(req.body.under20Mins ?? false),
      spoilFirstItems: cleanStringArray(req.body.spoilFirstItems),
    };

    if (!Array.isArray(currentCards) || replaceIndex < 0 || replaceIndex >= currentCards.length) {
      return res.status(400).json({ error: 'Invalid current cards or replace index' });
    }

    const rerolled = rerollSingleMeal(currentCards, replaceIndex, rawIngredients, filterOptions);
    res.json({ meal: rerolled });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reroll meal' });
  }
});

// POST /api/plan-day
app.post('/api/plan-day', (req, res) => {
  try {
    const rawIngredients = cleanStringArray(req.body.ingredients);
    const filterOptions: PantryFilterState = {
      assumeBasicPantry: Boolean(req.body.assumeBasicPantry ?? true),
      nigerianMode: Boolean(req.body.nigerianMode ?? false),
      under20Mins: Boolean(req.body.under20Mins ?? false),
      spoilFirstItems: cleanStringArray(req.body.spoilFirstItems),
    };

    const dayPlan = constructDayPlan(rawIngredients, filterOptions);
    res.json({ dayPlan });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate day plan' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pantry Roulette server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
