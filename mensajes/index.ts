import type { Idioma } from "./idiomas";
import type { Mensajes } from "./es";

export type { Mensajes } from "./es";
export * from "./idiomas";

/**
 * Carga el diccionario de un idioma.
 *
 * Importación dinámica para que cada página se lleve solo su idioma: con
 * cuatro diccionarios importados de forma estática, quien abre el sitio en
 * español descargaría también el inglés, el portugués y el chino.
 */
export async function cargar(idioma: Idioma): Promise<Mensajes> {
  switch (idioma) {
    case "en":
      return (await import("./en")).en;
    case "pt":
      return (await import("./pt")).pt;
    case "zh":
      return (await import("./zh")).zh;
    default:
      return (await import("./es")).es;
  }
}
