import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const empty = { label: "", start_date: "", end_date: "", is_current: false };

export default function ManageYears() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/academic-years")
      .then((r) => setYears(r.data))
      .catch(() => setYears([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError("");
    setShowModal(true);
  };

  const openEdit = (y) => {
    setEditing(y.id);
    setForm({
      label: y.label,
      start_date: y.start_date?.slice(0, 10) ?? "",
      end_date: y.end_date?.slice(0, 10) ?? "",
      is_current: !!y.is_current,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editing) await api.put(`/academic-years/${editing}`, form);
      else await api.post("/academic-years", form);
      setShowModal(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette annee ?")) return;
    await api.delete(`/academic-years/${id}`);
    load();
  };

  return (
    <>
      <AdminPageHeader
        title="Annees academiques"
        subtitle="Gerez les periodes du club"
        breadcrumb={[{ label: "Admin" }, { label: "Annees" }]}
        actions={
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <FaPlus /> Ajouter une annee
          </button>
        }
      />

      <div className="adm-card">
        {loading ? (
          <Loader />
        ) : years.length === 0 ? (
          <EmptyState message="Aucune annee academique." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Libelle</th>
                  <th>Debut</th>
                  <th>Fin</th>
                  <th>Statut</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y.id}>
                    <td className="cell-primary">{y.label}</td>
                    <td className="cell-muted">
                      {y.start_date?.slice(0, 10)}
                    </td>
                    <td className="cell-muted">
                      {y.end_date?.slice(0, 10)}
                    </td>
                    <td>
                      {y.is_current ? (
                        <span className="adm-badge is-success">
                          <span className="adm-badge-dot" /> Courante
                        </span>
                      ) : (
                        <span className="adm-badge is-neutral">
                          <span className="adm-badge-dot" /> Archive
                        </span>
                      )}
                    </td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openEdit(y)}
                        aria-label="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(y.id)}
                        aria-label="Supprimer"
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

            {showModal && (
        <Modal
          title={editing ? "Modifier l'annee" : "Ajouter une annee"}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button
                type="button"
                className="adm-btn adm-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                form="year-form"
                className="adm-btn adm-btn-primary"
                disabled={saving}
              >
                {saving ? "Enregistrement..." : editing ? "Enregistrer" : "Ajouter"}
              </button>
            </>
          }
        >
          <form id="year-form" onSubmit={handleSubmit} className="adm-row">
            <div className="adm-field">
              <label className="adm-label">
                Libelle <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                placeholder="2025-2026"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                required
              />
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">
                  Date de debut <span className="req">*</span>
                </label>
                <input
                  type="date"
                  className="adm-input"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">
                  Date de fin <span className="req">*</span>
                </label>
                <input
                  type="date"
                  className="adm-input"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <label className="adm-check">
              <input
                type="checkbox"
                checked={form.is_current}
                onChange={(e) =>
                  setForm({ ...form, is_current: e.target.checked })
                }
              />
              <span>Marquer comme annee courante</span>
            </label>

            {error && <div className="adm-alert is-error">{error}</div>}
          </form>
        </Modal>
      )}
    </>
  );
}