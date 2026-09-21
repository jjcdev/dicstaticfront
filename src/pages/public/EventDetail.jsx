import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { getEventById } from "../../services/eventService";
import { resolveImage } from "../../utils/resolveImage";
import Reveal from "../../components/ui/Reveal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

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

  if (loading) {
    return (
      <div className="dic-page">
        <div className="container-dic">
          <Loader />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="dic-page">
        <div className="container-dic">
          <EmptyState message="Evenement introuvable." />
        </div>
      </div>
    );
  }

  const cover = resolveImage(event.cover_image);

  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <Link
            to="/evenements"
            className="dic-section-link"
            style={{ marginBottom: "1.5rem", display: "inline-flex" }}
          >
            <FaArrowLeft size={10} /> Retour aux evenements
          </Link>
        </Reveal>

        <Reveal>
          <article className="dic-event-detail">
            {cover && (
              <div className="dic-event-cover">
                <img src={cover} alt={event.title} />
              </div>
            )}

            <div className="dic-event-body">
              <span className="dic-slide-badge">
                {new Date(event.event_date) >= new Date() ? "A venir" : "Passe"}
              </span>

              <h1
                className="dic-section-title"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", marginTop: "0.85rem" }}
              >
                {event.title}
              </h1>

              <div className="dic-event-meta">
                <span>
                  <FaCalendarAlt size={12} aria-hidden="true" />
                  {new Date(event.event_date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {event.location && (
                  <span>
                    <FaMapMarkerAlt size={12} aria-hidden="true" />
                    {event.location}
                  </span>
                )}
              </div>

              <p className="dic-event-description">{event.description}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  );
}