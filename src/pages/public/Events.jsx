import { useEffect, useMemo, useState } from "react";
import { getEvents } from "../../services/eventService";
import PageHeader from "../../components/ui/PageHeader";
import EventCard from "../../components/ui/EventCard";
import Reveal from "../../components/ui/Reveal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    if (filter === "upcoming") {
      return events
        .filter((e) => new Date(e.event_date) >= today)
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    }
    if (filter === "past") {
      return events
        .filter((e) => new Date(e.event_date) < today)
        .sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
    }
    return events.sort(
      (a, b) => new Date(b.event_date) - new Date(a.event_date)
    );
  }, [events, filter]);

  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <PageHeader
            eyebrow="Agenda"
            title="Ce que le club prepare."
            subtitle="Ateliers, hackathons, CTF et conferences : tous les rendez-vous du DIC."
          />
        </Reveal>

        <Reveal>
          <div className="dic-filter-bar">
            <div className="dic-filter-tabs">
              {[
                { value: "upcoming", label: "A venir" },
                { value: "past", label: "Passes" },
                { value: "all", label: "Tous" },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`dic-filter-tab ${filter === f.value ? "is-active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading ? (
          <Loader />
        ) : visible.length === 0 ? (
          <EmptyState message="Aucun evenement dans cette categorie." />
        ) : (
          <div className="dic-events-grid">
            {visible.map((e, i) => (
              <Reveal key={e.id} delay={(i % 6) * 50}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}