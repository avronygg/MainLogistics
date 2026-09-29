/**
 * Solicitud de cotización · el formulario que el cliente llena y ve armarse.
 *
 * ── Qué es y qué NO es ───────────────────────────────────────────────────
 *
 * Es la puerta de entrada del cotizador interno, no el cotizador. El cliente
 * completa sus datos y la carga, ve el documento tomar forma al lado, y al
 * enviar llega todo ordenado a la casilla comercial. El precio lo pone Trade
 * después, en la herramienta interna: acá NO hay valores, ni neto, ni IVA,
 * ni total. Un documento con precios que cualquiera puede generar en una URL
 * pública es una plantilla oficial suelta.
 *
 * Por eso tampoco lleva folio, validez, ejecutivo ni firmas: todo eso lo
 * asigna Trade al emitir. Lo que el cliente ve es una SOLICITUD, y el
 * encabezado lo dice con esas palabras.
 *
 * ── Por qué estas listas y no las del resto del sitio ────────────────────
 *
 * Son las del cotizador interno, no las de `cotizacion.ts` que usa
 * /cotizar. Es a propósito: lo que llega por correo se copia tal cual a la
 * herramienta con que se emite, sin que nadie tenga que traducir "rampla
 * plana" a otra cosa a las siete de la mañana.
 *
 * El costo es que el sitio tiene dos vocabularios para lo mismo. Vale la
 * pena alinearlos, pero esa decisión es del equipo comercial: son ellos los
 * que conviven con las dos listas.
 */

export const TIPOS_CARGA = [
  "Carga general paletizada",
  "Carga general a granel",
  "Carga dimensionada",
  "Carga sobredimensionada",
  "Maquinaria",
  "Contenedor 20'",
  "Contenedor 40'",
  "Carga refrigerada",
  "Materiales de construcción",
] as const;

export const EQUIPOS = [
  "Rampla plana",
  "Rampla cortina",
  "Rampla cama baja",
  "Camión 3/4",
  "Camión plano",
  "Porta contenedor",
  "Furgón refrigerado",
] as const;

export const MODALIDADES = [
  "Viaje completo · ida",
  "Viaje completo · ida y vuelta",
  "Carga consolidada",
  "Servicio dedicado",
] as const;

/** Una línea del detalle. Sin valores: el precio no se pide acá. */
export type Linea = {
  descripcion: string;
  equipo: string;
  cantidad: string;
};

export type Solicitud = {
  /* Cliente */
  razonSocial: string;
  rut: string;
  contacto: string;
  cargo: string;
  correo: string;
  telefono: string;

  /* Servicio */
  tipoCarga: string;
  equipo: string;
  modalidad: string;
  fechaEstimada: string;

  /* Ruta */
  origen: string;
  destino: string;

  /* Detalle y observaciones */
  lineas: Linea[];
  observaciones: string;

  /** Trampa para robots. Si viene con algo, se descarta en silencio. */
  web: string;
};

export const LINEA_VACIA: Linea = { descripcion: "", equipo: "", cantidad: "" };

export const SOLICITUD_VACIA: Solicitud = {
  razonSocial: "",
  rut: "",
  contacto: "",
  cargo: "",
  correo: "",
  telefono: "",
  tipoCarga: "",
  equipo: "",
  modalidad: "",
  fechaEstimada: "",
  origen: "",
  destino: "",
  lineas: [{ ...LINEA_VACIA }],
  observaciones: "",
  web: "",
};

/** Lo que no puede faltar para que la solicitud sirva de algo. */
export const OBLIGATORIOS: Record<string, string> = {
  razonSocial: "Razón social",
  contacto: "Nombre de contacto",
  correo: "Correo",
  telefono: "Teléfono",
  tipoCarga: "Tipo de carga",
  origen: "Origen",
  destino: "Destino",
};

/** Topes por campo. Cortan antes de llegar al correo. */
export const LARGOS: Record<string, number> = {
  razonSocial: 120,
  rut: 20,
  contacto: 80,
  cargo: 80,
  correo: 120,
  telefono: 40,
  tipoCarga: 60,
  equipo: 60,
  modalidad: 60,
  fechaEstimada: 20,
  origen: 80,
  destino: 80,
  observaciones: 600,
};

export const LARGO_LINEA: Record<keyof Linea, number> = {
  descripcion: 160,
  equipo: 60,
  cantidad: 12,
};

/** Máximo de líneas de detalle. Más que esto no es una solicitud, es un lote. */
export const MAX_LINEAS = 8;

/**
 * Correo con forma plausible. No comprueba que exista; eso lo dice el rebote.
 * Misma regla que usa el formulario de /cotizar, a propósito.
 */
export function correoValido(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

/**
 * RUT chileno, si viene. Es opcional en una solicitud —un cliente nuevo
 * puede no tenerlo a mano— pero si lo escribe, se comprueba el dígito
 * verificador y no solo la forma: un RUT bien escrito e inexistente pasa
 * cualquier expresión regular.
 */
export function rutValido(valor: string) {
  const limpio = valor.replace(/[.\s]/g, "").toUpperCase();
  const partes = /^(\d{7,8})-?([\dK])$/.exec(limpio);
  if (!partes) return false;

  const [, cuerpo, dv] = partes;
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
  return esperado === dv;
}
