/* ============================================================
   REVEAL — Animaciones on-scroll con IntersectionObserver
   ============================================================ */

export function initReveal() {
  const targets = document.querySelectorAll('.evento, .futuro-card, .stat, .g-item');
  if (!targets.length) return;

  // Respeto por accesibilidad: sin animación si el usuario la desactiva
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1)';
    io.observe(el);
  });
}