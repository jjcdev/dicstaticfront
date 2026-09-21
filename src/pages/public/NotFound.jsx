import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="dic-notfound">
      <div className="container-dic">
        <div className="dic-notfound-inner">
          <span className="dic-eyebrow">Erreur 404</span>
          <h1 className="dic-notfound-code">404</h1>
          <h2 className="dic-section-title">Cette page n'existe pas.</h2>
          <p className="dic-section-sub" style={{ margin: "0 auto 2rem" }}>
            Le lien est peut-etre casse, ou la page a ete deplacee.
          </p>
          <Link to="/" className="dic-btn dic-btn-primary">
            <FaArrowLeft size={11} /> Retour a l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}