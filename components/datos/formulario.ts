import type { Mensajes } from "@/mensajes";

/**
 * Estado y validación del formulario de cotización por pasos.
 *
 * Sin librería de formularios a propósito. Seis pasos con quince campos se
 * manejan con estado propio, y el proyecto entero tiene cinco dependencias:
 * sumar una sexta por esto no se paga. El costo es esta validación escrita a
 * mano, que a cambio queda explícita y auditable.
 *
 * La regla de oro está en PRODUCT.md §5: no prometer lo que no se puede
 * auditar. Acá se traduce en que el formulario nunca reporta éxito si el
 * envío falló, y en que ningún campo se autocompleta con un supuesto.
 */

export type Cotizacion = {
  /* 1 · Carga y equipo */
  tipoCarga: string;
  tipoCargaOtra: string;
  equipo: string;

  /* 2 · Origen y destino */
  origenRegion: string;
  origenComuna: string;
  origenDireccion: string;
  destinoRegion: string;
  destinoComuna: string;
  destinoDireccion: string;

  /* 3 · Fecha */
  fecha: string;
  fechaDia: string;

  /* 4 · Modalidad */
  modalidad: string;
  frecuencia: string;
  duracion: string;

  /* 5 · Requisitos y valor */
  requisitos: string[];
  requisitoOtro: string;
  valor: string;

  /* 6 · Contacto */
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  canal: string;

  /* Trampa para bots. Si viene con algo, se descarta en silencio. */
  web: string;
};

export const COTIZACION_VACIA: Cotizacion = {
  tipoCarga: "",
  tipoCargaOtra: "",
  equipo: "",
  origenRegion: "",
  origenComuna: "",
  origenDireccion: "",
  destinoRegion: "",
  destinoComuna: "",
  destinoDireccion: "",
  fecha: "",
  fechaDia: "",
  modalidad: "",
  frecuencia: "",
  duracion: "",
  requisitos: [],
  requisitoOtro: "",
  valor: "",
  empresa: "",
  nombre: "",
  correo: "",
  telefono: "",
  canal: "whatsapp",
  web: "",
};

/* ── Los seis pasos ──────────────────────────────────────────────────── */

/**
 * Ids de los pasos, en orden. Son ESTRUCTURA, no texto: fijan la secuencia,
 * dan la clave de React en el riel y el `aria-labelledby` del resumen. No
 * cambian con el idioma, igual que los anclas de la página.
 */
export const PASOS = [
  "carga",
  "ruta",
  "fecha",
  "modalidad",
  "requisitos",
  "contacto",
] as const;

export type IdPaso = (typeof PASOS)[number];

export type Paso = {
  id: IdPaso;
  titulo: string;
  /** Lo que el paso resuelve, en una línea. Va bajo el título. */
  bajada: string;
};

/** Los seis pasos con su texto en el idioma en curso. */
export function pasos(m: Mensajes): Paso[] {
  return PASOS.map((id) => ({ id, ...m.cotizar.pasos[id] }));
}

/* ── Validación ──────────────────────────────────────────────────────── */

export type Errores = Partial<Record<keyof Cotizacion, string>>;

