import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { sendMessage } from "../../services/contactService";
import PageHeader from "../../components/ui/PageHeader";
import Reveal from "../../components/ui/Reveal";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="dic-page">
      <div className="container-dic">
        <Reveal>
          <PageHeader
            eyebrow="Contact"
            title="Parlons de votre projet."
            subtitle="Une question, une collaboration, une envie de rejoindre le club ? Ecrivez-nous."
          />
        </Reveal>

        <div className="dic-contact-layout">
          <Reveal>
            <aside className="dic-contact-aside">
              <div className="dic-contact-item">
                <div className="dic-challenge-icon">
                  <FaEnvelope aria-hidden="true" />
                </div>
                <div>
                  <div className="dic-contact-label">Email</div>
                  <a href="mailto:contact@dic.org" className="dic-contact-value">
                    contact@dic.org
                  </a>
                </div>
              </div>

              <div className="dic-contact-item">
                <div className="dic-challenge-icon">
                  <FaMapMarkerAlt aria-hidden="true" />
                </div>
                <div>
                  <div className="dic-contact-label">Localisation</div>
                  <div className="dic-contact-value">Campus universitaire</div>
                </div>
              </div>

              <div className="dic-contact-note">
                Nous repondons generalement sous 24 a 48 heures.
              </div>
            </aside>
          </Reveal>

          <Reveal delay={80}>
            <form onSubmit={handleSubmit} className="dic-contact-form">
              <div className="dic-form-row">
                <div className="dic-field">
                  <label className="dic-label">Nom complet</label>
                  <input
                    name="name"
                    className="dic-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>

                <div className="dic-field">
                  <label className="dic-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="dic-input"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="vous@exemple.com"
                    required
                  />
                </div>
              </div>

              <div className="dic-field">
                <label className="dic-label">Sujet</label>
                <input
                  name="subject"
                  className="dic-input"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                  required
                />
              </div>

              <div className="dic-field">
                <label className="dic-label">Message</label>
                <textarea
                  name="message"
                  className="dic-textarea"
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  required
                />
              </div>

              {status === "success" && (
                <div className="dic-alert is-success">
                  <FaCheckCircle aria-hidden="true" />
                  <span>Message envoye avec succes. Merci !</span>
                </div>
              )}
              {status === "error" && (
                <div className="dic-alert is-error">
                  <span>Une erreur est survenue. Reessayez plus tard.</span>
                </div>
              )}

              <button
                type="submit"
                className="dic-btn dic-btn-primary"
                disabled={status === "sending"}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {status === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                <FaPaperPlane size={12} />
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}