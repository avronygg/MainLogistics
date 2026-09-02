import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Verificador154 from "@/components/Verificador154";

/**
 * Verificador de Resolución 154 del SII.
 *
 * URL propia y en español en los cuatro idiomas: la busca quien escribe
 * "resolución 154 guía de despacho" en Chile, y traducir el slug la
 * escondería justo de esa búsqueda.
 *
 * Sin `Asesor` flotante acá. El brief pide un CTA contextual, y ya está al
 * final del resultado; sumarle un widget de venta encima a una herramienta
 * de cumplimiento la convierte en un cebo, que es lo contrario de lo que
 * genera la confianza por la que existe.
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

  const titulo = `${m.verificador.titulo} ${m.verificador.destacado}`;

  return {
    title: `${titulo} | Main Logistics`,
    description: m.verificador.bajada,
    alternates: {
      canonical: `/${idioma}/verificador-resolucion-154`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/verificador-resolucion-154`]),
      ),
    },
    openGraph: {
      title: `${titulo} | Main Logistics`,
      description: m.verificador.bajada,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function PaginaVerificador({
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
        <Verificador154 m={m} idioma={idioma} />
      </main>
      <Pie m={m} idioma={idioma} />
    </>
  );
}
