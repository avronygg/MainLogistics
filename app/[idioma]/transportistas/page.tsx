import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";
import Titulo from "@/components/Titulo";
import { IconoEscudo, IconoReloj, IconoCarga, IconoCotizar } from "@/components/Iconos";
import { CORREO, TELEFONO, TELEFONO_ENLACE } from "@/components/datos/contacto";
import { DIAS_DE_PAGO, REQUISITOS_RED } from "@/components/datos/transportistas";

/**
 * El segundo embudo: captación de capacidad.
 *
 * En un modelo asset-light la capacidad ES el producto, y el brief de
 * desarrollo (§2.1) trae el dato que lo vuelve urgente: en un benchmark de
 * diez operadores logísticos chilenos, CERO capta transportistas desde su
 * web, aunque todos subcontratan. Es el canal de adquisición más desatendido
 * del mercado.
 *
 * Dos decisiones que no son de diseño:
 *
 * 1. LA LISTA DE REQUISITOS VA COMPLETA Y ANTES DEL FORMULARIO. La
 *    transparencia filtra: quien no tiene el F30-1 al día se autodescarta y
 *    no gasta el tiempo de nadie. Esconderla detrás del registro produce
 *    postulaciones que hay que rechazar una por una.
 *
 * 2. EL BLOQUE "CÓMO ES LA RELACIÓN" NO ES RELLENO. El artículo 183-A inciso
 *    2 de la Ley 20.123 establece que si el servicio se limita a intermediar
 *    trabajadores, el empleador pasa a ser el dueño de la faena. El lenguaje
 *    del sitio no puede sugerir que Main dirige el trabajo del conductor, y
 *    este bloque lo dice explícito.
 *
 * ⚠️ ANTES DE PUBLICAR: el brief (§7.4) pide que un abogado laboral revise
 * el flujo de registro y el lenguaje de esta página. La redacción de acá es
 * la interpretación de un desarrollador, no asesoría legal.
 *
 * ⚠️ FALTA EL GANCHO PRINCIPAL: el plazo de pago. Ver
 * `components/datos/transportistas.ts` — mientras sea `null`, el bloque no
 * se muestra y la página usa el gancho de respaldo.
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
    title: m.transportistas.meta.titulo,
    description: m.transportistas.meta.descripcion,
    alternates: {
      canonical: `/${idioma}/transportistas`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/transportistas`]),
      ),
    },
    openGraph: {
      title: m.transportistas.meta.titulo,
      description: m.transportistas.meta.descripcion,
      locale: NOMBRES[idioma].html.replace("-", "_"),
      type: "website",
    },
  };
}

export default async function Transportistas({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();
  const m = await cargar(idioma);
  const t = m.transportistas;

  const ofrece = [
    { Icono: IconoCarga, titulo: t.ofreceRecurrenteTitulo, detalle: t.ofreceRecurrenteDetalle },
    { Icono: IconoCotizar, titulo: t.ofreceSinCostoTitulo, detalle: t.ofreceSinCostoDetalle },
    { Icono: IconoEscudo, titulo: t.ofrecePapelesTitulo, detalle: t.ofrecePapelesDetalle },
    { Icono: IconoReloj, titulo: t.ofreceContraparteTitulo, detalle: t.ofreceContraparteDetalle },
  ];

  const exige: Record<(typeof REQUISITOS_RED)[number], string> = {
    vigencia: t.exigeVigencia,
    tributaria: t.exigeTributaria,
    f30: t.exigeF30,
    polizas: t.exigePolizas,
    padron: t.exigePadron,
    soap: t.exigeSoap,
    licencia: t.exigeLicencia,
    gps: t.exigeGps,
  };

  return (
    <>
      <Nav m={m} idioma={idioma} />

      <main>
        {/* ── Portada. Banda oscura. ─────────────────────────────────── */}
        <section
          id="inicio"
          className="relative isolate overflow-hidden pb-[var(--seccion-y)] pt-[clamp(9rem,16vw,12rem)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[36rem] w-[min(120vw,72rem)] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-35"
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 32%, transparent) 0%, transparent 68%)",
            }}
          />

          <div className="relative mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)]">
            <div className="max-w-[46rem]">
              <Titulo linea1={t.tituloLinea1} destacado={t.tituloDestacado} />
              <p className="mt-4 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
                {t.bajada}
              </p>

              {/* El gancho financiero. Solo aparece cuando el plazo existe:
                  publicar un número inventado acá sería la peor forma de
                  empezar una relación con un transportista. */}
              {DIAS_DE_PAGO !== null && (
                <div className="mt-8 inline-flex flex-col rounded-[var(--r-card)] border border-[color-mix(in_oklab,var(--morado-ui)_45%,var(--borde))] bg-[color-mix(in_oklab,var(--morado-solido)_12%,transparent)] px-6 py-5">
                  <span className="dato text-[10px] uppercase tracking-[0.14em] text-[var(--morado-texto)]">
                    {t.pagoEtiqueta}
                  </span>
                  <span className="mt-2 text-[clamp(1.3rem,1.6vw+0.9rem,1.9rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--texto)]">
                    {t.pagoTitulo.replace("{dias}", String(DIAS_DE_PAGO))}
                  </span>
                  <span className="mt-1.5 text-[14.5px] leading-[1.5] text-[var(--texto-sec)]">
                    {t.pagoDetalle}
                  </span>
                </div>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={`mailto:${CORREO}`}
                  className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[var(--morado-solido)] px-6 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  {t.ctaPrincipal}
                  <span className="grid size-6 place-items-center rounded-full bg-white/22 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3">
                      <path
                        d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>

                <a
                  href="#requisitos"
                  className="inline-flex min-h-[52px] items-center text-[15px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
                >
                  {t.ctaSecundario}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Qué ofrece Main. Banda clara. ──────────────────────────── */}
        <section className="tema-claro">
          <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
            <h2 className="text-[clamp(1.5rem,1.8vw+1.05rem,2.15rem)] font-semibold leading-[1.12] tracking-[-0.032em] text-[var(--texto)]">
              {t.ofreceTitulo}
            </h2>

            <ul className="mt-[clamp(2rem,3vw,2.75rem)] grid grid-cols-1 sm:grid-cols-2">
              {ofrece.map(({ Icono, titulo, detalle }, i) => (
                <li
                  key={titulo}
                  className={[
                    "group border-t border-[var(--borde)]",
                    i % 2 === 1 ? "sm:border-l" : "",
                    i >= ofrece.length - 2 ? "sm:border-b" : "",
                    i === ofrece.length - 1 ? "border-b" : "",
                  ].join(" ")}
                >
                  <div className="flex h-full items-start gap-4 px-1 py-6 sm:px-6">
                    <Icono className="mt-0.5 size-7 shrink-0 text-[var(--texto-sec)] transition-colors duration-[var(--dur-estado)] group-hover:text-[var(--morado-texto)]" />
                    <div className="min-w-0">
                      <h3 className="text-[16.5px] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--texto)]">
                        {titulo}
                      </h3>
                      <p className="mt-1.5 max-w-[44ch] text-[14px] leading-[1.55] text-[var(--texto-sec)]">
                        {detalle}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Qué se exige. Banda oscura. ────────────────────────────── */}
        <section id="requisitos" className="scroll-mt-[clamp(6rem,12vw,8.5rem)]">
          <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
            <div className="max-w-[46rem]">
              <h2 className="text-[clamp(1.5rem,1.8vw+1.05rem,2.15rem)] font-semibold leading-[1.12] tracking-[-0.032em] text-[var(--texto)]">
                {t.exigeTitulo}
              </h2>
              <p className="mt-3.5 max-w-[56ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
                {t.exigeBajada}
              </p>
            </div>

            {/* En mono: son documentos con nombre propio, del registro
                administrativo chileno. Es exactamente el dato auditable que
                DESIGN.md reserva para la mono. */}
            <ul className="mt-[clamp(2rem,3vw,2.75rem)] grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {REQUISITOS_RED.map((clave) => (
                <li
                  key={clave}
                  className="flex items-start gap-3 border-t border-[color-mix(in_oklab,var(--borde)_70%,transparent)] py-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_16%,transparent)]"
                  >
                    <svg viewBox="0 0 12 12" fill="none" className="size-[11px]">
                      <path
                        d="m2.5 6.2 2.2 2.2 4.8-5"
                        stroke="var(--morado-texto)"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="dato text-[13.5px] leading-[1.55] text-[var(--texto)]">
                    {exige[clave]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Cómo es la relación, y cómo sumarse. Banda clara. ──────── */}
        <section className="tema-claro">
          <div className="mx-auto grid w-full max-w-[var(--ancho-max)] gap-[clamp(2rem,4vw,3.5rem)] px-[var(--borde-x)] py-[var(--seccion-y)] lg:grid-cols-2">
            {/* `self-start`: sin eso la tarjeta se estira a la altura de la
              columna vecina y queda medio vacía. Que mida lo que mide su
              contenido. */}
          <div className="self-start rounded-[var(--r-img)] border border-[var(--borde)] bg-[var(--sup-1)] p-7">
              <h2 className="text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                {t.relacionTitulo}
              </h2>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--texto-sec)]">
                {t.relacionDetalle}
              </p>
            </div>

            <div>
              <h2 className="text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                {t.contactoTitulo}
              </h2>
              <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--texto-sec)]">
                {t.contactoDetalle}
              </p>

              <div className="dato mt-6 flex flex-col gap-2.5 text-[14px]">
                <a
                  href={`mailto:${CORREO}`}
                  className="w-fit text-[var(--texto)] underline underline-offset-4 transition-colors duration-[var(--dur-hover)] hover:text-[var(--morado-texto)]"
                >
                  {CORREO}
                </a>
                <a
                  href={`tel:${TELEFONO_ENLACE}`}
                  className="w-fit text-[var(--texto)] underline underline-offset-4 transition-colors duration-[var(--dur-hover)] hover:text-[var(--morado-texto)]"
                >
                  {TELEFONO}
                </a>
              </div>

              <Link
                href={`/${idioma}`}
                className="mt-8 inline-flex min-h-[44px] items-center text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
              >
                {t.volver}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Pie m={m} />
      <Asesor m={m} />
    </>
  );
}
