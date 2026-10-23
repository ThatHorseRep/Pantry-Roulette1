import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, AlertTriangle, Sparkles, Check, Flame, Clock, RefreshCw } from 'lucide-react';
import { PantryFilterState } from '../types';

interface IngredientInputProps {
  ingredients: string[];
  onChangeIngredients: (ingredients: string[]) => void;
  filters: PantryFilterState;
  onChangeFilters: (filters: PantryFilterState) => void;
  onGenerate: () => void;
  onPlanDay: () => void;
  isLoading: boolean;
}

const QUICK_CHIPS = [
  { label: 'Chicken', category: 'protein' },
  { label: 'Eggs', category: 'protein' },
  { label: 'Tofu', category: 'protein' },
  { label: 'Rice', category: 'starch' },
  { label: 'Pasta', category: 'starch' },
  { label: 'Plantain', category: 'nigerian' },
  { label: 'Yam', category: 'nigerian' },
  { label: 'Beans', category: 'protein' },
  { label: 'Tomatoes', category: 'veg' },
  { label: 'Onions', category: 'veg' },
  { label: 'Spinach', category: 'veg' },
  { label: 'Broccoli', category: 'veg' },
  { label: 'Potatoes', category: 'starch' },
  { label: 'Cheese', category: 'dairy' },
  { label: 'Yogurt', category: 'dairy' },
  { label: 'Lime', category: 'aromatic' }
];

const PRESETS = [
  {
    name: 'Student Budget Box',
    items: ['Rice', 'Eggs', 'Tomatoes', 'Onions', 'Beans']
  },
  {
    name: 'Nigerian Kitchen',
    items: ['Plantain', 'Eggs', 'Rice', 'Tomatoes', 'Peppers', 'Onions', 'Beans']
  },
  {
    name: 'Fresh & High Protein',
    items: ['Chicken', 'Broccoli', 'Spinach', 'Rice', 'Lime', 'Yogurt']
  }
];

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onChangeIngredients,
  filters,
  onChangeFilters,
  onGenerate,
  onPlanDay,
  isLoading
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/[,+]/).map(p => p.trim()).filter(Boolean);
    const updated = Array.from(new Set([...ingredients, ...parts]));
    onChangeIngredients(updated);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd(inputValue);
    }
  };

  const handleRemove = (item: string) => {
    onChangeIngredients(ingredients.filter(i => i !== item));
    if (filters.spoilFirstItems.includes(item)) {
      onChangeFilters({
        ...filters,
        spoilFirstItems: filters.spoilFirstItems.filter(s => s !== item)
      });
    }
  };

  const toggleSpoilFirst = (item: string) => {
    const isSpoil = filters.spoilFirstItems.includes(item);
    onChangeFilters({
      ...filters,
      spoilFirstItems: isSpoil
        ? filters.spoilFirstItems.filter(s => s !== item)
        : [...filters.spoilFirstItems, item]
    });
  };

  const applyPreset = (presetItems: string[]) => {
    onChangeIngredients(presetItems);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-stone-200/90 shadow-sm transition-all">
      {/* Title & Micro kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            What is in your fridge right now?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Type ingredients, tap quick-chips, or load a preset box to test the variety engine.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">Presets:</span>
          {PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset.items)}
              className="text-xs font-medium px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition-colors cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type ingredients separated by commas (e.g. chicken, rice, lime, plantain)..."
          className="w-full pl-4 pr-24 py-3 bg-stone-50/70 border border-stone-300 rounded-xl text-stone-900 placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#C2593F]/20 focus:border-[#C2593F] transition-all"
        />
        <button
          onClick={() => handleAdd(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute right-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Active Selected Chips */}
      {ingredients.length > 0 && (
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-600">
              Your Pantry ({ingredients.length} items)
            </span>
            <span className="text-[11px] text-stone-400">
              Tip: Click the flame on any item to mark it as &quot;about to spoil&quot;
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ingredients.map(item => {
              const isSpoil = filters.spoilFirstItems.includes(item);
              return (
                <div
                  key={item}
                  className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSpoil
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                      : 'bg-stone-100/90 border-stone-200 text-stone-800'
                  }`}
                >
                  <span>{item}</span>
                  <button
                    onClick={() => toggleSpoilFirst(item)}
                    title={isSpoil ? 'Marked urgent: Use first' : 'Mark about to spoil'}
                    className={`p-0.5 rounded transition-colors cursor-pointer ${
                      isSpoil ? 'text-amber-600 hover:text-amber-800' : 'text-stone-400 hover:text-amber-600'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-0.5 text-stone-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Add Tray */}
      <div className="mt-4 flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-stone-500 mr-1">Quick Add:</span>
        {QUICK_CHIPS.map(chip => {
          const isAdded = ingredients.some(i => i.toLowerCase() === chip.label.toLowerCase());
          return (
            <button
              key={chip.label}
              onClick={() => {
                if (isAdded) {
                  handleRemove(chip.label);
                } else {
                  handleAdd(chip.label);
                }
              }}
              className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                isAdded
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              {isAdded && <Check className="w-3 h-3 text-amber-400" />}
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Invariants & Filter Toggles */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={filters.assumeBasicPantry}
              onChange={e => onChangeFilters({ ...filters, assumeBasicPantry: e.target.checked })}
              className="w-4 h-4 rounded text-[#C2593F] focus:ring-[#C2593F] accent-[#C2593F] cursor-pointer"
            />
            <span>Assume pantry basics (oil, salt, garlic, soy, vinegar)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={filters.nigerianMode}
              onChange={e => onChangeFilters({ ...filters, nigerianMode: e.target.checked })}
              className="w-4 h-4 rounded text-[#C2593F] focus:ring-[#C2593F] accent-[#C2593F] cursor-pointer"
            />
            <span className="text-[#C2593F] font-semibold">Nigerian Culinary Mode</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-medium">
            <input
              type="checkbox"
              checked={filters.under20Mins}
              onChange={e => onChangeFilters({ ...filters, under20Mins: e.target.checked })}
              className="w-4 h-4 rounded text-[#C2593F] focus:ring-[#C2593F] accent-[#C2593F] cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>Under 20 mins</span>
            </span>
          </label>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPlanDay}
            disabled={isLoading || ingredients.length === 0}
            className="px-4 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Plan My Day
          </button>

          <button
            onClick={onGenerate}
            disabled={isLoading || ingredients.length === 0}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#C2593F] to-[#E08726] hover:from-[#b04d35] hover:to-[#ce781b] rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Gemma 4...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Generate 5 Distinct Meals</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
