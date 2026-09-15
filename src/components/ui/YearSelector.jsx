export default function YearSelector({ years, selected, onChange }) {
  if (!years?.length) return null;

  return (
    <div className="dic-scroll-x">
      <ul className="nav nav-pills flex-nowrap gap-2 d-inline-flex">
        {years.map((y) => (
          <li className="nav-item" key={y.id}>
            <button
              type="button"
              className={`nav-link ${selected === y.id ? "active" : ""}`}
              onClick={() => onChange(y.id)}
            >
              {y.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}