import "./ActivityCard.css";
import { useRef } from "react";

const ALWAYS_INTERACTIVE = ["WATER", "WORKOUT", "DIET"];
const LONG_PRESS_MS = 500;

function ActivityCard({ activity, displayValue, isCompleted, onClick, onLongPress }) {
  const timerRef = useRef(null);
  const didLongPress = useRef(false);

  function startPress() {
    didLongPress.current = false;
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        didLongPress.current = true;
        onLongPress();
      }, LONG_PRESS_MS);
    }
  }

  function endPress() {
    clearTimeout(timerRef.current);
  }

  function handleClick() {
    if (didLongPress.current) return; // long press already fired, ignore click
    if (!frozen) onClick();
  }

  const frozen = isCompleted && !ALWAYS_INTERACTIVE.includes(activity.type);

  return (
    <div
      className={`activity-card ${frozen ? "activity-card--done" : ""}`}
      onClick={handleClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
    >
      <span className="activity-icon">{activity.icon}</span>

      <div className="activity-info">
        <span className="activity-desc">{activity.description}</span>
      </div>

      <span className="activity-value">
        {isCompleted && activity.unit === "boolean" ? "✅" : (displayValue ?? "—")}
      </span>
    </div>
  );
}

export default ActivityCard;