import { useState } from "react";
import Modal from "./Modal";

import { resolveStaticBase } from "../../services/api";
const STATIC_URL = resolveStaticBase();

export default function GalleryCard({ post }) {
  const [open, setOpen] = useState(false);
  const image = post.image_url
    ? `${STATIC_URL}${post.image_url}`
    : "/placeholder.png";

  return (
    <>
      <article
        className="dic-card"
        role="button"
        onClick={() => setOpen(true)}
      >
        <img src={image} alt={post.title} className="dic-cover" />
        <div className="dic-card-body">
          <h3 className="dic-card-title">{post.title}</h3>
          {post.description && (
            <p className="dic-card-text text-truncate-2">{post.description}</p>
          )}
        </div>
      </article>

      {open && (
        <Modal title={post.title} onClose={() => setOpen(false)}>
          <img src={image} alt={post.title} className="img-fluid rounded mb-3" />
          <p className="mb-0">{post.description}</p>
        </Modal>
      )}
    </>
  );
}