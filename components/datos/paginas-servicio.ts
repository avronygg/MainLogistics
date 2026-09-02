import type { Mensajes } from "@/mensajes";

/**
 * Las páginas de servicio, bajo `/transporte-de-carga/`.
 *
 * ── Por qué cuatro y no ocho ─────────────────────────────────────────────
 *
 * El sitemap del brief (§5.2) fasea estas páginas: contenedores, carga
 * general, insumos mineros y BESS en Fase 1; maquinaria y cama baja más
 * graneles en Fase 2; carga peligrosa en Fase 3, y esa última solo con
 * homologación acreditada, que Main todavía no tiene.
 *
 * Eso NO es recortar la oferta. Los ocho servicios siguen en la home por
 * decisión del cliente: lo que se fasea es cuáles tienen página propia
 * primero, que es una decisión de esfuerzo, no de posicionamiento.
 *
 * ── Qué es una URL acá ───────────────────────────────────────────────────
 *
 * El slug es una dirección pública: en cuanto alguien la comparte, deja de
 * ser nuestra para cambiarla. Va en español en los cuatro idiomas, igual
 * que los anclas del nav, y por lo mismo: `/transporte-de-carga/bess-y-energia`
 * es lo que se busca en Chile, y traducirlo lo escondería de esa búsqueda.
 */

export type PaginaServicio = {
  /** Segmento de URL. Estable: una vez publicado no se cambia. */
  slug: string;
  /** Clave en `m.paginasServicio.paginas`. */
  clave: keyof Mensajes["paginasServicio"]["paginas"];
  /**
   * Con qué queda precargado el cotizador al llegar desde esta página.
   * Los valores existen en `TIPOS_CARGA`; si se borra uno de allá, esto
   * deja de compilar.
   */
  tipoCarga: string;
  /** Claves de `EQUIPOS` que se listan como equipo habitual. */
  equipos: string[];
};

export const PAGINAS_SERVICIO: PaginaServicio[] = [
  {
    slug: "contenedores",
    clave: "contenedores",
    tipoCarga: "contenedor",
    equipos: ["contenedor", "rampla_plana"],
  },
  {
    slug: "carga-general",
    clave: "cargaGeneral",
    tipoCarga: "suelta",
    equipos: ["rampla_plana", "camion_pequeno"],
  },
  {
    slug: "insumos-mineros",
    clave: "insumosMineros",
    tipoCarga: "suelta",
    equipos: ["rampla_plana", "cama_baja", "camion_pequeno"],
  },
  {
    slug: "bess-y-energia",
    clave: "bessEnergia",
    tipoCarga: "sobredimension",
    equipos: ["cama_baja", "rampla_plana"],
  },
];

export function servicioPorSlug(slug: string) {
  return PAGINAS_SERVICIO.find((p) => p.slug === slug);
}
