import db from "./firebaseAdmin.js";

const plans = {
  BEGINNER: [
    { type: "PUSHUP",  targetSets: 3, targetReps: 10, targetDuration: null },
    { type: "SQUATS",  targetSets: 3, targetReps: 10, targetDuration: null },
    { type: "CHINUPS", targetSets: 3, targetReps: 5,  targetDuration: null },
    { type: "PLANK",   targetSets: 3, targetReps: null, targetDuration: 30 },
  ],
  INTERMEDIATE: [
    { type: "PUSHUP",  targetSets: 3, targetReps: 15, targetDuration: null },
    { type: "SQUATS",  targetSets: 3, targetReps: 15, targetDuration: null },
    { type: "CHINUPS", targetSets: 3, targetReps: 10, targetDuration: null },
    { type: "PLANK",   targetSets: 3, targetReps: null, targetDuration: 60 },
  ],
  ADVANCED: [
    { type: "PUSHUP",  targetSets: 3, targetReps: 20, targetDuration: null },
    { type: "SQUATS",  targetSets: 3, targetReps: 20, targetDuration: null },
    { type: "CHINUPS", targetSets: 3, targetReps: 15, targetDuration: null },
    { type: "PLANK",   targetSets: 3, targetReps: null, targetDuration: 120 },
  ],
};

async function seedWorkoutPlans() {
  const batch = db.batch();

  Object.entries(plans).forEach(([category, exercises]) => {
    const ref = db.collection("workoutPlans").doc(category);
    batch.set(ref, { category, exercises, updatedAt: new Date() }, { merge: true });
  });

  await batch.commit();
  console.log("✅ Workout plans seeded");
}

seedWorkoutPlans();