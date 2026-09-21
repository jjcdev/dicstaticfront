import { useState } from "react";
import Modal from "./Modal";
import { resolveImage } from "../../utils/resolveImage";

const CATEGORY_LABELS = {
  workshop: "Atelier",
  event: "Evenement",
  project: "Projet",
  other: "Autre",
};

export default function GalleryCard({ post }) {
  const [open, setOpen] = useState(false);
  const image = resolveImage(post.image_url) || "/placeholder.png";
  const category = CATEGORY_LABELS[post.category] || "Autre";

  return (
    <>
      <article
        className="dic-slide"
        style={{ width: "100%", cursor: "pointer" }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
      >
        <div className="dic-slide-media">
          <img src={image} alt={post.title} loading="lazy" />
        </div>
        <div className="dic-slide-body">
          <span className="dic-slide-badge">{category}</span>
          <h3 className="dic-slide-title">{post.title}</h3>
          {post.description && (
            <p className="dic-slide-text dic-clamp-2">{post.description}</p>
          )}
        </div>
      </article>

      {open && (
        <Modal title={post.title} onClose={() => setOpen(false)}>
          <img
            src={image}
            alt={post.title}
            style={{
              width: "100%",
              borderRadius: "var(--radius)",
              marginBottom: "1rem",
            }}
          />
          <div className="dic-slide-badge" style={{ marginBottom: "0.75rem" }}>
            {category}
          </div>
          {post.description && (
            <p style={{ margin: 0, color: "var(--color-text-muted)", lineHeight: 1.7 }}>
              {post.description}
            </p>
          )}
        </Modal>
      )}
    </>
  );
}