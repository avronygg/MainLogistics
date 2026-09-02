import Link from "next/link";
import { EQUIPOS } from "./datos/cotizacion";
import type { PaginaServicio as Datos } from "./datos/paginas-servicio";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";

/**
 * El molde de las páginas de servicio.
 *
 * Componente de servidor, sin JavaScript en el cliente. El brief §9.3 pide
 * SSR o SSG en todo el contenido comercial porque hoy hay contenido crítico
 * que no llega al HTML servido; acá no hay nada que hidratar.
 *
 * ── Qué lleva cada página, y por qué ese orden ───────────────────────────
 *
 * 1. Qué es el servicio, en prosa. Sin viñetas: la primera pantalla tiene
 *    que sonar a alguien que conoce el negocio, no a una ficha.
 * 2. Qué exige la carga. Es la parte que ningún competidor chileno escribe
 *    y la que demuestra competencia sin afirmar nada sobre Main.
 * 3. Equipo habitual, tomado de la misma lista que usa el cotizador.
 * 4. Preguntas frecuentes, con `FAQPage` de Schema.org.
 * 5. El CTA, al final, con el tipo de carga ya elegido.
 *
 * Nada de esto promete una cifra, un plazo ni una certificación. Describe
 * lo que el servicio ES y lo que la norma EXIGE, que se puede verificar, y
 * no lo que Main tiene, que sigue pendiente de confirmación del cliente.
 */
export default function PaginaServicio({
  datos,
  m,
  idioma,
}: {
  datos: Datos;
  m: Mensajes;
  idioma: Idioma;
}) {
  const t = m.paginasServicio;
  const pagina = t.paginas[datos.clave];

  const equipos = datos.equipos
    .map((valor) => EQUIPOS.find((e) => e.valor === valor))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .map((e) => m.cotizar.equipos[e.clave as keyof typeof m.cotizar.equipos].etiqueta);

  /* El cotizador arranca con el tipo de carga puesto. Es el mismo parámetro
     que usa el cotizador express, y `Cotizar` lo valida contra la lista
     real antes de aceptarlo. */
  const aCotizar = `/${idioma}/cotizar?carga=${datos.tipoCarga}`;

  /* FAQPage de Schema.org, que el brief §9.3 pide explícitamente. Se arma
     desde las MISMAS preguntas que se muestran: un structured data que
     declara algo distinto de lo visible es motivo de penalización, además
     de una mentira. */
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pagina.faq.map((f) => ({
      "@type": "Question",
      name: f.p,
      acceptedAnswer: { "@type": "Answer", text: f.r },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />

      <section className="tema-claro">
        <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] pb-[var(--seccion-y)] pt-[clamp(7.5rem,13vw,10rem)]">
          <Link
            href={`/${idioma}/transporte-de-carga`}
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--morado-texto)]"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-3.5 rotate-180"
            >
              <path
                d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t.volver}
          </Link>

          <header className="mt-7 max-w-[52rem]">
            <h1 className="text-[clamp(2rem,2.6vw+1.2rem,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--texto)]">
              <span className="block">{pagina.titulo}</span>
              <span className="text-[var(--morado-ui)]">{pagina.destacado}</span>
            </h1>
            <p className="mt-5 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.15rem)] leading-[1.6] text-[var(--texto-sec)]">
              {pagina.bajada}
            </p>
            <p className="mt-6 max-w-[64ch] text-[16px] leading-[1.7] text-[var(--texto-sec)]">
              {pagina.intro}
            </p>
          </header>

          <div className="mt-[clamp(3rem,5vw,4.5rem)] grid gap-[clamp(2.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
            <div>
              <h2 className="text-[clamp(1.35rem,1.3vw+1rem,1.75rem)] font-semibold tracking-[-0.028em] text-[var(--texto)]">
                {t.queExige}
              </h2>
              <dl className="mt-6 border-t border-[var(--borde)]">
                {pagina.exigencias.map((e) => (
                  <div
                    key={e.titulo}
                    className="grid gap-1 border-b border-[var(--borde)] py-5 sm:grid-cols-[minmax(12rem,17rem)_1fr] sm:gap-8"
                  >
                    <dt className="text-[15.5px] font-medium tracking-[-0.012em] text-[var(--texto)]">
                      {e.titulo}
                    </dt>
                    <dd className="max-w-[58ch] text-[15px] leading-[1.65] text-[var(--texto-sec)]">
                      {e.detalle}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <aside className="lg:sticky lg:top-[7rem] lg:self-start">
              <h2 className="dato text-[12px] uppercase tracking-[0.1em] text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]">
                {t.equipoHabitual}
              </h2>
              <ul className="mt-4 space-y-2 border-l border-[var(--borde)] pl-4">
                {equipos.map((e) => (
                  <li key={e} className="text-[14.5px] leading-[1.5] text-[var(--texto-sec)]">
                    {e}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          <section className="mt-[clamp(3.5rem,6vw,5rem)]">
            <h2 className="text-[clamp(1.35rem,1.3vw+1rem,1.75rem)] font-semibold tracking-[-0.028em] text-[var(--texto)]">
              {t.preguntas}
            </h2>
            <dl className="mt-6 max-w-[70ch] border-t border-[var(--borde)]">
              {pagina.faq.map((f) => (
                <div key={f.p} className="border-b border-[var(--borde)] py-5">
                  <dt className="text-[16px] font-medium tracking-[-0.015em] text-[var(--texto)]">
                    {f.p}
                  </dt>
                  <dd className="mt-2 max-w-[62ch] text-[15px] leading-[1.7] text-[var(--texto-sec)]">
                    {f.r}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-[clamp(3rem,5vw,4rem)] rounded-[var(--r-card)] border border-[var(--borde)] bg-[var(--sup-1)] p-6 sm:p-8">
            <h2 className="text-[clamp(1.15rem,1vw+0.9rem,1.45rem)] font-semibold tracking-[-0.02em] text-[var(--texto)]">
              {t.ctaTitulo}
            </h2>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-[1.65] text-[var(--texto-sec)]">
              {t.ctaTexto}
            </p>
            <Link
              href={aCotizar}
              className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--morado-solido)] px-7 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
            >
              {t.ctaBoton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
