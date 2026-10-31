import { useEffect, useRef } from "react";

/* Palette : majoritairement blanc, quelques étoiles bleutées et chaudes */
const STAR_COLORS = [
  [255, 255, 255],
  [200, 220, 255],
  [255, 240, 210],
  [150, 185, 255],
];

const TAU = Math.PI * 2;

function buildStars(count, width, height) {
  const stars = new Array(count);
  for (let i = 0; i < count; i++) {
    const layer = Math.random(); // 0 = lointaine, 1 = proche
    const color = STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0];
    stars[i] = {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (0.015 + layer * 0.06),
      vy: (Math.random() - 0.5) * (0.015 + layer * 0.06),
      r: 0.35 + layer * 1.15,
      a: 0.32 + layer * 0.58,
      phase: Math.random() * TAU,
      twinkle: 0.25 + Math.random() * 1.15, // Hz
      layer,
      color,
      parallax: 0.4 + layer * 0.9,
    };
  }
  return stars;
}

export default function StarField({ className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const parent = canvas.parentElement;
    if (!parent) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const state = {
      stars: [],
      shooting: [],
      width: 0,
      height: 0,
      dpr: 1,
      lastTime: 0,
      nextShootingAt: 0,
      mouseX: 0,
      mouseY: 0,
      targetX: 0,
      targetY: 0,
      running: false,
      visible: true,
    };

    /* ---------------- init / resize ---------------- */
    function init() {
      const rect = parent.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(state.width * state.dpr);
      canvas.height = Math.floor(state.height * state.dpr);
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const area = state.width * state.height;
      const lowEnd =
        (navigator.hardwareConcurrency &&
          navigator.hardwareConcurrency < 4) ||
        (navigator.deviceMemory && navigator.deviceMemory < 4);

      let count = Math.min(180, Math.max(60, Math.floor(area / 14000)));
      if (lowEnd) count = Math.floor(count * 0.65);
      if (prefersReduced) count = Math.floor(count * 0.6);

      state.stars = buildStars(count, state.width, state.height);
      state.shooting = [];
      state.nextShootingAt =
        performance.now() + 2500 + Math.random() * 4500;
      state.lastTime = 0;
    }

    /* ---------------- boucle de dessin ---------------- */
    function draw(now) {
      if (!state.running) return;

      const dt = state.lastTime
        ? Math.min(now - state.lastTime, 50)
        : 16;
      state.lastTime = now;
      const tSec = now / 1000;
      const frameFactor = dt / 16.6667;

      ctx.clearRect(0, 0, state.width, state.height);

      /* Parallaxe adoucie */
      state.mouseX += (state.targetX - state.mouseX) * 0.06;
      state.mouseY += (state.targetY - state.mouseY) * 0.06;
      const px = state.mouseX;
      const py = state.mouseY;

      /* ---- Étoiles ---- */
      for (let i = 0; i < state.stars.length; i++) {
        const s = state.stars[i];

        if (!prefersReduced) {
          s.x += s.vx * frameFactor;
          s.y += s.vy * frameFactor;
          if (s.x < -8) s.x = state.width + 8;
          else if (s.x > state.width + 8) s.x = -8;
          if (s.y < -8) s.y = state.height + 8;
          else if (s.y > state.height + 8) s.y = -8;
        }

        const twinkle = prefersReduced
          ? 1
          : 0.62 + 0.38 * Math.sin(tSec * s.twinkle * TAU + s.phase);
        const alpha = s.a * twinkle;
        if (alpha <= 0.01) continue;

        const x = s.x + px * s.parallax;
        const y = s.y + py * s.parallax;

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, TAU);
        ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha})`;
        ctx.fill();
      }

      /* ---- Étoiles filantes ---- */
      if (!prefersReduced && now > state.nextShootingAt) {
        spawnShooting();
        state.nextShootingAt = now + 4500 + Math.random() * 5500;
      }

      for (let i = state.shooting.length - 1; i >= 0; i--) {
        const sh = state.shooting[i];
        sh.x += Math.cos(sh.angle) * sh.speed * frameFactor;
        sh.y += Math.sin(sh.angle) * sh.speed * frameFactor;
        sh.life -= dt;

        if (
          sh.life <= 0 ||
          sh.x < -220 ||
          sh.x > state.width + 220 ||
          sh.y < -220 ||
          sh.y > state.height + 220
        ) {
          state.shooting.splice(i, 1);
          continue;
        }

        const progress = 1 - sh.life / sh.totalLife;
        const fade = Math.sin(progress * Math.PI);

        const segs = 9;
        for (let j = 0; j < segs; j++) {
          const f = j / segs;
          const segAlpha = fade * (1 - f);
          if (segAlpha <= 0.02) continue;
          const sx = sh.x - Math.cos(sh.angle) * sh.length * f;
          const sy = sh.y - Math.sin(sh.angle) * sh.length * f;
          ctx.beginPath();
          ctx.arc(sx, sy, sh.radius * (1 - f * 0.7), 0, TAU);
          ctx.fillStyle = `rgba(210,230,255,${segAlpha})`;
          ctx.fill();
        }

        /* Tête */
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, sh.radius * 1.35, 0, TAU);
        ctx.fillStyle = `rgba(255,255,255,${fade})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function spawnShooting() {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 6);
      const x = state.width * (0.15 + Math.random() * 0.75);
      const life = 1600 + Math.random() * 800;

      state.shooting.push({
        x,
        y: -30,
        angle,
        speed: 8 + Math.random() * 4,
        length: 110 + Math.random() * 80,
        radius: 1.8,
        life,
        totalLife: life,
      });
    }

    /* ---------------- contrôle ---------------- */
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

    /* ---------------- événements ---------------- */
    function onMouseMove(e) {
      const r = canvas.getBoundingClientRect();
      state.targetX = ((e.clientX - r.left) / r.width - 0.5) * 26;
      state.targetY = ((e.clientY - r.top) / r.height - 0.5) * 18;
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

    /* ---------------- mise en route ---------------- */
    init();
    io.observe(canvas);
    ro.observe(parent);
    document.addEventListener("visibilitychange", onVisibility);
    if (!prefersReduced) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`hero-starfield ${className}`}
      aria-hidden="true"
    />
  );
}