/** Correo con formato plausible. No verifica que exista; eso lo dice el rebote. */
function correoValido(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/**
 * Teléfono chileno. Acepta como lo escriba la gente — con +56, con 9 al
 * frente, con espacios o guiones — y exige 8 o 9 dígitos útiles. Rechazar
 * un teléfono bien escrito por el formato es la forma más tonta de perder
 * una cotización.
 */
function telefonoValido(v: string): boolean {
  const digitos = v.replace(/\D/g, "").replace(/^56/, "");
  return digitos.length >= 8 && digitos.length <= 9;
}

/** Cada mensaje de error vive en el diccionario; acá solo se nombra cuál. */
type ClaveError = keyof Mensajes["cotizar"]["errores"];

type Fallo = { campo: keyof Cotizacion; clave: ClaveError };

/**
 * Qué falla en un paso, sin resolver el texto.
 *
 * La validación se parte en dos a propósito. Saber SI un paso está completo
 * — el riel, el botón de enviar — no necesita idioma; solo mostrarle el error
 * a alguien lo necesita. Con esta separación `pasoCompleto` y
 * `primerPasoIncompleto` siguen sin recibir `m`, que es ruido en todos sus
 * llamados.
 *
 * El ORDEN de la lista importa: `Cotizar.tsx` enfoca el primer campo que
 * falla, y ese primero sale de acá.
 *
 * Solo se valida el paso en pantalla: mostrarle a alguien un error de un
 * paso que todavía no vio es desorientarlo.
 */
function fallosDe(indice: number, d: Cotizacion): Fallo[] {
  const f: Fallo[] = [];
  const falta = (campo: keyof Cotizacion, clave: ClaveError) =>
    f.push({ campo, clave });

  if (indice === 0) {
    if (!d.tipoCarga) falta("tipoCarga", "tipoCarga");
    if (d.tipoCarga === "otra" && !d.tipoCargaOtra.trim())
      falta("tipoCargaOtra", "tipoCargaOtra");
    if (!d.equipo) falta("equipo", "equipo");
  }

  if (indice === 1) {
    if (!d.origenRegion) falta("origenRegion", "origenRegion");
    if (!d.origenComuna) falta("origenComuna", "origenComuna");
    if (!d.destinoRegion) falta("destinoRegion", "destinoRegion");
    if (!d.destinoComuna) falta("destinoComuna", "destinoComuna");
  }

  if (indice === 2) {
    if (!d.fecha) falta("fecha", "fecha");
    if (d.fecha === "especifica" && !d.fechaDia) falta("fechaDia", "fechaDia");
  }

  if (indice === 3) {
    if (!d.modalidad) falta("modalidad", "modalidad");
    if (d.modalidad === "recurrente" && !d.frecuencia)
      falta("frecuencia", "frecuencia");
    if (d.modalidad === "contrato" && !d.duracion) falta("duracion", "duracion");
  }

  if (indice === 4) {
    // Los requisitos son opcionales: no toda carga tiene una exigencia
    // especial, y obligar a marcar algo produce datos falsos.
    if (d.requisitos.includes("otro") && !d.requisitoOtro.trim())
      falta("requisitoOtro", "requisitoOtro");
    if (!d.valor) falta("valor", "valor");
  }

  if (indice === 5) {
    if (!d.empresa.trim()) falta("empresa", "empresa");
    if (!d.nombre.trim()) falta("nombre", "nombre");
    if (!d.correo.trim()) falta("correo", "correoFalta");
    else if (!correoValido(d.correo)) falta("correo", "correoIlegible");
    if (!d.telefono.trim()) falta("telefono", "telefonoFalta");
    else if (!telefonoValido(d.telefono)) falta("telefono", "telefonoIlegible");
    if (!d.canal) falta("canal", "canal");
  }

  return f;
}

/**
 * Valida un paso. Devuelve los errores del paso ya en texto, vacío si está
 * completo.
 */
export function validarPaso(
  indice: number,
  d: Cotizacion,
  m: Mensajes,
): Errores {
  const e: Errores = {};
  for (const { campo, clave } of fallosDe(indice, d)) {
    e[campo] = m.cotizar.errores[clave];
  }
  return e;
}

/** Un paso está completo cuando no arroja errores. Alimenta el indicador. */
export function pasoCompleto(indice: number, d: Cotizacion): boolean {
  return fallosDe(indice, d).length === 0;
}

/** Primer paso incompleto, o -1 si están todos. Se usa antes de enviar. */
export function primerPasoIncompleto(d: Cotizacion): number {
  for (let i = 0; i < PASOS.length; i++) if (!pasoCompleto(i, d)) return i;
  return -1;
}
