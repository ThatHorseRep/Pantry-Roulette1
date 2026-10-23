# PRD — "Same Ingredients, Different Dinner"

**Working name:** Pantry Roulette
**Build window:** 40 minutes, plain HTML + CSS + JS (no build step)
**Owner:** you + team
**Status:** v1 scope locked for the sprint

---

## 1. One-liner

You type what's already in your fridge. The app returns **5 genuinely different meals** — not 5 ways to say "chicken and rice" — plus the single shopping item that unlocks each one.

**Pitch line for judges:**
> Everyone has the same sad fridge. The hard part isn't finding *a* recipe, it's finding a *different* dinner from the same ingredients. We built a variety engine that guarantees your meals don't collapse into the same dish five times.

---

## 2. Problem

People cook from the same 10–15 ingredients all week. ChatGPT-style tools answer "what can I make?" with the same obvious dish, or with five variations on it (chicken stir-fry, chicken stir-fry with broccoli, chicken stir-fry with noodles). The result is decision fatigue and boredom, which is the actual reason people order takeout.

**Root cause:** recipe search is *similarity*-driven. Humans want *dissimilarity* — maximum variety from a fixed ingredient set.

**Insight that drives the product:** variety does not come from new ingredients. It comes from **transformation** — changing cuisine palette, technique, format, texture, and effort while keeping the same base inputs.

---

## 3. Target user & job to be done

**Primary:** 22–40, cooks 3–5x/week, shops once a week, has a fridge of overlapping ingredients, wants dinner decided in under 60 seconds.

**JTBD:** "When I open the fridge and see the same stuff I saw yesterday, help me pick something that feels like a *different* meal, so dinner doesn't feel like a chore."

**Non-user for this sprint:** people with zero ingredients, dietary medical plans, professional cooks.

---

## 4. What "variety" means (the core spec — read this twice)

A meal is a point in a 6-dimensional space. Variety = distance in that space. Every generated meal gets tagged on all six axes:

| # | Axis | Values (pick one per meal) |
|---|------|----------------------------|
| 1 | **Cuisine / flavor palette** | Italian, Thai, Mexican, Japanese, Levantine, Indian, Korean, American diner, French bistro, Smoky BBQ |
| 2 | **Technique** | sear, roast, braise/simmer, steam, fry, broil/char, raw / no-cook, bake |
| 3 | **Format / vessel** | bowl, soup, wrap/taco, skillet hash, cold salad, sandwich, noodles/pasta, sheet-pan, curry over rice, stuffed |
| 4 | **Texture & temp** | hot & crispy, hot & creamy, brothy, cold & crunchy, charred, saucy |
| 5 | **Effort / time** | 5-min assembly, ~20 min, 45-min oven, batch-cook |
| 6 | **Role** | main, side, breakfast-for-dinner, lunchbox/leftovers, snack plate |

**Two hard rules the engine must enforce:**

- **R1 — No clones:** any two meals in one result set must differ on **≥ 3 of 6 axes**.
- **R2 — No repeats:** no two meals may share the same (cuisine, format) pair, and no two may share the same **primary** technique.

R1/R2 are the product. They're also the line in the demo: *"watch — it refuses to give me two stir-fries."*

---

## 5. MVP scope

### In scope
- Ingredient input: free text + quick-add chips of common ingredients.
- "Pantry assumed" toggle (salt, pepper, oil, butter, flour, sugar, rice, pasta, garlic, onion, soy sauce, vinegar) — default **on**, so the user types 3 words instead of 20.
- Generate **5** meals: name, one-line description, the 6 axis tags, steps (≤5 bullets), time, and a "you're missing: X" line.
- Variety guarantee visible in the UI (e.g. a "Variety: 5/5 distinct" badge, axis diff shown).
- Reroll a single meal (keeps the rest, respects R1/R2).
- Save a plan to `localStorage`; "recently cooked" list feeds R2 so tomorrow isn't a repeat.
- One-click copy of the shopping list (union of missing items).

### Out of scope (say it out loud in the pitch — judges like scoping)
- Real recipe quantities, nutrition, accounts, images, grocery API, mobile app, dietary filtering beyond a single "no pork/no dairy" checkbox, real LLM dependency.

### Stretch, only if 3+ min remain
- "Surprise me" button that maximizes distance instead of best-fit.
- Batch-cook suggestion: "make 2x the rice, reuse Thursday."
- Swap one ingredient and regenerate.

