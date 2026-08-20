/* Flareonix Spark Engine — canvas-based fire/spark particle system.
 * Self-contained. Auto-initialises on DOMContentLoaded.
 * Ambient sparks rising from bottom + cursor trail + button-hover bursts
 * + cursor repulsion field + radial page-transition explosion.
 * Mobile-safe (lighter mode) and FPS-adaptive.
 */

const COLORS = ["#FF6B00", "#FF8C00", "#FFB300", "#CC2200", "#FF4500"];

class SparkEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.cursor = { x: -9999, y: -9999, vx: 0, vy: 0, px: -9999, py: -9999, speed: 0 };
    this.ambientTarget = 40;
    this.cursorSparksMax = 6;
    this.fps = 60;
    this.frameTimes = [];
    this.lastFrame = performance.now();
    this.boundResize = this.resize.bind(this);
    this.boundMove = this.onMouseMove.bind(this);
    this.hoverElements = new WeakSet();
    this.hoveredEl = null;
    this.transitionParticles = false;
    this.disabled = false;
  }

  init() {
    if (this.canvas) return; // singleton
    if (typeof window === "undefined") return;
    this.canvas = document.createElement("canvas");
    this.canvas.id = "flareonix-spark-canvas";
    Object.assign(this.canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "0",
    });
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d", { alpha: true });

    this.applyMobileBudget();
    this.resize();
    window.addEventListener("resize", this.boundResize);
    window.addEventListener("mousemove", this.boundMove, { passive: true });

    // Re-bind button hover sparks whenever DOM changes
    this.attachHoverListeners();
    this.observer = new MutationObserver(() => this.attachHoverListeners());
    this.observer.observe(document.body, { childList: true, subtree: true });

    // Intercept internal link clicks for radial explosion
    document.addEventListener("click", (e) => this.handleLinkClick(e), true);

    // Seed ambient
    for (let i = 0; i < this.ambientTarget; i++) this.spawnAmbient();

    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  applyMobileBudget() {
    if (window.innerWidth < 768) {
      this.ambientTarget = 20;
      this.cursorSparksMax = 6;
      this.repulsionEnabled = false;
    } else {
      this.repulsionEnabled = true;
    }
  }

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.applyMobileBudget();
  }

  onMouseMove(e) {
    this.cursor.px = this.cursor.x;
    this.cursor.py = this.cursor.y;
    this.cursor.x = e.clientX;
    this.cursor.y = e.clientY;
    const dx = this.cursor.x - this.cursor.px;
    const dy = this.cursor.y - this.cursor.py;
    this.cursor.speed = Math.sqrt(dx * dx + dy * dy);
  }

  spawnAmbient() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.particles.push({
      kind: "ambient",
      x: Math.random() * w,
      y: h - Math.random() * h * 0.2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.8 + Math.random() * 1.2),
      size: 2 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 80 + Math.random() * 60,
      age: 0,
      maxOpacity: 0.85,
    });
  }

  spawnCursorSparks(count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push({
        kind: "cursor",
        x: this.cursor.x + (Math.random() - 0.5) * 6,
        y: this.cursor.y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: 3 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 30 + Math.random() * 10,
        age: 0,
        maxOpacity: 0.9,
      });
    }
  }

  spawnHoverSparks(rect, count) {
    for (let i = 0; i < count; i++) {
      // Random point on perimeter
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = rect.left + Math.random() * rect.width; y = rect.top; }
      else if (side === 1) { x = rect.right; y = rect.top + Math.random() * rect.height; }
      else if (side === 2) { x = rect.left + Math.random() * rect.width; y = rect.bottom; }
      else { x = rect.left; y = rect.top + Math.random() * rect.height; }
      this.particles.push({
        kind: "hover",
        x, y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(0.5 + Math.random() * 1.5),
        size: 2 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 50 + Math.random() * 30,
        age: 0,
        maxOpacity: 0.85,
      });
    }
  }

  spawnExplosion(x, y, count = 200) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 12;
      this.particles.push({
        kind: "explosion",
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 30 + Math.random() * 30,
        age: 0,
        maxOpacity: 1,
      });
    }
  }

  handleLinkClick(e) {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("/") || href.startsWith("//")) return;
    if (a.target === "_blank") return;
    this.spawnExplosion(e.clientX, e.clientY, window.innerWidth < 768 ? 60 : 200);
    // Brief overlay flash
    const flash = document.createElement("div");
    Object.assign(flash.style, {
      position: "fixed", inset: "0", background: "rgba(255,107,0,0.15)",
      opacity: "0", transition: "opacity 300ms ease", pointerEvents: "none",
      zIndex: "9998",
    });
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = "1"; });
    setTimeout(() => { flash.style.opacity = "0"; }, 300);
    setTimeout(() => { flash.remove(); }, 600);
  }

  attachHoverListeners() {
    const selector = "button, .btn, .cta, a[href], [role=\"button\"]";
    document.querySelectorAll(selector).forEach((el) => {
      if (this.hoverElements.has(el)) return;
      this.hoverElements.add(el);
      el.addEventListener("mouseenter", () => { this.hoveredEl = el; });
      el.addEventListener("mouseleave", () => {
        if (this.hoveredEl === el) this.hoveredEl = null;
      });
    });
  }

  applyRepulsion() {
    if (!this.repulsionEnabled) return;
    const r = 80;
    for (const p of this.particles) {
      if (p.kind !== "ambient") continue;
      const dx = p.x - this.cursor.x;
      const dy = p.y - this.cursor.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < r && dist > 0.01) {
        const force = (r - dist) * 0.04;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }
  }

  step() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Spawn cursor sparks based on speed
    const s = this.cursor.speed;
    let n = 2;
    if (s > 15) n = this.cursorSparksMax;
    else if (s > 5) n = Math.min(this.cursorSparksMax, Math.round(2 + (s - 5) * 0.4));
    if (this.cursor.x > -9000) this.spawnCursorSparks(Math.min(n, this.cursorSparksMax));

    // Hover sparks
    if (this.hoveredEl && document.contains(this.hoveredEl)) {
      const rect = this.hoveredEl.getBoundingClientRect();
      this.spawnHoverSparks(rect, 8);
    }

    this.applyRepulsion();

    // Update particles
    const next = [];
    for (const p of this.particles) {
      p.age++;
      p.x += p.vx;
      p.y += p.vy;
      // gentle friction
      if (p.kind !== "ambient") {
        p.vx *= 0.96;
        p.vy *= 0.96;
      }
      if (p.age < p.life && p.x > -50 && p.x < w + 50 && p.y > -50 && p.y < h + 50) {
        next.push(p);
      }
    }
    this.particles = next;

    // Maintain ambient
    let ambientCount = 0;
    for (const p of this.particles) if (p.kind === "ambient") ambientCount++;
    while (ambientCount < this.ambientTarget) {
      this.spawnAmbient();
      ambientCount++;
    }

    // Draw
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.globalCompositeOperation = "lighter";
    for (const p of this.particles) {
      const lifeRatio = p.age / p.life;
      const opacity = (1 - lifeRatio) * p.maxOpacity;
      this.ctx.beginPath();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, opacity);
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "source-over";

    // Decay cursor speed for next frame so single jumps don't keep emitting
    this.cursor.speed *= 0.85;
  }

  loop(now) {
    if (this.disabled) return;
    const delta = now - this.lastFrame;
    this.lastFrame = now;
    this.frameTimes.push(delta);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.fps = 1000 / avg;
      if (this.fps < 30) {
        this.ambientTarget = Math.max(8, Math.floor(this.ambientTarget / 2));
        this.cursorSparksMax = Math.max(2, Math.floor(this.cursorSparksMax / 2));
      }
    }
    this.step();
    requestAnimationFrame(this.loop);
  }

  destroy() {
    this.disabled = true;
    if (this.canvas) this.canvas.remove();
    this.canvas = null;
    this.particles = [];
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.boundResize);
    window.removeEventListener("mousemove", this.boundMove);
  }
}

let _instance = null;

export function startSparkEngine() {
  if (_instance) return _instance;
  _instance = new SparkEngine();
  _instance.init();
  return _instance;
}

export function stopSparkEngine() {
  if (_instance) {
    _instance.destroy();
    _instance = null;
  }
}
