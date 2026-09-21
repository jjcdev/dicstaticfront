import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      className={`dic-theme-toggle ${className}`}
      onClick={toggle}
      aria-label={theme === "light" ? "Activer le theme sombre" : "Activer le theme clair"}
      title={theme === "light" ? "Theme sombre" : "Theme clair"}
    >
      <FaSun className="icon-sun" size={14} aria-hidden="true" />
      <FaMoon className="icon-moon" size={13} aria-hidden="true" />
    </button>
  );
}