import { FaInbox } from "react-icons/fa";

export default function EmptyState({ message = "Aucune donnee." }) {
  return (
    <div className="adm-empty">
      <div className="adm-empty-icon">
        <FaInbox aria-hidden="true" />
      </div>
      <p>{message}</p>
    </div>
  );
}