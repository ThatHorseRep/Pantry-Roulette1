import React, { useState } from 'react';
import { X, ShoppingBag, Copy, Check, Trash2 } from 'lucide-react';
import { MealCard } from '../types';

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  meals: MealCard[];
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({
  isOpen,
  onClose,
  meals
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract unique union of missing items across the 5 meals
  const missingItemsMap: Record<string, string[]> = {};
  for (const meal of meals) {
    for (const item of meal.ingredientsMissing) {
      const clean = item.trim();
      if (!clean) continue;
      if (!missingItemsMap[clean]) {
        missingItemsMap[clean] = [];
      }
      missingItemsMap[clean].push(meal.name);
    }
  }

  const uniqueMissing = Object.keys(missingItemsMap).sort();

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleCopy = () => {
    const listText = uniqueMissing
      .map(item => `[ ] ${item} (for: ${missingItemsMap[item].join(', ')})`)
      .join('\n');

    const message = `🛒 PANTRY ROULETTE — SHOPPING LIST\nOnly ${uniqueMissing.length} items needed to unlock all 5 meals:\n\n${listText}\n\nGenerated with Gemma 4 AI`;
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#E08726] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Union Shopping List
              </h3>
              <p className="text-xs text-stone-500">
                {uniqueMissing.length} single items unlock all 5 distinct meals
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

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-2.5">
          {uniqueMissing.length === 0 ? (
            <div className="py-8 text-center text-stone-500 text-sm">
              <p className="font-semibold text-stone-800">You are all set!</p>
              <p className="text-xs mt-1">You already have everything needed to cook these dishes.</p>
            </div>
          ) : (
            uniqueMissing.map(item => {
              const isDone = Boolean(checkedItems[item]);
              const usedIn = missingItemsMap[item];
              return (
                <div
                  key={item}
                  onClick={() => toggleCheck(item)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer select-none transition-all ${
                    isDone
                      ? 'bg-stone-50 border-stone-200/60 opacity-60'
                      : 'bg-white border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}} // handled by parent onClick
                      className="w-4 h-4 rounded text-[#C2593F] accent-[#C2593F] cursor-pointer"
                    />
                    <div>
                      <span className={`text-sm font-semibold capitalize ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                        {item}
                      </span>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Needed for: {usedIn.slice(0, 2).join(', ')}
                        {usedIn.length > 2 && ` +${usedIn.length - 2} more`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => setCheckedItems({})}
            className="text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
          >
            Reset Checks
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Done
            </button>
            <button
              onClick={handleCopy}
              disabled={uniqueMissing.length === 0}
              className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-amber-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied List!' : 'Copy Shopping List'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
