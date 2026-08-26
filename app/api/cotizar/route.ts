import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Recepción de solicitudes de cotización.
 *
 * Envía por Resend al correo comercial. Es deliberadamente el paso mínimo:
 * cuando exista CRM, este archivo es el único punto que cambia — el
 * formulario no se entera.
 *
 * Variables de entorno (ver .env.example):
 *   RESEND_API_KEY   clave de Resend
 *   COTIZA_DESTINO   correo que recibe las solicitudes
 *   COTIZA_REMITENTE remitente verificado en Resend
 *
 * Sin RESEND_API_KEY la ruta responde 503 y el formulario ofrece WhatsApp.
 * Nunca responde 200 sin haber enviado: una consulta que se pierde en
 * silencio es peor que un error visible.
 */

export const runtime = "nodejs";

const LIMITES = {
  origen: 120,
  destino: 120,
  tipo: 60,
  volumen: 80,
  frecuencia: 40,
  plazo: 40,
  nombre: 80,
  empresa: 100,
  correo: 120,
  telefono: 40,
} as const;

type Campo = keyof typeof LIMITES;
const CAMPOS = Object.keys(LIMITES) as Campo[];

const ETIQUETAS: Record<Campo, string> = {
  origen: "Origen",
  destino: "Destino",
  tipo: "Tipo de carga",
  volumen: "Peso o volumen",
  frecuencia: "Frecuencia",
  plazo: "Cuándo la necesita",
  nombre: "Nombre",
  empresa: "Empresa",
  correo: "Correo",
  telefono: "Teléfono",
};

/** Evita que un valor con saltos de línea inyecte encabezados o marcado. */
function limpiar(valor: unknown, max: number): string {
  if (typeof valor !== "string") return "";
  return valor.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function escapar(t: string) {
  return t.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function POST(peticion: Request) {
  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.COTIZA_DESTINO;
  const remitente = process.env.COTIZA_REMITENTE;

  if (!clave || !destino || !remitente) {
    return NextResponse.json(
      { ok: false, motivo: "sin-configurar" },
      { status: 503 },
    );
  }

  let cuerpo: unknown;
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ ok: false, motivo: "json-invalido" }, { status: 400 });
  }

  const datos = cuerpo as Record<string, unknown>;

  // Trampa para robots: un campo oculto que una persona nunca completa.
  if (limpiar(datos.web, 200)) {
    return NextResponse.json({ ok: true });
  }

  const campos = {} as Record<Campo, string>;
  const faltan: string[] = [];
  for (const c of CAMPOS) {
    campos[c] = limpiar(datos[c], LIMITES[c]);
    if (!campos[c]) faltan.push(ETIQUETAS[c]);
  }

  if (faltan.length) {
    return NextResponse.json(
      { ok: false, motivo: "faltan-campos", faltan },
      { status: 400 },
    );
  }

  const filas = CAMPOS.map(
    (c) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#667;white-space:nowrap">${ETIQUETAS[c]}</td>` +
      `<td style="padding:6px 0;color:#111;font-weight:600">${escapar(campos[c])}</td></tr>`,
  ).join("");

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      subject: `Cotización ${campos.empresa} — ${campos.origen} → ${campos.destino} · ${campos.tipo}`,
      // `replyTo` deja responder directo al cliente desde la bandeja.
      replyTo: campos.correo.includes("@") ? campos.correo : undefined,
      text: CAMPOS.map((c) => `${ETIQUETAS[c]}: ${campos[c]}`).join("\n"),
      html:
        `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5">` +
        `<h2 style="margin:0 0 16px;font-size:17px">Nueva solicitud de cotización</h2>` +
        `<table style="border-collapse:collapse">${filas}</table>` +
        `<p style="margin:20px 0 0;color:#889;font-size:13px">Enviado desde el formulario de mainlogistics.cl</p>` +
        `</div>`,
    });

    if (error) {
      console.error("[cotizar] Resend devolvió error:", error);
      return NextResponse.json({ ok: false, motivo: "envio-fallido" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[cotizar] fallo inesperado:", e);
    return NextResponse.json({ ok: false, motivo: "envio-fallido" }, { status: 502 });
  }
}
