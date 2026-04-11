import { useState, useEffect, useRef, useCallback } from "react";
import ActivityCard from "../components/ActivityCard";
import InputModal from "../components/InputModal";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";
import { activityConfig } from "../config/activityConfig";

import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

import "./DailyProgress.css";

// Hardcoded until auth is added
const USER_ID = "user_dev";
const today = new Date().toISOString().split("T")[0]; // "2026-04-11"
const DOC_ID = `${USER_ID}_${today}`;

function DailyProgress() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({
    water: 0,
    noAlcohol: false,
    workoutDone: false,
    sleep: 0,
    dietDone: false,
    steps: 0,
  });

  const [modal, setModal] = useState(null); // { title, unit, field, currentValue }
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);
  const saveTimer = useRef(null);

  // ── Load today's doc on mount ──────────────────────────────
  useEffect(() => {
    async function fetchActivities() {
      const snapshot = await getDocs(collection(db, "activities"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
    }

    async function fetchTodayProgress() {
      const ref = doc(db, "dailyProgress", DOC_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDailyProgress((prev) => ({ ...prev, ...snap.data() }));
      }
    }

    fetchActivities();
    fetchTodayProgress();
  }, []);

  // ── Auto-save with debounce ────────────────────────────────
  const saveToFirestore = useCallback(async (progress) => {
    const ref = doc(db, "dailyProgress", DOC_ID);
    await setDoc(ref, {
      userId: USER_ID,
      date: today,
      ...progress,
      updatedAt: new Date(),
    }, { merge: true });

    // Show toast
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }, []);

  function updateProgress(newProgress) {
    setDailyProgress(newProgress);

    // Debounce: wait 2s after last change before saving
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToFirestore(newProgress);
    }, 2000);
  }

  // ── Click handler ──────────────────────────────────────────
  function handleActivityClick(activity) {
    const config = activityConfig[activity.type];
    if (!config) return;

    if (config.type === "page") {
      navigate(config.route);

    } else if (config.type === "action") {
      updateProgress(config.update(dailyProgress));

    } else if (config.type === "input") {
      setModal({
        title: activity.title,
        unit: activity.unit,
        field: activity.type,
        currentValue: dailyProgress[activity.type.toLowerCase()],
      });
    }
  }

  // Long press on WATER → open direct input modal
  function handleWaterLongPress() {
    setModal({
      title: "Enter Water Amount",
      unit: "liters",
      field: "WATER",
      currentValue: dailyProgress.water,
    });
  }

  // Modal confirm
  function handleModalConfirm(value) {
    const config = activityConfig[modal.field];
    if (config?.update) {
      updateProgress(config.update(dailyProgress, value));
    }
  }

  return (
    <div className="daily-progress">
      <h2>Daily Progress</h2>
      <div className="activity-grid">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const displayValue = config?.getDisplay ? config.getDisplay(dailyProgress) : null;
          const isCompleted = config?.isCompleted ? config.isCompleted(dailyProgress) : false;

          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              displayValue={displayValue}
              isCompleted={isCompleted}
              onClick={() => handleActivityClick(activity)}
              onLongPress={activity.type === "WATER" ? handleWaterLongPress : undefined}
            />
          );
        })}
      </div>

      {modal && (
        <InputModal
          title={modal.title}
          unit={modal.unit}
          currentValue={modal.currentValue}
          onConfirm={handleModalConfirm}
          onClose={() => setModal(null)}
        />
      )}

      <Toast message="✅ Saved" visible={toastVisible} />
    </div>
  );
}

export default DailyProgress;