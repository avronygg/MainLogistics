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
  cantidadValida,
  correoValido,
  fechaValida,
  formatearRut,
  rutValido,
  telefonoValido,
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

/**
 * El cotizador interno, donde el ejecutivo le pone precio a esto.
 *
 * Vive en su propio despliegue, aparte del sitio: es una herramienta con
 * valores y no tiene por qué estar en una URL pública de logisticatrade.cl.
 */
const COTIZADOR =
  process.env.COTIZADOR_URL ?? "https://cotizador-logistica-trade.vercel.app";

/**
 * Arma el enlace que abre el cotizador con esta solicitud ya cargada.
 *
 * Los datos viajan EN LA URL, codificados, y no en una base de datos. No es
 * pereza: sin almacenamiento no hay nada que administrar, nada que expire y
 * nada que respaldar, y el enlace sigue funcionando el día que alguien lo
 * reenvíe desde su bandeja. Lo que viaja es lo que el cliente ya escribió y
 * ya está en el cuerpo del correo, así que el enlace no revela nada nuevo.
 *
 * Las claves son las del cotizador —`desc`, `cant`, `items`— para que
 * entren sin traducción. `observaciones` cae en `requisitos`, que es su
 * equivalente allá.
 */
function enlaceCotizador(
  d: Record<string, string>,
  lineas: { descripcion: string; equipo: string; cantidad: string }[],
) {
  const carga = {
    razonSocial: d.razonSocial,
    rut: d.rut,
    contacto: d.contacto,
    cargo: d.cargo,
    correo: d.correo,
    telefono: d.telefono,
    tipoCarga: d.tipoCarga,
    equipo: d.equipo,
    modalidad: d.modalidad,
    fechaEstimada: d.fechaEstimada,
    origen: d.origen,
    destino: d.destino,
    requisitos: d.observaciones,
    /* Sin `unit`: el precio es justamente lo que falta por poner, y
       mandarlo vacío desde acá deja claro que nadie lo decidió todavía. */
    items: lineas.map((l) => ({
      desc: l.descripcion,
      equipo: l.equipo,
      cant: l.cantidad,
      unit: "",
      incl: false,
    })),
  };

  const codificado = Buffer.from(JSON.stringify(carga), "utf8").toString("base64url");
  return `${COTIZADOR}/?d=${codificado}`;
}

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

  const extranjero = datos.extranjero === true;

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
    .filter(([campo]) => !d[campo] && !(campo === "rut" && extranjero))
    .map(([, etiqueta]) => etiqueta);

  if (d.correo && !correoValido(d.correo)) faltan.push("Correo con formato válido");
  if (!extranjero && d.rut && !rutValido(d.rut)) faltan.push("RUT con dígito verificador correcto");
  if (d.telefono && !telefonoValido(d.telefono)) faltan.push("Teléfono con al menos 8 dígitos");
  if (d.fechaEstimada && !fechaValida(d.fechaEstimada)) faltan.push("Fecha estimada válida");
  if (!lineas.some((l) => l.descripcion && cantidadValida(l.cantidad))) {
    faltan.push("Detalle del servicio: descripción y cantidad");
  }

  if (faltan.length) {
    return NextResponse.json({ ok: false, motivo: "faltan-campos", faltan }, { status: 400 });
  }

  /* Un solo formato en el correo y en el cotizador, escriban como escriban. */
  if (!extranjero) d.rut = formatearRut(d.rut);

  /* El correo va por bloques, no como una lista de veinte filas: quien lo
     abre busca "quién", "qué mueve" y "por dónde", y una lista corrida lo
     obliga a reconstruir eso de memoria. El contacto no va acá: la
     plantilla lo pone arriba, con el teléfono y el correo pulsables. */
  const bloques: Bloque[] = [
    {
      titulo: "El cliente",
      filas: [
        { k: "Razón social", v: d.razonSocial },
        ...(extranjero
          ? [{ k: "Identificación tributaria (cliente extranjero)", v: d.rut || "No indicó" }]
          : d.rut
            ? [{ k: "RUT", v: d.rut }]
            : []),
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
    accion: {
      titulo: "¿Le ponemos precio?",
      texto:
        "Abre el cotizador con estos datos y estos servicios ya cargados. Solo falta escribir los valores y emitir.",
      etiqueta: "Armar la cotización con precios",
      url: enlaceCotizador(d, lineas),
    },
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
