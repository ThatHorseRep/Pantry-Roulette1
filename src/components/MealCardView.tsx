import React, { useState } from 'react';
import { Clock, RefreshCw, Youtube, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Lightbulb, HeartPulse } from 'lucide-react';
import { MealCard } from '../types';

interface MealCardViewProps {
  meal: MealCard;
  index: number;
  onReroll: (index: number) => void;
  onToggleCooked: (id: string) => void;
  isCooked: boolean;
  isRerolling: boolean;
}

export const MealCardView: React.FC<MealCardViewProps> = ({
  meal,
  index,
  onReroll,
  onToggleCooked,
  isCooked,
  isRerolling
}) => {
  const [showSteps, setShowSteps] = useState(false);

  // Build clean YouTube search URL
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(meal.videoSearchQuery || meal.name)}`;

  return (
    <article
      className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        isCooked ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200/90'
      }`}
    >
      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Contrast Lead Kicker & Cook Time */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
              index === 0
                ? 'bg-[#C2593F]/10 text-[#C2593F]'
                : 'bg-amber-100/70 text-amber-900'
            }`}
          >
            {meal.whyDifferent || (index === 0 ? 'Best Pantry Match' : 'Distinct Transformation')}
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-stone-500 tabular-nums">
            <Clock className="w-3.5 h-3.5" />
            <span>{meal.cookTimeMinutes}m</span>
          </span>
        </div>

        {/* Dish Title & Description */}
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-snug tracking-tight">
            {meal.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
            {meal.description}
          </p>
        </div>

        {/* 6-Axis Metadata (Unboxed Typography with typographic separators) */}
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-semibold text-stone-500 pt-1 pb-1">
          <span className="text-stone-800">{meal.axis.cuisine}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-[#C2593F]">{meal.axis.technique}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{meal.axis.format}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-600">{meal.axis.texture}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-400">{meal.axis.role}</span>
        </div>

        {/* Ingredients: You Have vs Missing */}
        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200/60 text-xs flex flex-col gap-2">
          <div>
            <span className="font-semibold text-stone-700">In your fridge: </span>
            <span className="text-stone-600">
              {meal.ingredientsYouHave.length > 0 ? meal.ingredientsYouHave.join(', ') : 'Pantry staples'}
            </span>
          </div>

          <div>
            <span className="font-semibold text-rose-800">Need to unlock: </span>
            <span className="text-rose-700 font-medium">
              {meal.ingredientsMissing.length > 0 ? meal.ingredientsMissing.join(', ') : 'None! Cookable now.'}
            </span>
          </div>

          {/* Cheap Swap */}
          {meal.cheapSwap && (
            <div className="pt-1 border-t border-stone-200/60 flex items-start gap-1.5 text-stone-600">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-tight">
                <strong className="text-stone-800 font-semibold">Budget Swap: </strong>
                {meal.cheapSwap}
              </span>
            </div>
          )}
        </div>

        {/* Balance Note */}
        {meal.balanceNote && (
          <div className="flex items-start gap-1.5 text-[11px] text-stone-500 bg-emerald-50/60 border border-emerald-200/60 rounded-lg p-2.5">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
            <span className="leading-tight text-emerald-900">
              <strong className="font-semibold">Nutrition Balance: </strong>
              {meal.balanceNote}
            </span>
          </div>
        )}

        {/* Expandable Steps */}
        <div>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 transition-colors cursor-pointer py-1"
          >
            <span>{showSteps ? 'Hide Recipe Steps' : `View ${meal.steps.length} Preparation Steps`}</span>
            {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSteps && (
            <ol className="mt-2.5 space-y-2 text-xs text-stone-700 list-decimal list-inside pl-1 bg-white p-3 rounded-xl border border-stone-100">
              {meal.steps.map((step, sIdx) => (
                <li key={sIdx} className="leading-relaxed">
                  <span className="text-stone-800">{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between gap-2 text-xs">
        {/* Watch YouTube Guide */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 font-semibold transition-colors cursor-pointer"
          title="Watch verified video tutorial on YouTube"
        >
          <Youtube className="w-4 h-4 text-rose-600" />
          <span>Watch Video</span>
        </a>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Mark Cooked */}
          <button
            onClick={() => onToggleCooked(meal.id)}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
              isCooked
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isCooked ? 'Cooked' : 'Cooked Today'}</span>
          </button>

          {/* Reroll this dish */}
          <button
            onClick={() => onReroll(index)}
            disabled={isRerolling}
            title="Reroll only this dish while maintaining the 6-axis variety guarantee"
            className="px-2.5 py-1.5 rounded-lg text-stone-700 hover:text-stone-950 hover:bg-stone-200/70 font-semibold transition-all cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C2593F] ${isRerolling ? 'animate-spin' : ''}`} />
            <span>Reroll</span>
          </button>
        </div>
      </div>
    </article>
  );
};
