import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import ThemeToggle from "../ui/ThemeToggle";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/a-propos", label: "A propos" },
  { to: "/bureau", label: "Bureau" },
  { to: "/galerie", label: "Galerie" },
  { to: "/evenements", label: "Evenements" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`dic-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-dic">
        <div className="dic-nav-inner">
          <Link to="/" className="dic-nav-brand" aria-label="Accueil DIC">
            <img src="/logo-dic.png" alt="" />
            <span className="brand-mark">
              DIC<span className="brand-dot">.</span>
            </span>
          </Link>

          <ul className="dic-nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="dic-nav-actions">
            <ThemeToggle />
            <Link to="/contact" className="dic-nav-cta d-none d-sm-inline-flex">
              Rejoindre <FaArrowRight size={11} />
            </Link>
            <button
              type="button"
              className="dic-nav-burger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              {open ? <FaTimes size={14} /> : <FaBars size={14} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="dic-nav-mobile">
            {[...links, { to: "/contact", label: "Contact" }].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}