import { useEffect, useRef } from "react";

const DEFAULT_FORMATIONS = ["grid", "circle", "wave", "spiral"];

/**
 * Variantes : spacing = espacement des points, dotRadius = taille,
 * duration = temps entre chaque formation, opacity = visibilite globale.
 */
const VARIANTS = {
  dense:   { spacing: 22, dotRadius: 1.4, duration: 5500, opacity: 0.75 },
  default: { spacing: 28, dotRadius: 1.5, duration: 6000, opacity: 0.7 },
  sparse:  { spacing: 38, dotRadius: 1.7, duration: 8000, opacity: 0.5 },
  ambient: { spacing: 44, dotRadius: 1.3, duration: 9500, opacity: 0.4 },
};

export default function ParticleField({
  variant = "default",
  formations = DEFAULT_FORMATIONS,
  interactive = true,
  className = "",
}) {
  const canvasRef = useRef(null);
  const config = VARIANTS[variant] || VARIANTS.default;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let raf = null;
    let width = 0;
    let height = 0;
    let dots = [];
    let mouse = { x: -9999, y: -9999 };
    let startTime = performance.now();
    let lastFormationChange = 0;
    let formationIndex = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function readDotColor() {
      const styles = getComputedStyle(document.documentElement);
      const heroText =
        styles.getPropertyValue("--color-hero-text").trim() || "#ffffff";
      const hex = heroText.replace("#", "");
      const full =
        hex.length === 3
          ? hex.split("").map((c) => c + c).join("")
          : hex;
      const r = parseInt(full.slice(0, 2), 16) || 255;
      const g = parseInt(full.slice(2, 4), 16) || 255;
      const b = parseInt(full.slice(4, 6), 16) || 255;
      return `rgba(${r}, ${g}, ${b}, 0.55)`;
    }

    function computeTarget(d, formation, t) {
      const { col, row, cols, rows } = d;
      const nx = cols > 1 ? col / (cols - 1) : 0.5;
      const ny = rows > 1 ? row / (rows - 1) : 0.5;
      const cx = width / 2;
      const cy = height / 2;
      const maxR = Math.min(width, height) * 0.42;

      switch (formation) {
        case "circle": {
          const angle = nx * Math.PI * 2;
          const r = maxR * (0.35 + ny * 0.65);
          return {
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r * 0.9,
          };
        }
        case "wave": {
          const x = (nx - 0.5) * width * 0.85 + cx;
          const y =
            cy +
            Math.sin(nx * Math.PI * 4 + t * 0.0012) * 34 +
            (ny - 0.5) * 70;
          return { x, y };
        }
        case "spiral": {
          const angle = nx * Math.PI * 5 + ny * Math.PI * 2;
          const r = maxR * ny;
          return {
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r * 0.75,
          };
        }
        default: {
          const gx =
            col * config.spacing +
            (width - (cols - 1) * config.spacing) / 2;
          const gy =
            row * config.spacing +
            (height - (rows - 1) * config.spacing) / 2;
          return { x: gx, y: gy };
        }
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(6, Math.floor(width / config.spacing));
      const rows = Math.max(4, Math.floor(height / config.spacing));

      dots = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const gx =
            col * config.spacing +
            (width - (cols - 1) * config.spacing) / 2;
          const gy =
            row * config.spacing +
            (height - (rows - 1) * config.spacing) / 2;
          dots.push({
            col, row, cols, rows,
            x: gx, y: gy, tx: gx, ty: gy,
          });
        }
      }
    }

    function draw(now) {
      const t = now - startTime;
      ctx.clearRect(0, 0, width, height);

      if (t - lastFormationChange > config.duration) {
        lastFormationChange = t;
        formationIndex = (formationIndex + 1) % formations.length;
      }
      const formation = formations[formationIndex];
      const dotColor = readDotColor();

      for (const d of dots) {
        const target = computeTarget(d, formation, t);
        d.tx = target.x;
        d.ty = target.y;

        d.tx += Math.sin(d.col * 0.55 + t * 0.0009) * 1.6;
        d.ty += Math.cos(d.row * 0.55 + t * 0.0011) * 1.6;

        if (interactive) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const dist2 = dx * dx + dy * dy;
          const radius = 130;
          if (dist2 < radius * radius && dist2 > 0.01) {
            const dist = Math.sqrt(dist2);
            const force = (radius - dist) / radius;
            d.tx += (dx / dist) * force * 30;
            d.ty += (dy / dist) * force * 30;
          }
        }

        d.x += (d.tx - d.x) * 0.085;
        d.y += (d.ty - d.y) * 0.085;

        ctx.beginPath();
        ctx.arc(d.x, d.y, config.dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function onMouseMove(e) {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (interactive) {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [variant, formations, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`particle-field particle-field-${variant} ${className}`}
      aria-hidden="true"
    />
  );
}