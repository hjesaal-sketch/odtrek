/* ============================================================
   EVENTO — comportamiento de páginas internas
   ============================================================ */

import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initForm } from './form.js';
import { initNewsletter } from './newsletter.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initForm();
  initNewsletter();

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Preselecciona el evento en el form según data-evento del body
  const eventoSlug = document.body.dataset.evento;
  if (eventoSlug) {
    const select = document.getElementById('evento');
    if (select) {
      select.value = eventoSlug;
      // desactiva el select para que no lo cambien
      select.disabled = true;
      // campo oculto para que sí se envíe
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = 'evento';
      hidden.value = eventoSlug;
      select.parentElement.appendChild(hidden);
    }
  }
});