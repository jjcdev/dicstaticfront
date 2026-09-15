import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const columns = [
  {
    title: "Navigation",
    items: [
      { to: "/", label: "Accueil" },
      { to: "/a-propos", label: "A propos" },
      { to: "/bureau", label: "Bureau" },
    ],
  },
  {
    title: "Explorer",
    items: [
      { to: "/galerie", label: "Galerie" },
      { to: "/evenements", label: "Evenements" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dic-footer bg-dark text-light">
      <div className="container">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-5">
            <Link to="/" className="dic-footer-brand-f">
              <img src="/logo-dic.png" alt="DIC" />
              <span> <span className="text-primary h3">D</span>igital
                      <br />
                      <span className="text-primary h3">I</span>nnovation
                      <br />
                      <span className="text-primary h3">C</span>lub</span>
            </Link>
            <p className="dic-footer-text">
              Learn, Build, Innovate
            </p>
            <div className="dic-footer-socials">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="GitHub"><FaGithub /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          {columns.map((col) => (
            <div className="col-6 col-lg-2" key={col.title}>
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

          <div className="col-12 col-lg-3">
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
          <span>{year} Digital Innovation Club</span>
          <span className="dic-footer-bottom-sep">///</span>
          <span>Tous droits reserves</span>
        </div>
      </div>
    </footer>
  );
}