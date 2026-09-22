import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaFlag,
  FaShieldAlt,
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

/* ============================================================
   Données statiques
   ============================================================ */

const MARQUEE = [
  "Intelligence Artificielle",
  "Cybersécurité",
  "Robotique",
  "Systèmes embarqués",
  "Machine Learning",
  "CTF",
  "IoT",
  "Open Source",
];

const POLES = [
  {
    badge: "Pôle 01",
    title: "Intelligence Artificielle",
    text: "Modélisation, entraînement et déploiement de modèles d'apprentissage. Ateliers pratiques et projets appliqués.",
    tags: ["ML", "Deep Learning", "NLP", "Vision"],
    image: "/poles/ia.jpg",
    accent: false,
  },
  {
    badge: "Pôle 02",
    title: "Cybersécurité",
    text: "Analyse de vulnérabilités, forensique et participation à des compétitions Capture The Flag.",
    tags: ["Pentest", "Forensique", "Crypto", "CTF"],
    image: "/poles/cyber.jpg",
    accent: true,
  },
  {
    badge: "Pôle 03",
    title: "Robotique et Systèmes embarqués",
    text: "Conception de systèmes physiques : capteurs, actionneurs, protocoles de communication.",
    tags: ["Arduino", "Raspberry Pi", "ROS", "IoT"],
    image: "/poles/robotique.jpg",
    accent: false,
  },
];

const CHALLENGES = [
  {
    Icon: FaFlag,
    title: "Hackathons",
    text: "48 heures pour concevoir une solution à un problème réel.",
    image: "/challenges/hackathon.jpg",
  },
  {
    Icon: FaShieldAlt,
    title: "CTF",
    text: "Compétitions de sécurité par équipes, du débutant à l'avancé.",
    image: "/challenges/ctf.jpg",
  },
  {
    Icon: FaRobot,
    title: "Concours robotique",
    text: "Robots autonomes, suivi de ligne, bras articulés.",
    image: "/challenges/robotique.jpg",
  },
  {
    Icon: FaBolt,
    title: "Code sprints",
    text: "Sessions intensives sur un thème : IA, web, embarqué.",
    image: "/challenges/sprint.jpg",
  },
];

const STATS = [
  { Icon: FaUsers, to: 120, suffix: "+", label: "Membres", image: "/stats/membres.jpg" },
  { Icon: FaRocket, to: 30, suffix: "+", label: "Projets", image: "/stats/projets.jpg" },
  { Icon: FaTrophy, to: 12, suffix: "", label: "Challenges", image: "/stats/challenges.jpg" },
  { Icon: FaCalendarAlt, to: 25, suffix: "+", label: "Événements", image: "/stats/evenements.jpg" },
];

/* ============================================================
   Hook : media query
   ============================================================ */

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

/* ============================================================
   Compteur animé
   ============================================================ */

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

/* ============================================================
   Titre animé
   ============================================================ */

function AnimatedTitle({ children, delay = 0 }) {
  return (
    <span className="anim-title" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </span>
  );
}

/* ============================================================
   Page
   ============================================================ */

