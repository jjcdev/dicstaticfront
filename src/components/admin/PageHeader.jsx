import { Link } from "react-router-dom";

export default function AdminPageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="adm-page-header">
      <div>
        {breadcrumb && (
          <nav className="adm-breadcrumb">
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {item.to ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span className="adm-breadcrumb-sep">/</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h2 className="adm-page-title">{title}</h2>
        {subtitle && <p className="adm-page-subtitle">{subtitle}</p>}
      </div>

      {actions && <div className="adm-page-actions">{actions}</div>}
    </div>
  );
}