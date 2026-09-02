import type { MetadataRoute } from "next";

/**
 * robots.txt
 *
 * Se genera desde código y no como archivo estático para que el host del
 * sitemap salga del mismo sitio que el resto de los metadatos, y no haya que
 * acordarse de cambiarlo a mano el día que se conecte el dominio real.
 *
 * `/api/` queda fuera: la ruta de cotización solo acepta POST y no tiene nada
 * que indexar, pero un rastreador que la visite igual consume presupuesto de
 * rastreo y deja ruido en los registros.
 */

export const BASE = "https://mainlogistics.cl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
