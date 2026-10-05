/* ============================================================
   NEWSLETTER — Footer
   ============================================================ */

export function initNewsletter() {
  const btn = document.getElementById('newsBtn');
  const input = document.getElementById('newsEmail');
  if (!btn || !input) return;

  btn.addEventListener('click', async () => {
    const email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Ingresa un correo válido.');
      return;
    }

    try {
      // await fetch('/api/newsletter', { method:'POST', ... });
      alert('¡Suscrito! Gracias por unirte a la comunidad ODTREK.');
      input.value = '';
    } catch {
      alert('Hubo un error. Intenta de nuevo.');
    }
  });
}