import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaBrain,
  FaShieldAlt,
  FaMicrochip,
  FaCode,
  FaFlag,
  FaRobot,
  FaBolt,
  FaUsers,
  FaRocket,
  FaTrophy,
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";

import Reveal from "../../components/ui/Reveal";
import Slider from "../../components/ui/Slider";
import ParticleField from "../../components/ui/ParticleField";
import EventCard from "../../components/ui/EventCard";
import { getEvents } from "../../services/eventService";
import { ensureArray } from "../../utils/ensureArray";

/* ============ Donnees statiques ============ */

const MARQUEE = [
  "Intelligence Artificielle",
  "Cybersecurite",
  "Robotique",
  "Systemes embarques",
  "Machine Learning",
  "CTF",
  "IoT",
  "Open Source",
];

const POLES = [
  {
    Icon: FaBrain,
    badge: "Pole 01",
    title: "Intelligence Artificielle",
    text: "Modelisation, entrainement et deploiement de modeles d'apprentissage. Ateliers pratiques et projets appliques.",
    tags: ["ML", "Deep Learning", "NLP", "Vision"],
    accent: false,
  },
  {
    Icon: FaShieldAlt,
    badge: "Pole 02",
    title: "Cybersecurite",
    text: "Analyse de vulnerabilites, forensique et participation a des competitions Capture The Flag.",
    tags: ["Pentest", "Forensique", "Crypto", "CTF"],
    accent: true,
  },
  {
    Icon: FaMicrochip,
    badge: "Pole 03",
    title: "Robotique et Systemes embarques",
    text: "Conception de systemes physiques : capteurs, actionneurs, protocoles de communication.",
    tags: ["Arduino", "Raspberry Pi", "ROS", "IoT"],
    accent: false,
  },
  {
    Icon: FaCode,
    badge: "Pole 04",
    title: "Developpement logiciel",
    text: "Applications web, outils internes et contributions open source. Du prototype a la mise en production.",
    tags: ["Web", "Mobile", "API", "DevOps"],
    accent: true,
  },
];

const CHALLENGES = [
  {
    Icon: FaFlag,
    title: "Hackathons",
    text: "48 heures pour concevoir une solution a un probleme reel.",
  },
  {
    Icon: FaShieldAlt,
    title: "CTF",
    text: "Competitions de securite par equipes, du debutant a l'avance.",
  },
  {
    Icon: FaRobot,
    title: "Concours robotique",
    text: "Robots autonomes, suivi de ligne, bras articules.",
  },
  {
    Icon: FaBolt,
    title: "Code sprints",
    text: "Sessions intensives sur un theme : IA, web, embarque.",
  },
];

const STATS = [
  { Icon: FaUsers, to: 120, suffix: "+", label: "Membres" },
  { Icon: FaRocket, to: 30, suffix: "+", label: "Projets" },
  { Icon: FaTrophy, to: 12, suffix: "", label: "Challenges" },
  { Icon: FaCalendarAlt, to: 25, suffix: "+", label: "Evenements" },
];