export default function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 992px)");

  useEffect(() => {
    setEventsLoading(true);
    getEvents({ limit: 8 })
      .then((data) => setEvents(ensureArray(data)))
      .catch(() => setEvents([]))
      .finally(() => setEventsLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Blobs décoratifs */}
      <div className="home-blob home-blob-top" aria-hidden="true" />
      <div className="home-blob home-blob-bottom" aria-hidden="true" />

      <div className="home-content">
        {/* ============== HERO ============== */}
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
                    <span className="accent">le futur numérique.</span>
                  </AnimatedTitle>
                </h1>
                <p className="hero-sub">
                  Digital Innovation Club rassemble les étudiants passionnés
                  autour de trois pôles : IA, cybersécurité et robotique.
                  Challenges, ateliers, projets réels.
                </p>
                <div className="hero-actions">
                  <Link to="/a-propos" className="dic-btn dic-btn-primary">
                    Rejoindre le club <FaArrowRight size={12} />
                  </Link>
                  <Link to="/evenements" className="dic-btn dic-btn-ghost">
                    Voir les événements
                  </Link>
                </div>
              </div>

              <aside className="hero-social" aria-label="Réseaux sociaux">
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

          <a href="#poles" className="hero-scroll" aria-label="Faire défiler">
            <FaChevronDown />
          </a>
        </section>

        {/* ============== MARQUEE ============== */}
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

        {/* ============== PÔLES ============== */}
        <section id="poles" className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">Nos pôles</span>
                  <h2 className="dic-section-title">
                    Trois terrains d'exploration.
                  </h2>
                  <p className="dic-section-sub">
                    Chaque pôle mène ses propres projets, ateliers et
                    challenges. Rejoins celui qui te parle, ou explore les
                    trois.
                  </p>
                </div>
                <Link to="/a-propos" className="dic-section-link">
                  En savoir plus <FaArrowRight size={10} />
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <Slider ariaLabel="Pôles du club">
                {POLES.map((p, i) => (
                  <article
                    className="dic-slide dic-slide-anim"
                    data-slide
                    key={p.title}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="dic-slide-media dic-slide-media-pole">
                      <img src={p.image} alt={p.title} loading="lazy" />
                      <div className="dic-slide-glow" aria-hidden="true" />
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
                        {p.tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </Slider>
            </Reveal>
          </div>
        </section>

        {/* ============== CHALLENGES ============== */}
        <section className="dic-section dic-section-soft">
          <div className="container-dic">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">Challenges</span>
                  <h2 className="dic-section-title">
                    On organise, on participe, on gagne.
                  </h2>
                  <p className="dic-section-sub">
                    Toute l'année, le club met en place des compétitions
                    internes et représente l'école à l'extérieur.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="dic-challenges-grid">
              {CHALLENGES.map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <article className="dic-challenge dic-challenge-img dic-hover-lift">
                    <div className="dic-challenge-media">
                      <img src={c.image} alt={c.title} loading="lazy" />
                    </div>
                    <div className="dic-challenge-body">
                      <div className="dic-challenge-icon">
                        <c.Icon aria-hidden="true" />
                      </div>
                      <h3 className="dic-challenge-title">{c.title}</h3>
                      <p className="dic-challenge-text">{c.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============== STATS ============== */}
        <section className="dic-section dic-section-particles">
          <ParticleField variant="sparse" interactive={false} />
          <div className="container-dic dic-section-inner">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">En chiffres</span>
                  <h2 className="dic-section-title">
                    Ce que le club représente aujourd'hui.
                  </h2>
                </div>
              </div>
            </Reveal>

            <div className="dic-stats">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 80}>
                  <article className="dic-stat dic-stat-img dic-hover-lift">
                    <div className="dic-stat-media">
                      <img src={s.image} alt="" loading="lazy" />
                    </div>
                    <div className="dic-stat-body">
                      <div className="dic-stat-icon-wrap">
                        <s.Icon aria-hidden="true" />
                      </div>
                      <div className="dic-stat-value">
                        <Counter to={s.to} suffix={s.suffix} />
                      </div>
                      <div className="dic-stat-label">{s.label}</div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============== ÉVÉNEMENTS ============== */}
        <section className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <span className="dic-eyebrow">Agenda</span>
                  <h2 className="dic-section-title">
                    Ce qui arrive bientôt.
                  </h2>
                  <p className="dic-section-sub">
                    Ateliers, hackathons et rendez-vous du club.
                  </p>
                </div>
                <Link to="/evenements" className="dic-section-link">
                  Tout voir <FaArrowRight size={10} />
                </Link>
              </div>
            </Reveal>

            {eventsLoading ? (
              <div className="dic-home-events-empty">
                Chargement des événements...
              </div>
            ) : events.length === 0 ? (
              <div className="dic-home-events-empty">
                Aucun événement à venir pour le moment.
                <br />
                <Link
                  to="/evenements"
                  className="dic-section-link"
                  style={{ marginTop: "0.75rem" }}
                >
                  Voir tous les événements <FaArrowRight size={10} />
                </Link>
              </div>
            ) : (
              <Reveal>
                <Slider ariaLabel="Événements à venir">
                  {events.map((e) => (
                    <div className="dic-slide" data-slide key={e.id}>
                      <EventCard event={e} />
                    </div>
                  ))}
                </Slider>
              </Reveal>
            )}
          </div>
        </section>

        {/* ============== CTA ============== */}
        <section className="dic-section">
          <div className="container-dic">
            <Reveal>
              <div className="dic-cta">
                <div
                  className="dic-cta-bg"
                  style={{ backgroundImage: "url('/cta-bg.jpg')" }}
                  aria-hidden="true"
                />
                <ParticleField variant="sparse" interactive={false} />
                <div className="dic-cta-content">
                  <div className="dic-cta-text">
                    <h2 className="dic-cta-title">
                      Prêt à construire avec nous ?
                    </h2>
                    <p className="dic-cta-sub">
                      Rejoins le club, choisis ton pôle, participe aux
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