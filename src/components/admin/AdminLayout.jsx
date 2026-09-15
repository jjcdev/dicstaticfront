import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const TITLES = {
  "/admin/dashboard": { title: "Tableau de bord", subtitle: "Vue d'ensemble du club" },
  "/admin/annees": { title: "Annees academiques", subtitle: "Gerez les periodes du club" },
  "/admin/membres": { title: "Membres", subtitle: "Administration par annee" },
  "/admin/galerie": { title: "Galerie", subtitle: "Photos publiees sur le site" },
  "/admin/evenements": { title: "Evenements", subtitle: "Evenements du club" },
  "/admin/messages": { title: "Messages", subtitle: "Boite de reception" },
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const page = TITLES[location.pathname] || { title: "Administration", subtitle: "" };

  return (
    <div className="adm-shell">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-topbar-toggle"
            aria-label="Ouvrir le menu"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path
                d="M1 1h16M1 7h16M1 13h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 className="adm-topbar-title">{page.title}</h1>
            {page.subtitle && (
              <div className="adm-topbar-subtitle">{page.subtitle}</div>
            )}
          </div>

          <div className="adm-topbar-actions">
            <a
              href="/"
              className="adm-topbar-icon-btn"
              title="Voir le site"
              aria-label="Voir le site"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6.5 3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5M10 2h4v4M14 2 7 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </header>

        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}