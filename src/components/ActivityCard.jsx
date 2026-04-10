import "./ActivityCard.css";

function ActivityCard({ activity, displayValue, onClick }) {
  return (
    <div className="activity-card" onClick={onClick}>
      <div className="activity-left">

        <div className="activity-overlay">
            {activity.display_icon}
        </div>
      </div>

      <div className="activity-info">
        <p>{activity.description}</p>
        {displayValue && <p>{displayValue}</p>}
      </div>
    </div>
  );
}

export default ActivityCard;
