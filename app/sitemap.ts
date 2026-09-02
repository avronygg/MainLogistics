import type { MetadataRoute } from "next";
import { IDIOMAS, NOMBRES } from "@/mensajes/idiomas";
import { BASE } from "./robots";
import { PAGINAS_SERVICIO } from "@/components/datos/paginas-servicio";

/**
 * sitemap.xml
 *
 * Una entrada por idioma, y cada una declara a las otras tres con `hreflang`.
 * Sin eso un buscador trata las cuatro versiones como páginas distintas que
 * compiten entre sí, y termina eligiendo una por su cuenta.
 *
 * La raíz `/` NO entra: redirige al idioma que corresponda, y un sitemap no
 * debe listar URLs que responden 307.
 *
 * Se genera desde la lista de idiomas y no a mano: cuando se agregue un
 * quinto, entra solo. Lo mismo valdrá para las páginas de servicio, ruta e
 * industria de la Fase 1 — se agregan acá y el archivo se arma solo.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /* Una entrada por página y por idioma. Al agregar una página nueva se
     suma acá y el sitemap la recoge en los cuatro idiomas. */
  const PAGINAS = [
    { ruta: "", prioridad: 1 },
    { ruta: "/cotizar", prioridad: 0.9 },
    { ruta: "/transportistas", prioridad: 0.9 },
    /* El hub y las cuatro páginas de servicio. Son las URL que hoy no
       existen y por las que todo el long tail de búsqueda queda fuera de
       alcance (brief §5.1). */
    { ruta: "/transporte-de-carga", prioridad: 0.9 },
    ...PAGINAS_SERVICIO.map((p) => ({
      ruta: `/transporte-de-carga/${p.slug}`,
      prioridad: 0.8,
    })),
    /* La herramienta del brief §8.1. Prioridad alta: no es una página de
       apoyo, es la puerta de entrada de quien busca "resolución 154" entre
       hoy y el 1 de noviembre. */
    { ruta: "/verificador-resolucion-154", prioridad: 0.9 },
    /* Las legales entran al sitemap con prioridad baja, pero entran. El
       brief §10.3 anota que Agunsa y Loginsa tienen estos enlaces muertos
       en producción: una política que existe y se puede encontrar ya es
       una diferencia frente al benchmark. */
    { ruta: "/legal/privacidad", prioridad: 0.4 },
    { ruta: "/legal/terminos", prioridad: 0.4 },
  ];

  return IDIOMAS.flatMap((idioma) =>
    PAGINAS.map((pagina) => ({
    url: `${BASE}/${idioma}${pagina.ruta}`,
    // Una sola página por ahora, así que todas cambian a la vez.
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    // El español es la versión principal: es el idioma del mercado.
    priority: idioma === "es" ? pagina.prioridad : pagina.prioridad - 0.2,
    alternates: {
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `${BASE}/${i}${pagina.ruta}`]),
      ),
    },
    })),
  );
}
