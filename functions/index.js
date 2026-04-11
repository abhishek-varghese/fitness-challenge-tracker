const functions = require("firebase-functions");
const admin     = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

// ── Scoring rules ──────────────────────────────────────────
// 1 point each if threshold is met
const DAILY_RULES = [
  { key: "water",     field: "water",     threshold: 2,    compare: ">=" },
  { key: "sleep",     field: "sleep",     threshold: 7,    compare: ">=" },
  { key: "noAlcohol", field: "noAlcohol", threshold: true, compare: "==" },
  { key: "steps",     field: "steps",     threshold: 8000, compare: ">=" },
];

const PROTEIN_TARGETS = {
  BEGINNER:     120,
  INTERMEDIATE: 150,
  ADVANCED:     180,
};

function checkRule(value, threshold, compare) {
  if (compare === ">=") return (value ?? 0) >= threshold;
  if (compare === "==") return value === threshold;
  return false;
}

// ── Scheduled function — runs every hour ───────────────────
exports.calculateLeaderboard = functions.pubsub
  .schedule("every 1 hours")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const today = new Date().toISOString().split("T")[0];
    functions.logger.log(`Calculating leaderboard for ${today}`);

    // 1. Get all active users
    const usersSnap = await db.collection("users")
      .where("active", "==", true)
      .get();

    if (usersSnap.empty) {
      functions.logger.log("No active users found");
      return null;
    }

    for (const userDoc of usersSnap.docs) {
      const user   = userDoc.data();
      const userId = user.userId;

      // 2. Fetch today's logs for this user in parallel
      const [progressSnap, workoutSnap, dietSnap] = await Promise.all([
        db.collection("dailyProgress").doc(`${userId}_${today}`).get(),
        db.collection("workoutLogs").doc(`${userId}_${today}`).get(),
        db.collection("dietLogs").doc(`${userId}_${today}`).get(),
      ]);

      const progress = progressSnap.exists ? progressSnap.data() : {};
      const workout  = workoutSnap.exists  ? workoutSnap.data()  : {};
      const diet     = dietSnap.exists     ? dietSnap.data()     : {};

      // 3. Calculate score
      let todayScore = 0;
      const breakdown = {};

      // Daily activity points
      for (const rule of DAILY_RULES) {
        const met = checkRule(progress[rule.field], rule.threshold, rule.compare);
        breakdown[rule.key] = met ? 1 : 0;
        if (met) todayScore++;
      }

      // Workout point — check against user's plan
      const planSnap = await db.collection("workoutPlans")
        .doc(user.category ?? "INTERMEDIATE")
        .get();

      if (planSnap.exists && workout.entries) {
        const exercises = planSnap.data().exercises ?? [];
        const allMet = exercises.every((ex) => {
          const log    = workout.entries[ex.type];
          const target = ex.targetReps !== null
            ? ex.targetSets * ex.targetReps
            : ex.targetSets * ex.targetDuration;
          return (log?.totalReps ?? 0) >= target;
        });
        breakdown.workout = allMet ? 1 : 0;
        if (allMet) todayScore++;
      } else {
        breakdown.workout = 0;
      }

      // Diet point — check protein target
      const proteinTarget = PROTEIN_TARGETS[user.category] ?? 150;
      const dietMet       = (diet.totalProtein ?? 0) >= proteinTarget;
      breakdown.diet      = dietMet ? 1 : 0;
      if (dietMet) todayScore++;

      // 4. Read existing leaderboard doc and update daily scores
      const leaderboardRef  = db.collection("leaderboard").doc(userId);
      const leaderboardSnap = await leaderboardRef.get();
      const existing        = leaderboardSnap.exists ? leaderboardSnap.data() : {};
      const dailyScores     = existing.dailyScores ?? [];

      const todayIndex = dailyScores.findIndex((s) => s.date === today);
      const todayEntry = { date: today, score: todayScore, breakdown };
      if (todayIndex >= 0) {
        dailyScores[todayIndex] = todayEntry;
      } else {
        dailyScores.push(todayEntry);
      }

      const totalScore = dailyScores.reduce((sum, d) => sum + d.score, 0);

      await leaderboardRef.set({
        userId,
        name:        user.name,
        category:    user.category ?? "INTERMEDIATE",
        totalScore,
        todayScore,
        dailyScores,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      functions.logger.log(`${user.name}: today=${todayScore}/6, total=${totalScore}`);
    }

    functions.logger.log("Leaderboard updated successfully");
    return null;
  });