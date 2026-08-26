import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  TIPOS_CARGA,
  EQUIPOS,
  FECHAS,
  MODALIDADES,
  FRECUENCIAS,
  DURACIONES,
  REQUISITOS,
  VALORES,
  CANALES,
  etiquetaDe,
  etiquetasDe,
} from "@/components/datos/cotizacion";

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
 *
 * El formulario manda códigos (`cama_baja`), no etiquetas. La traducción a
 * texto legible ocurre acá, contra el mismo módulo que usa el formulario:
 * si el correo dijera `cama_baja`, quien cotiza tendría que traducir a mano.
 */

export const runtime = "nodejs";

/* Largos máximos. Solo aplican a lo que escribe la persona; los campos de
   opción se validan contra su lista, que ya acota el valor. */
const LIMITES = {
  tipoCargaOtra: 120,
  origenDireccion: 160,
  destinoDireccion: 160,
  requisitoOtro: 120,
  fechaDia: 24,
  empresa: 100,
  nombre: 80,
  correo: 120,
  telefono: 40,
} as const;

/** Campos de opción: se aceptan solo si el valor está en su lista. */
const OPCIONES = {
  tipoCarga: TIPOS_CARGA,
  equipo: EQUIPOS,
  fecha: FECHAS,
  modalidad: MODALIDADES,
  frecuencia: FRECUENCIAS,
  duracion: DURACIONES,
  valor: VALORES,
  canal: CANALES,
} as const;

/** Sin lista cerrada: son nombres de la división político-administrativa. */
const GEO = ["origenRegion", "origenComuna", "destinoRegion", "destinoComuna"] as const;

/** Lo que no puede faltar. El resto es opcional por diseño. */
const OBLIGATORIOS: Record<string, string> = {
  tipoCarga: "Tipo de carga",
  equipo: "Equipo requerido",
  origenRegion: "Región de origen",
  origenComuna: "Comuna de origen",
  destinoRegion: "Región de destino",
  destinoComuna: "Comuna de destino",
  fecha: "Fecha del servicio",
  modalidad: "Modalidad",
  valor: "Valor declarado",
  empresa: "Empresa",
  nombre: "Nombre de contacto",
  correo: "Correo",
  telefono: "Teléfono",
  canal: "Canal preferido",
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

type Fila = [string, string];

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

  const d: Record<string, string> = {};

  // Campos de opción: se descarta cualquier valor fuera de la lista, así un
  // POST hecho a mano no puede meter texto arbitrario en el correo.
  for (const [campo, lista] of Object.entries(OPCIONES)) {
    const bruto = limpiar(datos[campo], 40);
    d[campo] = lista.some((o) => o.valor === bruto) ? bruto : "";
  }

  for (const campo of GEO) d[campo] = limpiar(datos[campo], 80);
  for (const [campo, max] of Object.entries(LIMITES)) d[campo] = limpiar(datos[campo], max);

  // Requisitos es selección múltiple: se filtra contra su propia lista.
  const requisitos = Array.isArray(datos.requisitos)
    ? (datos.requisitos as unknown[])
        .map((r) => limpiar(r, 40))
        .filter((r) => REQUISITOS.some((o) => o.valor === r))
        .slice(0, REQUISITOS.length)
    : [];

  const faltan = Object.entries(OBLIGATORIOS)
    .filter(([campo]) => !d[campo])
    .map(([, etiqueta]) => etiqueta);

  if (faltan.length) {
    return NextResponse.json(
      { ok: false, motivo: "faltan-campos", faltan },
      { status: 400 },
    );
  }

  /* El correo va agrupado por bloque, no como una tabla plana de veinte
     filas: quien cotiza lee "la carga", "la ruta", "el contacto", y una
     lista corrida lo obliga a reconstruir eso de memoria. */
  const carga = etiquetaDe(TIPOS_CARGA, d.tipoCarga);
  const origen = [d.origenComuna, d.origenRegion].filter(Boolean).join(", ");
  const destinoRuta = [d.destinoComuna, d.destinoRegion].filter(Boolean).join(", ");

  const modalidadTexto = [
    etiquetaDe(MODALIDADES, d.modalidad),
    d.modalidad === "recurrente" && d.frecuencia
      ? `cada ${etiquetaDe(FRECUENCIAS, d.frecuencia).toLowerCase()}`
      : "",
    d.modalidad === "contrato" && d.duracion
      ? `por ${etiquetaDe(DURACIONES, d.duracion).toLowerCase()}`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const requisitosTexto = [
    etiquetasDe(REQUISITOS, requisitos),
    requisitos.includes("otro") && d.requisitoOtro ? `(${d.requisitoOtro})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const bloques: Array<[string, Fila[]]> = [
    [
      "La carga",
      [
        ["Tipo de carga", d.tipoCarga === "otra" && d.tipoCargaOtra ? `${carga} — ${d.tipoCargaOtra}` : carga],
        ["Equipo requerido", etiquetaDe(EQUIPOS, d.equipo)],
      ],
    ],
    [
      "La ruta",
      [
        ["Origen", origen + (d.origenDireccion ? ` — ${d.origenDireccion}` : "")],
        ["Destino", destinoRuta + (d.destinoDireccion ? ` — ${d.destinoDireccion}` : "")],
      ],
    ],
    [
      "Cuándo y cómo",
      [
        [
          "Fecha",
          d.fecha === "especifica" && d.fechaDia
            ? `${etiquetaDe(FECHAS, d.fecha)} — ${d.fechaDia}`
            : etiquetaDe(FECHAS, d.fecha),
        ],
        ["Modalidad", modalidadTexto],
      ],
    ],
    [
      "Requisitos",
      [
        ["Requisitos", requisitosTexto || "Ninguno indicado"],
        ["Valor declarado", etiquetaDe(VALORES, d.valor)],
      ],
    ],
    [
      "Contacto",
      [
        ["Empresa", d.empresa],
        ["Nombre", d.nombre],
        ["Correo", d.correo],
        ["Teléfono", d.telefono],
        ["Prefiere", etiquetaDe(CANALES, d.canal)],
      ],
    ],
  ];

  const html = bloques
    .map(
      ([titulo, filas]) =>
        `<h3 style="margin:22px 0 8px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8b5cf6">${escapar(titulo)}</h3>` +
        `<table style="border-collapse:collapse;width:100%">` +
        filas
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 16px 6px 0;color:#667;white-space:nowrap;vertical-align:top">${escapar(k)}</td>` +
              `<td style="padding:6px 0;color:#111;font-weight:600">${escapar(v || "—")}</td></tr>`,
          )
          .join("") +
        `</table>`,
    )
    .join("");

  const texto = bloques
    .map(
      ([titulo, filas]) =>
        `${titulo.toUpperCase()}\n` +
        filas.map(([k, v]) => `  ${k}: ${v || "—"}`).join("\n"),
    )
    .join("\n\n");

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      subject: `Cotización ${d.empresa} — ${d.origenComuna} → ${d.destinoComuna} · ${carga}`,
      // `replyTo` deja responder directo al cliente desde la bandeja.
      replyTo: d.correo.includes("@") ? d.correo : undefined,
      text: texto,
      html:
        `<div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.5;max-width:560px">` +
        `<h2 style="margin:0;font-size:17px">Nueva solicitud de cotización</h2>` +
        html +
        `<p style="margin:24px 0 0;color:#889;font-size:13px">Enviado desde el formulario de mainlogistics.cl</p>` +
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
