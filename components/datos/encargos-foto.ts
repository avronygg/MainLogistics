/**
 * Encargos de foto pendientes. Notas internas para el equipo.
 *
 * ── Por qué NO viven en el diccionario de idiomas ──────────────────────
 *
 * Estaban ahí, y eso tenía dos problemas:
 *
 * 1. **Se publicaban.** El diccionario entero se serializa en el payload que
 *    el servidor manda al navegador, porque baja como prop a componentes de
 *    cliente. Aunque el texto dejara de verse en pantalla, seguía viajando
 *    en el código fuente de la página. El brief de desarrollo (§1.3) es
 *    explícito: nunca publicar el brief de producción.
 * 2. **Se traducían.** Cuatro idiomas de instrucciones para un fotógrafo
 *    chileno. Trabajo inútil y ruido en el archivo que sí importa.
 *
 * Acá viven en español, que es el idioma del equipo, y solo se renderizan
 * con `npm run dev` — ver `MarcoImagen`. En el build de producción no se
 * renderizan, así que nunca llegan al navegador.
 *
 * Cuando una foto llegue: se reemplaza el `<MarcoImagen>` por un `<Image>`
 * con la misma clase de contenedor y se borra su entrada de acá.
 */

export const ENCARGOS = {
  cargas:
    "Plano abierto de la rampla cargada con mezcla de carga: pallets, un contenedor y maquinaria en el mismo patio. Es la foto que prueba la versatilidad.",
  mineria:
    "Camión de Main entrando a faena minera: portería, polvo, chaleco reflectante y el equipo homologado a la vista.",
  peligrosa:
    "Detalle del rótulo de sustancia peligrosa en la rampla, con la hoja de seguridad en primer plano.",
  refrigerada:
    "Interior de un furgón refrigerado con el registrador de temperatura en pantalla y la carga estibada.",
  forestal:
    "Rollizos amarrados sobre la rampla en camino de tierra, con la eslinga tensada en primer plano.",
  contenedores:
    "Contenedor saliendo del terminal portuario con el sello visible en la puerta.",
} as const;

export type ClaveEncargo = keyof typeof ENCARGOS;

/** Rótulo del marco. Interno, igual que los encargos: no se traduce. */
export const ROTULO_ENCARGO = "Foto pendiente";
