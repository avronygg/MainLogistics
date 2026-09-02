/**
 * Resolución Exenta SII N°154, de 5 de noviembre de 2025.
 *
 * "Fíjase exigencias sobre las facturas y guías de despacho que amparan el
 * traslado de bienes corporales muebles."
 *
 * Vigencia: 1 de noviembre de 2026. La original era el 1 de mayo de 2026 y
 * la postergó la Resolución Exenta SII N°52, de abril de 2026.
 *
 * ── De dónde salió cada cosa ─────────────────────────────────────────────
 *
 * Del PDF oficial, no del brief. El brief §8.1 resume bien la norma, pero
 * al leer el texto aparecieron tres exigencias que no estaban en el resumen
 * y que son justamente donde se falla:
 *
 *   1. La fecha Y LA HORA del documento deben ser las del inicio real del
 *      traslado, no las de la emisión contable (resolutivo 3 d).
 *   2. Si no se conocen las patentes, hay que declararlo EXPRESAMENTE en el
 *      documento. Dejar el campo vacío no es lo mismo (resolutivo 1 c).
 *   3. Un traslado que dura más de un día cabe en una sola guía solo si se
 *      declara en el detalle, con la fecha estimada de entrega. Sin eso, la
 *      guía vale únicamente el día de emisión (resolutivo 3 b).
 *
 * Fuentes:
 *   sii.cl/normativa_legislacion/resoluciones/2025/reso154.pdf
 *   sii.cl/normativa_legislacion/resoluciones/2026/reso52.pdf
 *
 * ── Lo que esta herramienta NO es ────────────────────────────────────────
 *
 * No es asesoría tributaria y el descargo va visible en la página, no en
 * letra chica. Orienta sobre si un documento trae los datos que la norma
 * exige. No valida contra el SII, no revisa el XML real y no reemplaza al
 * contador de nadie.
 */

export const VIGENCIA = "2026-11-01";
export const RESOLUCION = "Resolución Exenta SII N°154";
export const POSTERGACION = "Resolución Exenta SII N°52, de abril de 2026";

export const FUENTES = [
  {
    etiqueta: "Resolución Exenta SII N°154 (2025)",
    url: "https://www.sii.cl/normativa_legislacion/resoluciones/2025/reso154.pdf",
  },
  {
    etiqueta: "Resolución Exenta SII N°52 (2026), que posterga la vigencia",
    url: "https://www.sii.cl/normativa_legislacion/resoluciones/2026/reso52.pdf",
  },
];

/**
 * Los ocho valores del indicador de tipo de traslado, tal como los lista el
 * anexo de la resolución.
 *
 * El anexo los enumera fuera de orden (imprime el 8 antes que el 7). Acá van
 * ordenados por número, que es lo que se escribe en el DTE, y no se corrige
 * ni se completa nada: si la norma no define un valor, esta herramienta
 * tampoco se lo inventa.
 */
export const TIPOS_TRASLADO = [
  { valor: "1", etiqueta: "Operación constituye venta" },
  { valor: "2", etiqueta: "Ventas por efectuar" },
  { valor: "3", etiqueta: "Consignaciones" },
  { valor: "4", etiqueta: "Entrega gratuita" },
  { valor: "5", etiqueta: "Traslados internos" },
  { valor: "6", etiqueta: "Otros traslados no venta" },
  { valor: "7", etiqueta: "Venta para exportación" },
  { valor: "8", etiqueta: "Traslado para exportación (no venta)" },
] as const;

/* ── Validadores ──────────────────────────────────────────────────────── */

/** Dígito verificador por módulo 11, que es lo que hace válido a un RUT. */
function digitoVerificador(cuerpo: string) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

export type Resultado = { valido: boolean; motivo?: "formato" | "digito" };

/**
 * RUT chileno. Se comprueba el dígito verificador de verdad, no solo la
 * forma: un RUT bien escrito y falso pasa cualquier expresión regular, y es
 * el error que de verdad aparece en una guía mal llenada.
 */
export function validarRut(valor: string): Resultado {
  const limpio = valor.replace(/[.\s]/g, "").toUpperCase();
  const partes = /^(\d{7,8})-?([\dK])$/.exec(limpio);
  if (!partes) return { valido: false, motivo: "formato" };
  const [, cuerpo, dv] = partes;
  if (digitoVerificador(cuerpo) !== dv) return { valido: false, motivo: "digito" };
  return { valido: true };
}

