import React, { useState } from 'react';
import { X, CalendarDays, Copy, Check, Clock, Utensils, HeartPulse } from 'lucide-react';
import { DayPlan } from '../types';

interface DayPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayPlan: DayPlan | null;
  isLoading: boolean;
}

export const DayPlanModal: React.FC<DayPlanModalProps> = ({
  isOpen,
  onClose,
  dayPlan,
  isLoading
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPlan = () => {
    if (!dayPlan) return;
    const text = `🍳 PANTRY ROULETTE — MY 1-DAY PLAN (Powered by Gemma 4)

🌅 BREAKFAST: ${dayPlan.breakfast.name} (${dayPlan.breakfast.cookTimeMinutes}m)
   ${dayPlan.breakfast.description}
   Uses: ${dayPlan.breakfast.ingredientsYouHave.join(', ')}

☀️ LUNCH: ${dayPlan.lunch.name} (${dayPlan.lunch.cookTimeMinutes}m)
   ${dayPlan.lunch.description}
   Uses: ${dayPlan.lunch.ingredientsYouHave.join(', ')}

🌙 DINNER: ${dayPlan.dinner.name} (${dayPlan.dinner.cookTimeMinutes}m)
   ${dayPlan.dinner.description}
   Uses: ${dayPlan.dinner.ingredientsYouHave.join(', ')}

💡 NUTRITION NOTE: ${dayPlan.dayBalanceNote}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#C2593F] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Your Cohesive 1-Day Meal Plan
              </h3>
              <p className="text-xs text-stone-500">
                Breakfast, lunch, and dinner built from your exact pantry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-stone-500 text-sm">
              <div className="w-8 h-8 border-3 border-[#C2593F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>Gemma 4 is curating your 1-day culinary itinerary...</span>
            </div>
          ) : dayPlan ? (
            <>
              {/* Daily Balance Note */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                <HeartPulse className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  <strong>Nutrition Balance: </strong>
                  {dayPlan.dayBalanceNote}
                </span>
              </div>

              {/* The 3 Meals Timeline */}
              <div className="space-y-3">
                {/* Breakfast */}
                <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-800 mb-1">
                    <span>BREAKFAST</span>
                    <span className="text-stone-500 tabular-nums">{dayPlan.breakfast.cookTimeMinutes}m</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900">{dayPlan.breakfast.name}</h4>
                  <p className="text-xs text-stone-600 mt-1">{dayPlan.breakfast.description}</p>
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Uses: </span>
                    {dayPlan.breakfast.ingredientsYouHave.join(', ')}
                  </div>
                </div>

                {/* Lunch */}
                <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#C2593F] mb-1">
                    <span>LUNCH</span>
                    <span className="text-stone-500 tabular-nums">{dayPlan.lunch.cookTimeMinutes}m</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900">{dayPlan.lunch.name}</h4>
                  <p className="text-xs text-stone-600 mt-1">{dayPlan.lunch.description}</p>
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Uses: </span>
                    {dayPlan.lunch.ingredientsYouHave.join(', ')}
                  </div>
                </div>

                {/* Dinner */}
                <div className="p-4 rounded-xl border border-stone-200/90 bg-stone-50/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>DINNER</span>
                    <span className="text-stone-500 tabular-nums">{dayPlan.dinner.cookTimeMinutes}m</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-stone-900">{dayPlan.dinner.name}</h4>
                  <p className="text-xs text-stone-600 mt-1">{dayPlan.dinner.description}</p>
                  <div className="mt-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Uses: </span>
                    {dayPlan.dinner.ingredientsYouHave.join(', ')}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-stone-500 text-sm">
              Please click &quot;Plan My Day&quot; on the main screen to generate.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopyPlan}
            disabled={!dayPlan}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Plan!' : 'Copy Day Plan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
