import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronDown,
  FaBrain,
  FaShieldAlt,
  FaMicrochip,
  FaLaptopCode,
  FaFlag,
  FaRobot,
  FaBolt,
  FaUsers,
  FaRocket,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import Reveal from "../../components/ui/Reveal";
import EventCard from "../../components/ui/EventCard";
import { getEvents } from "../../services/eventService";

/* ---------- Machine a ecrire ---------- */

function Typewriter({ words, speed = 75, pause = 1600 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timer;

    if (!deleting && text === current) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => i + 1);
    } else {
      timer = setTimeout(
        () => {
          setText((prev) =>
            deleting
              ? prev.slice(0, -1)
              : current.slice(0, prev.length + 1)
          );
        },
        deleting ? speed / 2 : speed
      );
    }
    return () => clearTimeout(timer);
  }, [text, deleting, index, words, speed, pause]);

  return (
    <span className="dic-typewriter">
      <span className="dic-typewriter-text">{text}</span>
      <span className="dic-caret"></span>
    </span>
  );
}

/* ---------- Compteur anime ---------- */

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/* ---------- Donnees statiques ---------- */

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
    number: "01",
    Icon: FaBrain,
    title: "Intelligence Artificielle",
    tagline: "Modeliser, entrainer, deployer.",
    description:
      "Nous explorons les modeles d'apprentissage automatique, du prototype au deploiement. Ateliers pratiques, projets appliques et veille sur les avancees du domaine.",
    topics: ["Machine Learning", "Deep Learning", "NLP", "Vision"],
  },
  {
    number: "02",
    Icon: FaShieldAlt,
    title: "Cybersecurite",
    tagline: "Offensive et defensive.",
    description:
      "Analyse de vulnerabilites, forensique, cryptographie et participation a des competitions Capture The Flag. On apprend en cassant, puis en protegeant.",
    topics: ["Pentest", "Forensique", "Crypto", "CTF"],
  },
  {
    number: "03",
    Icon: FaMicrochip,
    title: "Robotique et Systemes embarques",
    tagline: "Du microcontroleur au robot autonome.",
    description:
      "Conception de systemes physiques : capteurs, actionneurs, protocoles de communication. Des projets concrets qui finissent en demonstration.",
    topics: ["Arduino", "Raspberry Pi", "ROS", "IoT"],
  },
];

const CHALLENGES = [
  {
    Icon: FaLaptopCode,
    title: "Hackathons",
    text: "48 heures pour concevoir une solution a un probleme reel.",
  },
  {
    Icon: FaFlag,
    title: "CTF",
    text: "Competitions de securite par equipes, du niveau debutant a avance.",
  },
  {
    Icon: FaRobot,
    title: "Concours robotique",
    text: "Robots autonomes, suivi de ligne, bras articules.",
  },
  {
    Icon: FaBolt,
    title: "Code sprints",
    text: "Sessions intensives sur un theme : IA, web, embarqué.",
  },
];

