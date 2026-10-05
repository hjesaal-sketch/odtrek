/* ============================================================
   ODTREK — Entry point
   Importa y arranca todos los módulos.
   ============================================================ */

import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initHero } from './hero.js';
import { initForm } from './form.js';
import { initNewsletter } from './newsletter.js';
import { initReveal } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initHero();
  initForm();
  initNewsletter();
  initReveal();

  // Año dinámico en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});