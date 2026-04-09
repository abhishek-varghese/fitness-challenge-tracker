import { useState, useEffect } from "react";
import ActivityCard from "../components/ActivityCard";
import { useNavigate } from "react-router-dom";
import { activityConfig, ACTIVITY_TYPES } from "../config/activityConfig";

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function DailyProgress() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({
    water: 0,
    noAlchol: false,
    workoutDone: false,
    sleep: 0,
    dietDone: false,
  });

  //   const activities = [
  //     {
  //       id: 1,
  //       type: ACTIVITY_TYPES.WATER,
  //       title: "drink water",
  //       description: "keep hydrated",
  //       display_icon: "💧",
  //     },
  //     {
  //       id: 2,
  //       type: ACTIVITY_TYPES.DIET,
  //       title: "eat healthy",
  //       description: "healthy body, healthy mind",
  //       display_icon: "🍗",
  //     },
  //     {
  //       id: 3,
  //       type: ACTIVITY_TYPES.WORKOUT,
  //       title: "workout",
  //       description: "healthy body, healthy mind",
  //       display_icon: "💪",
  //     },
  //     {
  //       id: 4,
  //       type: ACTIVITY_TYPES.SLEEP,
  //       title: "sleep",
  //       description: "need proper rest",
  //       display_icon: "🌙",
  //     },
  //     {
  //       id: 5,
  //       type: ACTIVITY_TYPES.ALCOHOL,
  //       title: "no alchol",
  //       description: "no alchol yesterday",
  //       display_icon: "🚫",
  //     },
  //     {
  //       id: 6,
  //       type: ACTIVITY_TYPES.STEPS,
  //       title: "steps",
  //       description: "step counter",
  //       display_icon: "👟",
  //     },
  //   ];
  useEffect(() => {
    async function fetchActivities() {
      try {
        const snapshot = await getDocs(collection(db, "activities"));

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    }

    fetchActivities();
  }, []);

  function handleActivityClick(activity) {
    const config = activityConfig[activity.type];

    if (!config) return;

    if (config.type === "page") {
      navigate(config.route);
    } else if (config.type === "action") {
      setDailyProgress((prev) => config.update(prev));
    } else if (config.type == "input") {
      const value = prompt("Enter hours slept");
      if (value != null) {
        setDailyProgress((prev) => config.update(prev, Number(value)));
      }
    }
  }

  return (
    <div className="daily-progress">
      <h2> Today </h2>
      <div className="activity-grid">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];

          const displayValue = config?.getDisplay
            ? config.getDisplay(dailyProgress)
            : null;
          return (
            <ActivityCard
              key={activity.id}
              activity={activity}
              displayValue={displayValue}
              onClick={() => handleActivityClick(activity)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DailyProgress;
