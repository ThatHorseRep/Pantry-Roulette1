# Pantry Roulette 🍳 

> **Same ingredients. Five completely different dinners.**  
> Powered by open-source **Gemma 4 AI** and a mathematical **6-Axis Variety Guarantee Engine**.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Powered by Gemma 4](https://img.shields.io/badge/AI-Gemma_4-amber.svg)](https://ai.google.dev/gemma)
[![GitHub](https://img.shields.io/badge/GitHub-thathorserep-orange.svg)](https://github.com/thathorserep)

---

## 💡 The Problem

Most people cook from the same 10–15 ingredients every week. Standard recipe apps or generic chatbots suggest 5 minor variations of the exact same dish (e.g. *chicken stir-fry*, *chicken stir-fry with rice*, *chicken stir-fry with noodles*). The result is meal boredom, food waste, and expensive takeout orders.

**Root cause:** Recipe retrieval is *similarity*-driven. Humans want **dissimilarity** — maximum variety from a fixed ingredient set.

**The Solution:** Variety comes from **transformation** — changing cuisine palette, technique, format, texture, and effort while keeping the same pantry base.

---

## ⚡ Key Features

1. **6-Axis Variety Engine (Mathematical Invariant):**
   - **R1 (No Clones):** Any two meals in a 5-dinner plan must differ on **$\ge 3$ of 6 axes** (Cuisine, Technique, Vessel/Format, Texture/Temperature, Effort/Time, Role).
   - **R2 (No Repeats):** No two dishes share the same `(cuisine, format)` pair, and zero technique duplicates allowed.
2. **Gemma 4 Open-Source AI Core:**
   - Evaluates fridge ingredients against pantry staples.
   - Generates customized meal instructions, balance notes (carbs/protein/veg status), and clever **cheap budget swaps** for missing items.
3. **Verified Cooking Video Guides:**
   - One-click YouTube cooking search launcher (`https://www.youtube.com/results?search_query=...`) for visual technique learning that never throws 404s.
4. **Nigerian Culinary Mode:**
   - Toggle to prioritize authentic West African dishes (Jollof, Egusi soup, Moi Moi, Plantain & Beans, Efo Riro) alongside global culinary traditions.
5. **"Plan My Day" (Breakfast, Lunch & Dinner):**
   - Instantly constructs a cohesive 3-meal plan from your available ingredients.
6. **Smart Reroll & Union Shopping List:**
   - Reroll a single dish without losing the remaining 4 (variety rules re-evaluated instantly).
   - One-click copy of the deduplicated missing grocery items.
7. **Pantry staples assumed:**
   - Salt, pepper, oil, butter, garlic, soy sauce, and vinegar are assumed so you type 3 words instead of 20.

---

## 🚀 Pushing to your GitHub (`github.com/thathorserep`)

To push this repository to your personal GitHub account under `thathorserep`:

```bash
# 1. Create a new public repository on GitHub named "pantry-roulette-gemma4"
# https://github.com/new

# 2. Add your remote
git remote add origin https://github.com/thathorserep/pantry-roulette-gemma4.git

# 3. Rename branch to main
git branch -M main

# 4. Commit and push
git add .
git commit -m "feat: initial release of Pantry Roulette with Gemma 4 variety engine"
git push -u origin main
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **AI Core:** Gemma 4 (Google GenAI SDK server-side proxy `/api/generate-meals` with local fallback engine)
- **Backend:** Express full-stack proxy running with Vite middlewares
- **License:** Apache License 2.0 with Gemma Terms of Use

---

## 📄 License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for details. Includes Google Gemma model terms of use attribution.
