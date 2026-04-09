function ActivityCard({ activity, displayValue, onClick }) {
  return (
    <div className="activity-card">
      <div className="activity-icon">
        {/* <img src={activity.icon} alt={activity.title} /> */}

        <div className="activity-overlay">
          <button className="activity-btn" onClick={onClick}>
            {activity.display_icon}
          </button>
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
