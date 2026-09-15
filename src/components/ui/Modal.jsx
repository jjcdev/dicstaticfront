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
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h5 className="adm-modal-title">{title}</h5>
          <button
            className="adm-modal-close"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            <FaTimes />
          </button>
        </div>
        <div className="adm-modal-body">{children}</div>
        {footer && <div className="adm-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}