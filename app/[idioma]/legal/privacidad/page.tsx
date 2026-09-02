import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Documento from "@/components/legal/Documento";
import { PRIVACIDAD } from "@/components/datos/legal";

/**
 * Política de privacidad.
 *
 * Existe porque el sitio recoge datos personales en dos formularios y hasta
 * ahora no decía en ninguna parte qué hacía con ellos. El brief §10.3 la
 * marca como bloqueante y anota que Agunsa y Loginsa tienen este enlace
 * muerto en producción: con cumplirlo de verdad ya se está por delante.
 *
 * Sin `Asesor` en el pie de esta página, a diferencia del resto del sitio.
 * Un widget de venta flotando sobre el documento que explica el tratamiento
 * de datos es exactamente el gesto que hace dudar de él.
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

  return {
    // El rótulo va traducido aunque el cuerpo esté en español: es lo que se
    // ve en la pestaña y en el buscador, y es lo que la persona busca.
    title: `${m.legal.privacidad} | Main Logistics`,
    description: PRIVACIDAD.bajada,
    alternates: {
      canonical: `/${idioma}/legal/privacidad`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/legal/privacidad`]),
      ),
    },
  };
}

export default async function PaginaPrivacidad({
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
        <Documento doc={PRIVACIDAD} m={m} idioma={idioma} />
      </main>
      <Pie m={m} idioma={idioma} />
    </>
  );
}
