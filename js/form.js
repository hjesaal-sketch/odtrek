/* ============================================================
   FORM — Inscripción con validación + submit
   ============================================================ */

const VALIDATORS = {
  nombre:   v => v.trim().length >= 2,
  apellido: v => v.trim().length >= 2,
  email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telefono: v => v.replace(/\D/g, '').length >= 7,
  edad:     v => Number(v) >= 14 && Number(v) <= 99,
  evento:   v => v !== '',
  talla:    v => v !== '',
};

export function initForm() {
  const form = document.getElementById('inscForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;

    Object.keys(VALIDATORS).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const field = input.closest('.field');
      const valid = VALIDATORS[id](input.value);
      field.classList.toggle('invalid', !valid);
      input.classList.toggle('error', !valid);
      if (!valid) ok = false;
    });

    const terminos = document.getElementById('terminos');
    if (terminos && !terminos.checked) {
      ok = false;
      alert('Debes aceptar los términos y condiciones.');
    }

    if (!ok) {
      const firstErr = form.querySelector('.field.invalid input, .field.invalid select');
      if (firstErr) firstErr.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Enviando...';

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al enviar');

      form.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } catch (err) {
      console.error(err);
      alert('Hubo un error. Intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Confirmar inscripción';
    }
  });

  // Limpia error al escribir
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      const field = el.closest('.field');
      if (field) field.classList.remove('invalid');
      el.classList.remove('error');
    });
  });
}