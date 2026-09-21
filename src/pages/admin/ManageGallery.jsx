import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import { resolveImage } from "../../utils/resolveImage";
import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const CATEGORIES = [
  { value: "workshop", label: "Atelier" },
  { value: "event", label: "Evenement" },
  { value: "project", label: "Projet" },
  { value: "other", label: "Autre" },
];

const empty = {
  title: "",
  description: "",
  category: "workshop",
  event_date: "",
  academic_year_id: "",
};

export default function ManageGallery() {
  const [years, setYears] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadYears = () =>
    api
      .get("/academic-years")
      .then((r) => setYears(r.data || []))
      .catch(() => {});

  const loadPosts = () => {
    setLoading(true);
    const params = {};
    if (filterYear) params.yearId = filterYear;
    if (filterCategory) params.category = filterCategory;
    api
      .get("/gallery", { params })
      .then((r) => setPosts(r.data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadYears();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [filterYear, filterCategory]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...empty, academic_year_id: filterYear });
    setImage(null);
    setPreview(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title ?? "",
      description: post.description ?? "",
      category: post.category ?? "other",
      event_date: post.event_date?.slice(0, 10) ?? "",
      academic_year_id: post.academic_year_id ?? "",
    });
    setImage(null);
    setPreview(resolveImage(post.image_url));
    setError("");
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (image) fd.append("image", image);

    try {
      if (editing) await api.put(`/gallery/${editing}`, fd);
      else await api.post("/gallery", fd);
      setShowModal(false);
      loadPosts();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette photo ?")) return;
    await api.delete(`/gallery/${id}`);
    loadPosts();
  };

  const categoryLabel = (v) =>
    CATEGORIES.find((c) => c.value === v)?.label || v;

  return (
    <>
      <AdminPageHeader
        title="Galerie"
        subtitle="Photos publiees sur le site"
        breadcrumb={[{ label: "Admin" }, { label: "Galerie" }]}
        actions={
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <FaPlus /> Ajouter une photo
          </button>
        }
      />

      <div className="adm-card">
        <div className="adm-toolbar">
          <div className="adm-field">
            <label className="adm-label">Annee</label>
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
          <div className="adm-field">
            <label className="adm-label">Categorie</label>
            <select
              className="adm-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Toutes</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="adm-toolbar-spacer" />
          <span className="adm-text-muted" style={{ fontSize: 12.5 }}>
            {posts.length} photo{posts.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <EmptyState message="Aucune photo pour cette selection." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Titre</th>
                  <th>Categorie</th>
                  <th>Annee</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={resolveImage(p.image_url) || "/placeholder.png"}
                        alt=""
                        className="adm-thumb"
                      />
                    </td>
                    <td>
                      <div className="cell-primary">{p.title}</div>
                      {p.description && (
                        <div
                          className="cell-muted"
                          style={{
                            maxWidth: 240,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="adm-badge is-neutral">
                        {categoryLabel(p.category)}
                      </span>
                    </td>
                    <td className="cell-muted">
                      {p.academic_year?.label || "-"}
                    </td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openEdit(p)}
                        aria-label="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(p.id)}
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
          title={editing ? "Modifier la photo" : "Ajouter une photo"}
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
                form="gallery-form"
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
          <form id="gallery-form" onSubmit={handleSubmit} className="adm-row">
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
              <label className="adm-label">Description</label>
              <textarea
                className="adm-textarea"
                rows="3"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">Categorie</label>
                <select
                  className="adm-select"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label className="adm-label">Date</label>
                <input
                  type="date"
                  className="adm-input"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
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
              <label className="adm-label">Image</label>
              <input
                type="file"
                accept="image/*"
                className="adm-file"
                onChange={handleImageChange}
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