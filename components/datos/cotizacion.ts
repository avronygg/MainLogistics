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
 */

export type Opcion = {
  valor: string;
  etiqueta: string;
  /** Línea de apoyo. Ayuda a decidir sin abrir una ayuda aparte. */
  detalle?: string;
};

/* ── Paso 1 · Carga y equipo ─────────────────────────────────────────── */

export const TIPOS_CARGA: Opcion[] = [
  { valor: "contenedor", etiqueta: "Contenedor 20′ / 40′", detalle: "Carga en contenedor" },
  { valor: "suelta", etiqueta: "Carga suelta o paletizada", detalle: "General o pallets" },
  { valor: "granel", etiqueta: "Graneles", detalle: "Áridos, silos, líquidos" },
  { valor: "sobredimension", etiqueta: "Sobredimensionada", detalle: "Excede medidas estándar" },
  { valor: "peligrosa", etiqueta: "Peligrosa o especializada", detalle: "Requiere manejo especial" },
  { valor: "otra", etiqueta: "Otra", detalle: "Cuéntenos cuál" },
];

export const EQUIPOS: Opcion[] = [
  { valor: "camion_pequeno", etiqueta: "Camión pequeño" },
  { valor: "rampla_plana", etiqueta: "Rampla plana" },
  { valor: "cama_baja", etiqueta: "Cama baja" },
  { valor: "batea", etiqueta: "Batea" },
  { valor: "silo", etiqueta: "Silo" },
  { valor: "contenedor", etiqueta: "Equipo para contenedor" },
  { valor: "asesoria", etiqueta: "No estoy seguro, necesito asesoría" },
];

/* ── Paso 3 · Fecha ──────────────────────────────────────────────────── */

export const FECHAS: Opcion[] = [
  { valor: "semana", etiqueta: "Esta semana", detalle: "Próximos 3 días" },
  { valor: "especifica", etiqueta: "Fecha específica", detalle: "Yo elijo el día" },
  { valor: "flexible", etiqueta: "Flexible", detalle: "Coordinemos la fecha" },
];

/* ── Paso 4 · Modalidad ──────────────────────────────────────────────── */

export const MODALIDADES: Opcion[] = [
  { valor: "puntual", etiqueta: "Puntual", detalle: "Un solo traslado" },
  { valor: "recurrente", etiqueta: "Recurrente", detalle: "Se repite en el tiempo" },
  { valor: "contrato", etiqueta: "Contrato", detalle: "Volumen sostenido" },
];

export const FRECUENCIAS: Opcion[] = [
  { valor: "semanal", etiqueta: "Semanal" },
  { valor: "quincenal", etiqueta: "Quincenal" },
  { valor: "mensual", etiqueta: "Mensual" },
  { valor: "otra", etiqueta: "Otra" },
];

export const DURACIONES: Opcion[] = [
  { valor: "3_meses", etiqueta: "3 meses" },
  { valor: "6_meses", etiqueta: "6 meses" },
  { valor: "12_meses", etiqueta: "12 meses" },
  { valor: "mas", etiqueta: "Más de 12 meses" },
];

/* ── Paso 5 · Requisitos y valor ─────────────────────────────────────── */

export const REQUISITOS: Opcion[] = [
  { valor: "acreditacion_minera", etiqueta: "Acreditación minera" },
  { valor: "carga_peligrosa", etiqueta: "Carga peligrosa" },
  { valor: "escolta", etiqueta: "Escolta o seguridad" },
  { valor: "refrigeracion", etiqueta: "Refrigeración" },
  { valor: "manipulacion_especial", etiqueta: "Manipulación especial" },
  { valor: "otro", etiqueta: "Otro" },
];

/* El valor declarado define el tramo de seguro, por eso se pregunta en UF y
   no en pesos: es la unidad en que se cotiza una póliza de carga en Chile. */
export const VALORES: Opcion[] = [
  { valor: "hasta_1000", etiqueta: "Hasta 1.000 UF" },
  { valor: "1000_3000", etiqueta: "1.000 – 3.000 UF" },
  { valor: "mas_3000", etiqueta: "Más de 3.000 UF" },
  { valor: "conversar", etiqueta: "Prefiero conversarlo" },
];

/* ── Paso 6 · Contacto ───────────────────────────────────────────────── */

export const CANALES: Opcion[] = [
  { valor: "whatsapp", etiqueta: "WhatsApp" },
  { valor: "email", etiqueta: "Correo" },
  { valor: "llamada", etiqueta: "Llamada" },
];

/* ── Búsqueda de etiqueta ────────────────────────────────────────────── */

/**
 * Etiqueta legible de un valor. Se usa en el resumen y en el correo: al
 * operador que recibe la cotización no le sirve leer `cama_baja`.
 */
export function etiquetaDe(opciones: Opcion[], valor: string | undefined): string {
  if (!valor) return "";
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}

/** Igual que `etiquetaDe`, para campos de selección múltiple. */
export function etiquetasDe(opciones: Opcion[], valores: string[] = []): string {
  return valores.map((v) => etiquetaDe(opciones, v)).filter(Boolean).join(" · ");
}
