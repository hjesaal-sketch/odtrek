/* ============================================================
   LIGHTBOX — Galería con zoom
   Se activa en cualquier .g-item con background-image.
   ============================================================ */

export function initLightbox() {
  const items = document.querySelectorAll('.g-item');
  if (!items.length) return;

  // Extraer la URL del background-image de cada item
  const images = Array.from(items).map((el) => {
    const bg = el.style.backgroundImage;
    const match = bg.match(/url\(["']?(.+?)["']?\)/);
    return match ? match[1] : null;
  }).filter(Boolean);

  if (!images.length) return;

  // Crear el lightbox en el DOM (una sola vez)
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Cerrar">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <button class="lightbox-prev" aria-label="Anterior">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <button class="lightbox-next" aria-label="Siguiente">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
    <div class="lightbox-counter"><span class="lb-current">1</span> / <span class="lb-total">${images.length}</span></div>
    <div class="lightbox-image-wrap">
      <img class="lightbox-image" src="" alt="">
    </div>
  `;
  document.body.appendChild(lb);

  const lbImage = lb.querySelector('.lightbox-image');
  const lbCurrent = lb.querySelector('.lb-current');
  const lbTotal = lb.querySelector('.lb-total');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');

  let currentIndex = 0;

  function open(index) {
    currentIndex = index;
    lbImage.src = images[currentIndex];
    lbCurrent.textContent = currentIndex + 1;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    lbImage.src = images[currentIndex];
    lbCurrent.textContent = currentIndex + 1;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lbImage.src = images[currentIndex];
    lbCurrent.textContent = currentIndex + 1;
  }

  // Eventos de clic en cada item
  items.forEach((item, i) => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      // Encontrar el índice real de esta imagen en el array global
      const idx = images.indexOf(images[i]);
      if (idx !== -1) open(idx);
    });
  });

  // Controles
  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });

  // Cerrar al hacer clic fuera de la imagen
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('lightbox-image-wrap')) {
      close();
    }
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Swipe en móvil
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });
}