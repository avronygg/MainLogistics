/**
 * Diccionario en español. Es la fuente de verdad.
 *
 * De acá sale el tipo `Mensajes`, así que si a `en`, `pt` o `zh` les falta
 * una clave, TypeScript no compila. No hay forma de publicar una traducción
 * a medias sin enterarse.
 *
 * Reglas de escritura para quien traduzca:
 *
 * - **Se habla de usted.** El comprador es un jefe de operaciones, no un
 *   consumidor final. En inglés no hay distinción, pero el registro sí: ni
 *   coloquial ni publicitario.
 * - **Prohibido el lenguaje startup** — "revolucionamos", "disrupción",
 *   "partner estratégico" — y los superlativos vacíos: "líderes", "los
 *   mejores", "excelencia". Vale para los cuatro idiomas.
 * - **Los nombres propios no se traducen.** Main Logistics, MainBrain, y los
 *   nombres de comuna y región de Chile van tal cual en todos los idiomas:
 *   son la dirección real de un lugar.
 * - **Los términos de equipo se traducen al término del rubro**, no al
 *   literal. "Cama baja" es *lowboy* en inglés, no "low bed". "Rampla plana"
 *   es *flatbed*. Traducirlos literalmente delata que no se conoce el rubro,
 *   que es exactamente lo que este sitio no puede permitirse.
 * - **Ninguna cifra ni certificación cambia al traducir.** Si el español no
 *   promete algo, la traducción tampoco puede prometerlo.
 */

export const es = {
  meta: {
    // §9 del doc de marca: nunca el nombre solo en el title tag.
    titulo: "Transporte de carga en todo Chile | Main Logistics",
    descripcion:
      "Main Logistics mueve carga general, minera, peligrosa, refrigerada, forestal, contenedores, maquinaria y sobredimensionada de Arica a Punta Arenas, con monitoreo permanente y el estándar que exige cada industria.",
    ogDescripcion:
      "Cualquier carga. Cualquier destino de Chile. Con visibilidad total y cero sorpresas.",
  },

  nav: {
    servicios: "Servicios",
    queMovemos: "Qué movemos",
    cobertura: "Cobertura",
    contacto: "Contacto",
    cotizar: "Cotizar",
    cotizarMovil: "Cotizar mi operación",
    principal: "Principal",
    inicio: "Main Logistics, inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    idioma: "Idioma",
    cambiarIdioma: "Cambiar idioma",
  },
};

/**
 * El tipo sale del español: los demás idiomas tienen que calzar exacto.
 *
 * Sin `as const` a propósito. Con `as const` cada valor quedaría tipado como
 * su literal español — `titulo: "Transporte de carga..."` — y la traducción
 * inglesa tendría que repetir la frase en español para compilar, que es
 * exactamente lo contrario de lo que se busca. Sin él, los valores se
 * ensanchan a `string` y lo que se exige es la ESTRUCTURA: mismas claves,
 * ninguna de más, ninguna de menos.
 */
export type Mensajes = typeof es;
