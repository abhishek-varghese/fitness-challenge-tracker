import { useState, useRef } from "react";
import InputModal from "./InputModal";
import "./DietCard.css";

const LONG_PRESS_MS = 500;

// Quick increment amounts per unit type
const QUICK_INCREMENTS = {
  count:  [1, 2],
  grams:  [50, 100],
  ml:     [100, 200],
  scoop:  [1],
};

function DietCard({ item, entry, onLog, onSet }) {
  const [showModal, setShowModal]   = useState(false);
  const [expanded, setExpanded]     = useState(false);
  const timerRef                    = useRef(null);
  const didLongPress                = useRef(false);

  const amount  = entry?.amount  ?? 0;
  const protein = entry?.protein ?? 0;
  const increments = QUICK_INCREMENTS[item.unit] ?? [1];

  // ── Long press → open modal ────────────────────────────────
  function startPress() {
    didLongPress.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      setShowModal(true);
    }, LONG_PRESS_MS);
  }

  function endPress() {
    clearTimeout(timerRef.current);
  }

  function handleCardClick() {
    if (didLongPress.current) return;
    setExpanded((prev) => !prev);
  }

  // Display string for amount
  function formatAmount(amt, unit) {
    if (amt === 0) return "—";
    if (unit === "count") return `×${amt}`;
    if (unit === "ml")    return `${amt}ml`;
    if (unit === "grams") return `${amt}g`;
    if (unit === "scoop") return amt === 1 ? "1 scoop" : `${amt} scoops`;
    return `${amt}`;
  }

  // Protein info string shown on card
  function proteinInfo(item) {
    if (item.unit === "count")  return `${item.proteinPerUnit}g protein each`;
    if (item.unit === "grams")  return `${item.proteinPerUnit}g protein/g`;
    if (item.unit === "ml")     return `${item.proteinPerUnit}g protein/ml`;
    if (item.unit === "scoop")  return `${item.proteinPerUnit}g protein/scoop`;
    return "";
  }

  return (
    <div className="diet-card">

      {/* ── Main row ── */}
      <div
        className="diet-card__row"
        onClick={handleCardClick}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
      >
        <span className="diet-card__icon">{item.icon}</span>

        <div className="diet-card__info">
          <span className="diet-card__title">{item.title}</span>
          <span className="diet-card__meta">{proteinInfo(item)}</span>
        </div>

        <div className="diet-card__right">
          <span className="diet-card__amount">{formatAmount(amount, item.unit)}</span>
          {protein > 0 && (
            <span className="diet-card__protein">{protein}g protein</span>
          )}
        </div>
      </div>

      {/* ── Quick increment buttons ── */}
      {expanded && (
        <div className="diet-card__actions">
          {increments.map((inc) => (
            <button
              key={inc}
              className="diet-btn"
              onClick={() => onLog(inc)}
            >
              +{inc}{item.unit === "grams" ? "g" : item.unit === "ml" ? "ml" : ""}
            </button>
          ))}
          <button
            className="diet-btn diet-btn--custom"
            onClick={() => setShowModal(true)}
          >
            Set amount
          </button>
        </div>
      )}

      {showModal && (
        <InputModal
          title={`Log ${item.title}`}
          unit={item.unit}
          currentValue={amount > 0 ? amount : ""}
          onConfirm={(val) => { onSet(val); setExpanded(false); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default DietCard;