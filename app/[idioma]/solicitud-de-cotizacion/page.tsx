import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import SolicitudCotizacion from "@/components/SolicitudCotizacion";

/**
 * Solicitud de cotización.
 *
 * Es un enlace que el equipo comercial manda a una empresa: la persona
 * completa sus datos y ve el documento armarse al lado, en el mismo diseño
 * con que Trade emite. Sin precios: el valor lo pone Trade después, en la
 * herramienta interna.
 *
 * El slug va en español en los cuatro idiomas, como el resto de las rutas
 * públicas del sitio: es una dirección que se comparte por correo y por
 * WhatsApp, y traducirla rompería cada enlace ya enviado.
 *
 * Sin `Asesor` flotante: en un formulario largo, el widget se para encima
 * del botón de enviar en el teléfono. Ya pasó con el cotizador.
 */

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

  const titulo = `${m.solicitud.titulo} ${m.solicitud.destacado}`;

  return {
    title: `${titulo} | Logística Trade`,
    description: m.solicitud.bajada,
    alternates: {
      canonical: `/${idioma}/solicitud-de-cotizacion`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/solicitud-de-cotizacion`]),
      ),
    },
    openGraph: {
      title: `${titulo} | Logística Trade`,
      description: m.solicitud.bajada,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function PaginaSolicitud({
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
      <main>
        <section className="tema-claro">
          <SolicitudCotizacion m={m} idioma={idioma} />
        </section>
      </main>
      <Pie m={m} idioma={idioma} />
    </>
  );
}
