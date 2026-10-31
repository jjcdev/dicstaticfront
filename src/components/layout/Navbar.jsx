import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight, FaLinkedin } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

const LINKS = [
  { to: "/", label: "Accueil", end: true },
  { to: "/a-propos", label: "À propos" },
  { to: "/bureau", label: "Bureau" },
  { to: "/galerie", label: "Galerie" },
  { to: "/evenements", label: "Agenda" },
  { to: "/reglement", label: "Règlement" },
];

const LINKEDIN_URL =
  "https://www.linkedin.com/company/digital-innovation-club";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`dic-hdr ${solid ? "is-solid" : ""}`}>
        <div className="container-dic dic-hdr-wrap">
          <Link to="/" className="dic-hdr-brand" aria-label="Accueil DIC">
            <img src="/logo-dic.png" alt="" />
            <span className="dic-hdr-brand-text">
              DIC<span className="dic-hdr-brand-dot">.</span>
            </span>
          </Link>

          <nav className="dic-hdr-nav" aria-label="Navigation principale">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `dic-hdr-link ${isActive ? "is-active" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="dic-hdr-tools">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dic-hdr-icon"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <ThemeToggle />

            <Link to="/recrutement" className="dic-hdr-cta">
              Rejoindre <FaArrowRight size={11} />
            </Link>

            <button
              type="button"
              className="dic-hdr-burger"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              aria-controls="dic-mobile-drawer"
            >
              <FaBars size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* --------- DRAWER --------- */}
      <div
        className={`dic-drw-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="dic-mobile-drawer"
        className={`dic-drw ${open ? "is-open" : ""}`}
        aria-label="Menu mobile"
        aria-hidden={!open}
      >
        <div className="dic-drw-head">
          <Link
            to="/"
            className="dic-hdr-brand"
            onClick={() => setOpen(false)}
          >
            <img src="/logo-dic.png" alt="" />
            <span className="dic-hdr-brand-text">
              DIC<span className="dic-hdr-brand-dot">.</span>
            </span>
          </Link>
          <button
            type="button"
            className="dic-drw-close"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <nav className="dic-drw-nav" aria-label="Navigation mobile">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `dic-drw-link ${isActive ? "is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `dic-drw-link ${isActive ? "is-active" : ""}`
            }
          >
            Contact
          </NavLink>
        </nav>

        <div className="dic-drw-foot">
          <div className="dic-drw-socials">
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

          <Link
            to="/recrutement"
            className="dic-hdr-cta dic-hdr-cta-block"
            onClick={() => setOpen(false)}
          >
            Rejoindre le club <FaArrowRight size={11} />
          </Link>
        </div>
      </aside>
    </>
  );
}