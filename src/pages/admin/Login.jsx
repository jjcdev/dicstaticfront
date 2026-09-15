import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      setError("Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm-login-page">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <img src="/logo-dic.png" alt="DIC" />
          <h1>Digital Innovation Club</h1>
          <p>Connexion a l'espace administrateur</p>
        </div>

        {error && (
          <div className="adm-alert is-error adm-mb-3">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="adm-row">
          <div className="adm-field">
            <label className="adm-label" htmlFor="email">
              Adresse email <span className="req">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="adm-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dic.org"
              autoComplete="email"
              required
            />
          </div>

          <div className="adm-field">
            <label className="adm-label" htmlFor="password">
              Mot de passe <span className="req">*</span>
            </label>
            <input
              id="password"
              type="password"
              className="adm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.25rem" }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="adm-mt-3" style={{ textAlign: "center" }}>
          <a
            href="/"
            className="adm-text-muted"
            style={{ fontSize: 12.5 }}
          >
            Retour au site public
          </a>
        </div>
      </div>
    </div>
  );
}