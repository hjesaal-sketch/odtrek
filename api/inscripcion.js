// ============================================================
// ODTREK — Endpoint "Avísame del regreso" / Contacto
// ============================================================

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, apellido, email, telefono, edad, evento } = req.body || {};

  if (!nombre || !apellido || !email || !evento) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const eventosMap = {
    'odtrek-21k': 'ODTREK 21K',
    'tovarer-trail': 'Tovarer Trail',
    'reto-nocturno': 'Reto Nocturno CT',
    'runningfest': 'RunningFest',
    'newsletter': 'Newsletter',
    'inscripcion': 'Consulta de inscripción',
    'alianza': 'Alianza / Patrocinio',
    'cobertura': 'Cobertura de eventos',
    'prensa': 'Prensa',
    'tienda': 'Tienda ODTREK',
    'voluntariado': 'Voluntariado',
    'otro': 'Otro'
  };

  const eventoNombre = eventosMap[evento] || evento;

  try {
    // 1. Notificación para ODTREK
    const notificacion = await resend.emails.send({
      from: 'ODTREK <onboarding@resend.dev>',
      to: ['TU_EMAIL_AQUI'],
      subject: `Nuevo registro: ${eventoNombre} — ${nombre} ${apellido}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E86A1C;">Nuevo registro en ODTREK</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Interés:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${eventoNombre}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${nombre} ${apellido}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${telefono || 'No proporcionado'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Edad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${edad || 'No proporcionada'}</td></tr>
          </table>
          <p style="margin-top: 30px; color: #888; font-size: 12px;">Enviado desde el formulario de odtrek.vercel.app</p>
        </div>
      `
    });

    if (notificacion.error) {
      console.error('Error notificación:', notificacion.error);
      throw new Error('Error al enviar notificación');
    }

    // 2. Confirmación para el usuario
    const confirmacion = await resend.emails.send({
      from: 'ODTREK <onboarding@resend.dev>',
      to: [email],
      subject: `¡Listo, ${nombre}! Te avisamos del regreso`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0E0F0C; color: #EDEDED; padding: 40px; border-radius: 12px;">
          <h1 style="color: #FF7A2B; font-size: 32px; margin-bottom: 8px;">ODTREK</h1>
          <p style="color: #9A9A9A; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">Desde 2009 · Preparando el regreso</p>

          <h2 style="color: #EDEDED; font-size: 24px; margin-bottom: 16px;">¡Hola ${nombre}!</h2>
          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            Ya estás en la lista. Cuando tengamos la fecha del regreso de <strong style="color: #FF7A2B;">${eventoNombre}</strong>, serás de los primeros en enterarte.
          </p>
          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            Sin spam. Solo las novedades importantes: fechas confirmadas, apertura de inscripciones, y preventas exclusivas.
          </p>

          <div style="background: #161814; border-left: 4px solid #FF7A2B; padding: 16px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #EDEDED; margin: 0; font-size: 14px;">
              Mientras tanto, síguenos en Instagram <strong style="color: #FF7A2B;">@odtrek</strong> para no perderte nada.
            </p>
          </div>

          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            Nos vemos en la ruta.
          </p>
          <p style="color: #EDEDED; font-weight: bold;">— El equipo ODTREK</p>

          <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 30px 0;">
          <p style="color: #666; font-size: 11px; text-align: center;">
            © 2026 ODTREK. Todos los derechos reservados.<br>
            <a href="https://odtrek.vercel.app" style="color: #FF7A2B; text-decoration: none;">odtrek.vercel.app</a>
          </p>
        </div>
      `
    });

    if (confirmacion.error) {
      console.error('Error confirmación:', confirmacion.error);
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro recibido. Te avisaremos del regreso.',
      notificacionId: notificacion.data?.id,
      confirmacionId: confirmacion.data?.id
    });

  } catch (error) {
    console.error('Error en /api/inscripcion:', error);
    return res.status(500).json({
      error: 'Error al procesar el registro. Intenta de nuevo.',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}