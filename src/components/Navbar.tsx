import React from 'react';
import { ChefHat, Sparkles, CalendarDays, ShoppingBag, ShieldCheck, GitBranch } from 'lucide-react';

interface NavbarProps {
  onOpenDayPlan: () => void;
  onOpenShoppingList: () => void;
  onOpenLicense: () => void;
  onOpenGitHubExport: () => void;
  shoppingListCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDayPlan,
  onOpenShoppingList,
  onOpenLicense,
  onOpenGitHubExport,
  shoppingListCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C2593F] to-[#E08726] flex items-center justify-center text-white shadow-sm shadow-amber-900/10">
            <ChefHat className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-none">
              Pantry Roulette
            </span>
            <span className="text-[11px] font-medium text-stone-500 tracking-wide mt-0.5">
              Gemma 4 Variety Engine · Apache 2.0
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-stone-600">
          <button
            onClick={onOpenDayPlan}
            className="flex items-center gap-1.5 hover:text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-[#C2593F]" />
            <span>Plan My Day</span>
          </button>

          <button
            onClick={onOpenShoppingList}
            className="flex items-center gap-1.5 hover:text-stone-950 transition-colors whitespace-nowrap cursor-pointer relative"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E08726]" />
            <span>Shopping List</span>
            {shoppingListCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
                {shoppingListCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenLicense}
            className="flex items-center gap-1.5 hover:text-stone-950 transition-colors whitespace-nowrap cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Gemma 4 License</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenGitHubExport}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            title="Push to github.com/thathorserep"
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-300" />
            <span className="whitespace-nowrap">Export to GitHub</span>
          </button>
        </div>
      </div>
    </header>
  );
};
