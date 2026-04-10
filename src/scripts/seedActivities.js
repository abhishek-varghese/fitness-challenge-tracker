import db from "./firebaseAdmin.js";

const activities = [
  {
    type: "WATER",
    category: "ACTIVITY",
    title: "Drink Water",
    description: "Keep hydrated",
    unit: "liters",
    icon: "💧",
    hasValue: true,
    defaultValue: 0,
  },
  {
    type: "DIET",
    category: "ACTIVITY",
    title: "Eat Healthy",
    description: "Healthy body, healthy mind",
    unit: "boolean",
    icon: "🍗",
    hasValue: true,
    defaultValue: false,
  },
  {
    type: "WORKOUT",
    category: "ACTIVITY",
    title: "Workout",
    description: "Healthy body, healthy mind",
    unit: "boolean",
    icon: "💪",
    hasValue: true,
    defaultValue: false,
  },
  {
    type: "SLEEP",
    category: "ACTIVITY",
    title: "Sleep",
    description: "Need proper rest",
    unit: "hours",
    icon: "🌙",
    hasValue: true,
    defaultValue: 0,
  },
  {
    type: "ALCOHOL",
    category: "ACTIVITY",
    title: "No Alcohol",
    description: "No alcohol yesterday",
    unit: "boolean",
    icon: "🚫",
    hasValue: true,
    defaultValue: false,
  },
  {
    type: "STEPS",
    category: "ACTIVITY",
    title: "Steps",
    description: "Step counter",
    unit: "count",
    icon: "👟",
    hasValue: true,
    defaultValue: 0,
  },
];

async function seedActivities() {
  const batch = db.batch();

  activities.forEach((item) => {
    const ref = db.collection("activities").doc(item.type);
    batch.set(ref, item, { merge: true });
  });

  await batch.commit();
  console.log("✅ Activities seeded");
}

seedActivities();