/* ============ Hook : taille d'ecran ============ */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ============ Composant Counter ============ */

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const duration = 1600;
    let raf = null;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [visible, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ============ Composant : titre qui apparait mot par mot ============ */

function AnimatedTitle({ children, delay = 0 }) {
  return (
    <span className="anim-title" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </span>
  );
}

/* ============ Page ============ */

export default function Home() {
  const [events, setEvents] = useState([]);
  const isDesktop = useMediaQuery("(min-width: 992px)");

  useEffect(() => {
    getEvents({ limit: 8 })
      .then((data) => setEvents(ensureArray(data)))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="home">
      {/* Blobs decoratifs flottants */}
      <div className="home-blob home-blob-top" aria-hidden="true" />
      <div className="home-blob home-blob-bottom" aria-hidden="true" />

      <div className="home-content">
        {/* ============== HERO FULLSCREEN ============== */}
        <section className="hero-full">
          <ParticleField
            variant={isDesktop ? "dense" : "default"}
            interactive={isDesktop}
          />
          <div className="hero-dotgrid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />

          <div className="container-dic hero-full-inner">
            <div className="hero-top">
              <span className="hero-brand">
                <span className="hero-brand-dot" />
                DIGITAL INNOVATION CLUB
              </span>
              <ul className="hero-links">
                <li><Link to="/a-propos">Notre histoire</Link></li>
                <li><Link to="/bureau">Bureau</Link></li>
                <li><Link to="/evenements">Agenda</Link></li>
              </ul>
            </div>

            <div className="hero-main">
              <div className="hero-copy">
                <h1 className="hero-title">
                  <AnimatedTitle delay={0}>Nous construisons</AnimatedTitle>
                  <br />
                  <AnimatedTitle delay={180}>
                    <span className="accent">le futur numerique.</span>
                  </AnimatedTitle>
                </h1>
                <p className="hero-sub">
                  Digital Innovation Club rassemble les etudiants
                  passionnes autour de trois poles : IA, cybersecurité et
                  robotique. Challenges,
                  ateliers, projets reels.
                </p>
                <div className="hero-actions">
                  <Link to="/a-propos" className="dic-btn dic-btn-primary">
                    Rejoindre le club <FaArrowRight size={12} />
                  </Link>
                  <Link to="/evenements" className="dic-btn dic-btn-ghost">
                    Voir les evenements
                  </Link>
                </div>
              </div>

              <aside className="hero-social" aria-label="Reseaux sociaux">
                <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
                <a href="#" aria-label="Facebook"><FaFacebook /></a>
                <a href="#" aria-label="GitHub"><FaGithub /></a>
              </aside>
            </div>

            <div className="hero-dots">
              <span className="is-active" />
              <span />
              <span />
              <span />
            </div>
          </div>

          <a
            href="#poles"
            className="hero-scroll"
            aria-label="Faire defiler"
          >
            <FaChevronDown />
          </a>
        </section>

        {/* ============== MARQUEE AVEC FOND ANIME ============== */}
        <div className="dic-marquee-wrap">
          <ParticleField variant="ambient" interactive={false} />
          <div className="dic-marquee" aria-hidden="true">
            <div className="dic-marquee-track">
              {[...MARQUEE, ...MARQUEE].map((word, i) => (
                <span className="dic-marquee-item" key={i}>
                  {word}
                  <span className="dic-marquee-sep">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ============== POLES ============== */}
        <section id="poles" className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">Nos poles</span>
                  <h2 className="dic-section-title">
                    Quatre terrains d'exploration.
                  </h2>
                  <p className="dic-section-sub">
                    Chaque pole mene ses propres projets, ateliers et
                    challenges. Rejoins celui qui te parle, ou explore les
                    quatre.
                  </p>
                </div>
                <Link to="/a-propos" className="dic-section-link">
                  En savoir plus <FaArrowRight size={10} />
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <Slider ariaLabel="Poles du club">
                {POLES.map((p, i) => (
                  <article
                    className="dic-slide dic-slide-anim"
                    data-slide
                    key={p.title}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="dic-slide-media">
                      <div className="dic-slide-glow" aria-hidden="true" />
                      <p.Icon className="dic-slide-icon" aria-hidden="true" />
                    </div>
                    <div className="dic-slide-body">
                      <span
                        className={`dic-slide-badge ${p.accent ? "is-accent" : ""}`}
                      >
                        {p.badge}
                      </span>
                      <h3 className="dic-slide-title">{p.title}</h3>
                      <p className="dic-slide-text">{p.text}</p>
                      <div className="dic-slide-tags">
                        {p.tags.map((t) => <span key={t}>{t}</span>)}
                      </div>
                    </div>
                  </article>
                ))}
              </Slider>
            </Reveal>
          </div>
        </section>

        {/* ============== CHALLENGES ============== */}
        <section className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">Challenges</span>
                  <h2 className="dic-section-title">
                    On organise, on participe, on gagne.
                  </h2>
                  <p className="dic-section-sub">
                    Toute l'annee, le club met en place des competitions
                    internes et represente l'ecole a l'exterieur.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="dic-challenges-grid">
              {CHALLENGES.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <div className="dic-challenge dic-hover-lift">
                    <div className="dic-challenge-icon">
                      <c.Icon aria-hidden="true" />
                    </div>
                    <h3 className="dic-challenge-title">{c.title}</h3>
                    <p className="dic-challenge-text">{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============== STATS AVEC FOND ANIME ============== */}
        <section className="dic-section dic-section-particles">
          <ParticleField variant="sparse" interactive={false} />
          <div className="container-dic" style={{ position: "relative", zIndex: 1 }}>
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">En chiffres</span>
                  <h2 className="dic-section-title">
                    Ce que le club represente aujourd'hui.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="dic-stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 80}>
                  <div className="dic-stat dic-hover-lift">
                    <div className="dic-stat-icon-wrap">
                      <s.Icon aria-hidden="true" />
                    </div>
                    <div className="dic-stat-value">
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="dic-stat-label">{s.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============== EVENTS SLIDER ============== */}
        {Array.isArray(events) && events.length > 0 && (
          <section className="dic-section">
            <div className="container-dic">
              <Reveal>
                <div className="dic-section-head">
                  <div>
                    <span className="dic-eyebrow">Agenda</span>
                    <h2 className="dic-section-title">
                      Ce qui arrive bientot.
                    </h2>
                  </div>
                  <Link to="/evenements" className="dic-section-link">
                    Tout voir <FaArrowRight size={10} />
                  </Link>
                </div>
              </Reveal>

              <Reveal>
                <Slider ariaLabel="Evenements a venir">
                  {events.map((e) => (
                    <div className="dic-slide" data-slide key={e.id}>
                      <EventCard event={e} />
                    </div>
                  ))}
                </Slider>
              </Reveal>
            </div>
          </section>
        )}

        {/* ============== CTA FINAL AVEC FOND ANIME ============== */}
        <section className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-cta">
                <ParticleField variant="sparse" interactive={false} />
                <div className="dic-cta-content">
                  <div>
                    <h2 className="dic-cta-title">
                      Pret a construire avec nous ?
                    </h2>
                    <p className="dic-cta-sub">
                      Rejoins le club, choisis ton pole, participe aux
                      challenges et fais partie de l'aventure.
                    </p>
                  </div>
                  <Link to="/contact" className="dic-btn dic-btn-primary">
                    Rejoindre le club <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}