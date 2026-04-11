import "./LeaderBoardRow.css";

const MEDALS = { 1: "🥇", 2: "🥈", 3: "🥉" };

const CATEGORY_COLORS = {
  BEGINNER:     "#38bdf8",
  INTERMEDIATE: "#22c55e",
  ADVANCED:     "#f97316",
};

function LeaderboardRow({ entry }) {
  const medal         = MEDALS[entry.rank];
  const categoryColor = CATEGORY_COLORS[entry.category] ?? "var(--text-secondary)";
  const todayScore    = entry.todayScore ?? 0;

  return (
    <div className={`lb-row ${entry.rank <= 3 ? "lb-row--top" : ""}`}>

      <div className="lb-rank">
        {medal
          ? <span className="lb-medal">{medal}</span>
          : <span className="lb-rank-num">#{entry.rank}</span>
        }
      </div>

      <div className="lb-info">
        <span className="lb-name">{entry.name}</span>
        <span className="lb-category" style={{ color: categoryColor }}>
          {entry.category?.charAt(0) + entry.category?.slice(1).toLowerCase()}
        </span>
      </div>

      <div className="lb-today">
        <span className="lb-today__value">{todayScore}/6</span>
        <span className="lb-today__label">today</span>
      </div>

      <div className="lb-total">
        <span className="lb-total__value">{entry.totalScore}</span>
        <span className="lb-total__label">pts</span>
      </div>

    </div>
  );
}

export default LeaderboardRow;