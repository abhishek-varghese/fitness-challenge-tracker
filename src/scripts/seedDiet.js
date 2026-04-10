import db from "./firebaseAdmin.js";

const dietItems = [
  {
    type: "EGG",
    category: "DIET",
    title: "Egg",
    description: "Whole egg",
    unit: "count",
    icon: "🥚",
    hasValue: true,
    defaultValue: 0,
    proteinPerUnit: 6,
  },
  {
    type: "CHICKEN",
    category: "DIET",
    title: "Chicken",
    description: "Cooked chicken",
    unit: "grams",
    icon: "🍗",
    hasValue: true,
    defaultValue: 0,
    proteinPerUnit: 0.27,
  },
  {
    type: "FISH",
    category: "DIET",
    title: "Fish",
    description: "Fish curry/fry",
    unit: "grams",
    icon: "🐟",
    hasValue: true,
    defaultValue: 0,
    proteinPerUnit: 0.22,
  },
  {
    type: "MILK",
    category: "DIET",
    title: "Milk",
    description: "Cow milk",
    unit: "ml",
    icon: "🥛",
    hasValue: true,
    defaultValue: 0,
    proteinPerUnit: 0.033,
  },
  {
    type: "PROTEIN_POWDER",
    category: "DIET",
    title: "Protein Powder",
    description: "Whey protein",
    unit: "scoop",
    icon: "💪",
    hasValue: true,
    defaultValue: 0,
    proteinPerUnit: 24,
  },
];

async function seedDiet() {
  const batch = db.batch();

  dietItems.forEach((item) => {
    const ref = db.collection("diet").doc(item.type);
    batch.set(ref, item, { merge: true });
  });

  await batch.commit();
  console.log("✅ Diet items seeded");
}

seedDiet();