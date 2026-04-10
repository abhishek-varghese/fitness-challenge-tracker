import { useState } from "react";
import InputModal from "./InputModal";
import "./WorkoutCard.css";

// Quick-log set options shown as buttons
const QUICK_SETS_REPS = [
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "20", value: 20 },
  { label: "25", value: 25 },
];

const QUICK_SETS_DURATION = [
  { label: "30s",  value: 30 },
  { label: "1min", value: 60 },
  { label: "2min", value: 120 },
  { label: "3min", value: 180 },
];

function WorkoutCard({ exercise, target, log, isCompleted, onLogSet }) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isTimeBased = exercise.unit === "seconds";
  const QUICK_SETS  = isTimeBased ? QUICK_SETS_DURATION : QUICK_SETS_REPS;

  const totalReps   = log?.totalReps ?? 0;
  const targetTotal = target
    ? (target.targetReps !== null
        ? target.targetSets * target.targetReps
        : target.targetSets * target.targetDuration)
    : null;

  const displayUnit = isTimeBased ? "sec" : "reps";

  function handleQuickLog(value) {
    onLogSet(value);
    setExpanded(false);
  }

  function handleCustomLog(value) {
    onLogSet(Number(value));
    setExpanded(false);
  }

  function handleCardClick() {
    if (isCompleted) return;
    setExpanded((prev) => !prev);
  }

  return (
    <div className={`workout-card ${isCompleted ? "workout-card--done" : ""} ${expanded ? "workout-card--expanded" : ""}`}>

      <div className="workout-card__row" onClick={handleCardClick}>
        <span className="workout-card__icon">{exercise.icon}</span>

        <div className="workout-card__info">
          <span className="workout-card__title">{exercise.title}</span>
          {targetTotal && (
            <span className="workout-card__sub">
              {totalReps} / {targetTotal} {displayUnit}
            </span>
          )}
        </div>

        <span className="workout-card__status">
          {isCompleted ? "✅" : totalReps > 0 ? `+${totalReps}` : "Tap"}
        </span>
      </div>

      {targetTotal && (
        <div className="workout-card__bar">
          <div
            className="workout-card__bar-fill"
            style={{ width: `${Math.min((totalReps / targetTotal) * 100, 100)}%` }}
          />
        </div>
      )}

      {expanded && !isCompleted && (
        <div className="workout-card__sets">
          {QUICK_SETS.map((s) => (
            <button
              key={s.label}
              className="set-btn"
              onClick={() => handleQuickLog(s.value)}
            >
              {s.label}
            </button>
          ))}
          <button
            className="set-btn set-btn--custom"
            onClick={() => setShowModal(true)}
          >
            Custom
          </button>
        </div>
      )}

      {showModal && (
        <InputModal
          title={`Log ${exercise.title}`}
          unit={displayUnit}
          currentValue=""
          onConfirm={handleCustomLog}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default WorkoutCard;