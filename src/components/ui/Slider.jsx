import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Slider({ children, ariaLabel = "Carrousel" }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      const cards = track.querySelectorAll("[data-slide]");
      setCount(cards.length);
      const scrollLeft = track.scrollLeft;
      const trackWidth = track.clientWidth;

      let nearest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      });
      setIndex(nearest);
      setCanPrev(scrollLeft > 8);
      setCanNext(scrollLeft + trackWidth < track.scrollWidth - 8);
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  const goTo = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll("[data-slide]");
    const card = cards[Math.max(0, Math.min(i, cards.length - 1))];
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="slider">
      <div
        className="slider-track"
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>

      <div className="slider-controls">
        <button
          type="button"
          className="slider-arrow"
          onClick={() => goTo(index - 1)}
          disabled={!canPrev}
          aria-label="Precedent"
        >
          <FaChevronLeft size={12} />
        </button>

        <div className="slider-dots">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`slider-dot ${i === index ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Element ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="slider-arrow"
          onClick={() => goTo(index + 1)}
          disabled={!canNext}
          aria-label="Suivant"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}