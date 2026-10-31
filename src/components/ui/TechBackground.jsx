/**
 * Motif de fond statique, adapte au theme DIC.
 * Remplace ParticleField (anime) : ici tout est statique, sobre, et
 * parfaitement responsive. S'appuie sur les variables CSS du theme.
 *
 * Variantes :
 *  - "grid"    : grille fine (par defaut)
 *  - "dots"    : points en grille
 *  - "circuit" : lignes entrecroisees, effet circuit
 */
export default function TechBackground({ variant = "grid", className = "" }) {
  return (
    <div
      className={`tech-bg tech-bg-${variant} ${className}`}
      aria-hidden="true"
    />
  );
}