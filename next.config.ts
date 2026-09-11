import type { NextConfig } from "next";

/**
 * Política de seguridad de contenido, sin nonces.
 *
 * Con nonce, cada página tendría que renderizarse por petición: el sitio
 * entero es estático y dejaría de salir del caché del borde. Así que va la
 * variante que documenta Next para sitios estáticos: `'unsafe-inline'` en
 * scripts, porque Next inyecta el payload de hidratación en línea, y todo lo
 * demás cerrado al propio dominio.
 *
 * Lo que sí protege: ningún script, estilo, fuente, imagen ni video puede
 * cargarse desde otro dominio, el sitio no se puede incrustar en un iframe
 * ajeno y no hay `<object>` ni `<base>` inyectables. WhatsApp y el SII son
 * enlaces que se abren en otra pestaña, no recursos, así que no pasan por acá.
 *
 * `'unsafe-eval'` solo en desarrollo: React lo usa para reconstruir las pilas
 * de error del servidor. En producción no hace falta.
 *
 * Si mañana entra un script de terceros (analítica, un chat), hay que sumar
 * su dominio acá o el navegador lo va a bloquear sin avisar en pantalla.
 */
const esDesarrollo = process.env.NODE_ENV === "development";

const politica = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${esDesarrollo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const encabezadosSeguridad = [
  { key: "Content-Security-Policy", value: politica },
  // Que el navegador no adivine el tipo de un archivo distinto al declarado.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Hacia otros sitios viaja solo el dominio, no la ruta ni los parámetros
  // (que en /cotizar llevan origen, destino y tipo de carga).
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // El sitio no usa cámara, micrófono ni ubicación: se apagan explícitamente.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Equivalente viejo de `frame-ancestors`, para navegadores que no leen CSP.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: encabezadosSeguridad }];
  },
  images: {
    /**
     * Next 16 cambió el default de `qualities` a solo [75] y coacciona
     * cualquier otro valor al más cercano de la lista. Sin declarar 90 acá,
     * el `quality={90}` de los <Image> caía en silencio a 75 — que sobre
     * fotos oscuras con degradados produce bandas visibles.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
