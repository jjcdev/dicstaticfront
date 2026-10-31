import { useEffect, useRef } from "react";

/* Palette bleu / lavande */
const STAR_COLORS = [
  [150, 200, 255],
  [180, 200, 255],
  [200, 180, 255],
  [130, 220, 255],
  [220, 200, 255],
];

const TAU = Math.PI * 2;

/* Sprite d'étoile à 4 branches NETTE (style sparkle Google/Gemini) */
function makeStarSprite(color, size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const cx = size / 2;
  const R = size * 0.46;
  const [r, g, b] = color;

  ctx.translate(cx, cx);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a1 = (i / 4) * TAU - Math.PI / 2;
    const a2 = ((i + 1) / 4) * TAU - Math.PI / 2;
    const mid = (a1 + a2) / 2;
    const ox = Math.cos(a1) * R;
    const oy = Math.sin(a1) * R;
    // point de contrôle très proche du centre → courbe concave nette
    const ctrlX = Math.cos(mid) * R * 0.1;
    const ctrlY = Math.sin(mid) * R * 0.1;
    const nx = Math.cos(a2) * R;
    const ny = Math.sin(a2) * R;
    if (i === 0) ctx.moveTo(ox, oy);
    ctx.quadraticCurveTo(ctrlX, ctrlY, nx, ny);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.2, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(0.85, `rgba(${r},${g},${b},0.95)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0.6)`);
  ctx.fillStyle = grad;
  ctx.fill();

  return c;
}

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* Calcule les cibles d'une formation géométrique */
function computeFormation(name, count, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.36;
  const targets = new Array(count);

  if (name === "circle") {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU;
      targets[i] = { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
    }
  } else if (name === "spiral") {
    // Phyllotaxie (angle d'or) → spirale style "Google Particle"
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const r = R * Math.sqrt(i / count);
      const a = i * golden;
      targets[i] = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
    }
  } else if (name === "star5") {
    // Étoile à 5 branches : échantillonnage le long du contour
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU - Math.PI / 2;
      const rr = i % 2 === 0 ? R : R * 0.42;
      pts.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr });
    }
    const segs = [];
    let total = 0;
    for (let i = 0; i < 10; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 1) % 10];
      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segs.push({ p1, p2, len, start: total });
      total += len;
    }
    for (let i = 0; i < count; i++) {
      const d = (i / count) * total;
      let seg = segs[0];
      for (let k = 0; k < segs.length; k++) {
        if (d >= segs[k].start && d <= segs[k].start + segs[k].len) {
          seg = segs[k];
          break;
        }
      }
      const f = (d - seg.start) / seg.len;
      targets[i] = {
        x: seg.p1.x + (seg.p2.x - seg.p1.x) * f,
        y: seg.p1.y + (seg.p2.y - seg.p1.y) * f,
      };
    }
  } else if (name === "grid") {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const sx = (R * 2) / Math.max(1, cols - 1);
    const sy = (R * 2) / Math.max(1, rows - 1);
    for (let i = 0; i < count; i++) {
      const gx = i % cols;
      const gy = Math.floor(i / cols);
      targets[i] = { x: cx - R + gx * sx, y: cy - R + gy * sy };
    }
  } else {
    return null;
  }

  return targets;
}

