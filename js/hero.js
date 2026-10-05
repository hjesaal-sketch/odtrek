/* ============================================================
   HERO — Carrusel con soporte video + imagen
   ============================================================ */

export function initHero() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.getElementById('heroDots');
  const slideNum = document.getElementById('slideNum');
  const slideTotal = document.getElementById('slideTotal');
  const hero = document.getElementById('hero');
  if (!slides.length || !dotsWrap || !hero) return;

  const DURATION = 7000;
  let current = 0;
  let timer;

  if (slideTotal) slideTotal.textContent = String(slides.length).padStart(2, '0');

  // Genera dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'hero-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });

  const dots = dotsWrap.querySelectorAll('.hero-dot');

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (slideNum) slideNum.textContent = String(current + 1).padStart(2, '0');
    resetTimer();
  }

  function next() { goTo(current + 1); }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, DURATION);
  }
  resetTimer();

  // Pausa al hover
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', resetTimer);

  // Swipe móvil
  let touchX = 0;
  hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) diff > 0 ? next() : goTo(current - 1);
  }, { passive: true });
}