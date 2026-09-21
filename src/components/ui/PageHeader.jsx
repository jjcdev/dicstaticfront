export default function PageHeader({ title, subtitle, eyebrow }) {
  return (
    <header className="dic-page-head">
      {eyebrow && <span className="dic-eyebrow">{eyebrow}</span>}
      <h1 className="dic-section-title" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="dic-section-sub" style={{ marginTop: "0.5rem" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}