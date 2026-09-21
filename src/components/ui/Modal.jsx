import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="dic-modal-backdrop" onClick={onClose}>
      <div className="dic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dic-modal-header">
          <h5 className="dic-modal-title">{title}</h5>
          <button
            type="button"
            className="dic-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <FaTimes />
          </button>
        </div>
        <div className="dic-modal-body">{children}</div>
        {footer && <div className="dic-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}