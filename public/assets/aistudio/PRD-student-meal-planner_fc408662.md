# PRD: Student Meal Planner (working title: "PantryPlate")

Hackathon build, 30-minute scope. Powered by open-source AI (Gemma 4).

## 1. Problem

Students often have a handful of random foodstuff and no clear idea what to cook from it. They end up repeating the same meal, wasting ingredients, spending on takeaway, or skipping meals. They rarely think about whether what they eat is balanced.

## 2. Goal

Let a student type what they have and instantly get realistic meal ideas, an honest list of what is missing, cheap swaps, and a balanced plan for the day.

## 3. Target Users

University students living in hostels or off-campus, cooking on a budget with limited ingredients and basic equipment.

## 4. Core User Flow

1. Student types their available ingredients in one text box (e.g. "rice, eggs, tomato, onions, beans").
2. App sends the list to Gemma 4 and returns 3 meal suggestions.
3. Each meal shows as a card: name, what they can already make, what is missing, a cheap substitute for the missing items, and a one-line balance note.
4. Student clicks "Plan my day" and gets breakfast, lunch and dinner built from the same ingredients.

## 5. Features

### Must have (build in 30 minutes)
- Single-page UI with one text input and a "Suggest meals" button
- Gemma 4 call that returns structured JSON (3 meals)
- Meal cards rendered from the JSON
- "Plan my day" button returning breakfast, lunch and dinner

### Nice to have (only if time remains)
- Local Nigerian-food bias in the prompt (garri, yam, beans, stew base, plantain)
- Budget toggle (cheapest options first)
- Copy or share the day plan

### Out of scope
- Photo or image ingredient scanning
- User accounts, saved history, grocery lists
- Exact calorie or nutrition tracking

## 6. AI Approach

- Model: Gemma 4 E4B (small, Apache 2.0, runs locally via Ollama or through a hosted API).
- One system prompt that tells the model to act as a student-friendly nutrition-aware cook, use only the listed ingredients plus common pantry basics (salt, oil, water), and flag anything else as "missing".
- Output must be JSON only so the UI can render it without parsing text.

Suggested meal response shape:

```json
{
  "meals": [
    {
      "name": "Egg and tomato rice",
      "can_make_with": ["rice", "eggs", "tomato", "onions"],
      "missing": ["pepper"],
      "swap": "Use a pinch of black pepper or skip it",
      "balance_note": "Carbs and protein covered, add a vegetable if you can"
    }
  ]
}
```

Suggested day plan response shape:

```json
{
  "breakfast": { "name": "", "uses": [], "missing": [] },
  "lunch": { "name": "", "uses": [], "missing": [] },
  "dinner": { "name": "", "uses": [], "missing": [] },
  "day_balance_note": ""
}
```

## 7. Technical Stack

- Frontend: Streamlit or a plain HTML page
- Backend: a single function calling Gemma 4 through Ollama (local) or an API
- No database

## 8. Success Criteria for the Demo

- Works end to end on a live ingredient list typed during the demo
- Returns sensible meals even when ingredients are incomplete
- Clearly shows what is missing and a workable swap
- Day plan renders in under about 10 seconds

## 9. Risks and Mitigations

- Model returns invalid JSON: strict prompt, strip code fences, retry once.
- Model invents ingredients the student does not have: prompt rule that anything not listed must appear under "missing".
- Slow local inference: use E4B and keep outputs short, or fall back to a hosted API.
- Unbalanced suggestions: include a required balance note and ask for protein, carbs and vegetables in the day plan.

## 10. 30-Minute Build Plan

- 0 to 5 min: set up the model call and test the prompt in the terminal
- 5 to 15 min: build the text box and meal cards
- 15 to 22 min: add "Plan my day"
- 22 to 30 min: test with 3 ingredient lists and rehearse the demo
