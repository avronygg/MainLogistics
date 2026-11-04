import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Presentacion from "@/components/presentacion/Presentacion";

/**
 * La presentación comercial como página.
 *
 * URL propia y con el mismo tramo en los cuatro idiomas, como el verificador:
 * es el enlace que el comercial manda por WhatsApp después de una reunión, y
 * `/presentacion` a secas ya redirige al idioma de quien lo abre.
 *
 * Sin `Asesor` flotante: la página tiene su propio mando abajo, con el botón
 * de cotizar, y dos elementos fijos se pisarían en un teléfono.
 */

export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

/** La barra del navegador móvil toma el fondo de la presentación, no el del sitio. */
export const viewport: Viewport = {
  themeColor: "#0B0914",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!esIdioma(idioma)) return {};
  const { presentacion: p } = await cargar(idioma);

  return {
    title: p.metaTitulo,
    description: p.metaDescripcion,
    alternates: {
      canonical: `/${idioma}/presentacion`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/presentacion`]),
      ),
    },
    openGraph: {
      title: p.metaTitulo,
      description: p.metaDescripcion,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
      // Es lo que se ve en la vista previa de WhatsApp, por donde viaja este
      // enlace. Se regenera con `node scripts/presentacion-og.mjs`.
      images: [{ url: `/presentacion/og-${idioma}.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function PaginaPresentacion({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();
  const m = await cargar(idioma);

  return (
    <>
      <Nav m={m} idioma={idioma} />
      <Presentacion m={m} idioma={idioma} />
      <Pie m={m} idioma={idioma} />
    </>
  );
}
