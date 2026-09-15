import { useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import api from "../../services/api";
import AdminPageHeader from "../../components/admin/PageHeader";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("/contact")
      .then((r) => setMessages(r.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    if (filter === "unread") return messages.filter((m) => !m.is_read);
    if (filter === "read") return messages.filter((m) => m.is_read);
    return messages;
  }, [messages, filter]);

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const readCount = messages.length - unreadCount;

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await api.patch(`/contact/${msg.id}/read`);
        setMessages((list) =>
          list.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        );
      } catch {
        /* silent */
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    await api.delete(`/contact/${id}`);
    setMessages((list) => list.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const toggleRead = async (msg) => {
    try {
      await api.patch(`/contact/${msg.id}/read`, { is_read: !msg.is_read });
      setMessages((list) =>
        list.map((m) =>
          m.id === msg.id ? { ...m, is_read: !m.is_read } : m
        )
      );
    } catch {
      /* silent */
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Messages"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
            : "Boite de reception du club"
        }
        breadcrumb={[{ label: "Admin" }, { label: "Messages" }]}
      />

      <div className="adm-card">
        <div className="adm-toolbar">
          <div className="adm-tabs">
            <button
              className={`adm-tab ${filter === "all" ? "is-active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tous <span className="adm-tab-count">{messages.length}</span>
            </button>
            <button
              className={`adm-tab ${filter === "unread" ? "is-active" : ""}`}
              onClick={() => setFilter("unread")}
            >
              Non lus <span className="adm-tab-count">{unreadCount}</span>
            </button>
            <button
              className={`adm-tab ${filter === "read" ? "is-active" : ""}`}
              onClick={() => setFilter("read")}
            >
              Lus <span className="adm-tab-count">{readCount}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : visible.length === 0 ? (
          <EmptyState message="Aucun message dans cette categorie." />
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }} />
                  <th>Expediteur</th>
                  <th>Sujet</th>
                  <th>Date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((m) => (
                  <tr
                    key={m.id}
                    style={
                      !m.is_read
                        ? { background: "rgba(32,116,146,0.04)" }
                        : undefined
                    }
                  >
                    <td>
                      <span
                        style={{
                          color: m.is_read
                            ? "var(--adm-text-dim)"
                            : "var(--adm-primary)",
                          fontSize: "1rem",
                        }}
                        title={m.is_read ? "Lu" : "Non lu"}
                      >
                        {m.is_read ? <FaEnvelopeOpen /> : <FaEnvelope />}
                      </span>
                    </td>
                    <td>
                      <div className="cell-primary">{m.name}</div>
                      <div className="cell-muted">{m.email}</div>
                    </td>
                    <td>
                      <div
                        style={{
                          fontWeight: m.is_read ? 400 : 600,
                          color: "var(--adm-text)",
                        }}
                      >
                        {m.subject || "(sans sujet)"}
                      </div>
                      <div
                        className="cell-muted"
                        style={{
                          maxWidth: 340,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.message}
                      </div>
                    </td>
                    <td className="cell-muted">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="col-actions">
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => openMessage(m)}
                        aria-label="Lire"
                        title="Lire"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="adm-icon-btn is-sm"
                        onClick={() => toggleRead(m)}
                        aria-label={m.is_read ? "Marquer non lu" : "Marquer lu"}
                        title={m.is_read ? "Marquer non lu" : "Marquer lu"}
                        style={{ marginLeft: 6 }}
                      >
                        {m.is_read ? <FaEnvelope /> : <FaEnvelopeOpen />}
                      </button>
                      <button
                        className="adm-icon-btn is-sm is-danger"
                        onClick={() => handleDelete(m.id)}
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
          title={selected.subject || "(sans sujet)"}
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
          <div className="adm-mb-3">
            <div className="adm-label">De</div>
            <div style={{ fontWeight: 600 }}>{selected.name}</div>
            <a
              href={`mailto:${selected.email}`}
              style={{ fontSize: 13, color: "var(--adm-primary)" }}
            >
              {selected.email}
            </a>
          </div>

          <div className="adm-mb-3">
            <div className="adm-label">Recu le</div>
            <div style={{ fontSize: 13.5 }}>
              {new Date(selected.createdAt).toLocaleString("fr-FR")}
            </div>
          </div>

          <div className="adm-divider" />

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              color: "var(--adm-text)",
            }}
          >
            {selected.message}
          </div>
        </Modal>
      )}
    </>
  );
}