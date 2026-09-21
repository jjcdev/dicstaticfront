import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { resolveImage } from "../../utils/resolveImage";

export default function EventCard({ event }) {
  const image = resolveImage(event.cover_image);
  const isUpcoming =
    new Date(event.event_date) >= new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <article className="dic-slide" style={{ width: "100%" }}>
      <div className="dic-slide-media">
        {image ? (
          <img src={image} alt={event.title} loading="lazy" />
        ) : (
          <FaCalendarAlt className="dic-slide-icon" aria-hidden="true" />
        )}
      </div>

      <div className="dic-slide-body">
        <span className={`dic-slide-badge ${isUpcoming ? "" : "is-accent"}`}>
          {isUpcoming ? "A venir" : "Passe"}
        </span>

        <h3 className="dic-slide-title">{event.title}</h3>

        <div
          className="dic-slide-text"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            marginBottom: "0.85rem",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <FaCalendarAlt size={11} />
            {new Date(event.event_date).toLocaleDateString("fr-FR")}
          </span>

          {event.location && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <FaMapMarkerAlt size={11} /> {event.location}
            </span>
          )}
        </div>

        <Link to={`/evenements/${event.id}`} className="dic-section-link">
          Voir plus <FaArrowRight size={10} />
        </Link>
      </div>
    </article>
  );
}