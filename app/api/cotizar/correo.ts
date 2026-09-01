/**
 * Plantilla del correo de cotización.
 *
 * Vive aparte de la ruta porque son dos trabajos distintos: la ruta valida y
 * despacha, esto compone. Mezclarlos hacía que un cambio de diseño obligara a
 * releer la lógica de seguridad.
 *
 * ── El correo HTML no es una página web ────────────────────────────────
 *
 * Las restricciones son de 2005 y no hay forma de esquivarlas:
 *
 * - **Tablas para maquetar.** Outlook usa el motor de Word: no hay flexbox
 *   ni grid, y `div` con `float` se rompe. Se maqueta con `table`.
 * - **Estilos en línea.** Gmail descarta el `<head>`, así que una hoja de
 *   estilos o un `<style>` se pierden. Cada celda lleva su `style`.
 * - **Sin imágenes.** La mayoría de los clientes las bloquea por defecto, así
 *   que un logo en PNG llega como un recuadro roto. El nombre va en texto.
 * - **Sin fuentes web.** Pila del sistema. La mono también.
 * - **600px de ancho máximo.** Es el ancho del panel de lectura de Outlook.
 * - **Colores explícitos en cada celda**, incluido el fondo. Sin eso, el modo
 *   oscuro de algunos clientes invierte lo que quiere y deja texto gris sobre
 *   gris.
 *
 * ── Qué se ve primero ──────────────────────────────────────────────────
 *
 * Quien abre esto está en una bandeja con veinte correos y necesita decidir
 * en dos segundos si lo atiende ahora. Por eso arriba de todo va la RUTA y el
 * TIPO DE CARGA, que es lo que identifica la operación, y el contacto va en
 * un bloque aparte con teléfono y correo pulsables: contestar no puede
 * requerir copiar y pegar.
 */

export type Fila = {
  k: string;
  v: string;
  /** Dato auditable — fecha, monto, duración. Va en mono. */
  dato?: boolean;
};

export type Bloque = { titulo: string; filas: Fila[] };

const TINTA = "#111827";
const TINTA_SUAVE = "#6b7280";
const BORDE = "#e5e7eb";
const FONDO = "#f3f4f6";
const MORADO = "#4916b4";
const MORADO_SUAVE = "#f3eeff";
const OSCURO = "#0e1519";

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

function escapar(t: string) {
  return t.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Fecha y hora de Chile. Es cuándo entró la solicitud, no cuándo se lee. */
function selloDeTiempo(): string {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date());
}

function filaHtml({ k, v, dato }: Fila): string {
  const valor = dato
    ? `<span style="font-family:${MONO};font-size:14px;letter-spacing:-0.01em">${escapar(v)}</span>`
    : escapar(v);
  return (
    `<tr>` +
    `<td width="164" style="width:164px;padding:9px 16px 9px 0;font-size:13px;line-height:1.4;color:${TINTA_SUAVE};vertical-align:top;border-top:1px solid ${BORDE}">${escapar(k)}</td>` +
    `<td style="padding:9px 0;font-size:14px;line-height:1.45;color:${TINTA};font-weight:600;vertical-align:top;border-top:1px solid ${BORDE}">${valor}</td>` +
    `</tr>`
  );
}

function bloqueHtml({ titulo, filas }: Bloque): string {
  return (
    `<tr><td style="padding:26px 28px 0">` +
    `<div style="font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${MORADO};padding-bottom:2px">${escapar(titulo)}</div>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;font-family:${SANS}">` +
    filas.map(filaHtml).join("") +
    `</table>` +
    `</td></tr>`
  );
}

