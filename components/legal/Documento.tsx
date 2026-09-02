import Link from "next/link";
import type { Bloque, DocumentoLegal } from "../datos/legal";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";
import { NOMBRES } from "@/mensajes/idiomas";

/**
 * El molde de las dos páginas legales.
 *
 * Componente de servidor, sin una línea de JavaScript en el cliente: es
 * texto, y el texto no necesita hidratarse. La única concesión a la
 * navegación es el índice lateral, que son anclas.
 *
 * Va en `tema-claro` a propósito, contra el resto del sitio, que arranca
 * oscuro. Dos mil palabras en texto claro sobre fondo oscuro se leen peor, y
 * estas dos páginas existen para ser leídas de verdad por alguien que está
 * decidiendo si entrega sus datos.
 *
 * Sin numerar las secciones: DESIGN.md lo prohíbe salvo en el timeline, y el
 * índice enlaza por título, que es más claro que "ver sección 7".
 */

/**
 * Ancla estable a partir del título. Sin tildes, sin espacios.
 *
 * El rango de acentos va como `\p{Diacritic}` y no como los signos
 * combinantes literales: un acento suelto en el código fuente es invisible
 * en el editor y cualquiera lo borra sin darse cuenta.
 */
function ancla(titulo: string) {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Contenido({ bloque }: { bloque: Bloque }) {
  if (bloque.tipo === "parrafo") {
    return (
      <p className="max-w-[68ch] text-[clamp(0.975rem,0.3vw+0.9rem,1.0625rem)] leading-[1.7] text-[var(--texto-sec)]">
        {bloque.texto}
      </p>
    );
  }

  if (bloque.tipo === "lista") {
    return (
      <ul className="max-w-[68ch] space-y-2.5">
        {bloque.puntos.map((p) => (
          <li
            key={p}
            className="relative pl-5 text-[clamp(0.975rem,0.3vw+0.9rem,1.0625rem)] leading-[1.7] text-[var(--texto-sec)]"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.72em] size-1.5 rounded-full bg-[color-mix(in_oklab,var(--morado-ui)_60%,transparent)]"
            />
            {p}
          </li>
        ))}
      </ul>
    );
  }

  /* Las definiciones son la parte que la gente escanea: qué dato, cuánto
     tiempo, qué derecho. Van como <dl> de verdad, con filete entre filas y
     sin caja, siguiendo el patrón del roster de servicios. */
  return (
    <dl className="max-w-[72ch] border-t border-[var(--borde)]">
      {bloque.filas.map(([termino, definicion]) => (
        <div
          key={termino}
          className="grid gap-1 border-b border-[var(--borde)] py-4 sm:grid-cols-[minmax(11rem,16rem)_1fr] sm:gap-6"
        >
          <dt className="text-[15px] font-medium tracking-[-0.01em] text-[var(--texto)]">
            {termino}
          </dt>
          <dd className="text-[15px] leading-[1.65] text-[var(--texto-sec)]">
            {definicion}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function Documento({
  doc,
  m,
  idioma,
}: {
  doc: DocumentoLegal;
  m: Mensajes;
  idioma: Idioma;
}) {
  /* La fecha se formatea en el idioma del lector aunque el cuerpo esté en
     español: "2 de septiembre de 2026" y "September 2, 2026" son el mismo
     dato, y una fecha mal ordenada se lee mal en cualquier documento. */
  const fecha = new Intl.DateTimeFormat(NOMBRES[idioma].html, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${doc.actualizado}T00:00:00Z`));

  return (
    <section className="tema-claro">
      <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] pb-[var(--seccion-y)] pt-[clamp(7.5rem,13vw,10rem)]">
        <header className="max-w-[52rem]">
          <h1 className="text-[clamp(2rem,2.6vw+1.2rem,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--texto)]">
            {doc.titulo}
          </h1>
          <p className="mt-5 max-w-[56ch] text-[clamp(1rem,0.4vw+0.92rem,1.15rem)] leading-[1.6] text-[var(--texto-sec)]">
            {doc.bajada}
          </p>

          <p className="dato mt-6 text-[13px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]">
            {m.legal.actualizado} <time dateTime={doc.actualizado}>{fecha}</time>
          </p>

          {/* Solo aparece si el lector no está leyendo en español. Decirle a
              alguien que ya está en español que "la versión en español rige"
              es ruido. */}
          {idioma !== "es" && (
            <p className="mt-6 max-w-[60ch] border-l-2 border-[color-mix(in_oklab,var(--morado-ui)_55%,transparent)] pl-4 text-[14.5px] leading-[1.6] text-[var(--texto-sec)]">
              {m.legal.avisoIdioma}
            </p>
          )}
        </header>

        <div className="mt-[clamp(3rem,5vw,4.5rem)] grid gap-[clamp(2.5rem,4vw,4rem)] lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div className="space-y-[clamp(2.5rem,4vw,3.5rem)]">
            {doc.secciones.map((s) => (
              <section
                key={s.titulo}
                id={ancla(s.titulo)}
                className="scroll-mt-[clamp(6rem,12vw,8.5rem)]"
              >
                <h2 className="text-[clamp(1.3rem,1.2vw+1rem,1.6rem)] font-semibold tracking-[-0.025em] text-[var(--texto)]">
                  {s.titulo}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.bloques.map((b, i) => (
                    <Contenido key={i} bloque={b} />
                  ))}
                </div>
              </section>
            ))}

            {/* La salida de vuelta, para quien leyó hasta el final en el
                teléfono y no tiene el índice al costado. */}
            <Link
              href={`/${idioma}`}
              className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--morado-texto)] lg:hidden"
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
              {m.legal.volver}
            </Link>
          </div>

          {/* Solo en escritorio, donde hay una columna libre al costado. En
              un teléfono este índice son once enlaces y una pantalla entera
              entre el título y la primera frase del documento, que es
              exactamente lo contrario de ayudar a leerlo. Ahí se lee
              bajando, y la vuelta al inicio queda al final del texto. */}
          <nav
            aria-label={m.legal.indice}
            className="hidden lg:sticky lg:top-[7rem] lg:block lg:self-start"
          >
            <h2 className="dato text-[12px] uppercase tracking-[0.1em] text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]">
              {m.legal.indice}
            </h2>
            <ul className="mt-4 space-y-2 border-l border-[var(--borde)] pl-4">
              {doc.secciones.map((s) => (
                <li key={s.titulo}>
                  <a
                    href={`#${ancla(s.titulo)}`}
                    className="block text-[14px] leading-[1.45] text-[var(--texto-sec)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--texto)]"
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>

            <Link
              href={`/${idioma}`}
              className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--morado-texto)]"
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
              {m.legal.volver}
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
