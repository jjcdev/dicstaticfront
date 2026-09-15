import { useEffect, useState } from "react";
import { getEvents } from "../../services/eventService";
import EventCard from "../../components/ui/EventCard";
import PageHeader from "../../components/ui/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4 py-md-5">
      <PageHeader
        title="Evenements"
        subtitle="Ateliers, hackathons et conferences du club."
      />
      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <EmptyState message="Aucun evenement publie." />
      ) : (
        <div className="row g-3">
          {events.map((e) => (
            <div className="col-12 col-md-6 col-lg-4" key={e.id}>
              <EventCard event={e} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}