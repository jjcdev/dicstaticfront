export default function PageHeader({ title, subtitle }) {
  return (
    <header className="dic-page-header">
      <h1>
        <span className="prompt"></span>
        {title}
        <span className="cursor"></span>
      </h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}