import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaImages,
  FaCalendarCheck,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import api from "../../services/api";
import AdminPageHeader from "../../components/admin/PageHeader";
import Loader from "../../components/ui/Loader";

const CARDS = [
  {
    key: "members",
    label: "Membres",
    Icon: FaUsers,
    color: "primary",
    to: "/admin/membres",
  },
  {
    key: "photos",
    label: "Photos",
    Icon: FaImages,
    color: "info",
    to: "/admin/galerie",
  },
  {
    key: "events",
    label: "Evenements",
    Icon: FaCalendarCheck,
    color: "success",
    to: "/admin/evenements",
  },
  {
    key: "unread",
    label: "Messages non lus",
    Icon: FaEnvelope,
    color: "danger",
    to: "/admin/messages",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    photos: 0,
    events: 0,
    unread: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats").then((r) => r.data),
      api.get("/contact").then((r) => r.data).catch(() => []),
    ])
      .then(([s, messages]) => {
        setStats(s);
        setRecent(
          (messages || []).filter((m) => !m.is_read).slice(0, 5)
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <AdminPageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activite du club"
        breadcrumb={[{ label: "Admin" }, { label: "Tableau de bord" }]}
      />

      <div className="adm-row adm-row-2 adm-mb-4" style={{ gap: "1rem" }}>
        {CARDS.map(({ key, label, Icon, color, to }) => (
          <Link to={to} key={key} className="adm-stat">
            <div className={`adm-stat-icon is-${color}`}>
              <Icon aria-hidden="true" />
            </div>
            <div className="adm-stat-body">
              <div className="adm-stat-label">{label}</div>
              <div className="adm-stat-value">{stats[key]}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-header">
          <div>
            <h3 className="adm-card-title">Messages recents</h3>
            <p className="adm-card-subtitle">
              Les derniers messages non lus
            </p>
          </div>
          <Link to="/admin/messages" className="adm-btn adm-btn-secondary adm-btn-sm">
            Voir tout <FaArrowRight />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="adm-empty">
            <p>Aucun message non lu.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Expediteur</th>
                  <th>Sujet</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="cell-primary">{m.name}</div>
                      <div className="cell-muted">{m.email}</div>
                    </td>
                    <td>{m.subject || "(sans sujet)"}</td>
                    <td className="cell-muted">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}