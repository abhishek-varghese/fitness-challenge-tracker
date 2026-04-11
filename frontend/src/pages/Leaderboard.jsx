import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import LeaderboardRow from "../components/LeaderBoardRow";
import "./LeaderBoard.css";

function LeaderBoard() {
  const [entries, setEntries]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q    = query(
          collection(db, "leaderboard"),
          orderBy("totalScore", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc, index) => ({
          id:   doc.id,
          rank: index + 1,
          ...doc.data(),
        }));
        setEntries(data);

        if (data.length > 0 && data[0].lastUpdated) {
          setLastUpdated(data[0].lastUpdated.toDate());
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  function formatUpdated(date) {
    if (!date) return "";
    return date.toLocaleTimeString("en-IN", {
      hour:   "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        {lastUpdated && (
          <span className="leaderboard-updated">
            Updated {formatUpdated(lastUpdated)}
          </span>
        )}
      </div>

      {loading ? (
        <div className="leaderboard-empty">Loading...</div>
      ) : entries.length === 0 ? (
        <div className="leaderboard-empty">
          <p>No scores yet.</p>
          <p>Check back after the first update.</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {entries.map((entry) => (
            <LeaderboardRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaderBoard;