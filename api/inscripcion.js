/* ============================================================
   Vercel Serverless Function — Inscripción ODTREK
   ============================================================ */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nombre, apellido, email, telefono, edad, evento, talla } = req.body || {};

  if (!nombre || !apellido || !email || !evento) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const inscripcion = {
    id: crypto.randomUUID(),
    nombre, apellido, email, telefono, edad, evento, talla,
    fecha: new Date().toISOString(),
  };

  // TODO: conectar a DB / Resend / SendGrid / Notion
  console.log('Nueva inscripción:', inscripcion);

  return res.status(200).json({ ok: true, id: inscripcion.id });
}