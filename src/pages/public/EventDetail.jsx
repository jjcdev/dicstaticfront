import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { getEventById } from "../../services/eventService";
import Loader from "../../components/ui/Loader";

import { resolveStaticBase } from "../../services/api";
const STATIC_URL = resolveStaticBase();

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;

  if (!event) {
    return (
      <div className="container py-5">
        <p className="text-muted">Evenement introuvable.</p>
      </div>
    );
  }

  return (
    <article
      className="container py-4 py-md-5"
      style={{ maxWidth: 900 }}
    >
      <Link to="/evenements" className="btn btn-sm btn-outline-secondary mb-3">
        <FaArrowLeft className="me-2" aria-hidden="true" /> Retour
      </Link>

      {event.cover_image && (
        <img
          src={`${STATIC_URL}${event.cover_image}`}
          alt={event.title}
          className="img-fluid rounded mb-4 w-100"
          style={{ border: "1px solid var(--dic-border)" }}
        />
      )}

      <h1 className="h4 fw-bold mb-3">{event.title}</h1>

      <div className="text-muted small mb-3 d-flex flex-wrap gap-3">
        <span className="d-flex align-items-center gap-2">
          <FaCalendarAlt aria-hidden="true" />
          {new Date(event.event_date).toLocaleDateString("fr-FR")}
        </span>
        {event.location && (
          <span className="d-flex align-items-center gap-2">
            <FaMapMarkerAlt aria-hidden="true" /> {event.location}
          </span>
        )}
      </div>

      <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
        {event.description}
      </p>
    </article>
  );
}