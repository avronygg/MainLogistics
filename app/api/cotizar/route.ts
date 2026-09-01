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
import { construirCorreo, type Bloque } from "./correo";

/**
 * Recepción de solicitudes de cotización.
 *
 * Esta ruta hace tres cosas y ninguna más: valida, arma los datos y despacha
 * por Resend. La composición del correo vive en `./correo.ts` — son dos
 * trabajos distintos, y mezclarlos hacía que un cambio de diseño obligara a
 * releer la lógica de seguridad.
 *
 * Es deliberadamente el paso mínimo: cuando exista CRM, este archivo es el
 * único punto que cambia — el formulario no se entera.
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
 * El correo va SIEMPRE en español, sea cual sea el idioma en que se cotizó:
 * lo lee el equipo de Main Logistics. Un chino cotizando no cambia el idioma
 * en que opera la empresa.
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

export async function POST(peticion: Request) {
  const clave = process.env.RESEND_API_KEY;
  const destino = process.env.COTIZA_DESTINO;
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
    return NextResponse.json({ ok: false, motivo: "faltan-campos", faltan }, { status: 400 });
  }

  const carga = etiquetaDe(TIPOS_CARGA, d.tipoCarga);
  const origen = [d.origenComuna, d.origenRegion].filter(Boolean).join(", ");
  const destinoRuta = [d.destinoComuna, d.destinoRegion].filter(Boolean).join(", ");

  const modalidadTexto = [
    etiquetaDe(MODALIDADES, d.modalidad),
    // Sin "cada": las etiquetas de frecuencia son adjetivos ("Semanal"), no
    // períodos ("semana"), así que salía "cada semanal". La duración sí es un
    // período y por eso "por 6 meses" sí funciona.
    d.modalidad === "recurrente" && d.frecuencia
      ? etiquetaDe(FRECUENCIAS, d.frecuencia)
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

  const fechaEspecifica = d.fecha === "especifica" && Boolean(d.fechaDia);

  /* El correo va agrupado por bloque, no como una tabla plana de veinte
     filas: quien cotiza lee "la carga", "la ruta", "el contacto", y una
     lista corrida lo obliga a reconstruir eso de memoria.

     El contacto NO está acá: la plantilla lo pone arriba, en un bloque
     propio con el teléfono y el correo pulsables. */
  const bloques: Bloque[] = [
    {
      titulo: "La carga",
      filas: [
        {
          k: "Tipo de carga",
          v:
            d.tipoCarga === "otra" && d.tipoCargaOtra
              ? `${carga} — ${d.tipoCargaOtra}`
              : carga,
        },
        { k: "Equipo requerido", v: etiquetaDe(EQUIPOS, d.equipo) },
      ],
    },
    {
      titulo: "La ruta",
      filas: [
        { k: "Origen", v: origen + (d.origenDireccion ? ` — ${d.origenDireccion}` : "") },
        {
          k: "Destino",
          v: destinoRuta + (d.destinoDireccion ? ` — ${d.destinoDireccion}` : ""),
        },
      ],
    },
    {
      titulo: "Cuándo y cómo",
      filas: [
        {
          k: "Fecha",
          v: fechaEspecifica
            ? `${etiquetaDe(FECHAS, d.fecha)} — ${d.fechaDia}`
            : etiquetaDe(FECHAS, d.fecha),
          // Una fecha concreta es dato auditable y va en mono, igual que en
          // el sitio. "Esta semana" es una preferencia, no un dato.
          dato: fechaEspecifica,
        },
        { k: "Modalidad", v: modalidadTexto },
      ],
    },
    {
      titulo: "Requisitos y valor",
      filas: [
        { k: "Exigencias especiales", v: requisitosTexto || "Ninguna indicada" },
        { k: "Valor declarado", v: etiquetaDe(VALORES, d.valor), dato: true },
      ],
    },
  ];

  const { html, texto, asunto } = construirCorreo({
    empresa: d.empresa,
    carga,
    origen,
    destino: destinoRuta,
    nombre: d.nombre,
    correo: d.correo,
    telefono: d.telefono,
    canal: etiquetaDe(CANALES, d.canal),
    bloques,
  });

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      subject: asunto,
      // `replyTo` deja responder directo al cliente desde la bandeja.
      replyTo: d.correo.includes("@") ? d.correo : undefined,
      text: texto,
      html,
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
