import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";
import Cotizar from "@/components/Cotizar";

/**
 * El cotizador completo, con URL propia.
 *
 * Antes vivía como una sección de la home, detrás del ancla `#cotizar`. Eso
 * tenía dos costos: no se podía enlazar desde fuera —ni desde un correo, ni
 * desde WhatsApp, ni desde una campaña— y no existía como página indexable.
 *
 * En la home queda ahora el cotizador express de tres campos, que manda para
 * acá con lo respondido en la URL. Ver `components/CotizarExpress.tsx`.
 *
 * El formulario lee esos parámetros para arrancar con los campos puestos, y
 * `useSearchParams` obliga a un límite de Suspense: sin él, Next no puede
 * prerenderizar esta página y la manda entera al cliente.
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

  const titulo = `${m.cotizar.tituloLinea1} ${m.cotizar.tituloDestacado}`.trim();

  return {
    title: `${titulo} | Main Logistics`,
    description: m.cotizar.bajada,
    alternates: {
      canonical: `/${idioma}/cotizar`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/cotizar`]),
      ),
    },
    openGraph: {
      title: `${titulo} | Main Logistics`,
      description: m.cotizar.bajada,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function PaginaCotizar({
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
      <main className="pt-[clamp(5rem,10vw,7rem)]">
        {/* El respaldo del Suspense va vacío a propósito: el formulario se
            monta en el mismo cuadro y un esqueleto parpadearía sin aportar. */}
        <Suspense fallback={null}>
          <Cotizar m={m} />
        </Suspense>
      </main>
      <Pie m={m} />
      <Asesor m={m} />
    </>
  );
}
