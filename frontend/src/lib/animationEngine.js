/* Lightweight IntersectionObserver-based animation engine.
 * Auto-attaches to any element with [data-animate] when scrolled into view.
 * Respects prefers-reduced-motion.
 * Adds the class `is-in` to the element to trigger the CSS transition.
 * For [data-animate="count-up"] also runs a numeric count animation to data-target.
 */

const REDUCED = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

let observer;
const seen = new WeakSet();

function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const fmt = (n) => (n >= 1000 ? n.toLocaleString('en-IN') : String(n)) + (el.dataset.suffix || '+');
  const step = (t) => {
    const p = Math.min((t - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.round(target * eased);
    el.textContent = fmt(v);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function handle(entries) {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    if (seen.has(el)) continue;
    seen.add(el);
    const kind = el.dataset.animate;
    if (kind === 'count-up') {
      const target = Number(el.dataset.target || '0');
      if (REDUCED) { el.textContent = String(target) + (el.dataset.suffix || '+'); }
      else { animateCount(el, target); }
    }
    el.classList.add('is-in');
    if (el.dataset.staggerChildren !== undefined) {
      const kids = Array.from(el.children);
      kids.forEach((c, i) => {
        c.style.transitionDelay = REDUCED ? '0ms' : `${i * 80}ms`;
        c.classList.add('is-in');
      });
    }
    observer.unobserve(el);
  }
}

function attach() {
  document.querySelectorAll('[data-animate]:not(.is-in)').forEach((el) => {
    observer.observe(el);
  });
  document.querySelectorAll('[data-stagger-children]').forEach((el) => {
    observer.observe(el);
  });
}

export function startAnimationEngine() {
  if (observer) { attach(); return; }
  observer = new IntersectionObserver(handle, { threshold: 0.15 });
  attach();
  // Re-attach on DOM mutations (route changes)
  const mo = new MutationObserver(() => attach());
  mo.observe(document.body, { childList: true, subtree: true });
}
