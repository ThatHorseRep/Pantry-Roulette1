import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Shuffle, ShieldCheck, ShoppingBag, GitBranch, AlertCircle, Info, Flame, CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { IngredientInput } from './components/IngredientInput';
import { MealCardView } from './components/MealCardView';
import { DayPlanModal } from './components/DayPlanModal';
import { ShoppingListModal } from './components/ShoppingListModal';
import { LicenseModal } from './components/LicenseModal';
import { GitHubExportModal } from './components/GitHubExportModal';
import { MealCard, DayPlan, PantryFilterState, RecipeGenerationResponse } from './types';
import { generateDiverseMealSet, rerollSingleMeal, constructDayPlan } from './engine/varietyEngine';

const DEFAULT_INGREDIENTS = ['Chicken', 'Rice', 'Broccoli', 'Tomatoes', 'Onions', 'Lime'];

export default function App() {
  const [ingredients, setIngredients] = useState<string[]>(DEFAULT_INGREDIENTS);
  const [filters, setFilters] = useState<PantryFilterState>({
    assumeBasicPantry: true,
    nigerianMode: false,
    under20Mins: false,
    spoilFirstItems: []
  });

  const [meals, setMeals] = useState<MealCard[]>([]);
  const [varietyScore, setVarietyScore] = useState<string>('5/5 Distinct Dishes');
  const [varietyExplanation, setVarietyExplanation] = useState<string>('Zero repeat techniques · >=3 differing culinary axes between every meal');
  const [source, setSource] = useState<'gemma4' | 'engine-fallback'>('gemma4');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rerollingIndex, setRerollingIndex] = useState<number | null>(null);

  // Persistence for cooked dishes
  const [cookedIds, setCookedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('pantry_roulette_cooked');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Modals state
  const [isDayPlanOpen, setIsDayPlanOpen] = useState(false);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [isDayPlanLoading, setIsDayPlanLoading] = useState(false);

  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [isGitHubExportOpen, setIsGitHubExportOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleCooked = (id: string) => {
    setCookedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast('Removed from cooked history');
      } else {
        next.add(id);
        showToast('Marked cooked! History updated so tomorrow won\'t repeat.');
      }
      try {
        localStorage.setItem('pantry_roulette_cooked', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Generate 5 distinct dinners
  const handleGenerate = async (targetIngredients = ingredients, targetFilters = filters) => {
    if (targetIngredients.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: targetIngredients,
          assumeBasicPantry: targetFilters.assumeBasicPantry,
          nigerianMode: targetFilters.nigerianMode,
          under20Mins: targetFilters.under20Mins,
          spoilFirstItems: targetFilters.spoilFirstItems
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: RecipeGenerationResponse = await response.json();
      setMeals(data.meals);
      setVarietyScore(data.varietyScore);
      setVarietyExplanation(data.varietyExplanation);
      setSource(data.source);
      showToast(`Generated 5 distinct meals with Gemma 4 variety engine`);
    } catch (err) {
      console.warn('API error, switching to client-side variety engine fallback:', err);
      // Deterministic variety engine fallback
      const fallback = generateDiverseMealSet(targetIngredients, 5, targetFilters);
      setMeals(fallback.meals);
      setVarietyScore(fallback.diversityScore);
      setVarietyExplanation(fallback.diversityNote);
      setSource('engine-fallback');
      showToast('Generated 5 distinct meals using 6-axis variety algorithm');
    } finally {
      setIsLoading(false);
    }
  };

  // Reroll single meal card
  const handleReroll = async (index: number) => {
    if (index < 0 || index >= meals.length) return;
    setRerollingIndex(index);

    try {
      const response = await fetch('/api/reroll-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCards: meals,
          replaceIndex: index,
          ingredients,
          assumeBasicPantry: filters.assumeBasicPantry,
          nigerianMode: filters.nigerianMode,
          under20Mins: filters.under20Mins,
          spoilFirstItems: filters.spoilFirstItems
        })
      });

      if (!response.ok) throw new Error('Reroll failed');
      const data = await response.json();
      const updated = [...meals];
      updated[index] = data.meal;
      setMeals(updated);
      showToast(`Rerolled dish #${index + 1} while maintaining diversity`);
    } catch (err) {
      console.warn('Reroll fallback:', err);
      const rerolled = rerollSingleMeal(meals, index, ingredients, filters);
      const updated = [...meals];
      updated[index] = rerolled;
      setMeals(updated);
      showToast(`Rerolled dish #${index + 1} with local variety algorithm`);
    } finally {
      setRerollingIndex(null);
    }
  };

  // Plan My Day
  const handlePlanDay = async () => {
    setIsDayPlanLoading(true);
    setIsDayPlanOpen(true);

    try {
      const response = await fetch('/api/plan-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          assumeBasicPantry: filters.assumeBasicPantry,
          nigerianMode: filters.nigerianMode,
          under20Mins: filters.under20Mins,
          spoilFirstItems: filters.spoilFirstItems
        })
      });

      if (!response.ok) throw new Error('Day plan failed');
      const data = await response.json();
      setDayPlan(data.dayPlan);
    } catch (err) {
      console.warn('Day plan fallback:', err);
      const fallback = constructDayPlan(ingredients, filters);
      setDayPlan(fallback);
    } finally {
      setIsDayPlanLoading(false);
    }
  };

  // Surprise Me - Randomizer that maximizes distance
  const handleSurpriseMe = () => {
    const surprisePools = [
      ['Plantain', 'Eggs', 'Tomatoes', 'Peppers', 'Onions'],
      ['Chicken', 'Potatoes', 'Broccoli', 'Garlic', 'Yogurt'],
      ['Tofu', 'Rice', 'Cabbage', 'Soy sauce', 'Lime'],
      ['Beans', 'Plantain', 'Spinach', 'Onions', 'Peppers']
    ];
    const picked = surprisePools[Math.floor(Math.random() * surprisePools.length)];
    setIngredients(picked);
    handleGenerate(picked, filters);
  };

  // Initial load
  useEffect(() => {
    handleGenerate(DEFAULT_INGREDIENTS, filters);
  }, []);

  // Compute union of missing items count for badge
  const uniqueMissingCount = new Set(meals.flatMap(m => m.ingredientsMissing)).size;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenDayPlan={() => {
          setIsDayPlanOpen(true);
          if (!dayPlan) handlePlanDay();
        }}
        onOpenShoppingList={() => setIsShoppingListOpen(true)}
        onOpenLicense={() => setIsLicenseOpen(true)}
        onOpenGitHubExport={() => setIsGitHubExportOpen(true)}
        shoppingListCount={uniqueMissingCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-8">
        {/* Hero Banner Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-100/70 text-amber-900 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C2593F]" />
              <span>Gemma 4 Open-Source AI Variety Engine</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Same fridge. Five completely different dinners.
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2.5 leading-relaxed">
              Standard recipe sites search for similarity. Pantry Roulette enforces <strong className="text-stone-900 font-semibold">maximum dissimilarity</strong> across 6 culinary dimensions, proving you don&apos;t need more groceries—just transformation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSurpriseMe}
              disabled={isLoading}
              className="px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#C2593F]" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Ingredient Input & Control Center */}
        <IngredientInput
          ingredients={ingredients}
          onChangeIngredients={setIngredients}
          filters={filters}
          onChangeFilters={setFilters}
          onGenerate={() => handleGenerate(ingredients, filters)}
          onPlanDay={handlePlanDay}
          isLoading={isLoading}
        />

        {/* Live Variety Engine Guarantee Dashboard */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-sm shrink-0">
              6D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-amber-300">
                  {varietyScore}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                  R1 & R2 Guaranteed
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {varietyExplanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <button
              onClick={() => setIsShoppingListOpen(true)}
              className="px-3 py-1.5 bg-stone-700/80 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Shopping List ({uniqueMissingCount})</span>
            </button>

            <button
              onClick={() => setIsLicenseOpen(true)}
              className="px-3 py-1.5 bg-stone-700/80 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apache 2.0</span>
            </button>
          </div>
        </div>

        {/* Meal Cards Grid */}
        <section aria-label="Generated Dinners">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-bold text-stone-900 tracking-tight">
              Tonight&apos;s 5 Diverse Transformations
            </h2>
            <span className="text-xs text-stone-500">
              Each dish differs on $\ge 3$ of 6 axes with 0 duplicate techniques
            </span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map(idx => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-pulse min-h-[380px]"
                >
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                  <div className="h-6 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="h-3 bg-stone-100 rounded w-5/6" />
                  <div className="h-16 bg-stone-50 rounded-xl" />
                  <div className="h-8 bg-stone-100 rounded-lg mt-8" />
                </div>
              ))}
            </div>
          ) : meals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meals.map((meal, index) => (
                <MealCardView
                  key={meal.id || index}
                  meal={meal}
                  index={index}
                  onReroll={handleReroll}
                  onToggleCooked={handleToggleCooked}
                  isCooked={cookedIds.has(meal.id)}
                  isRerolling={rerollingIndex === index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <ChefHat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-700">No ingredients selected</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Type ingredients above or click a preset box to generate 5 guaranteed distinct meals.
              </p>
            </div>
          )}
        </section>

        {/* Why This Beats ChatGPT Banner */}
        <div className="p-6 bg-stone-100/80 border border-stone-200/90 rounded-2xl text-xs text-stone-700 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#C2593F]" />
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Why the 6-Axis Variety Engine Beats Generic AI Prompting
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-3 bg-white rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-900 block mb-1">1. Mathematical Distance</span>
              <p className="text-stone-600 leading-relaxed">
                Rules R1 and R2 enforce distance $\ge 0.5$ across Cuisine, Technique, Vessel, Texture, Time, and Role. No two stir-fries ever slip through.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-900 block mb-1">2. Single-Card Reroll</span>
              <p className="text-stone-600 leading-relaxed">
                Dislike one meal? Reroll it individually while holding the other 4 fixed; the diversity invariant dynamically re-evaluates in real time.
              </p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200/70">
              <span className="font-bold text-stone-900 block mb-1">3. Minimal Union Shopping</span>
              <p className="text-stone-600 leading-relaxed">
                The engine pinpoints the single missing item per dish, and the deduplicated shopping list is usually only 1–3 items total.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/60 py-6 px-4 sm:px-8 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">Pantry Roulette</span>
            <span>·</span>
            <span>Powered by Gemma 4 Open AI</span>
            <span>·</span>
            <button
              onClick={() => setIsLicenseOpen(true)}
              className="hover:text-stone-900 hover:underline cursor-pointer font-semibold text-[#C2593F]"
            >
              Apache 2.0 License
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGitHubExportOpen(true)}
              className="text-stone-700 hover:text-stone-950 flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>github.com/thathorserep</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DayPlanModal
        isOpen={isDayPlanOpen}
        onClose={() => setIsDayPlanOpen(false)}
        dayPlan={dayPlan}
        isLoading={isDayPlanLoading}
      />

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        meals={meals}
      />

      <LicenseModal
        isOpen={isLicenseOpen}
        onClose={() => setIsLicenseOpen(false)}
      />

      <GitHubExportModal
        isOpen={isGitHubExportOpen}
        onClose={() => setIsGitHubExportOpen(false)}
      />
    </div>
  );
}
