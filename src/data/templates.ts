import { MealCard } from '../types';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  slots: {
    protein?: string[];
    starch?: string[];
    veg?: string[];
    aromatic?: string[];
    dairy?: string[];
    acid?: string[];
    fat?: string[];
    spice?: string[];
  };
  axis: {
    cuisine: string;
    technique: string;
    format: string;
    texture: string;
    effort: string;
    role: string;
  };
  steps: string[];
  missingHint: string;
  cheapSwap: string;
  balanceNote: string;
  cookTimeMinutes: number;
  videoQuery: string;
  isNigerian?: boolean;
}

export const INGREDIENT_BUCKETS: Record<string, string[]> = {
  protein: ['chicken', 'beef', 'pork', 'tofu', 'egg', 'eggs', 'fish', 'salmon', 'shrimp', 'lentil', 'lentils', 'bean', 'beans', 'chickpea', 'chickpeas', 'tuna', 'sausage', 'turkey', 'bacon', 'ground meat'],
  starch: ['rice', 'pasta', 'noodle', 'noodles', 'bread', 'tortilla', 'potato', 'potatoes', 'quinoa', 'couscous', 'plantain', 'plantains', 'yam', 'garri', 'pita', 'spaghetti', 'oats'],
  veg: ['broccoli', 'spinach', 'tomato', 'tomatoes', 'pepper', 'peppers', 'onion', 'onions', 'carrot', 'carrots', 'cabbage', 'zucchini', 'mushroom', 'mushrooms', 'kale', 'pea', 'peas', 'corn', 'cucumber', 'eggplant', 'cauliflower', 'green beans', 'lettuce'],
  aromatic: ['garlic', 'ginger', 'scallion', 'scallions', 'shallot', 'shallots', 'chili', 'chilies', 'lemon', 'lime', 'basil', 'cilantro', 'parsley', 'thyme', 'curry leaves', 'rosemary'],
  dairy: ['cheese', 'yogurt', 'cream', 'milk', 'feta', 'parmesan', 'cheddar', 'mozzarella'],
  acid: ['lemon', 'lime', 'vinegar', 'pickle', 'tamarind', 'tomato', 'soy sauce'],
  fat: ['oil', 'butter', 'tahini', 'mayo', 'mayonnaise', 'sesame oil', 'peanut butter', 'coconut oil', 'coconut milk'],
  spice: ['cumin', 'paprika', 'turmeric', 'curry powder', 'chili flakes', 'oregano', 'cinnamon', 'black pepper', 'garam masala', 'suya spice', 'nutmeg']
};

export const PANTRY_STAPLES = [
  'salt', 'black pepper', 'cooking oil', 'water', 'garlic', 'onion', 'soy sauce', 'vinegar', 'butter'
];

