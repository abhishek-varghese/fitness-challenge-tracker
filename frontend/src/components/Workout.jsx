import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import WorkoutCard from "../components/WorkoutCard";
import Toast from "../components/Toast";
import "./Workout.css";

const USER_ID = "user_dev";
const today = new Date().toISOString().split("T")[0];
const LOG_DOC_ID = `${USER_ID}_${today}`;

function Workout() {
  const navigate = useNavigate();

  const [exercises, setExercises]       = useState([]);
  const [plan, setPlan]                 = useState([]);
  const [logs, setLogs]                 = useState({});
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer                      = useRef(null);

  useEffect(() => {
  async function loadAll() {
    const allTypes = ["PUSHUP", "SQUATS", "CHINUPS", "PLANK"];

    const defs = await Promise.all(
      allTypes.map(async (type) => {
        const snap = await getDoc(doc(db, "workouts", type));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
      })
    );
    setExercises(defs.filter(Boolean));

    // Get user's category first, then fetch the right plan
    const userSnap = await getDoc(doc(db, "users", USER_ID));
    const category = userSnap.exists() ? userSnap.data().category : "INTERMEDIATE";

    const planSnap = await getDoc(doc(db, "workoutPlans", category));
    if (planSnap.exists()) setPlan(planSnap.data().exercises);

    const logSnap = await getDoc(doc(db, "workoutLogs", LOG_DOC_ID));
    if (logSnap.exists()) setLogs(logSnap.data().entries ?? {});
  }

  loadAll();
}, []);

  async function saveLogs(updatedLogs) {
    await setDoc(doc(db, "workoutLogs", LOG_DOC_ID), {
      userId: USER_ID,
      date: today,
      entries: updatedLogs,
      updatedAt: new Date(),
    }, { merge: true });

    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }

  function handleLogSet(type, reps) {
    const existing = logs[type] ?? { totalReps: 0, sets: [] };
    const updated = {
      ...logs,
      [type]: {
        totalReps: existing.totalReps + reps,
        sets: [...existing.sets, { reps, loggedAt: new Date().toISOString() }],
      },
    };
    setLogs(updated);
    saveLogs(updated);
  }

  function isExerciseDone(type) {
    const planItem = plan.find((p) => p.type === type);
    if (!planItem) return false;
    const target = planItem.targetReps !== null
      ? planItem.targetSets * planItem.targetReps
      : planItem.targetSets * planItem.targetDuration;
    return (logs[type]?.totalReps ?? 0) >= target;
  }

  function getTarget(type) {
    return plan.find((p) => p.type === type) ?? null;
  }

  return (
    <div className="workout-page">
      <div className="workout-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Workout</h2>
      </div>

      <div className="exercise-grid">
        {exercises.map((exercise) => (
          <WorkoutCard
            key={exercise.id}
            exercise={exercise}
            target={getTarget(exercise.id)}
            log={logs[exercise.id]}
            isCompleted={isExerciseDone(exercise.id)}
            onLogSet={(reps) => handleLogSet(exercise.id, reps)}
          />
        ))}
      </div>

      <Toast message="✅ Saved" visible={toastVisible} />
    </div>
  );
}

export default Workout;