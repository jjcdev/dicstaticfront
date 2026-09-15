import { useState } from "react";
import { sendMessage } from "../../services/contactService";
import PageHeader from "../../components/ui/PageHeader";

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
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container py-4 py-md-5" style={{ maxWidth: 720 }}>
      <PageHeader
        title="Contact"
        subtitle="Une question, une collaboration ? Ecrivez-nous."
      />

      <form onSubmit={handleSubmit} className="dic-card p-3 p-md-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Nom</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Sujet</label>
            <input
              name="subject"
              className="form-control"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              rows="6"
              className="form-control"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {status === "success" && (
          <div className="alert alert-success mt-3 mb-0 py-2 small">
            Message envoye avec succes.
          </div>
        )}
        {status === "error" && (
          <div className="alert alert-danger mt-3 mb-0 py-2 small">
            Erreur lors de l'envoi.
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-3 w-100"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Envoi..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
}