// ============================================================
// ODTREK — Endpoint "Avísame del regreso" / Contacto
// Con soporte para campo `mensaje` opcional.
// ============================================================

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TIPOS = {
  // Eventos — el usuario quiere que le avisen del regreso
  'odtrek-21k': {
    nombre: 'ODTREK 21K',
    esEvento: true,
    emailSubject: '¡Listo! Te avisamos del regreso de ODTREK 21K',
    mensaje: 'Ya estás en la lista. Cuando tengamos la fecha del regreso de ODTREK 21K, serás de los primeros en enterarte.',
    cierre: 'Nos vemos en la ruta.',
  },
  'tovarer-trail': {
    nombre: 'Tovarer Trail',
    esEvento: true,
    emailSubject: '¡Listo! Te avisamos del regreso de Tovarer Trail',
    mensaje: 'Ya estás en la lista. Cuando tengamos la fecha del regreso de Tovarer Trail, serás de los primeros en enterarte.',
    cierre: 'Nos vemos en la ruta.',
  },
  'reto-nocturno': {
    nombre: 'Reto Nocturno CT',
    esEvento: true,
    emailSubject: '¡Listo! Te avisamos del regreso del Reto Nocturno CT',
    mensaje: 'Ya estás en la lista. Cuando tengamos la fecha del regreso del Reto Nocturno CT, serás de los primeros en enterarte.',
    cierre: 'Nos vemos en la ruta.',
  },
  'runningfest': {
    nombre: 'RunningFest',
    esEvento: true,
    emailSubject: '¡Listo! Te avisamos del regreso del RunningFest',
    mensaje: 'Ya estás en la lista. Cuando tengamos la fecha del regreso del RunningFest, serás de los primeros en enterarte.',
    cierre: 'Nos vemos en la ruta.',
  },

  // Newsletter general
  'newsletter': {
    nombre: 'Newsletter ODTREK',
    esEvento: false,
    emailSubject: '¡Listo! Ya estás en la lista de ODTREK',
    mensaje: 'Recibimos tus datos. Te avisaremos cuando tengamos novedades importantes: fechas, eventos y preventas.',
    cierre: 'Gracias por sumarte.',
  },

  // Consultas de contacto (ahora sí hay campo de mensaje)
  'inscripcion': {
    nombre: 'Consulta de inscripción',
    esEvento: false,
    emailSubject: 'Recibimos tu consulta — ODTREK',
    mensaje: 'Recibimos tu consulta sobre inscripciones. Te responderemos a la brevedad.',
    cierre: 'Gracias por escribirnos.',
  },
  'alianza': {
    nombre: 'Alianza / Patrocinio',
    esEvento: false,
    emailSubject: 'Recibimos tu propuesta — ODTREK',
    mensaje: 'Recibimos tu propuesta de alianza. Nos interesa conocer más y te contactaremos en los próximos días.',
    cierre: 'Gracias por pensar en ODTREK.',
  },
  'cobertura': {
    nombre: 'Cobertura de eventos',
    esEvento: false,
    emailSubject: 'Recibimos tu solicitud — ODTREK',
    mensaje: 'Recibimos tu solicitud de cobertura. Te contactaremos para coordinar detalles.',
    cierre: 'Gracias por considerarnos.',
  },
  'prensa': {
    nombre: 'Prensa',
    esEvento: false,
    emailSubject: 'Recibimos tu consulta de prensa — ODTREK',
    mensaje: 'Recibimos tu consulta de prensa. Te responderemos a la brevedad.',
    cierre: 'Gracias por tu interés.',
  },
  'tienda': {
    nombre: 'Tienda ODTREK',
    esEvento: false,
    emailSubject: 'Recibimos tu interés — ODTREK',
    mensaje: 'Recibimos tus datos. Te avisaremos cuando abramos la tienda con las primeras colecciones.',
    cierre: 'Gracias por el interés.',
  },
  'voluntariado': {
    nombre: 'Voluntariado',
    esEvento: false,
    emailSubject: 'Recibimos tu interés — ODTREK',
    mensaje: 'Recibimos tus datos. Te contactaremos cuando armemos el equipo para el regreso.',
    cierre: 'Gracias por querer ser parte.',
  },
  'otro': {
    nombre: 'Consulta general',
    esEvento: false,
    emailSubject: 'Recibimos tu mensaje — ODTREK',
    mensaje: 'Recibimos tu mensaje. Te responderemos a la brevedad.',
    cierre: 'Gracias por escribirnos.',
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, apellido, email, telefono, edad, evento, mensaje } = req.body || {};

  if (!nombre || !apellido || !email) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const tipoSlug = evento || 'newsletter';
  const tipo = TIPOS[tipoSlug] || TIPOS['otro'];

  // Sanitización básica del mensaje (evita HTML injection en el email)
  const mensajeLimpio = (mensaje || '').trim().slice(0, 2000);
  const mensajeEscapado = mensajeLimpio
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');

  try {
    // 1. Notificación para ODTREK
    const notificacion = await resend.emails.send({
      from: 'ODTREK <onboarding@resend.dev>',
      to: ['eosconnecting@gmail.com'],
      subject: `${tipo.esEvento ? 'Nuevo interés' : 'Nuevo contacto'}: ${tipo.nombre} — ${nombre} ${apellido}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E86A1C;">${tipo.esEvento ? 'Nuevo interés en evento' : 'Nuevo contacto'}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tipo:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${tipo.nombre}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${nombre} ${apellido}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${telefono || 'No proporcionado'}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Edad:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${edad || 'No proporcionada'}</td></tr>
          </table>
          ${mensajeEscapado ? `
          <div style="margin-top: 24px; padding: 16px; background: #f7f7f7; border-left: 4px solid #E86A1C; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Mensaje del usuario:</p>
            <p style="margin: 0; color: #333; line-height: 1.6;">${mensajeEscapado}</p>
          </div>
          ` : ''}
          <p style="margin-top: 30px; color: #888; font-size: 12px;">Enviado desde odtrek.vercel.app</p>
        </div>
      `,
    });

    if (notificacion.error) {
      console.error('Error notificación:', notificacion.error);
      throw new Error('Error al enviar notificación');
    }

    // 2. Confirmación para el usuario
    const confirmacion = await resend.emails.send({
      from: 'ODTREK <onboarding@resend.dev>',
      to: [email],
      subject: tipo.emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0E0F0C; color: #EDEDED; padding: 40px; border-radius: 12px;">
          <h1 style="color: #FF7A2B; font-size: 32px; margin-bottom: 8px;">ODTREK</h1>
          <p style="color: #9A9A9A; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px;">Desde 2009 · Preparando el regreso</p>

          <h2 style="color: #EDEDED; font-size: 24px; margin-bottom: 16px;">¡Hola ${nombre.trim()}!</h2>
          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            ${tipo.mensaje}
          </p>

          ${tipo.esEvento ? `
          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            Sin spam. Solo las novedades importantes: fechas confirmadas, apertura de inscripciones y preventas exclusivas.
          </p>
          ` : ''}

          <div style="background: #161814; border-left: 4px solid #FF7A2B; padding: 16px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #EDEDED; margin: 0; font-size: 14px;">
              ${tipo.esEvento
                ? 'Mientras tanto, síguenos en Instagram <strong style="color: #FF7A2B;">@odtrek</strong> para no perderte nada.'
                : 'Si necesitas algo más, responde a este correo y te atendemos.'
              }
            </p>
          </div>

          <p style="color: #9A9A9A; line-height: 1.6; margin-bottom: 20px;">
            ${tipo.cierre}
          </p>
          <p style="color: #EDEDED; font-weight: bold;">— El equipo ODTREK</p>

          <hr style="border: none; border-top: 1px solid #2A2A2A; margin: 30px 0;">
          <p style="color: #666; font-size: 11px; text-align: center;">
            © 2026 ODTREK. Todos los derechos reservados.<br>
            <a href="https://odtrek.vercel.app" style="color: #FF7A2B; text-decoration: none;">odtrek.vercel.app</a>
          </p>
        </div>
      `,
    });

    if (confirmacion.error) {
      console.error('Error confirmación:', confirmacion.error);
    }

    return res.status(200).json({
      ok: true,
      message: 'Registro recibido.',
      notificacionId: notificacion.data?.id,
      confirmacionId: confirmacion.data?.id,
    });

  } catch (error) {
    console.error('Error en /api/inscripcion:', error);
    return res.status(500).json({
      error: 'Error al procesar el registro. Intenta de nuevo.',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}