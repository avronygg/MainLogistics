import { NextResponse } from "next/server";
import { CORREO } from "@/components/datos/contacto";
import { construirCorreo, type Bloque } from "../cotizar/correo";
import {
  EQUIPOS,
  LARGOS,
  LARGO_LINEA,
  MAX_LINEAS,
  MODALIDADES,
  OBLIGATORIOS,
  TIPOS_CARGA,
  correoValido,
  rutValido,
} from "@/components/datos/solicitud";

/**
 * Recibe la solicitud de cotización de /solicitud-de-cotizacion.
 *
 * Usa el MISMO Resend y el mismo remitente que /api/cotizar, y llega a la
 * misma casilla. No hay configuración nueva: si el formulario de cotización
 * envía, este también.
 *
 * Y el mismo contrato, que es lo que importa:
 *
 *   503  falta configuración — no se intentó enviar
 *   400  faltan campos o vienen mal
 *   502  se intentó y Resend falló
 *   200  SOLO cuando el correo salió
 *
 * Nunca responde 200 sin haber enviado. Una solicitud que se pierde en
 * silencio es peor que un error en pantalla: el cliente se queda esperando
 * una respuesta que nadie sabe que debe dar.
 *
 * El correo va siempre en español, sea cual sea el idioma en que se llenó:
 * lo lee el equipo comercial en Chile.
 */

/** Evita que un valor con saltos de línea inyecte encabezados o marcado. */
function limpiar(valor: unknown, max: number): string {
  if (typeof valor !== "string") return "";
  return valor.replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

/** Igual, pero conservando los saltos: las observaciones son un párrafo. */
function limpiarParrafo(valor: unknown, max: number): string {
  if (typeof valor !== "string") return "";
  return valor.replace(/\r/g, "").trim().slice(0, max);
}

const EN_LISTA: Record<string, readonly string[]> = {
  tipoCarga: TIPOS_CARGA,
  equipo: EQUIPOS,
  modalidad: MODALIDADES,
};

export async function POST(peticion: Request) {
  const clave = process.env.RESEND_API_KEY;
  const destino = CORREO;
  const remitente = process.env.COTIZA_REMITENTE;

  if (!clave || !destino || !remitente) {
    return NextResponse.json({ ok: false, motivo: "sin-configurar" }, { status: 503 });
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
  for (const [campo, max] of Object.entries(LARGOS)) {
    d[campo] = campo === "observaciones"
      ? limpiarParrafo(datos[campo], max)
      : limpiar(datos[campo], max);
  }

  /* Los campos de lista se descartan si el valor no está en su lista: un
     POST hecho a mano no puede meter texto arbitrario en el correo. */
  for (const [campo, lista] of Object.entries(EN_LISTA)) {
    if (d[campo] && !lista.includes(d[campo])) d[campo] = "";
  }

  const lineas = (Array.isArray(datos.lineas) ? datos.lineas : [])
    .slice(0, MAX_LINEAS)
    .map((l) => {
      const linea = l as Record<string, unknown>;
      const equipo = limpiar(linea.equipo, LARGO_LINEA.equipo);
      return {
        descripcion: limpiar(linea.descripcion, LARGO_LINEA.descripcion),
        equipo: EQUIPOS.includes(equipo as (typeof EQUIPOS)[number]) ? equipo : "",
        cantidad: limpiar(linea.cantidad, LARGO_LINEA.cantidad),
      };
    })
    .filter((l) => l.descripcion || l.equipo || l.cantidad);

  const faltan = Object.entries(OBLIGATORIOS)
    .filter(([campo]) => !d[campo])
    .map(([, etiqueta]) => etiqueta);

  if (d.correo && !correoValido(d.correo)) faltan.push("Correo con formato válido");
  if (d.rut && !rutValido(d.rut)) faltan.push("RUT con dígito verificador correcto");

  if (faltan.length) {
    return NextResponse.json({ ok: false, motivo: "faltan-campos", faltan }, { status: 400 });
  }

  /* El correo va por bloques, no como una lista de veinte filas: quien lo
     abre busca "quién", "qué mueve" y "por dónde", y una lista corrida lo
     obliga a reconstruir eso de memoria. El contacto no va acá: la
     plantilla lo pone arriba, con el teléfono y el correo pulsables. */
  const bloques: Bloque[] = [
    {
      titulo: "El cliente",
      filas: [
        { k: "Razón social", v: d.razonSocial },
        ...(d.rut ? [{ k: "RUT", v: d.rut }] : []),
        ...(d.cargo ? [{ k: "Cargo", v: d.cargo }] : []),
      ],
    },
    {
      titulo: "El servicio",
      filas: [
        { k: "Tipo de carga", v: d.tipoCarga },
        ...(d.equipo ? [{ k: "Equipo", v: d.equipo }] : []),
        ...(d.modalidad ? [{ k: "Modalidad", v: d.modalidad }] : []),
        ...(d.fechaEstimada ? [{ k: "Fecha estimada", v: d.fechaEstimada }] : []),
      ],
    },
    {
      titulo: "La ruta",
      filas: [
        { k: "Origen", v: d.origen },
        { k: "Destino", v: d.destino },
      ],
    },
  ];

  if (lineas.length) {
    bloques.push({
      titulo: "Detalle del servicio",
      filas: lineas.map((l, i) => ({
        k: `Línea ${i + 1}`,
        v: [l.descripcion, l.equipo, l.cantidad && `× ${l.cantidad}`]
          .filter(Boolean)
          .join(" · "),
      })),
    });
  }

  if (d.observaciones) {
    bloques.push({
      titulo: "Observaciones",
      filas: [{ k: "Del cliente", v: d.observaciones }],
    });
  }

  const { html, texto, asunto } = construirCorreo({
    empresa: d.razonSocial,
    carga: d.tipoCarga,
    origen: d.origen,
    destino: d.destino,
    nombre: d.contacto,
    correo: d.correo,
    telefono: d.telefono,
    bloques,
  });

  try {
    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        subject: asunto,
        html,
        text: texto,
        reply_to: d.correo,
      }),
    });

    if (!respuesta.ok) {
      return NextResponse.json({ ok: false, motivo: "envio-fallido" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, motivo: "envio-fallido" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
