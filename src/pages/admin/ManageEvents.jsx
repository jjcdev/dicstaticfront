import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api, { resolveStaticBase } from "../../services/api";
import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const STATIC_URL = resolveStaticBase();

const empty = {
  title: "",
  description: "",
  event_date: "",
  location: "",
  academic_year_id: "",
};

export default function ManageEvents() {
  const [years, setYears] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadYears = () =>
    api
      .get("/academic-years")
      .then((r) => setYears(r.data))
      .catch(() => {});

  const loadEvents = () => {
    setLoading(true);
    const params = {};
    if (filterYear) params.yearId = filterYear;
    api
      .get("/events", { params })
      .then((r) => setEvents(r.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [filterYear]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, academic_year_id: filterYear });
    setCover(null);
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (ev) => {
    setEditing(ev.id);
    setForm({
      title: ev.title ?? "",
      description: ev.description ?? "",
      event_date: ev.event_date?.slice(0, 10) ?? "",
      location: ev.location ?? "",
      academic_year_id: ev.academic_year_id ?? "",
    });
    setCover(null);
    setPreview(ev.cover_image ? `${STATIC_URL}${ev.cover_image}` : null);
    setError("");
    setShowModal(true);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    setCover(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (cover) fd.append("cover_image", cover);

    try {
      if (editing) await api.put(`/events/${editing}`, fd);
      else await api.post("/events", fd);
      setShowModal(false);
      loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet evenement ?")) return;
    await api.delete(`/events/${id}`);
    loadEvents();
  };

  const isUpcoming = (dateStr) => {
    const d = new Date(dateStr).setHours(0, 0, 0, 0);
    const now = new Date().setHours(0, 0, 0, 0);
    return d >= now;
  };

  return (
    <>
      <AdminPageHeader
        title="Evenements"
        subtitle="Ateliers, hackathons et conferences"
        breadcrumb={[{ label: "Admin" }, { label: "Evenements" }]}
        actions={
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <FaPlus /> Ajouter un evenement
          </button>
        }
      />

      <div className="adm-card">
        <div className="adm-toolbar">
          <div className="adm-field">
            <label className="adm-label">Filtrer par annee</label>
            <select
              className="adm-select"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="">Toutes les annees</option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-toolbar-spacer" />
          <span className="adm-text-muted" style={{ fontSize: 12.5 }}>
            {events.length} evenement{events.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <EmptyState message="Aucun evenement pour cette selection." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Couverture</th>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Statut</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const upcoming = isUpcoming(ev.event_date);
                  return (
                    <tr key={ev.id}>
                      <td>
                        <img
                          src={
                            ev.cover_image
                              ? `${STATIC_URL}${ev.cover_image}`
                              : "/placeholder.png"
                          }
                          alt=""
                          className="adm-thumb"
                        />
                      </td>
                      <td>
                        <div className="cell-primary">{ev.title}</div>
                        <div className="cell-muted">
                          {ev.academic_year?.label || "-"}
                        </div>
                      </td>
                      <td className="cell-muted">
                        {ev.event_date
                          ? new Date(ev.event_date).toLocaleDateString("fr-FR")
                          : "-"}
                      </td>
                      <td className="cell-muted">{ev.location || "-"}</td>
                      <td>
                        {upcoming ? (
                          <span className="adm-badge is-success">
                            <span className="adm-badge-dot" /> A venir
                          </span>
                        ) : (
                          <span className="adm-badge is-neutral">
                            <span className="adm-badge-dot" /> Passe
                          </span>
                        )}
                      </td>
                      <td className="col-actions">
                        <button
                          className="adm-icon-btn is-sm"
                          onClick={() => openEdit(ev)}
                          aria-label="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="adm-icon-btn is-sm is-danger"
                          onClick={() => handleDelete(ev.id)}
                          aria-label="Supprimer"
                          style={{ marginLeft: 6 }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? "Modifier l'evenement" : "Ajouter un evenement"}
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
                form="event-form"
                className="adm-btn adm-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Enregistrement..."
                  : editing
                  ? "Enregistrer"
                  : "Ajouter"}
              </button>
            </>
          }
        >
          <form id="event-form" onSubmit={handleSubmit} className="adm-row">
            <div className="adm-field">
              <label className="adm-label">
                Titre <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">
                Description <span className="req">*</span>
              </label>
              <textarea
                className="adm-textarea"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">
                  Date <span className="req">*</span>
                </label>
                <input
                  type="date"
                  className="adm-input"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Lieu</label>
                <input
                  className="adm-input"
                  placeholder="Amphi A, Salle B..."
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Annee academique</label>
              <select
                className="adm-select"
                value={form.academic_year_id}
                onChange={(e) =>
                  setForm({ ...form, academic_year_id: e.target.value })
                }
              >
                <option value="">Aucune</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label className="adm-label">Image de couverture</label>
              <input
                type="file"
                accept="image/*"
                className="adm-file"
                onChange={handleCoverChange}
              />
              {preview && (
                <img src={preview} alt="Apercu" className="adm-preview" />
              )}
            </div>

            {error && <div className="adm-alert is-error">{error}</div>}
          </form>
        </Modal>
      )}
    </>
  );
}