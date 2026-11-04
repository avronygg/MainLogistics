/**
 * Datos de /presentacion que no son texto traducible: los capítulos, a dónde
 * lleva cada servicio, las normas y las coordenadas.
 *
 * Los `id` de capítulo son anclas públicas: `/es/presentacion#cobertura` es
 * lo que viaja por WhatsApp al compartir. No se traducen ni se renombran,
 * igual que los fragmentos del resto del sitio.
 */

export const CAPITULOS = [
  "portada",
  "servicios",
  "cumplimiento",
  "monitoreo",
  "cobertura",
  "seguridad",
  "proceso",
  "equipo",
  "clientes",
  "cierre",
] as const;

export type Capitulo = (typeof CAPITULOS)[number];

/** Copia comprimida de la presentación que entregó el cliente. Solo español. */
export const PDF_PRESENTACION = "/presentacion/logistica-trade.pdf";

/**
 * Cada servicio lleva a lo más específico que existe: su página si la tiene,
 * o el cotizador con el tipo de carga ya elegido (`?carga=` es un parámetro
 * que `components/Cotizar.tsx` ya entiende y valida contra `TIPOS_CARGA`).
 */
export const SERVICIOS = [
  { clave: "contenedores", ruta: "/transporte-de-carga/contenedores" },
  { clave: "camaBaja", ruta: "/cotizar?carga=sobredimension" },
  { clave: "ramplas", ruta: "/transporte-de-carga/carga-general" },
  { clave: "pequenos", ruta: "/cotizar?carga=suelta" },
  { clave: "bateas", ruta: "/cotizar?carga=granel" },
  { clave: "silos", ruta: "/cotizar?carga=granel" },
  { clave: "bess", ruta: "/transporte-de-carga/bess-y-energia" },
  { clave: "desconsolidado", ruta: "/cotizar?carga=contenedor" },
] as const;

/**
 * Las normas son siglas auditables y no se traducen. Las cargas sin un tipo
 * equivalente en el cotizador (minera, refrigerada, forestal) abren el
 * cotizador sin preseleccionar: elegir "otra" por ellas sería peor que dejar
 * que la persona decida.
 */
export const FILAS_CUMPLIMIENTO = [
  { clave: "general", normas: [], ruta: "/cotizar?carga=suelta" },
  { clave: "minera", normas: ["SICEP"], ruta: "/cotizar" },
  { clave: "peligrosa", normas: ["DS 298", "ASIQUIM"], ruta: "/cotizar?carga=peligrosa" },
  { clave: "refrigerada", normas: ["SAG"], ruta: "/cotizar" },
  { clave: "forestal", normas: ["CORMA"], ruta: "/cotizar" },
  { clave: "contenedores", normas: [], ruta: "/cotizar?carga=contenedor" },
  { clave: "dimensionada", normas: [], ruta: "/cotizar?carga=dimensionada" },
  { clave: "sobredimensionada", normas: [], ruta: "/cotizar?carga=sobredimension" },
] as const;

/**
 * Las ciudades van por su latitud real, igual que en `components/RutaChile`:
 * el salto enorme entre Puerto Montt y Punta Arenas es así el país, y es lo
 * que hace que el gráfico diga algo.
 */
export const CIUDADES = [
  { nombre: "Arica", lat: -18.48, coord: "18°28′ S" },
  { nombre: "Antofagasta", lat: -23.65, coord: "23°39′ S" },
  { nombre: "La Serena", lat: -29.9, coord: "29°54′ S" },
  { nombre: "Santiago", lat: -33.45, coord: "33°27′ S" },
  { nombre: "Concepción", lat: -36.83, coord: "36°50′ S" },
  { nombre: "Puerto Montt", lat: -41.47, coord: "41°28′ S" },
  { nombre: "Punta Arenas", lat: -53.16, coord: "53°10′ S" },
] as const;

/** Las tres citas de la presentación. El texto vive en `resenas.testimonios`. */
export const TESTIMONIOS = ["importacion", "quimicos", "congelados"] as const;
