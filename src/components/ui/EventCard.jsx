import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import { resolveStaticBase } from "../../services/api";
const STATIC_URL = resolveStaticBase();

export default function EventCard({ event }) {
  return (
    <article className="dic-card">
      {event.cover_image && (
        <img
          src={`${STATIC_URL}${event.cover_image}`}
          alt={event.title}
          className="dic-cover"
        />
      )}
      <div className="dic-card-body">
        <h3 className="dic-card-title">{event.title}</h3>
        <p className="dic-card-text d-flex align-items-center gap-2 mb-1">
          <FaCalendarAlt aria-hidden="true" />
          {new Date(event.event_date).toLocaleDateString("fr-FR")}
        </p>
        {event.location && (
          <p className="dic-card-text d-flex align-items-center gap-2 mb-2">
            <FaMapMarkerAlt aria-hidden="true" /> {event.location}
          </p>
        )}
        <Link
          to={`/evenements/${event.id}`}
          className="btn btn-sm btn-outline-primary mt-auto align-self-start"
        >
          Voir plus
        </Link>
      </div>
    </article>
  );
}