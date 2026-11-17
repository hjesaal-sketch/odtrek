/* ============================================================
   FORM — Inscripción / Contacto con validación condicional
   - talla es requerida SOLO si el asunto/evento implica kit
   - en contacto, talla es opcional
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

// Valores de "evento" que NO requieren talla
const EVENTOS_SIN_TALLA = new Set([
  'newsletter',
  'inscripcion',
  'alianza',
  'cobertura',
  'prensa',
  'otro',
  'tienda',
  'voluntariado',
]);

export function initForm() {
  const form = document.getElementById('inscForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  // Referencias útiles
  const eventoSelect = document.getElementById('evento');
  const tallaField = document.getElementById('talla')?.closest('.field');
  const tallaSelect = document.getElementById('talla');

  // Función: ¿este formulario debe pedir talla ahora mismo?
  function tallaEsRequerida() {
    if (!tallaSelect) return false;
    const val = eventoSelect?.value || '';
    return !EVENTOS_SIN_TALLA.has(val);
  }

  // Actualiza el `required` de la talla dinámicamente
  function actualizarTallaRequerida() {
    if (!tallaSelect) return;
    const requerida = tallaEsRequerida();
    tallaSelect.toggleAttribute('required', requerida);
    if (!requerida) {
      tallaSelect.value = '';
      tallaField?.classList.remove('invalid');
      tallaSelect.classList.remove('error');
    }
  }

  // Si el select de evento cambia, reevaluar
  if (eventoSelect && tallaSelect) {
    eventoSelect.addEventListener('change', actualizarTallaRequerida);
    actualizarTallaRequerida(); // estado inicial
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;

    // Validación estándar
    Object.keys(VALIDATORS).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;

      const field = input.closest('.field');

      // Saltar talla si no es requerida en este momento
      if (id === 'talla' && !tallaEsRequerida()) return;

      const isRequired = input.hasAttribute('required');
      if (!isRequired && !input.value.trim()) return;

      const valid = VALIDATORS[id](input.value);
      if (field) field.classList.toggle('invalid', !valid);
      input.classList.toggle('error', !valid);
      if (!valid) ok = false;
    });

    const terminos = document.getElementById('terminos');
    if (terminos && terminos.hasAttribute('required') && !terminos.checked) {
      ok = false;
      alert('Debes aceptar los términos y condiciones.');
    }

    if (!ok) {
      const firstErr = form.querySelector('.field.invalid input, .field.invalid select');
      if (firstErr) firstErr.focus();
      return;
    }

    // Confirmación extra para talla en formularios de inscripción
    if (tallaSelect && tallaEsRequerida() && tallaSelect.value) {
      const tallaElegida = tallaSelect.value;
      const confirmado = confirm(
        `Has seleccionado talla "${tallaElegida}".\n\n` +
        `¿Confirmas que es la talla que deseas?\n\n` +
        `Los cambios posteriores están sujetos a disponibilidad.`
      );
      if (!confirmado) {
        tallaSelect.focus();
        return;
      }
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
      if (tallaSelect && eventoSelect) actualizarTallaRequerida(); // resetear estado
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    } catch (err) {
      console.error(err);
      alert('Hubo un error. Intenta de nuevo.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Confirmar';
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