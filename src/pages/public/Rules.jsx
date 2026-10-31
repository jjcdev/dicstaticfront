import { useEffect, useState } from "react";
import {
  FaBookOpen,
  FaExclamationCircle,
  FaListUl,
} from "react-icons/fa";

import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import TechBackground from "../../components/ui/TechBackground";
import { getPublicRules } from "../../services/ruleService";

export default function Rules() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPublicRules()
      .then((data) => setSections(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const anchor = (section) =>
    section.slug || `section-${section.id}`;

  return (
    <div className="dic-page dic-rules-page">
      <div className="dic-page-tech-bg" aria-hidden="true">
        <TechBackground variant="dots" />
      </div>

      <div className="container-dic dic-page-inner">
        <Reveal>
          <PageHeader
            eyebrow="Règlement intérieur"
            title="Les règles du club."
            subtitle="Assiduité, retards, absences, comportement et engagement : ce document encadre la vie du Digital Innovation Club pour tous ses membres."
          />
        </Reveal>

        {loading ? (
          <Loader />
        ) : error ? (
          <EmptyState message="Impossible de charger le règlement pour le moment." />
        ) : sections.length === 0 ? (
          <EmptyState message="Le règlement sera publié prochainement." />
        ) : (
          <div className="dic-rules-layout">
            {/* Sommaire */}
            <Reveal>
              <aside className="dic-rules-toc">
                <div className="dic-rules-toc-title">
                  <FaListUl aria-hidden="true" />
                  <span>Sommaire</span>
                </div>
                <ol className="dic-rules-toc-list">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${anchor(s)}`}>{s.title}</a>
                    </li>
                  ))}
                </ol>
              </aside>
            </Reveal>

            {/* Contenu */}
            <Reveal delay={60}>
              <div className="dic-rules-content">
                {sections.map((s) => (
                  <section
                    key={s.id}
                    id={anchor(s)}
                    className="dic-rule-section"
                  >
                    <div className="dic-rule-section-head">
                      <FaBookOpen aria-hidden="true" />
                      <h2>{s.title}</h2>
                    </div>
                    <div
                      className="dic-rule-section-body"
                      dangerouslySetInnerHTML={{ __html: s.content }}
                    />
                  </section>
                ))}

                <div className="dic-rules-footnote">
                  <FaExclamationCircle aria-hidden="true" />
                  <span>
                    Ce règlement peut être mis à jour par le bureau du club.
                    La version publiée ici est toujours la version en vigueur.
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}