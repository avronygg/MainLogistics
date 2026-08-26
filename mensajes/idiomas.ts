/**
 * Idiomas del sitio.
 *
 * Español es el principal. Inglés, portugués y chino existen porque la carga
 * que mueve Main Logistics llega y sale por puertos, y del otro lado del
 * correo hay operadores que no hablan español.
 *
 * Sin librería de i18n a propósito. Para copy estático en cuatro idiomas, sin
 * plurales ni formatos de fecha que negociar, el diccionario propio son unas
 * cuarenta líneas y evita sumarle una sexta dependencia al proyecto. El
 * tipo `Mensajes` sale del diccionario español, así que a los otros tres les
 * falta una clave y TypeScript no compila: no hay forma de publicar una
 * traducción a medias.
 */

export const IDIOMAS = ["es", "en", "pt", "zh"] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = "es";

export const NOMBRES: Record<Idioma, { propio: string; corto: string; html: string }> = {
  // `propio` es el nombre del idioma EN ese idioma: quien busca su idioma en
  // un selector no lo reconoce traducido al que está viendo.
  es: { propio: "Español", corto: "ES", html: "es-CL" },
  en: { propio: "English", corto: "EN", html: "en" },
  pt: { propio: "Português", corto: "PT", html: "pt-BR" },
  zh: { propio: "中文", corto: "中文", html: "zh-Hans" },
};

export function esIdioma(v: string): v is Idioma {
  return (IDIOMAS as readonly string[]).includes(v);
}

/**
 * Elige idioma a partir del encabezado `Accept-Language`.
 *
 * Respeta los factores de calidad (`es;q=0.9`) porque el navegador ordena la
 * lista con ellos, y toma solo la etiqueta primaria: `pt-BR` y `pt-PT` caen
 * los dos en portugués, `zh-Hant` cae en chino. Ante cualquier duda, español.
 */
export function detectarIdioma(encabezado: string | null): Idioma {
  if (!encabezado) return IDIOMA_POR_DEFECTO;

  const preferencias = encabezado
    .split(",")
    .map((parte) => {
      const [etiqueta, ...resto] = parte.trim().split(";");
      const q = resto.find((r) => r.trim().startsWith("q="));
      const peso = q ? Number.parseFloat(q.split("=")[1]) : 1;
      return {
        primaria: etiqueta.trim().toLowerCase().split("-")[0],
        peso: Number.isFinite(peso) ? peso : 0,
      };
    })
    .filter((p) => p.peso > 0)
    .sort((a, b) => b.peso - a.peso);

  for (const { primaria } of preferencias) {
    if (esIdioma(primaria)) return primaria;
  }
  return IDIOMA_POR_DEFECTO;
}
