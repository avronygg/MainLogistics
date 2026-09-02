import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";
import PaginaServicio from "@/components/PaginaServicio";
import { PAGINAS_SERVICIO, servicioPorSlug } from "@/components/datos/paginas-servicio";

/**
 * Una URL indexable por servicio, que es lo que hoy no existe.
 *
 * El brief §5.1 lo señala como la pérdida más cara del sitio actual: sin
 * estas páginas, todo el long tail de búsqueda queda fuera de alcance, y en
 * Chile ese long tail está casi libre porque los operadores establecidos no
 * producen contenido.
 *
 * Las cuatro se prerrenderizan en los cuatro idiomas: 16 páginas estáticas
 * más el hub.
 */

export function generateStaticParams() {
  return IDIOMAS.flatMap((idioma) =>
    PAGINAS_SERVICIO.map((p) => ({ idioma, servicio: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string; servicio: string }>;
}): Promise<Metadata> {
  const { idioma, servicio } = await params;
  if (!esIdioma(idioma)) return {};
  const datos = servicioPorSlug(servicio);
  if (!datos) return {};

  const m = await cargar(idioma);
  const pagina = m.paginasServicio.paginas[datos.clave];
  // §9 del doc de marca: nunca el nombre de la empresa solo en el title.
  const titulo = `${pagina.titulo} ${pagina.destacado}`;

  return {
    title: `${titulo} | Main Logistics`,
    description: pagina.bajada,
    alternates: {
      canonical: `/${idioma}/transporte-de-carga/${servicio}`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/transporte-de-carga/${servicio}`]),
      ),
    },
    openGraph: {
      title: `${titulo} | Main Logistics`,
      description: pagina.bajada,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function Pagina({
  params,
}: {
  params: Promise<{ idioma: string; servicio: string }>;
}) {
  const { idioma, servicio } = await params;
  if (!esIdioma(idioma)) notFound();
  const datos = servicioPorSlug(servicio);
  if (!datos) notFound();

  const m = await cargar(idioma);

  return (
    <>
      <Nav m={m} idioma={idioma} />
      <main>
        <PaginaServicio datos={datos} m={m} idioma={idioma} />
      </main>
      <Pie m={m} idioma={idioma} />
      <Asesor m={m} />
    </>
  );
}
