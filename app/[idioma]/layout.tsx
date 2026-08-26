/**
 * ════════════════════════════════════════════════════════════════════════
 *  MAIN LOGISTICS · Sitio corporativo
 *
 *  Diseñado y desarrollado por Aaron Tardón
 *  Marketing Manager · MAIN BRAIN
 *
 *  Construido bajo el estándar de agencia de MAIN BRAIN.
 * ════════════════════════════════════════════════════════════════════════
 *
 *  Esta firma vive solo en el código fuente. `layout.tsx` es un componente
 *  de servidor, así que este comentario no viaja en el bundle del cliente
 *  ni aparece en el HTML servido.
 *
 *  Antes de tocar cualquier interfaz, leer en este orden:
 *    1. PRODUCT.md   — registro, audiencia, anti-referencias, principios
 *    2. DESIGN.md    — paleta verificada, tipografía, vidrio, motion
 *    3. brand/main-logistics-marca.md — documento de marca del cliente
 *
 *  Verificación antes de publicar:
 *    node scripts/pruebas.mjs          desbordes, menú móvil, reduced-motion
 *    node scripts/contraste.mjs        contraste AA, tema oscuro
 *    node scripts/tema-claro.mjs       contraste AA, tema claro
 *    node scripts/anclas.mjs           enlaces internos que resuelven
 *    node scripts/alternancia.mjs      bandas claro/oscuro sin repetir
 *    node scripts/nitidez.mjs          fotos sin ampliación
 *    node scripts/auditoria-movil.mjs  hero en pantallas chicas
 *    node scripts/idiomas.mjs          los cuatro idiomas, sin claves sueltas
 *
 *  Este es el layout RAÍZ: no hay `app/layout.tsx`. Todo el sitio cuelga del
 *  segmento de idioma, que es lo que permite compartir por WhatsApp el
 *  enlace ya en el idioma del destinatario.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // cubre á é í ó ú ñ ¿ ¡
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Las cuatro rutas se generan en el build: no hay render en caliente. */
export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!esIdioma(idioma)) return {};
  const m = await cargar(idioma);

  return {
    title: m.meta.titulo,
    description: m.meta.descripcion,
    metadataBase: new URL("https://mainlogistics.cl"),
    // Cada idioma declara dónde viven los otros tres. Sin esto, un buscador
    // trata las cuatro versiones como páginas distintas que compiten entre sí.
    alternates: {
      canonical: `/${idioma}`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}`]),
      ),
    },
    openGraph: {
      title: m.meta.titulo,
      description: m.meta.ogDescripcion,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0E1519",
  colorScheme: "dark",
  /**
   * Al abrirse el teclado, el viewport de layout se encoge en vez de que el
   * teclado quede flotando encima. Es lo que mantiene la barra de "Siguiente"
   * del formulario de cotización SOBRE el teclado y no debajo — en un
   * formulario por pasos, en un teléfono, es la diferencia entre poder
   * avanzar y no encontrar el botón.
   */
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();

  return (
    <html
      lang={NOMBRES[idioma].html}
      /**
       * En chino se marca la raíz para que la hoja de estilos anteponga la
       * pila CJK del sistema. Geist no trae ideogramas, y Noto Sans SC
       * completo pesa varios megabytes: el equipo de quien lee en chino ya
       * tiene una tipografía CJK mejor que cualquiera que le sirvamos.
       */
      data-cjk={idioma === "zh" ? "" : undefined}
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