/* ---------- Page ---------- */

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents({ upcoming: true, limit: 3 })
      .then(setEvents)
      .catch(() => {});
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="dic-hero-v2">
        <div className="dic-hero-grid" aria-hidden="true" />

        <div className="container dic-hero-content">
          <Reveal>
            <span className="dic-hero-tag">
              <span className="dic-hero-tag-dot" />
              Club actif - 2025 / 2026
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="dic-hero-v2-title mb-5 text-shadow">
              Digital Innovation Club
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <h4 className="text-light text-shadow">Learn, Build, Innnovate</h4>
          </Reveal>
          <Reveal delay={240}>
            <div className="dic-hero-v2-actions mt-5 ">
              <Link to="/a-propos" className="btn dic-btn-primary btn-lg">
                Decouvrir le club <FaArrowRight className="ms-2" />
              </Link>
              <Link to="/evenements" className="btn dic-btn-ghost btn-lg">
                Voir les evenements
              </Link>
            </div>
          </Reveal>
        </div>

        <a href="#poles" className="dic-hero-scroll" aria-label="Faire defiler">
          <FaChevronDown />
        </a>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="dic-marquee" aria-hidden="true">
        <div className="dic-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span className="dic-marquee-item" key={i}>
              {word}
              <span className="dic-marquee-sep">///</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ POLES ============ */}
      <section id="poles" className="dic-poles">
        <div className="container">
          <Reveal>
            <div className="dic-section-eyebrow">Nos poles</div>
            <h2 className="dic-section-h2">
              Trois domaines, une seule communaute.
            </h2>
            <p className="dic-section-p">
              Chaque pole mene ses propres projets, ateliers et challenges.
              Tu peux rejoindre celui qui te parle, ou tous les explorer.
            </p>
          </Reveal>

          <div className="dic-poles-list">
            {POLES.map((pole, i) => {
              const reverse = i % 2 === 1;
              return (
                <Reveal key={pole.number} delay={i * 100}>
                  <article
                    className={`dic-pole ${reverse ? "dic-pole--reverse" : ""}`}
                  >
                    <div className="dic-pole-visual">
                      <div className="dic-pole-number">{pole.number}</div>
                      <div className="dic-pole-icon">
                        <pole.Icon />
                      </div>
                    </div>

                    <div className="dic-pole-body">
                      <h3 className="dic-pole-title">{pole.title}</h3>
                      <p className="dic-pole-tagline">{pole.tagline}</p>
                      <p className="dic-pole-desc">{pole.description}</p>
                      <ul className="dic-pole-topics">
                        {pole.topics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ CHALLENGES ============ */}
      <section className="dic-challenges">
        <div className="container">
          <Reveal>
            <div className="dic-section-eyebrow">Challenges</div>
            <h2 className="dic-section-h2">
              On organise, on participe, on gagne.
            </h2>
            <p className="dic-section-p">
              Tout au long de l'annee, le club met en place des competitions
              internes et represente l'ecole a l'exterieur.
            </p>
          </Reveal>

          <div className="row g-3 mt-2">
            {CHALLENGES.map((c, i) => (
              <div className="col-12 col-md-6 col-lg-3" key={c.title}>
                <Reveal delay={i * 80}>
                  <div className="dic-challenge">
                    <div className="dic-challenge-icon">
                      <c.Icon />
                    </div>
                    <h4 className="dic-challenge-title">{c.title}</h4>
                    <p className="dic-challenge-text">{c.text}</p>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      {/* <section className="dic-stats-band">
        <div className="container">
          <div className="row g-4">
            {[
              { Icon: FaUsers, to: 120, suffix: "+", label: "Membres" },
              { Icon: FaRocket, to: 30, suffix: "+", label: "Projets" },
              { Icon: FaTrophy, to: 12, suffix: "", label: "Challenges" },
              { Icon: FaCalendarAlt, to: 25, suffix: "+", label: "Evenements" },
            ].map((s, i) => (
              <div className="col-6 col-lg-3" key={s.label}>
                <Reveal delay={i * 80}>
                  <div className="dic-stat-v2">
                    <s.Icon className="dic-stat-v2-icon" />
                    <div className="dic-stat-v2-value">
                      <Counter to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="dic-stat-v2-label">{s.label}</div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ============ EVENEMENTS ============ */}
      {events.length > 0 && (
        <section className="dic-home-events">
          <div className="container">
            <Reveal>
              <div className="dic-section-head">
                <div>
                  <div className="dic-section-eyebrow">A venir</div>
                  <h2 className="dic-section-h2 mb-0">
                    Prochains evenements
                  </h2>
                </div>
                <Link to="/evenements" className="dic-section-link">
                  Voir tout <FaArrowRight />
                </Link>
              </div>
            </Reveal>

            <div className="row g-3">
              {events.map((e, i) => (
                <div className="col-12 col-sm-6 col-lg-4" key={e.id}>
                  <Reveal delay={i * 80}>
                    <EventCard event={e} />
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA FINAL ============ */}
      <section className="dic-cta">
        <div className="container">
          <Reveal>
            <div className="dic-cta-inner">
              <div>
                <h2 className="dic-cta-title">
                  Pret a construire avec nous ?
                </h2>
                <p className="dic-cta-text">
                  Rejoins le club, choisis ton pole, participe aux challenges.
                </p>
              </div>
              <Link to="/contact" className="btn dic-btn-primary btn-lg">
                Rejoindre le club <FaArrowRight className="ms-2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}