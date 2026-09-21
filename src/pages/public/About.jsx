import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";
import {
  FaBullseye,
  FaEye,
  FaHeart,
  FaUsers,
  FaLightbulb,
  FaHandshake,
} from "react-icons/fa";

const VALUES = [
  {
    Icon: FaHeart,
    title: "Partage",
    text: "Transmettre ce que l'on sait, apprendre des autres. Le club vit par ses membres.",
  },
  {
    Icon: FaLightbulb,
    title: "Innovation",
    text: "Explorer les technologies emergentes et transformer les idees en projets concrets.",
  },
  {
    Icon: FaUsers,
    title: "Esprit d'equipe",
    text: "Travailler ensemble, se depasser, celebrer les reussites collectives.",
  },
  {
    Icon: FaHandshake,
    title: "Rigueur",
    text: "Livrer du travail soigne, respecter les delais, assumer ses engagements.",
  },
];

export default function About() {
  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <PageHeader
            eyebrow="A propos"
            title="Un club, quatre poles, une communaute."
            subtitle="Digital Innovation Club rassemble les etudiants et passionnes d'informatique autour de projets concrets, d'ateliers et de challenges techniques."
          />
        </Reveal>

        <section className="dic-section" style={{ paddingTop: 0 }}>
          <div className="dic-about-grid">
            <Reveal>
              <div className="dic-about-card">
                <div className="dic-challenge-icon">
                  <FaBullseye aria-hidden="true" />
                </div>
                <h3 className="dic-challenge-title">Notre mission</h3>
                <p className="dic-challenge-text">
                  Promouvoir la culture numerique et l'innovation technique
                  au sein du campus. Offrir a chaque membre les moyens de
                  progresser, seul et en equipe.
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="dic-about-card">
                <div className="dic-challenge-icon">
                  <FaEye aria-hidden="true" />
                </div>
                <h3 className="dic-challenge-title">Notre vision</h3>
                <p className="dic-challenge-text">
                  Devenir un club de reference pour les etudiants en
                  informatique, reconnu pour la qualite de ses projets et
                  l'engagement de ses membres.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="dic-section">
          <Reveal>
            <span className="dic-eyebrow">Nos valeurs</span>
            <h2 className="dic-section-title">Ce qui nous guide.</h2>
          </Reveal>

          <div className="dic-challenges-grid" style={{ marginTop: "1.5rem" }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="dic-challenge">
                  <div className="dic-challenge-icon">
                    <v.Icon aria-hidden="true" />
                  </div>
                  <h3 className="dic-challenge-title">{v.title}</h3>
                  <p className="dic-challenge-text">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}