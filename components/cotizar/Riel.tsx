"use client";

import { pasos } from "../datos/formulario";
import { rellenar } from "./Campos";
import type { Mensajes } from "@/mensajes";

/**
 * Riel de progreso del formulario.
 *
 * Seis tramos, como la segmentada de la carretera del isotipo. Es el único
 * elemento animado del formulario, y se mueve porque una ruta avanza
 * (DESIGN.md, principio 2: la carretera es el único ornamento).
 *
 * NÚMERO Y NO PORCENTAJE. Un "50% completado" afirma que los seis pasos
 * pesan lo mismo, y no es cierto: el paso 3 es un toque y el paso 2 son seis
 * campos. "3/6" es verificable; el porcentaje es una cifra inventada, y este
 * sitio no publica cifras que no puede sostener (PRODUCT.md, principio 5).
 * Además una barra continua se lee como "cargando".
 *
 * El contador va en dígitos arábigos en los cuatro idiomas: es dato
 * auditable, no una palabra.
 *
 * Nunca `role="progressbar"`: el lector de pantalla lo anuncia como una
 * carga en curso, que es exactamente lo que esto no es.
 *
 * NOTA PARA QUIEN VENGA DESPUÉS: DESIGN.md dice que no hay numeración de
 * secciones salvo el timeline, "que sí es una secuencia". Un formulario por
 * pasos ES una secuencia, así que la numeración de acá cae en esa misma
 * excepción. No es una violación de la regla; no la "corrijan".
 */
export default function Riel({
  actual,
  completados,
  irA,
  enResumen,
  m,
}: {
  actual: number;
  /** Índices de pasos ya completados. Solo esos son navegables. */
  completados: number[];
  irA: (i: number) => void;
  enResumen: boolean;
  m: Mensajes;
}) {
  const PASOS = pasos(m);
  const total = PASOS.length;
  const t = m.cotizar.riel;

  return (
    <div>
      <ol className="flex gap-[2px]">
        {PASOS.map((p, i) => {
          const hecho = enResumen || completados.includes(i);
          const esActual = !enResumen && i === actual;
          const navegable = hecho && !esActual;

          const color = esActual
            ? "bg-[var(--morado-ui)]"
            : hecho
              ? "bg-[var(--morado-solido)]"
              : "bg-[var(--borde)]";

          // El anuncio se arma de una plantilla completa y no de trozos: en
          // otro idioma el número puede no ir primero.
          const anuncio = rellenar(
            navegable
              ? t.pasoNavegable
              : esActual
                ? t.pasoActual
                : hecho
                  ? t.pasoCompletado
                  : t.pasoPendiente,
            { n: i + 1, titulo: p.titulo },
          );

          return (
            <li
              key={p.id}
              aria-current={esActual ? "step" : undefined}
              className="flex-1"
            >
              {/* El tramo se ve de 3px pero su área táctil llega a 44px: el
                  padding transparente es lo que hace que se pueda tocar con
                  guantes. Sin esto es un objetivo de 3px. */}
              {navegable ? (
                <button
                  type="button"
                  onClick={() => irA(i)}
                  className="group flex w-full items-center py-[20px] focus:outline-none"
                >
                  <span className="sr-only">{anuncio}</span>
                  <span
                    aria-hidden="true"
                    className={`h-[3px] w-full rounded-full transition-[background-color,height] duration-[300ms] ease-[var(--ease-quart)] group-hover:h-[5px] group-focus-visible:h-[5px] motion-reduce:transition-none ${color}`}
                  />
                </button>
              ) : (
                <div
                  aria-disabled={!hecho || undefined}
                  className="flex items-center py-[20px]"
                >
                  <span className="sr-only">{anuncio}</span>
                  <span
                    aria-hidden="true"
                    className={`w-full rounded-full transition-[background-color,height] duration-[300ms] ease-[var(--ease-quart)] motion-reduce:transition-none ${color} ${
                      esActual ? "h-[5px]" : "h-[3px]"
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="-mt-2 flex items-baseline gap-2.5">
        {/* El contador es dato auditable: va en Geist Mono. */}
        <span className="dato text-[13px] font-medium text-[var(--morado-texto)]">
          {enResumen ? `${total}/${total}` : `${actual + 1}/${total}`}
        </span>
        <span className="text-[16px] font-semibold leading-[1.3] tracking-[-0.02em] text-[var(--texto)]">
          {enResumen ? t.resumen : PASOS[actual].titulo}
        </span>
      </p>

      {/* Los nombres completos solo desde 1024px. En 375px terminan
          truncados ("Carga y…", "Origen y…"), y una etiqueta cortada es peor
          que un número honesto. */}
      <ol className="mt-3 hidden gap-[2px] lg:flex" aria-hidden="true">
        {PASOS.map((p, i) => {
          const hecho = enResumen || completados.includes(i);
          const esActual = !enResumen && i === actual;
          return (
            <li
              key={p.id}
              className={`flex-1 text-[13px] leading-[1.3] ${
                esActual
                  ? "font-medium text-[var(--texto)]"
                  : hecho
                    ? "text-[var(--texto-sec)]"
                    : "text-[color-mix(in_oklab,var(--texto-sec)_65%,transparent)]"
              }`}
            >
              {p.titulo}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
