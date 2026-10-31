import { useEffect, useMemo, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaSchool,
  FaBookOpen,
  FaBullseye,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";
import TechBackground from "../../components/ui/TechBackground";
import { getPhonePrefixes } from "../../services/phoneService";
import { submitApplication } from "../../services/applicationService";

/* ---------------------------------------------------------------
   Pôles disponibles
   --------------------------------------------------------------- */
const POLES = [
  { value: "ia", label: "Intelligence Artificielle" },
  { value: "cybersecurity", label: "Cybersécurité" },
  { value: "robotics", label: "Robotique & Systèmes embarqués" },
];

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone_prefix: "",
  phone_number: "",
  school: "",
  field_of_study: "",
  pole: "",
  motivations: "",
  source: "",
};

export default function Recruitment() {
  const [prefixes, setPrefixes] = useState([]);
  const [prefixesLoading, setPrefixesLoading] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* Chargement des préfixes téléphoniques */
  useEffect(() => {
    setPrefixesLoading(true);
    getPhonePrefixes()
      .then((list) => {
        const sorted = [...list].sort((a, b) =>
          a.label.localeCompare(b.label, "fr")
        );
        setPrefixes(sorted);
        if (sorted.length > 0) {
          setForm((f) => ({ ...f, phone_prefix: sorted[0].value }));
        }
      })
      .catch(() => setPrefixes([]))
      .finally(() => setPrefixesLoading(false));
  }, []);

  const selectedPrefix = useMemo(
    () => prefixes.find((p) => p.value === form.phone_prefix) || null,
    [prefixes, form.phone_prefix]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((fe) => {
        const copy = { ...fe };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    setFieldErrors({});

    try {
      await submitApplication(form);
      setStatus("success");
      setForm({ ...INITIAL_FORM, phone_prefix: form.phone_prefix });
    } catch (err) {
      const httpStatus = err.response?.status;
      const data = err.response?.data || {};

      if (httpStatus === 400 && data.errors) {
        setFieldErrors(data.errors);
        setErrorMessage(data.message || "Certains champs sont invalides.");
      } else if (httpStatus === 409) {
        setErrorMessage(
          data.message ||
            "Cette adresse email a déjà une candidature enregistrée."
        );
      } else if (httpStatus === 429) {
        setErrorMessage(
          data.message ||
            "Trop de candidatures envoyées depuis cette adresse. Réessayez plus tard."
        );
      } else {
        setErrorMessage(
          data.message || "Une erreur est survenue. Réessayez plus tard."
        );
      }
      setStatus("error");
    }
  };

  const fieldError = (name) => fieldErrors[name] || null;

  return (
    <div className="dic-page dic-recruitment-page">
      <div className="dic-page-tech-bg" aria-hidden="true">
        <TechBackground variant="grid" />
      </div>

      <div className="container-dic dic-page-inner">
        <Reveal>
          <PageHeader
            eyebrow="Recrutement"
            title="Rejoindre le Digital Innovation Club."
            subtitle="Remplis le formulaire ci-dessous. Le club étudiera ta candidature et te recontactera directement par email ou téléphone."
          />
        </Reveal>

        <div className="dic-recruitment-layout">
          {/* Colonne informative */}
          <Reveal>
            <aside className="dic-recruitment-aside">
              <div className="dic-recruitment-aside-block">
                <div className="dic-recruitment-aside-icon">
                  <FaBullseye aria-hidden="true" />
                </div>
                <h3>Trois pôles, une communauté</h3>
                <p>
                  Choisis le pôle qui te correspond. Tu pourras toujours
                  explorer les autres au fil de l&apos;année.
                </p>
                <ul className="dic-recruitment-poles">
                  {POLES.map((p) => (
                    <li key={p.value}>
                      <span className="dic-recruitment-pole-dot" />
                      {p.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dic-recruitment-aside-block">
                <h3>Ce qui compte pour nous</h3>
                <ul className="dic-recruitment-bullets">
                  <li>La motivation et l&apos;envie d&apos;apprendre.</li>
                  <li>L&apos;esprit d&apos;équipe et le partage.</li>
                  <li>La régularité et l&apos;engagement.</li>
                </ul>
              </div>

              <div className="dic-recruitment-note">
                Aucun document personnel n&apos;est demandé. Le club te
                recontactera par email ou téléphone après étude de ta
                candidature.
              </div>
            </aside>
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={80}>
            {status === "success" ? (
              <div className="dic-recruitment-success">
                <div className="dic-recruitment-success-icon">
                  <FaCheckCircle aria-hidden="true" />
                </div>
                <h2>Candidature envoyée.</h2>
                <p>
                  Merci ! Ta candidature a bien été enregistrée. Le club te
                  recontactera prochainement à l&apos;adresse indiquée.
                </p>
                <button
                  type="button"
                  className="dic-btn dic-btn-ghost dic-btn-ghost-dark"
                  onClick={() => setStatus("idle")}
                >
                  Envoyer une autre candidature
                </button>
              </div>
            ) : (
              <form
                className="dic-recruitment-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="dic-form-section">
                  <div className="dic-form-section-title">
                    <FaUser aria-hidden="true" />
                    <span>Informations personnelles</span>
                  </div>

                  <div className="dic-form-row">
                    <div className="dic-field">
                      <label className="dic-label" htmlFor="first_name">
                        Prénom <span className="dic-req">*</span>
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        className={`dic-input ${fieldError("first_name") ? "is-invalid" : ""}`}
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="Ton prénom"
                        required
                        autoComplete="given-name"
                      />
                      {fieldError("first_name") && (
                        <span className="dic-field-error">
                          {fieldError("first_name")}
                        </span>
                      )}
                    </div>

                    <div className="dic-field">
                      <label className="dic-label" htmlFor="last_name">
                        Nom <span className="dic-req">*</span>
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        className={`dic-input ${fieldError("last_name") ? "is-invalid" : ""}`}
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Ton nom"
                        required
                        autoComplete="family-name"
                      />
                      {fieldError("last_name") && (
                        <span className="dic-field-error">
                          {fieldError("last_name")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="dic-form-row">
                    <div className="dic-field">
                      <label className="dic-label" htmlFor="email">
                        <FaEnvelope aria-hidden="true" /> Email{" "}
                        <span className="dic-req">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={`dic-input ${fieldError("email") ? "is-invalid" : ""}`}
                        value={form.email}
                        onChange={handleChange}
                        placeholder="toi@exemple.com"
                        required
                        autoComplete="email"
                      />
                      {fieldError("email") && (
                        <span className="dic-field-error">
                          {fieldError("email")}
                        </span>
                      )}
                    </div>

                    <div className="dic-field">
                      <label className="dic-label" htmlFor="phone_number">
                        <FaPhoneAlt aria-hidden="true" /> Téléphone{" "}
                        <span className="dic-req">*</span>
                      </label>
                      <div className="dic-phone-group">
                        <select
                          name="phone_prefix"
                          className="dic-input dic-phone-prefix"
                          value={form.phone_prefix}
                          onChange={handleChange}
                          disabled={prefixesLoading || prefixes.length === 0}
                          aria-label="Préfixe téléphonique"
                        >
                          {prefixesLoading && (
                            <option value="">Chargement…</option>
                          )}
                          {!prefixesLoading && prefixes.length === 0 && (
                            <option value="">Indisponible</option>
                          )}
                          {prefixes.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.value} — {p.label}
                            </option>
                          ))}
                        </select>
                        <input
                          id="phone_number"
                          name="phone_number"
                          type="tel"
                          className={`dic-input ${fieldError("phone_number") ? "is-invalid" : ""}`}
                          value={form.phone_number}
                          onChange={handleChange}
                          placeholder={
                            selectedPrefix?.placeholder || "Numéro"
                          }
                          required
                          autoComplete="tel"
                        />
                      </div>
                      {fieldError("phone_number") && (
                        <span className="dic-field-error">
                          {fieldError("phone_number")}
                        </span>
                      )}
                      {fieldError("phone_prefix") && (
                        <span className="dic-field-error">
                          {fieldError("phone_prefix")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dic-form-section">
                  <div className="dic-form-section-title">
                    <FaSchool aria-hidden="true" />
                    <span>Etablissement</span>
                  </div>

                  <div className="dic-form-row">
                    <div className="dic-field">
                      <label className="dic-label" htmlFor="school">
                        <FaSchool aria-hidden="true" /> Établissement{" "}
                        <span className="dic-req">*</span>
                      </label>
                      <input
                        id="school"
                        name="school"
                        className={`dic-input ${fieldError("school") ? "is-invalid" : ""}`}
                        value={form.school}
                        onChange={handleChange}
                        placeholder="Ex. INSTI, UNSTIM, UAC…"
                        required
                      />
                      {fieldError("school") && (
                        <span className="dic-field-error">
                          {fieldError("school")}
                        </span>
                      )}
                    </div>

                    <div className="dic-field">
                      <label className="dic-label" htmlFor="field_of_study">
                        <FaBookOpen aria-hidden="true" /> Filière{" "}
                        <span className="dic-req">*</span>
                      </label>
                      <input
                        id="field_of_study"
                        name="field_of_study"
                        className={`dic-input ${fieldError("field_of_study") ? "is-invalid" : ""}`}
                        value={form.field_of_study}
                        onChange={handleChange}
                        placeholder="Ex. Génie logiciel, Réseaux…"
                        required
                      />
                      {fieldError("field_of_study") && (
                        <span className="dic-field-error">
                          {fieldError("field_of_study")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dic-form-section">
                  <div className="dic-form-section-title">
                    <FaBullseye aria-hidden="true" />
                    <span>Motivation</span>
                  </div>

                  <div className="dic-field">
                    <label className="dic-label" htmlFor="pole">
                      Pôle souhaité <span className="dic-req">*</span>
                    </label>
                    <select
                      id="pole"
                      name="pole"
                      className={`dic-input ${fieldError("pole") ? "is-invalid" : ""}`}
                      value={form.pole}
                      onChange={handleChange}
                      required
                    >
                      <option value="" hidden>Sélectionner un pôle</option>
                      {POLES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    {fieldError("pole") && (
                      <span className="dic-field-error">
                        {fieldError("pole")}
                      </span>
                    )}
                  </div>

                  <div className="dic-field">
                    <label className="dic-label" htmlFor="motivations">
                      Motivations <span className="dic-req">*</span>
                    </label>
                    <textarea
                      id="motivations"
                      name="motivations"
                      rows="6"
                      className={`dic-textarea ${fieldError("motivations") ? "is-invalid" : ""}`}
                      value={form.motivations}
                      onChange={handleChange}
                      placeholder="Explique en quelques lignes pourquoi tu veux rejoindre le club et ce que tu aimerais y faire (30 caractères minimum)."
                      required
                      minLength={30}
                      maxLength={200}
                    />
                    <div className="dic-field-meta">
                      <span>
                        {form.motivations.length} / 200 caractères
                      </span>
                      {fieldError("motivations") && (
                        <span className="dic-field-error">
                          {fieldError("motivations")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="dic-field">
                    <label className="dic-label" htmlFor="source">
                      Comment nous as-tu connus ?
                    </label>
                    <input
                      id="source"
                      name="source"
                      className={`dic-input ${fieldError("source") ? "is-invalid" : ""}`}
                      value={form.source}
                      onChange={handleChange}
                      placeholder="Ex. Instagram, un ami, un événement…"
                    />
                    {fieldError("source") && (
                      <span className="dic-field-error">
                        {fieldError("source")}
                      </span>
                    )}
                  </div>
                </div>

                {status === "error" && errorMessage && (
                  <div className="dic-alert is-error">
                    <FaExclamationCircle aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="dic-recruitment-actions">
                  <button
                    type="submit"
                    className="dic-btn dic-btn-primary"
                    disabled={status === "sending"}
                  >
                    {status === "sending"
                      ? "Envoi en cours…"
                      : "Envoyer ma candidature"}
                    <FaPaperPlane size={12} aria-hidden="true" />
                  </button>

                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </div>
  );
}