import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import {
  getAdminRules,
  createRule,
  updateRule,
  deleteRule,
  reorderRules,
} from "../../services/ruleService";

const EMPTY = {
  title: "",
  content: "",
  display_order: 0,
  slug: "",
  is_published: true,
};

export default function ManageRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAdminRules()
      .then((list) => {
        const sorted = [...list].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
        );
        setRules(sorted);
      })
      .catch(() => setRules([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    const nextOrder =
      rules.length > 0
        ? Math.max(...rules.map((r) => r.display_order ?? 0)) + 1
        : 1;
    setForm({ ...EMPTY, display_order: nextOrder });
    setError("");
    setShowModal(true);
  };

  const openEdit = (rule) => {
    setEditing(rule.id);
    setForm({
      title: rule.title ?? "",
      content: rule.content ?? "",
      display_order: rule.display_order ?? 0,
      slug: rule.slug ?? "",
      is_published: !!rule.is_published,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editing) await updateRule(editing, form);
      else await createRule(form);
      setShowModal(false);
      load();
    } catch (err) {
      const data = err.response?.data || {};
      if (data.errors) {
        setError(Object.values(data.errors).join(" "));
      } else {
        setError(data.message || "Erreur lors de l'enregistrement.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette section ?")) return;
    await deleteRule(id);
    load();
  };

  const togglePublish = async (rule) => {
    try {
      await updateRule(rule.id, { is_published: !rule.is_published });
      setRules((list) =>
        list.map((r) =>
          r.id === rule.id ? { ...r, is_published: !r.is_published } : r
        )
      );
    } catch {
      /* silent */
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= rules.length) return;
    if (reordering) return;

    const next = [...rules];
    [next[index], next[target]] = [next[target], next[index]];

    const payload = next.map((r, i) => ({
      id: r.id,
      display_order: i + 1,
    }));

    setReordering(true);
    setRules(next.map((r, i) => ({ ...r, display_order: i + 1 })));
    try {
      const updated = await reorderRules(payload);
      const sorted = [...updated].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );
      setRules(sorted);
    } catch {
      load();
    } finally {
      setReordering(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Règlement"
        subtitle="Sections du règlement intérieur"
        breadcrumb={[{ label: "Admin" }, { label: "Règlement" }]}
        actions={
          <button className="adm-btn adm-btn-primary" onClick={openCreate}>
            <FaPlus /> Ajouter une section
          </button>
        }
      />

      <div className="adm-card">
        {loading ? (
          <Loader />
        ) : rules.length === 0 ? (
          <EmptyState message="Aucune section pour le moment." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 90 }}>Ordre</th>
                  <th>Titre</th>
                  <th>Slug</th>
                  <th>Statut</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      <div className="adm-order-controls">
                        <button
                          className="adm-icon-btn is-sm"
                          onClick={() => move(i, -1)}
                          disabled={i === 0 || reordering}
                          aria-label="Monter"
                          title="Monter"
                        >
                          <FaArrowUp />
                        </button>
                        <span className="adm-order-value">
                          {r.display_order}
                        </span>
                        <button
                          className="adm-icon-btn is-sm"
                          onClick={() => move(i, 1)}
                          disabled={i === rules.length - 1 || reordering}
                          aria-label="Descendre"
                          title="Descendre"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="cell-primary">{r.title}</div>
                      <div
                        className="cell-muted"
                        style={{
                          maxWidth: 320,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.content?.replace(/<[^>]*>/g, "").slice(0, 120)}…
                      </div>
                    </td>
                    <td className="cell-muted">{r.slug || "—"}</td>
                    <td>
                      {r.is_published ? (
                        <span className="adm-badge is-success">
                          <span className="adm-badge-dot" /> Publiée
                        </span>
                      ) : (
                        <span className="adm-badge is-neutral">
                          <span className="adm-badge-dot" /> Brouillon
                        </span>
                      )}
                    </td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => togglePublish(r)}
                        aria-label={
                          r.is_published ? "Dépublier" : "Publier"
                        }
                        title={r.is_published ? "Dépublier" : "Publier"}
                      >
                        {r.is_published ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openEdit(r)}
                        aria-label="Modifier"
                        title="Modifier"
                        style={{ marginLeft: 6 }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(r.id)}
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

      {showModal && (
        <Modal
          title={editing ? "Modifier la section" : "Ajouter une section"}
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
                form="rule-form"
                className="adm-btn adm-btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Enregistrement…"
                  : editing
                  ? "Enregistrer"
                  : "Ajouter"}
              </button>
            </>
          }
        >
          <form id="rule-form" onSubmit={handleSubmit} className="adm-row">
            <div className="adm-field">
              <label className="adm-label">
                Titre <span className="req">*</span>
              </label>
              <input
                className="adm-input"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
                maxLength={160}
              />
            </div>

            <div className="adm-field">
              <label className="adm-label">
                Contenu <span className="req">*</span>
              </label>
              <textarea
                className="adm-textarea"
                rows="10"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                required
                maxLength={20000}
              />
              <div className="adm-help">
                HTML simple supporté : p, br, strong, em, ul, ol, li, h2-h4,
                a, blockquote, code, pre.
              </div>
            </div>

            <div className="adm-row adm-row-2">
              <div className="adm-field">
                <label className="adm-label">Slug</label>
                <input
                  className="adm-input"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="assiduite"
                  pattern="^[a-z0-9-]+$"
                />
                <div className="adm-help">
                  Minuscules, chiffres et tirets uniquement.
                </div>
              </div>
              <div className="adm-field">
                <label className="adm-label">Ordre</label>
                <input
                  type="number"
                  className="adm-input"
                  min="0"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      display_order: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <label className="adm-check">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              <span>Publiée sur le site</span>
            </label>

            {error && <div className="adm-alert is-error">{error}</div>}
          </form>
        </Modal>
      )}
    </>
  );
}