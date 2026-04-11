import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import DietCard from "../components/DietCard";
import Toast from "../components/Toast";
import "./Diet.css";

const USER_ID = "user_dev";
const today = new Date().toISOString().split("T")[0];
const LOG_DOC_ID = `${USER_ID}_${today}`;

// Protein target per category — will come from user doc later
const PROTEIN_TARGETS = {
  BEGINNER:     120,
  INTERMEDIATE: 150,
  ADVANCED:     180,
};

function Diet() {
  const navigate = useNavigate();

  const [dietItems, setDietItems]       = useState([]);
  const [entries, setEntries]           = useState({});
  const [proteinTarget, setProteinTarget] = useState(150);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef(null);
  const saveTimer  = useRef(null);

  // ── Load diet items + today's log ──────────────────────────
  useEffect(() => {
    async function loadAll() {
      // Diet item definitions
      const snap = await getDocs(collection(db, "diet"));
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort: egg, chicken, fish, milk, protein_powder
      const order = ["EGG", "CHICKEN", "FISH", "MILK", "PROTEIN_POWDER"];
      items.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
      setDietItems(items);

      // User's category → protein target
      const userSnap = await getDoc(doc(db, "users", USER_ID));
      if (userSnap.exists()) {
        const cat = userSnap.data().category ?? "INTERMEDIATE";
        setProteinTarget(PROTEIN_TARGETS[cat] ?? 150);
      }

      // Today's diet log
      const logSnap = await getDoc(doc(db, "dietLogs", LOG_DOC_ID));
      if (logSnap.exists()) {
        setEntries(logSnap.data().entries ?? {});
      }
    }
    loadAll();
  }, []);

  // ── Calculate total protein ────────────────────────────────
  function calcTotalProtein(currentEntries) {
    return Object.values(currentEntries).reduce((sum, e) => sum + (e.protein ?? 0), 0);
  }

  // ── Save to Firestore ──────────────────────────────────────
  async function saveToFirestore(updatedEntries) {
    const totalProtein = calcTotalProtein(updatedEntries);
    await setDoc(doc(db, "dietLogs", LOG_DOC_ID), {
      userId: USER_ID,
      date: today,
      entries: updatedEntries,
      totalProtein: Math.round(totalProtein * 10) / 10,
      updatedAt: new Date(),
    }, { merge: true });

    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000);
  }

  function updateEntries(updatedEntries) {
    setEntries(updatedEntries);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveToFirestore(updatedEntries), 2000);
  }

  // ── Log amount for a diet item ─────────────────────────────
  function handleLog(item, amount) {
    const prev     = entries[item.type] ?? { amount: 0, protein: 0 };
    const newAmount  = prev.amount + amount;
    const newProtein = Math.round(newAmount * item.proteinPerUnit * 10) / 10;

    updateEntries({
      ...entries,
      [item.type]: { amount: newAmount, protein: newProtein },
    });
  }

  // ── Set amount directly (from modal) ──────────────────────
  function handleSet(item, amount) {
    const newProtein = Math.round(amount * item.proteinPerUnit * 10) / 10;
    updateEntries({
      ...entries,
      [item.type]: { amount, protein: newProtein },
    });
  }

  const totalProtein  = Math.round(calcTotalProtein(entries) * 10) / 10;
  const progressPct   = Math.min((totalProtein / proteinTarget) * 100, 100);
  const progressColor = progressPct >= 100 ? "var(--accent)" : "var(--accent-alt)";

  return (
    <div className="diet-page">

      {/* ── Header ── */}
      <div className="diet-header">
        <button className="back-btn" onClick={() => navigate("/")}>← Back</button>
        <h2>Diet</h2>
      </div>

      {/* ── Protein summary bar ── */}
      <div className="protein-summary">
        <div className="protein-summary__labels">
          <span className="protein-summary__title">Protein</span>
          <span className="protein-summary__value">
            {totalProtein}g <span className="protein-summary__target">/ {proteinTarget}g</span>
          </span>
        </div>
        <div className="protein-bar">
          <div
            className="protein-bar__fill"
            style={{ width: `${progressPct}%`, background: progressColor }}
          />
        </div>
        {progressPct >= 100 && (
          <p className="protein-summary__done">✅ Target hit!</p>
        )}
      </div>

      {/* ── Diet cards ── */}
      <div className="diet-grid">
        {dietItems.map((item) => (
          <DietCard
            key={item.id}
            item={item}
            entry={entries[item.type]}
            onLog={(amount) => handleLog(item, amount)}
            onSet={(amount) => handleSet(item, amount)}
          />
        ))}
      </div>

      <Toast message="✅ Saved" visible={toastVisible} />
    </div>
  );
}

export default Diet;