---

## 6. User flow

1. **Land** → headline "Type what's in your fridge. Get 5 different dinners." Input is autofocused.
2. **Input** → chips + free text. Show assumed pantry as small gray pills.
3. **Press Generate** (or Enter) → 400ms skeleton, then results.
4. **Results** → 5 cards in a grid. Each card shows the variety tags as colored pills. One card is auto-marked "fits best", the rest are marked with *what's different about it* ("cold + no-cook vs. your usual stir-fry").
5. **Actions** → Reroll single card · Save plan · Copy shopping list · Mark cooked.
6. **Empty/insufficient input** (<2 real ingredients) → friendly nudge, no crash.

No routing, no modals, no login. One screen plus a results section.

---

## 7. Variety engine — implementation spec

This is the differentiator, so it gets the most engineering time. **No LLM required** — a template library + a max-min distance pick is enough, deterministic, and demo-safe.

### 7.1 Ingredient taxonomy

Classify each input string into one bucket (substring match, lowercase, first hit wins):

```js
const BUCKETS = {
  protein:  ['chicken','beef','pork','tofu','egg','fish','salmon','shrimp','lentil','bean','chickpea','tuna','sausage'],
  starch:   ['rice','pasta','noodle','bread','tortilla','potato','quinoa','couscous','polenta','bun','pita'],
  veg:      ['broccoli','spinach','tomato','pepper','onion','carrot','cabbage','zucchini','mushroom','kale','pea','corn','cucumber','eggplant','cauliflower'],
  aromatic: ['garlic','ginger','scallion','shallot','chili','lemon','lime','herb','basil','cilantro','parsley','mint'],
  dairy:    ['cheese','yogurt','cream','milk','feta','parmesan','butter'],
  acid:     ['lemon','lime','vinegar','pickle','tamarind','tomato'],
  fat:      ['oil','butter','tahini','mayo','sesame','peanut','coconut'],
  spice:    ['cumin','paprika','turmeric','curry','chili','oregano','cinnamon','garam','gochujang','miso']
};
```

Multi-bucket ingredients are fine (tomato = veg + acid). Store as a `Set` of buckets.

### 7.2 Meal templates

A template is a **skeleton with slots**, not a recipe:

```js
{
  id: 'thai-cold-noodle',
  name: 'Cold sesame noodles, Thai-ish',
  slots: { protein:'any', starch:'noodle|rice', veg:'+1 crisp', aromatic:'+1', acid:'required' },
  axis: { cuisine:'Thai', technique:'raw', format:'noodles/pasta',
          texture:'cold & crunchy', effort:'5-min assembly', role:'main' },
  steps: ['Boil noodles, rinse cold', 'Whisk peanut + soy + lime', 'Toss with shredded veg', 'Top with protein'],
  missingHint: 'lime or rice vinegar'
}
```

Write **24 templates minimum** — 4 per format family — so the demo never looks thin. Seed the library as a plain array in `data.js`; each teammate writes 8 from their own cooking.

**Slot tolerance:** the matcher scores a template as *cookable* if it covers ≥1 requested ingredient per filled slot, and *ideal* if it covers ≥3 total.

### 7.3 Selection algorithm (max-min greedy — the "diversity promise")

```js
function generate(ingredients, n = 5) {
  const have = classify(ingredients);
  const pool = TEMPLATES
    .map(t => ({ t, fit: fitScore(t, have) }))   // fit = buckets covered, weighted protein > veg > starch
    .filter(x => x.fit >= 1);

  const picked = [pool.sort((a,b) => b.fit - a.fit)[0]];  // best fit seeds the set
  while (picked.length < n && pool.length) {
    let best = null, bestScore = -1;
    for (const c of pool) {
      if (picked.includes(c)) continue;
      if (violates(c, picked)) continue;                   // R1 + R2
      const score = Math.min(...picked.map(p => distance(c, p))) * 0.7 + c.fit * 0.3;
      if (score > bestScore) { bestScore = score; best = c; }
    }
    if (!best) break;
    picked.push(best);
  }
  return picked;
}
```

- `distance(a,b)` = number of differing axes / 6.
- `violates()` implements R1 (distance ≥ 0.5) and R2 (unique cuisine+format pair, unique primary technique).
- If the pool can't satisfy R1, **relax R2 first, then R1**, and label the set "tight pantry" in the UI. Never return fewer than 3 cards silently — show a note.

