import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <h1
        className="fw-bold mb-2"
        style={{ fontSize: "4rem", color: "var(--dic-primary)" }}
      >
        404
      </h1>
      <p className="text-muted mb-4">Page introuvable.</p>
      <Link to="/" className="btn btn-primary">Retour a l'accueil</Link>
    </div>
  );
}