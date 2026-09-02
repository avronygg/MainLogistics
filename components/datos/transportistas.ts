/**
 * Condiciones comerciales de la red de transportistas.
 *
 * ── Por qué el plazo de pago vive acá y puede estar vacío ──────────────
 *
 * El brief de desarrollo (§4.4 y §7.4) es explícito: al transportista lo
 * mueve el gancho FINANCIERO, no el tecnológico. No le interesa la app, le
 * interesa cuándo le pagan. Cobra a 60 o 90 días y camión detenido es
 * pérdida. Referencias del mercado: Carga Inteligente paga a 48 horas
 * hábiles, Loadsmart publica su factoring al 2,5%.
 *
 * Por eso el plazo tiene que ir en el titular de la página. Pero es una
 * decisión comercial de Main Logistics, no un dato de diseño, y publicar un
 * número inventado es exactamente lo que PRODUCT.md prohíbe en su principio
 * 5: una promesa que no se sostiene con este interlocutor no genera un
 * reclamo, genera que dejen de contestar el teléfono.
 *
 * Mientras sea `null`, la página no muestra el bloque de pago y el titular
 * usa el gancho de respaldo (carga recurrente). En cuanto Main defina el
 * plazo, se escribe acá y el bloque aparece solo, en su lugar correcto.
 */

/** Días desde el POD hasta el pago. `null` mientras no esté definido. */
export const DIAS_DE_PAGO: number | null = null;

/**
 * Documentos que se exigen para entrar a la red.
 *
 * La lista va COMPLETA y a la vista, no detrás del formulario: la
 * transparencia filtra. Un transportista que no tiene el F30-1 al día se
 * autodescarta antes de registrarse, y eso ahorra trabajo a los dos lados.
 *
 * Son los documentos estándar de la subcontratación de transporte en Chile.
 * Las claves apuntan al diccionario; los nombres de norma y formulario
 * —F30-1, SOAP, clase A— no se traducen: son identificadores chilenos.
 */
export const REQUISITOS_RED = [
  "vigencia",
  "tributaria",
  "f30",
  "polizas",
  "padron",
  "soap",
  "licencia",
  "gps",
] as const;

export type RequisitoRed = (typeof REQUISITOS_RED)[number];