export function construirCorreo(datos: {
  empresa: string;
  carga: string;
  origen: string;
  destino: string;
  nombre: string;
  correo: string;
  telefono: string;
  canal: string;
  bloques: Bloque[];
}) {
  const { empresa, carga, origen, destino, nombre, correo, telefono, canal, bloques } =
    datos;

  /* Teléfono para `tel:`: sin espacios ni signos, o el enlace no marca. */
  const telLimpio = telefono.replace(/[^\d+]/g, "");

  const cabecera =
    `<tr><td style="background:${OSCURO};padding:20px 28px">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">` +
    `<tr>` +
    `<td style="font-family:${SANS};font-size:13px;font-weight:700;letter-spacing:0.16em;color:#ffffff">MAIN LOGISTICS</td>` +
    `<td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:0.06em;color:#9ca3af">${escapar(selloDeTiempo())}</td>` +
    `</tr></table></td></tr>`;

  /* La cabecera de identificación: lo que se lee en dos segundos. La ruta va
     en mono porque es el dato que se compara contra una planilla. */
  const identificacion =
    `<tr><td style="padding:28px 28px 4px;font-family:${SANS}">` +
    `<div style="font-size:12px;color:${TINTA_SUAVE};padding-bottom:6px">Nueva solicitud de cotización</div>` +
    `<div style="font-size:21px;line-height:1.25;font-weight:700;color:${TINTA};letter-spacing:-0.02em">${escapar(empresa)}</div>` +
    `<div style="font-family:${MONO};font-size:14px;line-height:1.5;color:${MORADO};padding-top:8px">${escapar(origen)} &rarr; ${escapar(destino)}</div>` +
    `<div style="font-size:14px;line-height:1.5;color:${TINTA_SUAVE};padding-top:2px">${escapar(carga)}</div>` +
    `</td></tr>`;

  /* Contestar no puede requerir copiar y pegar: los dos enlaces son
     pulsables y el canal preferido está a la vista. */
  const acciones =
    `<tr><td style="padding:24px 28px 0">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${MORADO_SUAVE};border-radius:10px">` +
    `<tr><td style="padding:16px 18px;font-family:${SANS}">` +
    `<div style="font-size:11px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:${MORADO};padding-bottom:8px">Responder a ${escapar(nombre)}</div>` +
    `<div style="font-size:15px;line-height:1.7">` +
    `<a href="tel:${escapar(telLimpio)}" style="color:${TINTA};font-weight:700;text-decoration:none">${escapar(telefono)}</a>` +
    `<span style="color:${TINTA_SUAVE}"> &middot; </span>` +
    `<a href="mailto:${escapar(correo)}" style="color:${TINTA};font-weight:700;text-decoration:none">${escapar(correo)}</a>` +
    `</div>` +
    `<div style="font-size:12.5px;color:${TINTA_SUAVE};padding-top:4px">Canal preferido: ${escapar(canal)}</div>` +
    `</td></tr></table></td></tr>`;

  const pie =
    `<tr><td style="padding:26px 28px 28px">` +
    `<div style="border-top:1px solid ${BORDE};padding-top:14px;font-family:${SANS};font-size:11.5px;line-height:1.5;color:${TINTA_SUAVE}">` +
    `Enviado desde el formulario de mainlogistics.cl. ` +
    `Al responder este correo le llega directo a quien cotizó.` +
    `</div></td></tr>`;

  const html =
    `<!doctype html><html lang="es"><head>` +
    `<meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    // Sin esto, el modo oscuro de Outlook y Apple Mail invierte los colores
    // por su cuenta y deja el morado ilegible sobre el lavanda.
    `<meta name="color-scheme" content="light">` +
    `<meta name="supported-color-schemes" content="light">` +
    `<title>Nueva solicitud de cotización</title>` +
    `</head>` +
    `<body style="margin:0;padding:0;background:${FONDO};-webkit-font-smoothing:antialiased">` +
    // Preencabezado: la línea que la bandeja muestra junto al asunto. Se
    // oculta en el cuerpo; sin ella, el cliente muestra el primer texto que
    // encuentre, que sería "MAIN LOGISTICS" repetido.
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(`${carga} · ${origen} → ${destino}`)}</div>` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${FONDO}">` +
    `<tr><td align="center" style="padding:24px 12px">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${BORDE};border-radius:12px;overflow:hidden">` +
    cabecera +
    identificacion +
    acciones +
    bloques.map(bloqueHtml).join("") +
    pie +
    `</table></td></tr></table></body></html>`;

  /* La versión de texto no es un descarte: es lo que se ve al reenviar por
     WhatsApp, y lo que leen los clientes que bloquean HTML. */
  const texto = [
    `NUEVA SOLICITUD DE COTIZACIÓN`,
    selloDeTiempo(),
    ``,
    empresa,
    `${origen} → ${destino}`,
    carga,
    ``,
    `RESPONDER A ${nombre.toUpperCase()}`,
    `  ${telefono}  ·  ${correo}`,
    `  Canal preferido: ${canal}`,
    ``,
    ...bloques.flatMap(({ titulo, filas }) => [
      titulo.toUpperCase(),
      ...filas.map(({ k, v }) => `  ${k}: ${v}`),
      ``,
    ]),
    `Enviado desde el formulario de mainlogistics.cl`,
  ].join("\n");

  /* El asunto solo con comuna, sin región, y sin el tipo de carga: Gmail
     corta cerca de los 70 caracteres en escritorio y de los 35 en el
     teléfono. "Cotización · Minera Los Pelambres · San Antonio, Valparaíso →
     Calama, Antofagasta · Sobredimensionada" son 98 y lo último no se ve
     nunca. El tipo de carga ya viaja en el preencabezado, que es la línea
     gris que la bandeja muestra al lado del asunto. */
  const comuna = (lugar: string) => lugar.split(",")[0].trim();
  const asunto = `Cotización · ${empresa} · ${comuna(origen)} → ${comuna(destino)}`;

  return { html, texto, asunto };
}
