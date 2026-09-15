import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaImages,
  FaCalendarCheck,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/admin/dashboard", label: "Tableau de bord", Icon: FaTachometerAlt },
  { to: "/admin/annees", label: "Annees", Icon: FaCalendarAlt },
  { to: "/admin/membres", label: "Membres", Icon: FaUsers },
  { to: "/admin/galerie", label: "Galerie", Icon: FaImages },
  { to: "/admin/evenements", label: "Evenements", Icon: FaCalendarCheck },
  {
    to: "/admin/messages",
    label: "Messages",
    Icon: FaEnvelope,
    badgeKey: "unread",
  },
];

export default function AdminSidebar({ open, onClose }) {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ unread: 0 });

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  const logout = () => {
    signOut();
    navigate("/admin/login");
  };

  const initials = (admin?.username || admin?.email || "A")
    .slice(0, 1)
    .toUpperCase();

  return (
    <>
      <div
        className={`adm-sidebar-backdrop ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`adm-sidebar ${open ? "is-open" : ""}`}>
        <Link to="/admin/dashboard" className="adm-sidebar-brand" onClick={onClose}>
          <img src="/logo-dic.png" alt="DIC" />
          <div className="adm-sidebar-brand-text">
            <strong>DIC Admin</strong>
            <span>Espace gestion</span>
          </div>
        </Link>

        <div className="adm-sidebar-body">
          <div className="adm-sidebar-section">Navigation</div>
          <nav>
            <ul className="adm-nav">
              {links.map(({ to, label, Icon, badgeKey }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `adm-nav-item ${isActive ? "is-active" : ""}`
                    }
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                    {badgeKey && stats[badgeKey] > 0 && (
                      <span className="adm-nav-badge">{stats[badgeKey]}</span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="adm-sidebar-footer">
          <div className="adm-user-card">
            <div className="adm-user-avatar">{initials}</div>
            <div className="adm-user-info">
              <strong>{admin?.username || "Administrateur"}</strong>
              <span>{admin?.email || "admin@dic.org"}</span>
            </div>
            <button
              className="adm-user-logout"
              onClick={logout}
              title="Deconnexion"
              aria-label="Deconnexion"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}