**Reroll:** same function, but pass `exclude: [currentMealID]` and keep the other 4 as the seed set. Instant, respects the rules.

### 7.4 Why this beats "just ask ChatGPT" (use this exact argument)

1. **Guaranteed** dissimilarity instead of vibes — it's a rule, not a prompt hope.
2. **Instant and free** — no key, no latency, no rate limit; demo can't fail on wifi.
3. **Memory** — refuses to repeat what you cooked this week.
4. **Minimal shopping** — every card names the one thing you'd need, and the union is usually 0–2 items.

If you add an LLM later, it writes the *prose and steps* for an already-chosen meal. The engine decides **which** meals; the model only makes them sound delicious. That split is the architecture slide.

---

## 8. Optional LLM layer (only if everything else is done)

Use it for copywriting only, never for selection.

```txt
You are writing a recipe card. Do not change the meal concept.
Meal: {name} | Cuisine: {cuisine} | Technique: {technique} | Format: {format}
Available: {ingredients}. Pantry staples: {pantry}.
Missing: {missingItem}.
Write: 1 sentence description (max 20 words), 4 steps (max 12 words each), no quantities.
Return JSON: {"description": "...", "steps": ["...","..."]}
```

Guardrails: 3s timeout → fall back to the template's static `steps`; validate JSON; discard anything that adds an ingredient not in the input. **Ship the static version first and keep it as the fallback mode** — toggle via `?ai=0`.

---

## 9. Tech stack & file layout

Plain HTML/CSS/JS, no dependencies, no build, opens by double-clicking `index.html`.

```
meal-planner/
  PRD.md          <- this file
  index.html      <- markup + input + results grid
  styles.css      <- one grid, one card style, pill colors
  data.js         <- INGREDIENT_BUCKETS, PANTRY_STAPLES, TEMPLATES (24+)
  engine.js       <- classify, fitScore, distance, violates, generate
  app.js          <- DOM wiring, render, reroll, localStorage
  demo-fallback.json  <- snapshot of one good result set (for worst-case demo)
```

**Conventions**
- `data.js` and `engine.js` load before `app.js`; use plain `<script>` tags, no modules (avoids `file://` CORS pain).
- Everything client-side; `localStorage` keys: `pr.cooked` (array of template IDs + date), `pr.plan` (last plan).
- Colors: one accent, pills per axis. Dark text on light background, 16px base, generous spacing. Mobile-first-ish (single column < 700px).
- No frameworks. No npm. If someone reaches for React, they are wrong today.

---

## 10. UI spec

```
┌───────────────────────────────────────────────────────────┐
│  Pantry Roulette                            [Variety 5/5] │
│  Same ingredients. Five different dinners.                │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ chicken, rice, broccoli, lime, yogurt            [↵]│  │
│  └─────────────────────────────────────────────────────┘  │
│  + chicken  + rice  + eggs  + tofu  + spinach  ...        │
│  ☑ assume basic pantry (oil, salt, garlic, soy, vinegar)  │
│                                                           │
│  [ Generate 5 dinners ]   [ Surprise me ]                 │
│                                                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │ BEST FIT     │ │ DIFFERENT    │ │ DIFFERENT    │      │
│  │ Chicken rice │ │ Cold sesame  │ │ Sheet-pan    │      │
│  │ bowl         │ │ noodles      │ │ chicken      │      │
│  │ Thai · sear ·│ │ Thai · raw · │ │ Levantine ·  │      │
│  │ bowl · 20min │ │ noodles·5min │ │ roast · pan  │      │
│  │ • steps...   │ │ • steps...   │ │ • steps...   │      │
│  │ missing: —   │ │ missing: lime│ │ missing: pita│      │
│  │ [↻ reroll]   │ │ [↻ reroll]   │ │ [↻ reroll]   │      │
│  └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                           │
│  [ Save plan ]  [ Copy shopping list ]  [ Mark cooked ]   │
└───────────────────────────────────────────────────────────┘
```

- Each card header shows **why it's different** ("cold · no-cook" vs the best-fit card) — this is the money detail, don't cut it.
- Pills: cuisine (blue), technique (purple), format (green), texture (orange). Effort as a small clock label.
- Empty state: 3 example inputs as clickable buttons so a judge can't get stuck.

---

