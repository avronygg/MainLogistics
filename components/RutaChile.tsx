"use client";

import { motion, useReducedMotion } from "motion/react";
import s from "./RutaChile.module.css";

/**
 * La ruta troncal de Arica a Punta Arenas, dibujada en código.
 *
 * Las ciudades no están repartidas a ojo: van posicionadas por su latitud
 * real, normalizada entre Arica (−18,48°) y Punta Arenas (−53,16°). Por eso
 * el salto entre Puerto Montt y Punta Arenas es enorme y el norte va
 * apretado — así es el país. Es el principio de "el dato es la decoración"
 * aplicado a un gráfico: si el espaciado fuera decorativo, no diría nada.
 *
 * Geometría: cada ciudad se centra con translateY(-50%) sobre su porcentaje,
 * así que el 0% y el 100% del contenedor coinciden con el centro del primer
 * y del último punto. El riel va de 0 a 100% y calza exacto.
 */

const CIUDADES = [
  { nombre: "Arica", lat: -18.48, coord: "18°28′ S" },
  { nombre: "Antofagasta", lat: -23.65 },
  { nombre: "La Serena", lat: -29.9 },
  { nombre: "Santiago", lat: -33.45 },
  { nombre: "Concepción", lat: -36.83 },
  { nombre: "Puerto Montt", lat: -41.47 },
  { nombre: "Punta Arenas", lat: -53.16, coord: "53°10′ S" },
];

const NORTE = CIUDADES[0].lat;
const SUR = CIUDADES[CIUDADES.length - 1].lat;
const posicion = (lat: number) => ((lat - NORTE) / (SUR - NORTE)) * 100;

/** Columna del riel: 20px de ancho, el punto centrado en 10px. */
const COLUMNA = 20;

export default function RutaChile() {
  const reducir = useReducedMotion();

  return (
    <div className="relative w-full max-w-[19rem] shrink-0 select-none lg:w-[17rem]">
      <div className="relative" style={{ height: "17.5rem" }}>
        {/* Riel base, exactamente de centro a centro. */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-px"
          style={{ left: COLUMNA / 2 }}
        >
          <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--borde)_85%,transparent)]" />

          {/* Trazo de marca: se dibuja de norte a sur una sola vez. */}
          <motion.div
            className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--morado-ui)] via-[var(--morado-ui)] to-[color-mix(in_oklab,var(--morado-ui)_30%,transparent)]"
            initial={{ scaleY: reducir ? 1 : 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reducir ? 0 : 1.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Pulso que baja: el mismo motivo de ruta del resto del sitio. */}
          <span
            aria-hidden="true"
            className={`${s.pulso} absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white to-transparent`}
            style={{ ["--recorrido" as string]: "17.5rem" }}
          />
        </div>

        <ul className="relative h-full">
          {CIUDADES.map((c, i) => {
            const extremo = i === 0 || i === CIUDADES.length - 1;
            return (
              <li
                key={c.nombre}
                className="absolute flex w-full items-center gap-3"
                style={{ top: `${posicion(c.lat)}%`, transform: "translateY(-50%)" }}
              >
                <motion.span
                  className="relative grid shrink-0 place-items-center"
                  style={{ width: COLUMNA, height: COLUMNA }}
                  initial={{ opacity: reducir ? 1 : 0, scale: reducir ? 1 : 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: reducir ? 0 : 0.5,
                    delay: reducir ? 0 : 0.3 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {extremo ? (
                    <>
                      {/* Halo suave solo en los extremos, que son los que
                          nombran la promesa "de Arica a Punta Arenas". */}
                      <span className="absolute size-[18px] rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_18%,transparent)]" />
                      <span className="relative grid size-[11px] place-items-center rounded-full bg-[var(--morado-solido)]">
                        <span className="size-[3.5px] rounded-full bg-white" />
                      </span>
                    </>
                  ) : (
                    <span className="size-[7px] rounded-full border-[1.5px] border-[var(--morado-ui)] bg-[var(--sup-1)]" />
                  )}
                </motion.span>

                <span
                  className={[
                    "whitespace-nowrap text-[13.5px] leading-none",
                    extremo
                      ? "font-semibold tracking-[-0.02em] text-[var(--texto)]"
                      : "text-[var(--texto-sec)]",
                  ].join(" ")}
                >
                  {c.nombre}
                </span>

                {c.coord && (
                  <span className="dato ml-auto whitespace-nowrap text-[10px] uppercase tracking-[0.06em] text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]">
                    {c.coord}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
