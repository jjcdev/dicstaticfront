import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { resolveStaticBase } from "../../services/api";

const STATIC_URL = resolveStaticBase();

const empty = {
  first_name: "",
  last_name: "",
  role: "",
  bio: "",
  linkedin: "",
  github: "",
  academic_year_id: "",
  display_order: 0,
};

export default function ManageMembers() {
  const [years, setYears] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadYears = () =>
    api.get("/academic-years").then((r) => {
      setYears(r.data);
      if (r.data.length && !filterYear) setFilterYear(String(r.data[0].id));
    });

  const loadMembers = (yearId) => {
    setLoading(true);
    api
      .get("/members", { params: yearId ? { yearId } : {} })
      .then((r) => setMembers(r.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadMembers(filterYear);
  }, [filterYear]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, academic_year_id: filterYear });
    setPhoto(null);
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditing(m.id);
    setForm({
      first_name: m.first_name,
      last_name: m.last_name,
      role: m.role,
      bio: m.bio ?? "",
      linkedin: m.linkedin ?? "",
      github: m.github ?? "",
      academic_year_id: m.academic_year_id,
      display_order: m.display_order ?? 0,
    });
    setPhoto(null);
    setPreview(m.photo_url ? `${STATIC_URL}${m.photo_url}` : null);
    setError("");
    setShowModal(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    setPhoto(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (photo) fd.append("photo", photo);

    try {
      if (editing) await api.put(`/members/${editing}`, fd);
      else await api.post("/members", fd);
      setShowModal(false);
      loadMembers(filterYear);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre ?")) return;
    await api.delete(`/members/${id}`);
    loadMembers(filterYear);
  };

  return (
    <>
      <AdminPageHeader
        title="Membres"
        subtitle="Administration du club par annee"
        breadcrumb={[{ label: "Admin" }, { label: "Membres" }]}
        actions={
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <FaPlus /> Ajouter un membre
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
            {members.length} membre{members.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : members.length === 0 ? (
          <EmptyState message="Aucun membre pour cette selection." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Photo</th>
                  <th>Nom</th>
                  <th>Role</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <img
                        src={
                          m.photo_url
                            ? `${STATIC_URL}${m.photo_url}`
                            : "/default-avatar.png"
                        }
                        alt=""
                        className="adm-thumb"
                      />
                    </td>
                    <td>
                      <div className="cell-primary">
                        {m.first_name} {m.last_name}
                      </div>
                      <div className="cell-muted">
                        {m.academic_year?.label || "-"}
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge is-info">{m.role}</span>
                    </td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openEdit(m)}
                        aria-label="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(m.id)}
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
          title={editing ? "Modifier le membre" : "Ajouter un membre"}
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
                form="member-form"
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
          <form id="member-form" onSubmit={handleSubmit} className="adm-row">
            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">
                  Prenom <span className="req">*</span>
                </label>
                <input
                  className="adm-input"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">
                  Nom <span className="req">*</span>
                </label>
                <input
                  className="adm-input"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label">
                Role <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                placeholder="President, Vice-president, Secretaire..."
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">Bio</label>
              <textarea
                className="adm-textarea"
                rows="3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">LinkedIn</label>
                <input
                  className="adm-input"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin}
                  onChange={(e) =>
                    setForm({ ...form, linkedin: e.target.value })
                  }
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">GitHub</label>
                <input
                  className="adm-input"
                  placeholder="https://github.com/..."
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                />
              </div>
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">
                  Annee academique <span className="req">*</span>
                </label>
                <select
                  className="adm-select"
                  value={form.academic_year_id}
                  onChange={(e) =>
                    setForm({ ...form, academic_year_id: e.target.value })
                  }
                  required
                >
                  <option value="">Selectionner</option>
                  {years.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Ordre d'affichage</label>
                <input
                  type="number"
                  className="adm-input"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({ ...form, display_order: e.target.value })
                  }
                />
                <div className="adm-help">0 = premier</div>
              </div>
            </div>

            <div className="adm-field">
              <label className="adm-label">Photo</label>
              <input
                type="file"
                accept="image/*"
                className="adm-file"
                onChange={handlePhotoChange}
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