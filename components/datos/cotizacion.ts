import type { Mensajes } from "@/mensajes";

/**
 * Opciones del formulario de cotización.
 *
 * Estructura heredada del formulario de Logística Yireh — mismo grupo, mismos
 * servicios, mismo comprador — con el copy pasado al trato de usted que usa
 * el resto del sitio.
 *
 * Estos valores viajan al correo de cotización, así que los `valor` son
 * estables: si se renombra uno, las cotizaciones viejas dejan de coincidir.
 * La etiqueta se puede reescribir libremente; el valor no.
 *
 * ── Por qué las listas siguen en español ──────────────────────────────────
 *
 * Las constantes de acá abajo NO son el texto de pantalla: son el catálogo de
 * qué opciones existen, más su etiqueta en español. `app/api/cotizar/route.ts`
 * las usa para dos cosas que no dependen del idioma del visitante:
 *
 * 1. Validar que el `valor` recibido sea uno de los que el formulario ofrece.
 * 2. Escribir el correo que lee el equipo de Main Logistics, que trabaja en
 *    español. Un chino cotizando no cambia el idioma en que opera la empresa.
 *
 * Lo mismo vale para el texto de respaldo de WhatsApp en `Cotizar.tsx`.
 *
 * Para PANTALLA se usan las funciones del final, que toman la lista base y le
 * cambian la etiqueta por la del diccionario. El `valor` y el orden quedan
 * intactos, y sigue habiendo una sola definición de qué opciones existen: si
 * mañana se agrega una, se agrega acá y el diccionario reclama su texto.
 */

export type Opcion = {
  /** Viaja al correo. Es un identificador, no texto: no se traduce nunca. */
  valor: string;
  /** Dónde vive su texto en el diccionario. Ver `conEtiquetas`. */
  clave: string;
  /** Etiqueta en español, la que va al correo del equipo. */
  etiqueta: string;
  /** Línea de apoyo. Ayuda a decidir sin abrir una ayuda aparte. */
  detalle?: string;
};

/* ── Paso 1 · Carga y equipo ─────────────────────────────────────────── */

export const TIPOS_CARGA: Opcion[] = [
  { valor: "contenedor", clave: "contenedor", etiqueta: "Contenedor 20′ / 40′", detalle: "Carga en contenedor" },
  { valor: "suelta", clave: "suelta", etiqueta: "Carga suelta o paletizada", detalle: "General o pallets" },
  { valor: "granel", clave: "granel", etiqueta: "Graneles", detalle: "Áridos, silos, líquidos" },
  { valor: "sobredimension", clave: "sobredimension", etiqueta: "Sobredimensionada", detalle: "Excede medidas estándar" },
  { valor: "peligrosa", clave: "peligrosa", etiqueta: "Peligrosa o especializada", detalle: "Requiere manejo especial" },
  { valor: "otra", clave: "otra", etiqueta: "Otra", detalle: "Cuéntenos cuál" },
];

export const EQUIPOS: Opcion[] = [
  { valor: "camion_pequeno", clave: "camionPequeno", etiqueta: "Camión pequeño" },
  { valor: "rampla_plana", clave: "ramplaPlana", etiqueta: "Rampla plana" },
  { valor: "cama_baja", clave: "camaBaja", etiqueta: "Cama baja" },
  { valor: "batea", clave: "batea", etiqueta: "Batea" },
  { valor: "silo", clave: "silo", etiqueta: "Silo" },
  { valor: "contenedor", clave: "contenedor", etiqueta: "Equipo para contenedor" },
  { valor: "asesoria", clave: "asesoria", etiqueta: "No estoy seguro, necesito asesoría" },
];

/* ── Paso 3 · Fecha ──────────────────────────────────────────────────── */

export const FECHAS: Opcion[] = [
  { valor: "semana", clave: "semana", etiqueta: "Esta semana", detalle: "Próximos 3 días" },
  { valor: "especifica", clave: "especifica", etiqueta: "Fecha específica", detalle: "Yo elijo el día" },
  { valor: "flexible", clave: "flexible", etiqueta: "Flexible", detalle: "Coordinemos la fecha" },
];

/* ── Paso 4 · Modalidad ──────────────────────────────────────────────── */

export const MODALIDADES: Opcion[] = [
  { valor: "puntual", clave: "puntual", etiqueta: "Puntual", detalle: "Un solo traslado" },
  { valor: "recurrente", clave: "recurrente", etiqueta: "Recurrente", detalle: "Se repite en el tiempo" },
  { valor: "contrato", clave: "contrato", etiqueta: "Contrato", detalle: "Volumen sostenido" },
];

export const FRECUENCIAS: Opcion[] = [
  { valor: "semanal", clave: "semanal", etiqueta: "Semanal" },
  { valor: "quincenal", clave: "quincenal", etiqueta: "Quincenal" },
  { valor: "mensual", clave: "mensual", etiqueta: "Mensual" },
  { valor: "otra", clave: "otra", etiqueta: "Otra" },
];

