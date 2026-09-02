import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";
import { PAGINAS_SERVICIO } from "@/components/datos/paginas-servicio";

/**
 * Hub de servicios.
 *
 * Lista las páginas que existen, no los ocho servicios de la home. Enlazar
 * a cuatro páginas que todavía no están escritas daría cuatro 404, que es
 * peor que no enlazarlas: el brief §10.3 usa justamente los enlaces muertos
 * de Agunsa y Loginsa como ejemplo de lo que no hay que hacer.
 *
 * Los cuatro que faltan siguen en la home con su detalle, y van a tener
 * página en las fases 2 y 3, como fasea el sitemap del brief §5.2.
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
  const t = m.paginasServicio.hub;

  return {
    title: `${t.titulo} ${t.destacado} | Main Logistics`,
    description: t.bajada,
    alternates: {
      canonical: `/${idioma}/transporte-de-carga`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/transporte-de-carga`]),
      ),
    },
  };
}

export default async function HubServicios({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();
  const m = await cargar(idioma);
  const t = m.paginasServicio;

  return (
    <>
      <Nav m={m} idioma={idioma} />
      <main>
        <section className="tema-claro">
          <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] pb-[var(--seccion-y)] pt-[clamp(7.5rem,13vw,10rem)]">
            <header className="max-w-[52rem]">
              <h1 className="text-[clamp(2rem,2.6vw+1.2rem,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--texto)]">
                <span className="block">{t.hub.titulo}</span>
                <span className="text-[var(--morado-ui)]">{t.hub.destacado}</span>
              </h1>
              <p className="mt-5 max-w-[56ch] text-[clamp(1rem,0.4vw+0.92rem,1.15rem)] leading-[1.6] text-[var(--texto-sec)]">
                {t.hub.bajada}
              </p>
            </header>

            {/* Filete y no tarjetas. PRODUCT.md lo tiene como anti-referencia
                explícita: cuatro tarjetas idénticas con ícono redondeado es
                exactamente lo que hace la competencia. */}
            <ul className="mt-[clamp(3rem,5vw,4.5rem)] border-t border-[var(--borde)]">
              {PAGINAS_SERVICIO.map((p) => {
                const pagina = t.paginas[p.clave];
                return (
                  <li key={p.slug} className="border-b border-[var(--borde)]">
                    <Link
                      href={`/${idioma}/transporte-de-carga/${p.slug}`}
                      className="group grid gap-2 py-7 transition-colors duration-[var(--dur-hover)] sm:grid-cols-[minmax(0,22rem)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8"
                    >
                      <span className="text-[clamp(1.15rem,1vw+0.9rem,1.4rem)] font-semibold tracking-[-0.022em] text-[var(--texto)]">
                        {pagina.titulo} {pagina.destacado}
                      </span>
                      <span className="max-w-[56ch] text-[15px] leading-[1.6] text-[var(--texto-sec)]">
                        {pagina.bajada}
                      </span>
                      <span
                        aria-hidden="true"
                        className="hidden size-8 place-items-center rounded-full border border-[var(--borde)] text-[var(--morado-texto)] transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 sm:grid"
                      >
                        <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                          <path
                            d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
      <Pie m={m} idioma={idioma} />
      <Asesor m={m} />
    </>
  );
}
