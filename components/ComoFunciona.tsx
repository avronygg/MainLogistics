"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import Revelar from "./Revelar";
import { IconoCotizar, IconoRetiro, IconoEntrega, IconoReloj } from "./Iconos";
import Titulo from "./Titulo";
import type { Mensajes } from "@/mensajes";

/**
 * Sexta sección: cómo funciona, en tres hitos.
 *
 * Va sobre fondo claro: el sitio alterna bandas para dar ritmo, y esta cae
 * entre las reseñas (oscura) y el equipo (oscura).
 *
 * Es el único lugar del sitio con numeración. En el resto, numerar secciones
 * es andamiaje; acá el orden ES la información — primero se cotiza, después
 * se retira, después se entrega, y no al revés.
 *
 * La línea que une los hitos se dibuja al entrar: el mismo motivo de ruta
 * que recorre todo el sitio.
 */

/**
 * Los hitos se arman a partir del diccionario.
 *
 * Función en vez de arreglo con solo la clave: son tres, fijos, y así el
 * orden, el número y el icono se siguen leyendo juntos en un lugar. Guardar
 * únicamente la clave obligaría a saltar al diccionario para saber qué hito
 * es cada uno.
 */
function hitos(m: Mensajes) {
  return [
    { n: 1, Icono: IconoCotizar, ...m.comoFunciona.hitos.cotizacion },
    { n: 2, Icono: IconoRetiro, ...m.comoFunciona.hitos.retiro },
    { n: 3, Icono: IconoEntrega, ...m.comoFunciona.hitos.entrega },
  ];
}

export default function ComoFunciona({ m }: { m: Mensajes }) {
  const reducir = useReducedMotion();
  const HITOS = hitos(m);

  return (
    <section id="como-funciona" className="tema-claro scroll-mt-[clamp(6rem,12vw,8.5rem)]">
      <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <Revelar className="max-w-[46rem]">
          <Titulo
            linea1={m.comoFunciona.tituloLinea1}
            destacado={m.comoFunciona.tituloDestacado}
          />
          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            {m.comoFunciona.bajadaInicio}{" "}
            <span className="realce">{m.comoFunciona.bajadaRealce}</span>{" "}
            {m.comoFunciona.bajadaFin}
          </p>
        </Revelar>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          {/* Los tres hitos, en tarjetas unidas por el riel. */}
          <ol className="relative grid gap-4 sm:grid-cols-3">
            {/* Riel: se dibuja de izquierda a derecha una sola vez. */}
            <div
              aria-hidden="true"
              className="absolute left-6 top-[calc(1.5rem+22px)] hidden h-px w-[calc(100%-3rem)] sm:block"
            >
              <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--borde)_75%,transparent)]" />
              <motion.div
                className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--morado-ui)] to-[color-mix(in_oklab,var(--morado-ui)_25%,transparent)]"
                initial={{ scaleX: reducir ? 1 : 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: reducir ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {HITOS.map(({ n, Icono, titulo, detalle, dato }, i) => (
              <Revelar key={n} retraso={0.12 + i * 0.12}>
                <li className="relative flex h-full flex-col rounded-[var(--r-img)] border border-[var(--borde)] bg-[var(--sup-1)] p-6">
                  <div className="flex items-center gap-3">
                    <span className="relative z-[1] grid size-11 shrink-0 place-items-center rounded-[13px] bg-[var(--morado-solido)] text-white">
                      <Icono className="size-[22px]" />
                    </span>
                    <span className="dato text-[11px] uppercase tracking-[0.12em] text-[var(--texto-sec)]">
                      {m.comoFunciona.paso} {String(n).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold tracking-[-0.028em] text-[var(--texto)]">
                    {titulo}
                  </h3>

                  <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[var(--texto-sec)]">
                    {detalle}
                  </p>

                  <p className="dato mt-auto inline-flex w-fit rounded-[var(--r-chip)] border border-[color-mix(in_oklab,var(--borde)_80%,transparent)] px-2.5 py-1 pt-1 text-[11px] text-[var(--morado-texto)] [margin-top:1.5rem]">
                    {dato}
                  </p>
                </li>
              </Revelar>
            ))}
          </ol>

          {/* Plazos, con foto. */}
          <Revelar retraso={0.3}>
            <article className="sobre-foto group relative isolate flex h-full min-h-[19rem] flex-col justify-end overflow-hidden rounded-[var(--r-img)]">
              <Image
                src="/fotos/monitoreo-reloj.webp"
                alt={m.comoFunciona.plazosAltFoto}
                width={1536}
                height={1024}
                quality={90}
                sizes="(min-width: 1024px) 22vw, 100vw"
                className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_60%,transparent)] to-transparent" />

              <span className="absolute left-5 top-5 z-[1] inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--sup-1)_70%,transparent)] px-2.5 py-1 backdrop-blur-md">
                <IconoReloj className="size-3.5 text-[var(--morado-ui)]" />
                <span className="dato text-[10.5px] uppercase tracking-[0.1em] text-[var(--texto)]">
                  {m.comoFunciona.plazosEtiqueta}
                </span>
              </span>

              <div className="relative p-6">
                <h3 className="text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                  {m.comoFunciona.plazosTituloInicio}{" "}
                  <span className="text-[var(--morado-texto)]">
                    {m.comoFunciona.plazosTituloDestacado}
                  </span>
                  {m.comoFunciona.plazosTituloFin}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.5] text-[var(--texto-sec)]">
                  {m.comoFunciona.plazosDetalle}
                </p>
              </div>
            </article>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