export default function HeroBackdrop({ className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = mq.matches;

    const sprites = STAR_COLORS.map((c) => makeStarSprite(c, 128));

    const state = {
      stars: [],
      width: 0,
      height: 0,
      dpr: 1,
      lastTime: 0,
      mouseX: 0,
      mouseY: 0,
      hasMouse: false,
      running: false,
      visible: true,
      cachedFormation: null,
      cachedTargets: null,
    };

    // Cycle des formations
    const FORMATIONS = ["circle", "star5", "spiral", "grid", "scatter"];
    const CYCLE = 4.5; // secondes par formation

    function init() {
      const rect = parent.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const w = state.width;
      const h = state.height;
      const isMobile = w < 768;
      const count = isMobile ? 36 : 80;

      state.stars = [];
      for (let i = 0; i < count; i++) {
        state.stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          size: 10 + Math.random() * 16,
          sprite: sprites[i % sprites.length],
          baseAlpha: 0.5 + Math.random() * 0.45,
          alpha: 0.6,
          twinklePhase: Math.random() * TAU,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          rotation: Math.random() * TAU,
          rotationSpeed: (Math.random() - 0.5) * 0.012,
          lerpSpeed: 0.03 + Math.random() * 0.03,
        });
      }

      // Si "reduced motion" : on fige une jolie spirale statique
      if (prefersReduced) {
        const spiral = computeFormation("spiral", count, w, h);
        if (spiral) {
          for (let i = 0; i < count; i++) {
            state.stars[i].x = spiral[i].x;
            state.stars[i].y = spiral[i].y;
          }
        }
      }

      state.lastTime = 0;
      state.cachedFormation = null;
      state.cachedTargets = null;
    }

    function draw(now) {
      if (!state.running) return;

      const dt = state.lastTime ? Math.min(now - state.lastTime, 50) : 16;
      state.lastTime = now;
      const ff = dt / 16.6667;
      const tSec = now / 1000;

      const w = state.width;
      const h = state.height;
      const cx = w / 2;
      const cy = h / 2;

      // Phase de formation
      const totalPhase = tSec / CYCLE;
      const idx = Math.floor(totalPhase) % FORMATIONS.length;
      const local = totalPhase - Math.floor(totalPhase);

      let blend;
      if (local < 0.25) blend = smoothstep(0, 0.25, local);
      else if (local > 0.75) blend = 1 - smoothstep(0.75, 1, local);
      else blend = 1;

      const formationName = FORMATIONS[idx];

      // Cache les cibles tant que la formation ne change pas
      if (formationName !== state.cachedFormation) {
        state.cachedFormation = formationName;
        state.cachedTargets =
          formationName === "scatter"
            ? null
            : computeFormation(formationName, state.stars.length, w, h);
      }
      const targets = state.cachedTargets;

      // Rotation lente de la formation
      const formAngle = tSec * 0.15;
      const cosA = Math.cos(formAngle);
      const sinA = Math.sin(formAngle);

      ctx.clearRect(0, 0, w, h);

      const mouseX = state.mouseX;
      const mouseY = state.mouseY;
      const hasMouse = state.hasMouse;

      // ── Update étoiles ─────────────────────────────────────────────
      for (let i = 0; i < state.stars.length; i++) {
        const s = state.stars[i];

        if (prefersReduced) {
          s.alpha = s.baseAlpha;
          continue;
        }

        // dérive libre
        s.x += s.vx * ff;
        s.y += s.vy * ff;

        // wrap
        const pad = 40;
        if (s.x < -pad) s.x = w + pad;
        else if (s.x > w + pad) s.x = -pad;
        if (s.y < -pad) s.y = h + pad;
        else if (s.y > h + pad) s.y = -pad;

        // attraction formation
        if (targets && blend > 0) {
          const ft = targets[i];
          const fdx = ft.x - cx;
          const fdy = ft.y - cy;
          const tx = cx + fdx * cosA - fdy * sinA;
          const ty = cy + fdx * sinA + fdy * cosA;
          const k = s.lerpSpeed * blend * ff;
          s.x += (tx - s.x) * k;
          s.y += (ty - s.y) * k;
        }

        // répulsion souris douce
        if (hasMouse) {
          const dx = s.x - mouseX;
          const dy = s.y - mouseY;
          const d2 = dx * dx + dy * dy;
          const R = 130;
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / R) * 1.2 * (1 - blend * 0.7);
            s.x += (dx / d) * push * ff;
            s.y += (dy / d) * push * ff;
          }
        }

        s.rotation += s.rotationSpeed * ff;

        const twinkle =
          0.6 + 0.4 * Math.sin(tSec * s.twinkleSpeed + s.twinklePhase);
        s.alpha = s.baseAlpha * twinkle;
      }

      // ── Lignes de constellation ────────────────────────────────────
      const LINK = 130;
      const LINK2 = LINK * LINK;
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(160, 190, 255, 1)";

      for (let i = 0; i < state.stars.length; i++) {
        const a = state.stars[i];
        for (let j = i + 1; j < state.stars.length; j++) {
          const b = state.stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const d = Math.sqrt(d2);
            ctx.globalAlpha = (1 - d / LINK) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // ── Rendu des étoiles (additif) ────────────────────────────────
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < state.stars.length; i++) {
        const s = state.stars[i];
        const half = s.size / 2;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.alpha;
        ctx.drawImage(s.sprite, -half, -half, s.size, s.size);
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    }

    function start() {
      if (state.running) return;
      state.running = true;
      state.lastTime = 0;
      rafRef.current = requestAnimationFrame(draw);
    }

    function stop() {
      state.running = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    function onMouseMove(e) {
      const r = canvas.getBoundingClientRect();
      state.mouseX = e.clientX - r.left;
      state.mouseY = e.clientY - r.top;
      state.hasMouse = true;
    }
    function onMouseLeave() {
      state.hasMouse = false;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else if (state.visible) start();
    }

    let resizeTimer = null;
    function scheduleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
        if (state.visible && !document.hidden) start();
      }, 180);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    const ro = new ResizeObserver(scheduleResize);
    const onMqChange = (e) => {
      prefersReduced = e.matches;
    };
    if (mq.addEventListener) mq.addEventListener("change", onMqChange);
    else if (mq.addListener) mq.addListener(onMqChange);

    init();
    io.observe(canvas);
    ro.observe(parent);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      if (mq.removeEventListener) mq.removeEventListener("change", onMqChange);
      else if (mq.removeListener) mq.removeListener(onMqChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`hero-canvas ${className}`}
      aria-hidden="true"
    />
  );
}