/**
 * Patente chilena, en los dos formatos que circulan: el antiguo de dos
 * letras y cuatro números (AB1234) y el actual de cuatro letras y dos
 * números (BBCC12).
 *
 * Se valida la ESTRUCTURA y no el juego de letras. Las patentes nuevas usan
 * solo consonantes, pero rechazar por esa regla arriesga botar una patente
 * válida por una excepción que no conozco, y una herramienta que dice "no
 * cumple" sobre un dato correcto hace más daño que una que deja pasar.
 */
export function validarPatente(valor: string): Resultado {
  const limpio = valor.replace(/[-.\s·]/g, "").toUpperCase();
  const antigua = /^[A-Z]{2}\d{4}$/.test(limpio);
  const nueva = /^[A-Z]{4}\d{2}$/.test(limpio);
  return antigua || nueva ? { valido: true } : { valido: false, motivo: "formato" };
}

/* ── Los requisitos, uno por uno ──────────────────────────────────────── */

export type Requisito = {
  clave: string;
  /** Nombre corto del bloque, para el formulario y el resultado. */
  titulo: string;
  /** Lo que la norma exige, en una frase. */
  exige: string;
  /** Etiqueta del resolutivo, para citar la fuente en el resultado. */
  referencia: string;
  /** Tags del formato DTE que cubren este requisito. */
  tags: string[];
};

/**
 * Los diez requisitos, en español y sin traducir.
 *
 * Mismo criterio que en las páginas legales: es una norma chilena, sus
 * campos son etiquetas del formato DTE que se escriben igual en cualquier
 * idioma, y una traducción libre de un texto normativo termina diciendo
 * algo distinto de lo que dice la norma. Lo que sí se traduce es la
 * interfaz: botones, errores y el resultado. Eso vive en el diccionario.
 */
export const REQUISITOS = [
  {
    clave: "origen",
    titulo: "Origen efectivo",
    exige:
      "Dirección y comuna del lugar donde el traslado empieza de verdad, no la casa matriz.",
    referencia: "Resolutivo 1 a)",
    tags: ["DirOrigen", "CmnaOrigen"],
  },
  {
    clave: "destino",
    titulo: "Destino efectivo",
    exige: "Dirección y comuna donde la carga se entrega.",
    referencia: "Resolutivo 1 a)",
    tags: ["DirDest", "CmnaDest"],
  },
  {
    clave: "chofer",
    titulo: "Chofer",
    exige: "Nombre completo y cédula de identidad de quien conduce.",
    referencia: "Resolutivo 1 b)",
    tags: ["NombreChofer", "RUTChofer"],
  },
  {
    clave: "transportista",
    titulo: "Transportista",
    exige: "RUT de la empresa de transporte, que puede no ser la del chofer.",
    referencia: "Resolutivo 1 b)",
    tags: ["RUTTrans"],
  },
  {
    clave: "patentes",
    titulo: "Patentes",
    exige:
      "Patente del vehículo y del carro. Si no se conocen, hay que declararlo expresamente en el documento: dejar el campo en blanco no es lo mismo.",
    referencia: "Resolutivo 1 c)",
    tags: ["Patente", "PatenteCarro"],
  },
  {
    clave: "bienes",
    titulo: "Descripción de los bienes",
    exige:
      "Cantidad, peso o volumen, nombre y descripción, y precio unitario. En traslados que no son venta el precio puede omitirse, pero hay que consignar el motivo del traslado.",
    referencia: "Resolutivo 1 d)",
    tags: ["NmbItem", "QtyItem", "UnmdItem", "PrcItem"],
  },
  {
    clave: "tipoTraslado",
    titulo: "Tipo de traslado",
    exige: "Uno de los ocho valores del indicador, declarado en forma clara y precisa.",
    referencia: "Resolutivo 2",
    tags: ["IndTraslado"],
  },
  {
    clave: "unaPorVehiculo",
    titulo: "Una guía por traslado y por vehículo",
    exige:
      "No se puede amparar con la misma guía dos traslados en días distintos ni dos vehículos. Va una por cada jornada o etapa.",
    referencia: "Resolutivo 3 a)",
    tags: [],
  },
  {
    clave: "prolongado",
    titulo: "Traslado de más de un día",
    exige:
      "Cabe en una sola guía solo si en el detalle se declara que es un traslado prolongado y por qué, con la fecha estimada de entrega. Sin eso, la guía vale únicamente el día de emisión.",
    referencia: "Resolutivo 3 b)",
    tags: ["FchLlegada"],
  },
  {
    clave: "salida",
    titulo: "Fecha y hora de salida",
    exige:
      "Deben ser las del inicio real del traslado, no las de la emisión contable del documento.",
    referencia: "Resolutivo 3 d)",
    tags: ["FchSalida", "HraSalida"],
  },
] as const satisfies readonly Requisito[];

export type ClaveRequisito = (typeof REQUISITOS)[number]["clave"];
