import db from "./firebaseAdmin.js";

// Dummy data so you can see the leaderboard page before
// the Cloud Function runs for the first time.
// Replace names with real ones before running.

const entries = [
  {
    userId:      "8089439833",
    name:        "Your Name",
    category:    "INTERMEDIATE",
    totalScore:  18,
    todayScore:  5,
    dailyScores: [
      { date: "2026-04-09", score: 6, breakdown: { water:1, sleep:1, noAlcohol:1, steps:1, workout:1, diet:1 } },
      { date: "2026-04-10", score: 7, breakdown: { water:1, sleep:1, noAlcohol:1, steps:1, workout:1, diet:1 } },
      { date: "2026-04-11", score: 5, breakdown: { water:1, sleep:1, noAlcohol:1, steps:0, workout:1, diet:1 } },
    ],
    lastUpdated: new Date(),
  },
  {
    userId:      "8089439834",
    name:        "Abhishek",
    category:    "INTERMEDIATE",
    totalScore:  15,
    todayScore:  4,
    dailyScores: [
      { date: "2026-04-09", score: 5, breakdown: { water:1, sleep:1, noAlcohol:1, steps:1, workout:1, diet:0 } },
      { date: "2026-04-10", score: 6, breakdown: { water:1, sleep:1, noAlcohol:1, steps:1, workout:1, diet:1 } },
      { date: "2026-04-11", score: 4, breakdown: { water:1, sleep:0, noAlcohol:1, steps:0, workout:1, diet:1 } },
    ],
    lastUpdated: new Date(),
  },
];

async function seedLeaderboard() {
  const batch = db.batch();
  entries.forEach((entry) => {
    const ref = db.collection("leaderboard").doc(entry.userId);
    batch.set(ref, entry, { merge: true });
  });
  await batch.commit();
  console.log("✅ Leaderboard seeded");
}

seedLeaderboard();