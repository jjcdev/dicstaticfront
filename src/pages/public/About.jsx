import PageHeader from "../../components/ui/PageHeader";

export default function About() {
  return (
    <div className="container py-4 py-md-5">
      <PageHeader
        title="A propos du DIC"
        subtitle="Un espace dédié aux passionnés d'informatique."
      />

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <p>
            Le Digital Innovation Club rassemble des étudiants et amateurs
            d'informatique autour de projets concrets, d'ateliers pratiques
            et d'évènements techniques.
          </p>
        </div>
<br />
        <div className="col-12 col-md-4">
          <div className="dic-card p-3 h-100">
            <h3 className="dic-card-sub">Mission</h3>
            <p className="dic-card-text mb-0">
              Promouvoir la culture numérique et l'innovation technique.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="dic-card p-3 h-100">
            <h3 className="dic-card-sub">Vision</h3>
            <p className="dic-card-text mb-0">
              Devenir un club de référence pour les étudiants en informatique.
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="dic-card p-3 h-100">
            <h3 className="dic-card-sub">Valeurs</h3>
            <ul className="dic-card-text mb-0 ps-3">
              <li>Partage</li>
              <li>Rigueur</li>
              <li>Innovation</li>
              <li>Esprit d'equipe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}