export const TEMPLATES: TemplateDefinition[] = [
  // 1. Nigerian / West African - Smoky Jollof
  {
    id: 'nigerian-smoky-jollof',
    name: 'Smoky Stovetop Jollof Rice',
    description: 'Rich tomato-infused parboiled rice simmered with aromatics and caramelized bottom crust.',
    slots: {
      starch: ['rice'],
      veg: ['tomato', 'pepper', 'onion'],
      protein: ['chicken', 'beef', 'egg', 'fish'],
      aromatic: ['garlic', 'ginger', 'thyme'],
      spice: ['curry powder', 'black pepper']
    },
    axis: {
      cuisine: 'Nigerian',
      technique: 'simmer/braise',
      format: 'skillet hash',
      texture: 'charred & saucy',
      effort: '35-min one-pot',
      role: 'comfort main'
    },
    steps: [
      'Blend tomatoes, bell pepper, and onions into a smooth pepper base.',
      'Sauté sliced onions in oil with curry powder and thyme until fragrant.',
      'Pour in blended base and fry down until oil floats to the top.',
      'Add rinsed rice and broth/water, seal tightly with foil, simmer on low heat.',
      'Let the bottom gently char for 3 mins to capture signature smoky party flavor.'
    ],
    missingHint: 'bell pepper or curry powder',
    cheapSwap: 'Use canned tomato paste mixed with water and a pinch of paprika.',
    balanceNote: 'High complex carbs; pair with hard-boiled eggs or fried fish for protein.',
    cookTimeMinutes: 35,
    videoQuery: 'how to cook authentic smoky jollof rice',
    isNigerian: true
  },
  // 2. Nigerian - Fried Plantain & Scrambled Eggs (Dodo & Eggs)
  {
    id: 'nigerian-dodo-eggs',
    name: 'Golden Dodo & Spiced Farmhouse Eggs',
    description: 'Sweet fried ripe plantain cubes served alongside eggs scrambled with peppers and scallions.',
    slots: {
      starch: ['plantain'],
      protein: ['egg', 'eggs'],
      veg: ['onion', 'tomato', 'pepper'],
      fat: ['oil']
    },
    axis: {
      cuisine: 'Nigerian',
      technique: 'pan-fry',
      format: 'bowl',
      texture: 'crispy & soft',
      effort: '15-20 min',
      role: 'quick dinner'
    },
    steps: [
      'Slice ripe plantains on the bias into thick coins and salt lightly.',
      'Fry plantains in shimmering oil until deeply caramelized and golden brown.',
      'Whisk eggs with diced tomatoes, peppers, onions, and black pepper.',
      'Scramble eggs gently over medium-low heat until glossy and soft-set.',
      'Serve the sweet plantains right next to the savory egg scramble.'
    ],
    missingHint: 'ripe plantain or bell pepper',
    cheapSwap: 'Swap plantain for pan-roasted diced sweet potatoes or toast.',
    balanceNote: 'Excellent balance of dietary fiber, healthy fats, and bioavailable egg protein.',
    cookTimeMinutes: 15,
    videoQuery: 'how to make nigerian egg sauce and fried plantain dodo',
    isNigerian: true
  },
  // 3. Nigerian - Rich Stewed Beans & Plantain
  {
    id: 'nigerian-beans-porridge',
    name: 'Slow-Simmered Honey Bean Porridge',
    description: 'Hearty tender beans stewed with peppers, sweet plantain slices, and savory aromatics.',
    slots: {
      protein: ['bean', 'beans', 'lentil'],
      starch: ['plantain', 'yam', 'potato'],
      veg: ['onion', 'pepper', 'tomato'],
      fat: ['oil']
    },
    axis: {
      cuisine: 'Nigerian',
      technique: 'simmer/braise',
      format: 'soup',
      texture: 'creamy & velvety',
      effort: '35-min one-pot',
      role: 'comfort main'
    },
    steps: [
      'Simmer rinsed beans in salted water until half tender.',
      'Add blended onions, scotch bonnet pepper, and oil.',
      'Drop in diced ripe plantain or yam chunks for natural sweetness.',
      'Cover and simmer until plantains melt slightly, thickening the porridge broth.',
      'Season with salt and crushed pepper, rest 5 minutes before serving.'
    ],
    missingHint: 'brown beans or plantain',
    cheapSwap: 'Use canned black-eyed peas or kidney beans to cut cook time to 12 minutes.',
    balanceNote: 'Outstanding prebiotic fiber and plant protein profile.',
    cookTimeMinutes: 30,
    videoQuery: 'nigerian beans porridge and plantain recipe',
    isNigerian: true
  },
  // 4. Thai - Cold Sesame Lime Noodles
  {
    id: 'thai-cold-sesame-noodles',
    name: 'Chilled Sesame Lime Crunch Noodles',
    description: 'Cool springy noodles tossed in zesty peanut-lime sauce with shredded crunchy cabbage.',
    slots: {
      starch: ['noodle', 'noodles', 'pasta', 'spaghetti'],
      veg: ['cabbage', 'cucumber', 'carrot', 'spinach'],
      protein: ['tofu', 'chicken', 'egg'],
      aromatic: ['lime', 'garlic', 'ginger'],
      fat: ['peanut butter', 'sesame oil', 'oil']
    },
    axis: {
      cuisine: 'Thai',
      technique: 'raw/no-cook',
      format: 'noodles/pasta',
      texture: 'cold & crunchy',
      effort: '5-min assembly',
      role: 'light fresh plate'
    },
    steps: [
      'Boil noodles according to package, rinse thoroughly in cold running water.',
      'Whisk peanut butter (or tahini), soy sauce, lime juice, and a splash of warm water.',
      'Thinly shred carrots, cabbage, and cucumbers into matchsticks.',
      'Toss cold noodles vigorously with sauce until glossy.',
      'Garnish with shredded vegetables, sliced chili, and protein of choice.'
    ],
    missingHint: 'lime or peanut butter',
    cheapSwap: 'Swap peanut butter for toasted sesame oil or standard mayonnaise with a splash of vinegar.',
    balanceNote: 'Refreshing, hydrating raw fiber paired with slow-burning complex carbs.',
    cookTimeMinutes: 10,
    videoQuery: 'how to make cold thai peanut sesame noodles',
    isNigerian: false
  },
  // 5. Levantine - Crispy Spiced Sheet-Pan Hash
  {
    id: 'levantine-sheetpan-roast',
    name: 'Sheet-Pan Zaatar Spiced Roast Plate',
    description: 'High-heat blistered potatoes, chickpeas, and chicken roasted with cumin and garlic sauce.',
    slots: {
      protein: ['chicken', 'chickpea', 'chickpeas', 'tofu'],
      starch: ['potato', 'potatoes', 'bread', 'pita'],
      veg: ['onion', 'pepper', 'broccoli', 'cauliflower'],
      aromatic: ['garlic', 'lemon'],
      spice: ['cumin', 'paprika', 'oregano']
    },
    axis: {
      cuisine: 'Levantine',
      technique: 'roast',
      format: 'sheet-pan',
      texture: 'charred & crispy',
      effort: '25-min oven',
      role: 'comfort main'
    },
    steps: [
      'Preheat oven to 220°C (425°F) with baking sheet inside.',
      'Toss diced potatoes, chickpeas, and chicken chunks with olive oil, cumin, and garlic.',
      'Spread across blazing hot baking sheet in a single even layer.',
      'Roast undisturbed for 20 minutes until edges caramelize into deep bronze.',
      'Squeeze fresh lemon over the top and serve directly from the tray.'
    ],
    missingHint: 'lemon or cumin',
    cheapSwap: 'Use dried oregano or curry powder if cumin is missing.',
    balanceNote: 'Oven roasting preserves micronutrients while crisping protein without deep frying.',
    cookTimeMinutes: 25,
    videoQuery: 'crispy sheet pan chicken potato cumin roast',
    isNigerian: false
  },
  // 6. Italian - Silky Creamy Garlic Pasta
  {
    id: 'italian-garlic-butter-pasta',
    name: 'Silky Emulsified Garlic & Parmesan Pasta',
    description: 'Al dente spaghetti swirled with pan-toasted garlic, starchy cooking water, and creamy melted cheese.',
    slots: {
      starch: ['pasta', 'spaghetti', 'noodle'],
      dairy: ['cheese', 'parmesan', 'butter'],
      aromatic: ['garlic', 'parsley'],
      veg: ['spinach', 'mushroom', 'tomato'],
      fat: ['butter', 'oil']
    },
    axis: {
      cuisine: 'Italian',
      technique: 'simmer/braise',
      format: 'noodles/pasta',
      texture: 'velvety saucy',
      effort: '15-20 min',
      role: 'comfort main'
    },
    steps: [
      'Boil pasta in generously salted water until 1 minute shy of al dente; reserve 1 mug of starchy water.',
      'Gently sizzle shaved garlic in butter and oil over low heat until pale gold.',
      'Toss pasta directly into the garlic pan along with a splash of reserved pasta water.',
      'Stir vigorously off the heat while sprinkling cheese to build a creamy glossy emulsion.',
      'Finish with cracked black pepper and wilted greens if available.'
    ],
    missingHint: 'parmesan cheese or butter',
    cheapSwap: 'Use any hard grating cheese or cheddar plus an extra splash of olive oil and starchy pasta water.',
    balanceNote: 'Quick comfort meal; toss in fresh spinach or canned tuna for micronutrients & protein.',
    cookTimeMinutes: 15,
    videoQuery: 'cacio e pepe pasta silky emulsion technique',
    isNigerian: false
  },
  // 7. Mexican - Sizzling Skillet Hash & Crisp Tortilla
  {
    id: 'mexican-skillet-hash-taco',
    name: 'Smoky Chipotle Skillet Hash',
    description: 'Hard-seared peppers, black beans, and charred potatoes with melted cheese and zesty salsa base.',
    slots: {
      protein: ['bean', 'beans', 'chicken', 'beef', 'egg'],
      starch: ['tortilla', 'potato', 'potatoes', 'rice'],
      veg: ['pepper', 'onion', 'tomato', 'corn'],
      spice: ['cumin', 'paprika', 'chili'],
      aromatic: ['lime', 'garlic']
    },
    axis: {
      cuisine: 'Mexican',
      technique: 'sear',
      format: 'wrap/taco',
      texture: 'crispy & charred',
      effort: '15-20 min',
      role: 'quick dinner'
    },
    steps: [
      'Get a cast-iron or heavy skillet smoking hot with a tablespoon of oil.',
      'Drop in diced potatoes and onions, searing undisturbed for 4 minutes to achieve blackened crust.',
      'Add black beans, chili powder, and cumin, tossing until heated through.',
      'Warm tortillas directly over an open burner or skillet edge.',
      'Scoop sizzling hash into warm tortillas and squeeze fresh lime.'
    ],
    missingHint: 'tortillas or lime',
    cheapSwap: 'Serve as a burrito bowl over rice or toast if tortillas are absent.',
    balanceNote: 'High in plant polyphenols, capsaicin, and fiber from whole beans.',
    cookTimeMinutes: 18,
    videoQuery: 'crispy potato and black bean skillet taco',
    isNigerian: false
  },
  // 8. Japanese - Savory Teriyaki Protein Rice Bowl
  {
    id: 'japanese-teriyaki-bowl',
    name: 'Glazed Teriyaki Caramelized Bowl',
    description: 'Hot steamed rice crowned with sweet-savory pan-glazed protein, tender broccoli, and scallions.',
    slots: {
      starch: ['rice'],
      protein: ['chicken', 'tofu', 'salmon', 'egg'],
      veg: ['broccoli', 'cabbage', 'mushroom', 'carrot'],
      aromatic: ['ginger', 'garlic', 'scallion'],
      acid: ['soy sauce', 'vinegar']
    },
    axis: {
      cuisine: 'Japanese',
      technique: 'sear',
      format: 'bowl',
      texture: 'velvety saucy',
      effort: '15-20 min',
      role: 'quick dinner'
    },
    steps: [
      'Mix 2 tbsp soy sauce, 1 tbsp sugar (or honey), grated ginger, and water for sauce.',
      'Sear protein in hot skillet until deeply browned on both sides.',
      'Steam broccoli florets in the same pan with 2 tablespoons of water, covered for 2 minutes.',
      'Pour in the sauce and simmer rapidly until bubbling glaze coats every piece.',
      'Ladle over bowls of hot fluffy rice and sprinkle scallions.'
    ],
    missingHint: 'ginger or soy sauce',
    cheapSwap: 'Combine soy sauce with a pinch of brown sugar and garlic powder.',
    balanceNote: 'Balanced lean protein and cruciferous sulforaphane from steamed broccoli.',
    cookTimeMinutes: 18,
    videoQuery: 'easy homemade teriyaki chicken rice bowl',
    isNigerian: false
  },
  // 9. French Bistro - Golden Pan-Seared Protein & Velvety Mash
  {
    id: 'french-bistro-pan-sear',
    name: 'Pan-Roasted Cutlet with Herb Butter Reduction',
    description: 'Tender golden-crusted cutlet served over mashed potatoes with a quick pan-juices pan sauce.',
    slots: {
      protein: ['chicken', 'pork', 'fish', 'tofu'],
      starch: ['potato', 'potatoes', 'bread'],
      veg: ['spinach', 'carrot', 'green beans', 'mushroom'],
      dairy: ['butter', 'milk', 'cream'],
      aromatic: ['garlic', 'thyme']
    },
    axis: {
      cuisine: 'French Bistro',
      technique: 'sear',
      format: 'skillet hash',
      texture: 'crispy & creamy',
      effort: '20 min',
      role: 'comfort main'
    },
    steps: [
      'Boil potatoes and mash with butter, milk, and salt until velvety smooth.',
      'Pat protein completely dry; season generously with salt and pepper.',
      'Sear in hot pan until golden crust forms, flip and baste with butter and garlic.',
      'Remove protein; deglaze pan with a splash of water, swirling remaining butter into pan sauce.',
      'Plate over warm mash and spoon golden pan jus over the top.'
    ],
    missingHint: 'potatoes or butter',
    cheapSwap: 'Serve over toasted crusty bread to catch the savory herb pan juices.',
    balanceNote: 'Rich satiety from quality fats paired with bioavailable animal or soy protein.',
    cookTimeMinutes: 20,
    videoQuery: 'french pan seared chicken with butter pan sauce',
    isNigerian: false
  },
  // 10. Indian - Fragrant Golden Coconut Dal / Curry
  {
    id: 'indian-golden-dal',
    name: 'Fragrant Turmeric & Cumin Golden Dal',
    description: 'Comforting yellow lentils simmered with coconut milk, aromatic tempered spices, and spinach.',
    slots: {
      protein: ['lentil', 'lentils', 'chickpea', 'chickpeas', 'chicken'],
      starch: ['rice', 'bread', 'pita'],
      veg: ['spinach', 'tomato', 'onion'],
      spice: ['turmeric', 'cumin', 'chili'],
      aromatic: ['garlic', 'ginger']
    },
    axis: {
      cuisine: 'Indian',
      technique: 'simmer/braise',
      format: 'soup',
      texture: 'creamy & velvety',
      effort: '25-min one-pot',
      role: 'comfort main'
    },
    steps: [
      'Rinse lentils and simmer with turmeric and water until tender and porridge-like.',
      'In a separate small pan, heat oil and sizzle cumin seeds, garlic, and sliced onion (tadka).',
      'Stir diced tomatoes and chili into the spice oil until soft.',
      'Pour the sizzling spiced oil directly into the simmering lentils (watch the steam!).',
      'Fold in fresh spinach until wilted; serve warm over rice.'
    ],
    missingHint: 'turmeric or lentils',
    cheapSwap: 'Use canned chickpeas or white beans crushed slightly with standard curry powder.',
    balanceNote: 'Anti-inflammatory powerhouse loaded with curcumin and prebiotic legume fiber.',
    cookTimeMinutes: 22,
    videoQuery: 'easy tadka dal yellow lentil curry recipe',
    isNigerian: false
  },
  // 11. Korean - Sizzling Gochujang Kimchi Fried Rice
  {
    id: 'korean-crispy-fried-rice',
    name: 'Sizzling Crispy-Bottom Gochujang Fried Rice',
    description: 'Day-old rice crisped in sesame oil with spicy chili sauce, scrambled egg ribbons, and scallions.',
    slots: {
      starch: ['rice'],
      protein: ['egg', 'eggs', 'tofu', 'chicken', 'tuna'],
      veg: ['cabbage', 'onion', 'carrot', 'spinach'],
      fat: ['sesame oil', 'oil'],
      spice: ['chili flakes', 'black pepper']
    },
    axis: {
      cuisine: 'Korean',
      technique: 'pan-fry',
      format: 'skillet hash',
      texture: 'crispy & spicy',
      effort: '15-20 min',
      role: 'quick dinner'
    },
    steps: [
      'Heat oil in a wide wok or non-stick skillet over high heat.',
      'Sauté chopped cabbage and onions with chili paste/flakes until softened.',
      'Break up cold cooked rice into the pan and toss vigorously to coat each grain.',
      'Press rice flat against the skillet bottom and leave undisturbed for 3 minutes for crunchy socarrat.',
      'Top with a fried egg with a runny golden yolk.'
    ],
    missingHint: 'chili flakes or sesame oil',
    cheapSwap: 'Use standard hot sauce or sriracha mixed with a drop of honey and cooking oil.',
    balanceNote: 'Perfect zero-waste utilization of leftover fridge rice.',
    cookTimeMinutes: 14,
    videoQuery: 'korean crispy fried rice technique',
    isNigerian: false
  },
  // 12. American Diner - Crispy Potato Smash Patty Melt
  {
    id: 'american-diner-smash-melt',
    name: 'Toasted Crispy Smashed Patty Melt',
    description: 'Thinly smashed caramelized patties sandwiched between butter-toasted bread with melted cheese.',
    slots: {
      protein: ['beef', 'turkey', 'chicken', 'tofu', 'egg'],
      starch: ['bread', 'potato'],
      dairy: ['cheese', 'cheddar'],
      veg: ['onion'],
      fat: ['butter', 'mayo']
    },
    axis: {
      cuisine: 'American',
      technique: 'sear',
      format: 'sandwich',
      texture: 'hot & crispy',
      effort: '15-20 min',
      role: 'comfort main'
    },
    steps: [
      'Thinly slice onions and caramelize slowly in butter until sweet and golden.',
      'Smash balls of meat/protein very thin onto a smoking cast iron pan until edges crisp.',
      'Layer sliced cheese directly onto the hot patty to melt.',
      'Butter outer slices of bread and grill sandwich in the pan until deeply golden.',
      'Slice diagonally and enjoy crunchy, gooey layers.'
    ],
    missingHint: 'sliced bread or cheese',
    cheapSwap: 'Use sandwich buns, tortillas for a quesadilla melt, or serve open-faced on toast.',
    balanceNote: 'High protein energy punch; balance with raw crunchy veggies.',
    cookTimeMinutes: 15,
    videoQuery: 'how to make classic diner smash patty melt',
    isNigerian: false
  },
  // 13. Nigerian - Efo Riro Rich Spinach Braise
  {
    id: 'nigerian-efo-riro-braise',
    name: 'Savory Efo Riro Braised Greens',
    description: 'Blanched leafy greens folded into rich, seasoned tomato-pepper reduction with fish or beef.',
    slots: {
      veg: ['spinach', 'kale', 'tomato', 'pepper', 'onion'],
      protein: ['fish', 'beef', 'chicken', 'shrimp', 'egg'],
      fat: ['oil'],
      aromatic: ['garlic', 'ginger']
    },
    axis: {
      cuisine: 'Nigerian',
      technique: 'simmer/braise',
      format: 'bowl',
      texture: 'saucy & rich',
      effort: '20 min',
      role: 'comfort main'
    },
    steps: [
      'Roughly chop fresh spinach or greens and blanch briefly in hot water; squeeze dry.',
      'Blend peppers, tomatoes, and onions, then fry down in heated oil with seasoning.',
      'Add flaked fish, boiled meat, or hard-boiled eggs into the simmering sauce.',
      'Fold the squeezed greens into the sauce, tossing gently for 3 minutes without overcooking.',
      'Serve alongside boiled yam, rice, or plantain.'
    ],
    missingHint: 'spinach or scotch bonnet pepper',
    cheapSwap: 'Use frozen chopped spinach, kale, or collard greens with any hot chili.',
    balanceNote: 'Exceptional iron, folate, and carotenoids from dense leafy vegetables.',
    cookTimeMinutes: 20,
    videoQuery: 'how to cook authentic nigerian efo riro',
    isNigerian: true
  },
  // 14. Mediterranean - Fresh Chopped Crunch Salad
  {
    id: 'mediterranean-crunch-salad',
    name: 'Sun-Drenched Herb & Feta Chop Salad',
    description: 'Crisp cucumbers, juicy tomatoes, and chickpeas tossed in tangy lemon-herb vinaigrette.',
    slots: {
      veg: ['cucumber', 'tomato', 'onion', 'pepper'],
      protein: ['chickpea', 'chickpeas', 'chicken', 'egg', 'tuna'],
      dairy: ['feta', 'cheese'],
      aromatic: ['lemon', 'parsley', 'oregano'],
      fat: ['oil']
    },
    axis: {
      cuisine: 'Levantine',
      technique: 'raw/no-cook',
      format: 'crisp salad',
      texture: 'cold & crunchy',
      effort: '5-min assembly',
      role: 'light fresh plate'
    },
    steps: [
      'Chop cucumbers, ripe tomatoes, and red onions into bite-sized uniform cubes.',
      'Drain chickpeas or flaked tuna and add to the mixing bowl.',
      'Whisk lemon juice with olive oil, salt, black pepper, and dried oregano.',
      'Pour vinaigrette over vegetables and toss gently to preserve textures.',
      'Crumble cheese over the top and garnish with fresh herbs.'
    ],
    missingHint: 'feta cheese or cucumber',
    cheapSwap: 'Use any firm cheese or salted boiled egg for creamy saltiness.',
    balanceNote: 'High hydration and natural electrolyte density with zero cook time.',
    cookTimeMinutes: 8,
    videoQuery: 'greek cucumber tomato chickpea salad recipe',
    isNigerian: false
  },
  // 15. Italian - Oven Baked Crispy Frittata
  {
    id: 'italian-skillet-frittata',
    name: 'Cast-Iron Oven Herb & Vegetable Frittata',
    description: 'Fluffy eggs baked with caramelized onions, roasted potatoes, and bubbling cheese crust.',
    slots: {
      protein: ['egg', 'eggs'],
      dairy: ['cheese', 'milk'],
      veg: ['potato', 'spinach', 'onion', 'tomato', 'mushroom'],
      aromatic: ['garlic', 'parsley']
    },
    axis: {
      cuisine: 'Italian',
      technique: 'bake',
      format: 'skillet hash',
      texture: 'creamy & browned',
      effort: '20 min',
      role: 'quick dinner'
    },
    steps: [
      'Whisk 4 eggs with a splash of milk, salt, pepper, and shredded cheese.',
      'Sauté diced potatoes and vegetables in an oven-safe skillet until tender.',
      'Pour egg mixture over the vegetables, tilting pan to distribute evenly.',
      'Cook on stovetop for 2 minutes until edges set, then transfer to 200°C oven.',
      'Bake 10 minutes until center puffs and top turns pale golden brown.'
    ],
    missingHint: 'eggs or cheese',
    cheapSwap: 'Cook entirely on the stovetop with a lid on low heat if no oven is available.',
    balanceNote: 'Complete amino acid profile; ideal for meal prepping or next-day lunch.',
    cookTimeMinutes: 18,
    videoQuery: 'how to make fluffy vegetable frittata in skillet',
    isNigerian: false
  },
  // 16. Asian - Steamed Ginger-Scallion Dumpling/Broth Bowl
  {
    id: 'asian-steamed-broth-bowl',
    name: 'Fragrant Ginger Scallion Steamed Broth',
    description: 'Delicate poached protein and wilted greens floating in aromatic ginger-infused steaming broth.',
    slots: {
      protein: ['chicken', 'tofu', 'fish', 'egg'],
      veg: ['cabbage', 'spinach', 'carrot', 'mushroom'],
      aromatic: ['ginger', 'scallion', 'garlic'],
      acid: ['soy sauce', 'vinegar']
    },
    axis: {
      cuisine: 'Japanese',
      technique: 'steam',
      format: 'soup',
      texture: 'brothy & light',
      effort: '15-20 min',
      role: 'light fresh plate'
    },
    steps: [
      'Bring 3 cups of water to a gentle simmer with smashed ginger, garlic, and soy sauce.',
      'Add sliced chicken or tofu, letting it poach gently without boiling furiously.',
      'Drop in sliced carrots and cabbage, steaming until tender-crisp.',
      'Stir in spinach right at the end to keep bright green color.',
      'Finish with drizzle of sesame oil and generous sliced scallions.'
    ],
    missingHint: 'fresh ginger or scallions',
    cheapSwap: 'Use a pinch of ground ginger or a garlic clove plus black pepper.',
    balanceNote: 'Ultra-soothing, low sodium brothy hydration that resets digestion.',
    cookTimeMinutes: 15,
    videoQuery: 'ginger scallion clear soup recipe easy',
    isNigerian: false
  }
];
