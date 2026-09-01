/**
 * Datos de contacto de Main Logistics. Fuente única.
 *
 * No pasan por el diccionario de idiomas: un número de teléfono chileno y una
 * dirección de correo se escriben igual en español, inglés, portugués y
 * chino. Traducirlos no significaría nada y abriría la puerta a que una
 * traducción cambiara un dígito.
 *
 * Por qué constantes y no variables de entorno: `NEXT_PUBLIC_*` se incrusta
 * en el build, así que cambiarla exige redesplegar exactamente igual que
 * editar este archivo. Como variable no daba ninguna ventaja y sí un riesgo
 * — quedar vacía en producción y dejar el botón de WhatsApp muerto sin que
 * nadie se entere. Acá está a la vista y el compilador la exige.
 *
 * `NEXT_PUBLIC_WHATSAPP` se sigue respetando si está definida: sirve para
 * apuntar un despliegue de prueba a un número que no sea el comercial.
 */

/** Correo comercial. Recibe también las cotizaciones del formulario. */
export const CORREO = "comercial@mainlogistics.cl";

/** Teléfono, como se lee. */
export const TELEFONO = "+56 9 9277 8013";

/** El mismo, para `href="tel:"`. */
export const TELEFONO_ENLACE = "+56992778013";

/**
 * El mismo, en el formato que pide wa.me: código de país y número, sin `+`,
 * sin espacios y sin guiones. Un solo carácter de más y el enlace abre un
 * chat con un número que no existe.
 */
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "56992778013";
