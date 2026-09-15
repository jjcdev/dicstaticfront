import { useEffect, useState } from "react";
import { getGalleryPosts } from "../../services/galleryService";
import { getAcademicYears } from "../../services/yearService";
import GalleryCard from "../../components/ui/GalleryCard";
import PageHeader from "../../components/ui/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

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
    <div className="container py-4 py-md-5">
      <PageHeader
        title="Galerie"
        subtitle="Photos du club, ateliers et projets."
      />

      <div className="row g-2 mb-4">
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            value={filters.yearId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, yearId: e.target.value }))
            }
          >
            <option value="">Toutes les annees</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.label}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-4">
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option value="">Toutes les categories</option>
            <option value="workshop">Atelier</option>
            <option value="event">Evenement</option>
            <option value="project">Projet</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState message="Aucune photo pour le moment." />
      ) : (
        <div className="row g-3">
          {posts.map((p) => (
            <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
              <GalleryCard post={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}