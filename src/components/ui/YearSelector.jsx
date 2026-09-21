import { ensureArray } from "../../utils/ensureArray";

export default function YearSelector({ years, selected, onChange }) {
  const list = ensureArray(years);
  if (list.length === 0) return null;

  return (
    <div className="dic-year-selector">
      <div className="dic-year-track">
        {list.map((y) => (
          <button
            key={y.id}
            type="button"
            className={`dic-year-chip ${selected === y.id ? "is-active" : ""}`}
            onClick={() => onChange(y.id)}
          >
            {y.label}
            {y.is_current && <span className="dic-year-dot" />}
          </button>
        ))}
      </div>
    </div>
  );
}