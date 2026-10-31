import { useEffect, useState } from "react";
import {
  FaEye,
  FaTrash,
  FaFilter,
  FaUserGraduate,
} from "react-icons/fa";

import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import {
  getApplications,
  getApplicationById,
  deleteApplication,
} from "../../services/applicationService";

const POLES = [
  { value: "", label: "Tous les pôles" },
  { value: "ia", label: "Intelligence Artificielle" },
  { value: "cybersecurity", label: "Cybersécurité" },
  { value: "robotics", label: "Robotique & Systèmes embarqués" },
];

const POLE_LABEL = {
  ia: "Intelligence Artificielle",
  cybersecurity: "Cybersécurité",
  robotics: "Robotique & Systèmes embarqués",
};

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ pole: "", from: "", to: "" });

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.pole) params.pole = filters.pole;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    getApplications(params)
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    setSelected({ id });
    try {
      const full = await getApplicationById(id);
      setSelected(full);
    } catch {
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette candidature ?")) return;
    await deleteApplication(id);
    setApplications((list) => list.filter((a) => a.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString("fr-FR") : "—";

  return (
    <>
      <AdminPageHeader
        title="Candidatures"
        subtitle="Recrutement du club"
        breadcrumb={[{ label: "Admin" }, { label: "Candidatures" }]}
      />

      <div className="adm-card">
        <div className="adm-toolbar">
          <div className="adm-field">
            <label className="adm-label">
              <FaFilter /> Pôle
            </label>
            <select
              className="adm-select"
              value={filters.pole}
              onChange={(e) =>
                setFilters((f) => ({ ...f, pole: e.target.value }))
              }
            >
              {POLES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="adm-field">
            <label className="adm-label">Depuis</label>
            <input
              type="date"
              className="adm-input"
              value={filters.from}
              onChange={(e) =>
                setFilters((f) => ({ ...f, from: e.target.value }))
              }
            />
          </div>

          <div className="adm-field">
            <label className="adm-label">Jusqu&apos;au</label>
            <input
              type="date"
              className="adm-input"
              value={filters.to}
              onChange={(e) =>
                setFilters((f) => ({ ...f, to: e.target.value }))
              }
            />
          </div>

          <div className="adm-toolbar-spacer" />
          <span className="adm-text-muted" style={{ fontSize: 12.5 }}>
            {applications.length} candidature
            {applications.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : applications.length === 0 ? (
          <EmptyState message="Aucune candidature pour cette sélection." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Candidat</th>
                  <th>Pôle</th>
                  <th>Contact</th>
                  <th>Date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div className="cell-primary">
                        {a.first_name} {a.last_name}
                      </div>
                      <div className="cell-muted">
                        {a.school} — {a.field_of_study}
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge is-info">
                        {POLE_LABEL[a.pole] || a.pole}
                      </span>
                    </td>
                    <td>
                      <div className="cell-muted">{a.email}</div>
                      <div className="cell-muted">
                        {a.phone_prefix} {a.phone_number}
                      </div>
                    </td>
                    <td className="cell-muted">{formatDate(a.createdAt)}</td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openDetail(a.id)}
                        aria-label="Voir"
                        title="Voir"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(a.id)}
                        aria-label="Supprimer"
                        title="Supprimer"
                        style={{ marginLeft: 6 }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal
          title="Détail de la candidature"
          onClose={() => setSelected(null)}
          footer={
            <>
              <button
                className="adm-btn adm-btn-secondary"
                onClick={() => setSelected(null)}
              >
                Fermer
              </button>
              <button
                className="adm-btn adm-btn-danger"
                onClick={() => handleDelete(selected.id)}
              >
                Supprimer
              </button>
            </>
          }
        >
          {detailLoading ? (
            <Loader />
          ) : (
            <div className="adm-application-detail">
              <div className="adm-application-head">
                <div className="adm-application-avatar">
                  <FaUserGraduate aria-hidden="true" />
                </div>
                <div>
                  <div className="adm-application-name">
                    {selected.first_name} {selected.last_name}
                  </div>
                  <div className="adm-application-meta">
                    {selected.school} — {selected.field_of_study}
                  </div>
                </div>
              </div>

              <div className="adm-application-grid">
                <div>
                  <div className="adm-label">Email</div>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <div>
                  <div className="adm-label">Téléphone</div>
                  <div>
                    {selected.phone_prefix} {selected.phone_number}
                  </div>
                </div>
                <div>
                  <div className="adm-label">Pôle</div>
                  <div>{POLE_LABEL[selected.pole] || selected.pole}</div>
                </div>
                <div>
                  <div className="adm-label">Source</div>
                  <div>{selected.source || "—"}</div>
                </div>
                <div>
                  <div className="adm-label">Reçue le</div>
                  <div>{formatDate(selected.createdAt)}</div>
                </div>
              </div>

              <div className="adm-divider" />

              <div className="adm-label">Motivations</div>
              <div className="adm-application-motivations">
                {selected.motivations}
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}