export const DURACIONES: Opcion[] = [
  { valor: "3_meses", clave: "tresMeses", etiqueta: "3 meses" },
  { valor: "6_meses", clave: "seisMeses", etiqueta: "6 meses" },
  { valor: "12_meses", clave: "doceMeses", etiqueta: "12 meses" },
  { valor: "mas", clave: "masDeDoceMeses", etiqueta: "Más de 12 meses" },
];

/* ── Paso 5 · Requisitos y valor ─────────────────────────────────────── */

export const REQUISITOS: Opcion[] = [
  { valor: "acreditacion_minera", clave: "acreditacionMinera", etiqueta: "Acreditación minera" },
  { valor: "carga_peligrosa", clave: "cargaPeligrosa", etiqueta: "Carga peligrosa" },
  { valor: "escolta", clave: "escolta", etiqueta: "Escolta o seguridad" },
  { valor: "refrigeracion", clave: "refrigeracion", etiqueta: "Refrigeración" },
  { valor: "manipulacion_especial", clave: "manipulacionEspecial", etiqueta: "Manipulación especial" },
  { valor: "otro", clave: "otro", etiqueta: "Otro" },
];

/* El valor declarado define el tramo de seguro, por eso se pregunta en UF y
   no en pesos: es la unidad en que se cotiza una póliza de carga en Chile.
   La UF tampoco se traduce — es una unidad chilena, como el propio destino. */
export const VALORES: Opcion[] = [
  { valor: "hasta_1000", clave: "hasta1000", etiqueta: "Hasta 1.000 UF" },
  { valor: "1000_3000", clave: "de1000a3000", etiqueta: "1.000 – 3.000 UF" },
  { valor: "mas_3000", clave: "masDe3000", etiqueta: "Más de 3.000 UF" },
  { valor: "conversar", clave: "conversar", etiqueta: "Prefiero conversarlo" },
];

/* ── Paso 6 · Contacto ───────────────────────────────────────────────── */

export const CANALES: Opcion[] = [
  { valor: "whatsapp", clave: "whatsapp", etiqueta: "WhatsApp" },
  { valor: "email", clave: "correo", etiqueta: "Correo" },
  { valor: "llamada", clave: "llamada", etiqueta: "Llamada" },
];

/* ── Listas para pantalla ────────────────────────────────────────────── */

type TextoOpcion = { etiqueta: string; detalle?: string };

/**
 * Devuelve la lista con la etiqueta del diccionario. No toca `valor`, no toca
 * el orden, y si a una opción le faltara texto se queda con el español antes
 * que dejar el hueco en blanco: una opción sin nombre no se puede elegir.
 */
function conEtiquetas(base: Opcion[], textos: Record<string, TextoOpcion>): Opcion[] {
  return base.map((o) => ({ ...o, ...textos[o.clave] }));
}

export const tiposCarga = (m: Mensajes) => conEtiquetas(TIPOS_CARGA, m.cotizar.tiposCarga);
export const equipos = (m: Mensajes) => conEtiquetas(EQUIPOS, m.cotizar.equipos);
export const fechas = (m: Mensajes) => conEtiquetas(FECHAS, m.cotizar.fechas);
export const modalidades = (m: Mensajes) => conEtiquetas(MODALIDADES, m.cotizar.modalidades);
export const frecuencias = (m: Mensajes) => conEtiquetas(FRECUENCIAS, m.cotizar.frecuencias);
export const duraciones = (m: Mensajes) => conEtiquetas(DURACIONES, m.cotizar.duraciones);
export const requisitos = (m: Mensajes) => conEtiquetas(REQUISITOS, m.cotizar.requisitos);
// `valoresDeclarados` y no `valores`: en este archivo `valores` ya es el
// nombre del parámetro de `etiquetasDe`, y dos cosas distintas con el mismo
// nombre en el mismo archivo se leen mal.
export const valoresDeclarados = (m: Mensajes) => conEtiquetas(VALORES, m.cotizar.valores);
export const canales = (m: Mensajes) => conEtiquetas(CANALES, m.cotizar.canales);

/* ── Búsqueda de etiqueta ────────────────────────────────────────────── */

/**
 * Etiqueta legible de un valor. Se usa en el resumen y en el correo: al
 * operador que recibe la cotización no le sirve leer `cama_baja`.
 *
 * Qué idioma sale depende de qué lista se le pase: las constantes en
 * mayúsculas dan español (correo, WhatsApp), las funciones de arriba dan el
 * idioma en curso (pantalla).
 */
export function etiquetaDe(opciones: Opcion[], valor: string | undefined): string {
  if (!valor) return "";
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}

/** Igual que `etiquetaDe`, para campos de selección múltiple. */
export function etiquetasDe(opciones: Opcion[], valores: string[] = []): string {
  return valores.map((v) => etiquetaDe(opciones, v)).filter(Boolean).join(" · ");
}
