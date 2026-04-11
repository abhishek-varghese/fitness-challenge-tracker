import db from "./firebaseAdmin.js";

const workouts = [
  {
    type: "PUSHUP",
    category: "WORKOUT",
    title: "Pushups",
    description: "Bodyweight push exercise",
    unit: "reps",
    icon: "💪",
    hasValue: true,
    defaultValue: 0,
  },
  {
    type: "SQUATS",
    category: "WORKOUT",
    title: "Squats",
    description: "Leg strength",
    unit: "reps",
    icon: "🦵",
    hasValue: true,
    defaultValue: 0,
  },
  {
    type: "PLANK",
    category: "WORKOUT",
    title: "Plank",
    description: "Core hold",
    unit: "seconds",
    icon: "🧘",
    hasValue: true,
    defaultValue: 0,
  },
  {
    type: "CHINUPS",
    category: "WORKOUT",
    title: "Chinups",
    description: "Upper body pull",
    unit: "reps",
    icon: "🏋️",
    hasValue: true,
    defaultValue: 0,
  },
];

async function seedWorkouts() {
  const batch = db.batch();

  workouts.forEach((item) => {
    const ref = db.collection("workouts").doc(item.type);
    batch.set(ref, item, { merge: true });
  });

  await batch.commit();
  console.log("✅ Workouts seeded");
}

seedWorkouts();