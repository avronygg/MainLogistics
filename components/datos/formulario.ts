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

export type Paso = {
  id: string;
  titulo: string;
  /** Lo que el paso resuelve, en una línea. Va bajo el título. */
  bajada: string;
};

export const PASOS: Paso[] = [
  { id: "carga", titulo: "Su carga", bajada: "Qué mueve y con qué equipo." },
  { id: "ruta", titulo: "La ruta", bajada: "Desde dónde y hasta dónde." },
  { id: "fecha", titulo: "Cuándo", bajada: "La fecha del servicio." },
  { id: "modalidad", titulo: "Modalidad", bajada: "Una vez o de forma sostenida." },
  { id: "requisitos", titulo: "Requisitos", bajada: "Lo que su industria exige." },
  { id: "contacto", titulo: "Sus datos", bajada: "Para responderle." },
];

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

/**
 * Valida un paso. Devuelve los errores del paso, vacío si está completo.
 *
 * Solo se valida el paso en pantalla: mostrarle a alguien un error de un
 * paso que todavía no vio es desorientarlo.
 */
export function validarPaso(indice: number, d: Cotizacion): Errores {
  const e: Errores = {};

  if (indice === 0) {
    if (!d.tipoCarga) e.tipoCarga = "Elija qué tipo de carga va a mover.";
    if (d.tipoCarga === "otra" && !d.tipoCargaOtra.trim())
      e.tipoCargaOtra = "Cuéntenos qué carga es.";
    if (!d.equipo) e.equipo = "Elija un equipo, o pida asesoría.";
  }

  if (indice === 1) {
    if (!d.origenRegion) e.origenRegion = "Indique la región de origen.";
    if (!d.origenComuna) e.origenComuna = "Indique la comuna de origen.";
    if (!d.destinoRegion) e.destinoRegion = "Indique la región de destino.";
    if (!d.destinoComuna) e.destinoComuna = "Indique la comuna de destino.";
  }

  if (indice === 2) {
    if (!d.fecha) e.fecha = "Indique cuándo necesita el servicio.";
    if (d.fecha === "especifica" && !d.fechaDia) e.fechaDia = "Elija el día.";
  }

  if (indice === 3) {
    if (!d.modalidad) e.modalidad = "Indique la modalidad.";
    if (d.modalidad === "recurrente" && !d.frecuencia)
      e.frecuencia = "Indique cada cuánto se repite.";
    if (d.modalidad === "contrato" && !d.duracion)
      e.duracion = "Indique la duración del contrato.";
  }

  if (indice === 4) {
    // Los requisitos son opcionales: no toda carga tiene una exigencia
    // especial, y obligar a marcar algo produce datos falsos.
    if (d.requisitos.includes("otro") && !d.requisitoOtro.trim())
      e.requisitoOtro = "Especifique el requisito.";
    if (!d.valor) e.valor = "Indique el valor declarado, o que prefiere conversarlo.";
  }

  if (indice === 5) {
    if (!d.empresa.trim()) e.empresa = "Indique la empresa.";
    if (!d.nombre.trim()) e.nombre = "Indique su nombre.";
    if (!d.correo.trim()) e.correo = "Indique su correo.";
    else if (!correoValido(d.correo)) e.correo = "Revise el correo, parece incompleto.";
    if (!d.telefono.trim()) e.telefono = "Indique un teléfono.";
    else if (!telefonoValido(d.telefono))
      e.telefono = "Revise el teléfono: son 9 dígitos en Chile.";
    if (!d.canal) e.canal = "Elija por dónde prefiere que le respondamos.";
  }

  return e;
}

/** Un paso está completo cuando no arroja errores. Alimenta el indicador. */
export function pasoCompleto(indice: number, d: Cotizacion): boolean {
  return Object.keys(validarPaso(indice, d)).length === 0;
}

/** Primer paso incompleto, o -1 si están todos. Se usa antes de enviar. */
export function primerPasoIncompleto(d: Cotizacion): number {
  for (let i = 0; i < PASOS.length; i++) if (!pasoCompleto(i, d)) return i;
  return -1;
}
