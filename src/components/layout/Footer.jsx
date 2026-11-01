import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const LINKEDIN_URL =
  "https://www.linkedin.com/company/dic-insti/";

const COLUMNS = [
  {
    title: "Navigation",
    items: [
      { to: "/", label: "Accueil" },
      { to: "/a-propos", label: "À propos" },
      { to: "/bureau", label: "Bureau" },
    ],
  },
  {
    title: "Explorer",
    items: [
      { to: "/galerie", label: "Galerie" },
      { to: "/evenements", label: "Événements" },
      { to: "/reglement", label: "Règlement" },
    ],
  },
  {
    title: "Rejoindre",
    items: [
      { to: "/recrutement", label: "Candidater" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dic-footer">
      <div className="container-dic">
        <div className="dic-footer-grid">
          <div>
            <Link to="/" className="dic-footer-brand">
              <img src="/logo-dic.png" alt="" />
              <span>Digital Innovation Club</span>
            </Link>
            <p className="dic-footer-text">
              Un club où l'on construit, apprend et partage autour de
              l'intelligence artificielle, de la cybersécurité et des
              systèmes embarqués.
            </p>
            <div className="dic-footer-socials">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h6 className="dic-footer-title">{col.title}</h6>
              <ul className="dic-footer-list">
                {col.items.map((it) => (
                  <li key={it.to}>
                    <Link to={it.to}>{it.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h6 className="dic-footer-title">Contact</h6>
            <ul className="dic-footer-list">
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope aria-hidden="true" /> contact@dic.org
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt aria-hidden="true" /> Campus universitaire
              </li>
            </ul>
          </div>
        </div>

        <div className="dic-footer-bottom">
          <span>
            {year} <span className="accent">///</span> Digital Innovation Club
          </span>
          <span>Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}