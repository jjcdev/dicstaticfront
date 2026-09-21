import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaArrowRight, 
  FaBrain, 
  FaShieldAlt, 
  FaMicrochip,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const slides = [
  {
    id: 1,
    icon: FaBrain,
    title: "Intelligence Artificielle",
    subtitle: "Explorez le futur",
    description: "Plongez dans l'univers du Machine Learning et du Deep Learning. Créez des modèles innovants et participez à des projets concrets.",
    ctaPrimary: { text: "Découvrir le pôle", link: "/a-propos" },
    ctaSecondary: { text: "Voir les projets", link: "/galerie" },
    accentColor: "#0ea5e9",
    pattern: "dots"
  },
  {
    id: 2,
    icon: FaShieldAlt,
    title: "Cybersécurité",
    subtitle: "Protégez le numérique",
    description: "Apprenez les techniques d'offensive et defensive security. Participez aux CTF et devenez un expert en sécurité informatique.",
    ctaPrimary: { text: "Rejoindre le pôle", link: "/a-propos" },
    ctaSecondary: { text: "Prochains événements", link: "/evenements" },
    accentColor: "#10b981",
    pattern: "grid"
  },
  {
    id: 3,
    icon: FaMicrochip,
    title: "Systèmes Embarqués",
    subtitle: "Du code au hardware",
    description: "Concevez des robots, des objets connectés et des systèmes autonomes. Arduino, Raspberry Pi, IoT n'auront plus de secrets pour vous.",
    ctaPrimary: { text: "Explorer", link: "/a-propos" },
    ctaSecondary: { text: "Nos réalisations", link: "/galerie" },
    accentColor: "#f59e0b",
    pattern: "circles"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <section className="dic-hero-slider">
      <div className={`dic-hero-slide ${isAnimating ? "is-animating" : ""}`}>
        {/* Background Pattern */}
        <div className="dic-hero-pattern" style={{ "--accent-color": slide.accentColor }}>
          {slide.pattern === "dots" && (
            <div className="dic-pattern-dots" />
          )}
          {slide.pattern === "grid" && (
            <div className="dic-pattern-grid" />
          )}
          {slide.pattern === "circles" && (
            <div className="dic-pattern-circles" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="dic-hero-gradient" style={{ "--accent-color": slide.accentColor }} />

        {/* Content */}
        <div className="container dic-hero-slider-content">
          <div className="row align-items-center min-vh-100">
            <div className="col-12 col-lg-8">
              <div className={`dic-slide-content ${isAnimating ? "slide-out" : "slide-in"}`}>
                <div className="dic-slide-icon" style={{ "--accent-color": slide.accentColor }}>
                  <Icon />
                </div>
                
                <span className="dic-slide-subtitle" style={{ color: slide.accentColor }}>
                  {slide.subtitle}
                </span>
                
                <h1 className="dic-slide-title">
                  {slide.title}
                </h1>
                
                <p className="dic-slide-description">
                  {slide.description}
                </p>

                <div className="dic-slide-cta">
                  <Link 
                    to={slide.ctaPrimary.link} 
                    className="dic-btn-filled"
                    style={{ "--btn-accent": slide.accentColor }}
                  >
                    {slide.ctaPrimary.text}
                    <FaArrowRight />
                  </Link>
                  <Link 
                    to={slide.ctaSecondary.link} 
                    className="dic-btn-outline"
                    style={{ "--btn-accent": slide.accentColor }}
                  >
                    {slide.ctaSecondary.text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="dic-hero-nav dic-hero-prev"
          onClick={prevSlide}
          aria-label="Slide précédente"
        >
          <FaChevronLeft />
        </button>
        <button 
          className="dic-hero-nav dic-hero-next"
          onClick={nextSlide}
          aria-label="Slide suivante"
        >
          <FaChevronRight />
        </button>

        {/* Dots Navigation */}
        <div className="dic-hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dic-dot ${index === currentSlide ? "is-active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à la slide ${index + 1}`}
              style={{ 
                "--dot-color": slide.accentColor,
                "--dot-active": index === currentSlide ? slide.accentColor : "var(--dic-border)"
              }}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="dic-slide-counter">
          <span className="dic-slide-counter-current">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className="dic-slide-counter-total">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}