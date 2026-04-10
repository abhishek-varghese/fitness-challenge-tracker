import "./InputModal.css";
import { useState } from "react";

function InputModal({ title, unit, currentValue, onConfirm, onClose }) {
  const [value, setValue] = useState(currentValue ?? "");

  function handleConfirm() {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onConfirm(num);
      onClose();
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <h3 className="modal-title">{title}</h3>

        <input
          className="modal-input"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${unit}`}
          autoFocus
        />

        <div className="modal-actions">
          <button className="modal-btn modal-btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn--confirm" onClick={handleConfirm}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputModal;