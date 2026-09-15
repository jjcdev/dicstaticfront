import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/a-propos", label: "A propos" },
  { to: "/bureau", label: "Bureau" },
  { to: "/galerie", label: "Galerie" },
  { to: "/evenements", label: "Evenements" },
  { to: "/contact", label: "Contact" },
  { to: "/admin/login", label: "Admin" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Ferme le menu a chaque changement de page
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Ajoute une classe quand on scrolle
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll de la page quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Ferme avec la touche Echap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg sticky-top bg-light border border-3 ${
          scrolled ? "is-scrolled" : ""
        }`}
      >
        <div className="container">
          <Link to="/" className="dic-nav-brand">
            <img src="/logo-dic.png" alt="DIC" className="brand-logo" />
            <span className="brand-name text-dark">DIC</span>
          </Link>

          {/* Burger : masque sur desktop */}
          <button
            className="navbar-toggler dic-nav-burger d-lg-none"
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <FaBars />
          </button>

          {/* Liens : visibles uniquement sur desktop */}
          <div className="collapse navbar-collapse d-none d-lg-flex ">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {links.map((l) => (
                <li className="nav-item" key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`dic-drawer-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer mobile */}
      <aside
        className={`dic-drawer ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <div className="dic-drawer-header">
          <Link
            to="/"
            className="dic-nav-brand"
            onClick={() => setOpen(false)}
          >
            <img src="/logo-dic.png" alt="DIC" className="brand-logo" />
            <span className="brand-name text-dark">DIC</span>
          </Link>

          <button
            className="dic-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="dic-drawer-nav">
          <ul>
            {links.map((l, index) => (
              <li
                key={l.to}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  <span>{l.label}</span>
                  <FaArrowRight aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="dic-drawer-footer">
          <p>Digital Innovation Club</p>
          <span>2025 / 2026</span>
        </div>
      </aside>
    </>
  );
}