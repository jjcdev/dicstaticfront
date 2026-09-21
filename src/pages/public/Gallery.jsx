import { useEffect, useState } from "react";
import { getGalleryPosts } from "../../services/galleryService";
import { getAcademicYears } from "../../services/yearService";
import PageHeader from "../../components/ui/PageHeader";
import GalleryCard from "../../components/ui/GalleryCard";
import Reveal from "../../components/ui/Reveal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const CATEGORIES = [
  { value: "", label: "Toutes" },
  { value: "workshop", label: "Ateliers" },
  { value: "event", label: "Evenements" },
  { value: "project", label: "Projets" },
  { value: "other", label: "Autres" },
];

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({ yearId: "", category: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAcademicYears().then(setYears).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getGalleryPosts(filters)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <PageHeader
            eyebrow="Galerie"
            title="Une annee en images."
            subtitle="Ateliers, evenements, projets : les meilleurs moments du club."
          />
        </Reveal>

        <Reveal>
          <div className="dic-filter-bar">
            <div className="dic-filter-tabs">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`dic-filter-tab ${filters.category === c.value ? "is-active" : ""}`}
                  onClick={() => setFilters((f) => ({ ...f, category: c.value }))}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {years.length > 0 && (
              <select
                className="dic-filter-select"
                value={filters.yearId}
                onChange={(e) => setFilters((f) => ({ ...f, yearId: e.target.value }))}
              >
                <option value="">Toutes les annees</option>
                {years.map((y) => (
                  <option key={y.id} value={y.id}>{y.label}</option>
                ))}
              </select>
            )}
          </div>
        </Reveal>

        {loading ? (
          <Loader />
        ) : posts.length === 0 ? (
          <EmptyState message="Aucune photo pour le moment." />
        ) : (
          <div className="dic-gallery-grid">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={(i % 6) * 50}>
                <GalleryCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}