## 11. Seed data checklist (assign before coding)

| Owner | Deliverable | Count |
|---|---|---|
| Person A | Templates: bowl, soup, skillet hash | 8 |
| Person B | Templates: wrap/taco, cold salad, sheet-pan | 8 |
| Person C | Templates: noodles/pasta, curry-over-rice, stuffed, snack plate | 8 |
| Anyone | 30 common ingredients as chips + bucket mapping | — |

Quality bar per template: unique (cuisine, format), a technique not duplicated in its format family, ≤5 steps, one realistic `missingHint`.

**Test set for the demo:** `chicken, rice, broccoli, lime, yogurt` and `eggs, bread, tomato, cheese` and `tofu, noodles, cabbage, peanut`. All three must return 5 cards with no rule violations.

---

## 12. 40-minute plan

| Time | What | Who |
|---|---|---|
| 0–3 | Read this, lock scope, agree tech = plain JS, split data | All |
| 3–8 | Write `data.js` skeleton + buckets + 8 templates each, in parallel | A/B/C |
| 8–20 | `index.html` + `styles.css` shell + render function; engine in parallel | A: UI, B: engine, C: data |
| 20–28 | Wire input → engine → cards; pills, cards, reroll | A + B |
| 28–33 | Finish 24 templates; run the 3 test sets; fix rule violations | C + all |
| 33–36 | `localStorage` save/cooked memory + copy shopping list | B |
| 36–38 | Fallback snapshot file, demo run-through once, pick the best input | All |
| 38–40 | Freeze. Nobody touches code. Rehearse the 90 seconds. | All |

**Freeze rule:** at 38:00 the code is done. Ship the static fallback and present.

---

## 13. Demo script (90 seconds)

1. "Every week I buy the same stuff and make the same three dinners." *(5s)*
2. Type `chicken, rice, broccoli, lime, yogurt`. Hit Generate. *(10s)*
3. "Five meals, same fridge. Look at the tags — sear, no-cook, roast; Thai, Levantine, Italian. The engine **forbids** two meals that share a technique or a cuisine+format." *(20s)*
4. Point at "missing: lime" → "it tells me the one thing to buy, and the whole shopping list is two items." *(10s)*
5. Reroll the middle card → "and it doesn't repeat itself." *(10s)*
6. Mark one cooked, regenerate → "it remembers what I made Tuesday." *(15s)*
7. Close: "It's not a recipe search. It's a variety guarantee. Same ingredients, different dinner." *(10s)*

Leave 30s for questions. The likely question is "why not just use an LLM?" — answer §7.4 in one breath.

---

## 14. Risks & fallbacks

| Risk | Fallback |
|---|---|
| Templates too few → can't satisfy R1 | Ship 24 minimum; relax R1 before shipping a 2-card result; say "tight pantry" |
| Demo laptop dies / file won't open | `demo-fallback.json` + a screenshot; also open via `python -m http.server` if `file://` misbehaves |
| Team argues about LLM integration | Cut it. Static engine wins the demo. §7.4 is the answer |
| Input with one weird ingredient | Unknown → bucket `other`, still matches templates with `any` slots |
| Scope creep (nutrition, accounts, images) | Point at §5 out-of-scope, say no |
| Empty results | Never render an empty grid → show the 3 example inputs |

---

## 15. Success check before you present

- [ ] 3 test ingredient sets each return 5 cards
- [ ] Zero pairs violate R1 or R2 in any result set (write a 10-line console assert)
- [ ] Results appear in under 500ms with no network
- [ ] Every card has: name, 1-line why-different, 6 axis tags, ≤5 steps, missing item
- [ ] Reroll works and doesn't duplicate
- [ ] "Mark cooked" persists across reload
- [ ] Copy shopping list puts the deduped missing items on the clipboard
- [ ] Works at 1280px and at 420px wide
- [ ] `?ai=0` (or no key) path is the default and the one you demo
- [ ] One person can recite the closing line without reading it

---

## 16. Open decisions (decide in the first 3 minutes)

1. Name on screen: **Pantry Roulette** vs. "Same 5 Ingredients, 5 Dinners"?
2. Result count fixed at 5, or 3–7 slider? (Recommend fixed 5 — one less thing to debug.)
3. Do we show the variety axes as pills, or a small radar-ish bar? (Pills. Radar costs 15 minutes.)
4. Who presents? One voice, not three.
