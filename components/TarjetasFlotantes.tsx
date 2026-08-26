"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import s from "./TarjetasFlotantes.module.css";

/**
 * Las dos tarjetas de vidrio que flanquean al camión.
 *
 * Derecha: simulación de GPS. Un marcador recorre la ruta y un testigo
 * parpadea, como un equipo transmitiendo. Es ilustrativo, no un dashboard
 * operando: no lleva folios, patentes ni IDs inventados, que es lo que el
 * doc de marca §9 prohíbe mientras el portal no exista.
 *
 * Izquierda: el lockup vertical de marca. Junto al logo va siempre la
 * bajada aprobada del doc §7 — "Transporte de carga en todo Chile" — que
 * además es lo que ancla la marca al rubro y al país, el riesgo número uno
 * de PRODUCT.md.
 *
 * Bajo lg se apagan: en una columna, encima del video, taparían al camión.
 */

const TRAZADO = "M6 56C34 56 44 18 88 18s54 38 82 38";

/** Punto que late más la línea que la une con la escena. */
function Guia({ lado }: { lado: "izquierda" | "derecha" }) {
  const esIzq = lado === "izquierda";
  return (
    <span
      className={[
        "absolute top-1/2 hidden h-px w-[clamp(2rem,5vw,4.5rem)] items-center lg:flex",
        esIzq ? "right-full mr-1 flex-row-reverse" : "left-full ml-1",
      ].join(" ")}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[color-mix(in_oklab,white_45%,transparent)]" />
      <span className="relative grid size-2 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-[latido_2.4s_var(--ease-quart)_infinite] rounded-full bg-[var(--morado-ui)]" />
        <span className="size-[3px] rounded-full bg-white" />
      </span>
    </span>
  );
}

export default function TarjetasFlotantes() {
  const reducir = useReducedMotion();

  const entrada = (retraso: number) => ({
    initial: { opacity: 0, y: reducir ? 0 : 16, filter: reducir ? "none" : "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: reducir ? 0 : 0.75,
      delay: reducir ? 0 : retraso,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <div
      aria-hidden="true"
      data-tarjetas-hero=""
      className="pointer-events-none absolute inset-0 z-[var(--z-flotante)]"
    >
      {/* GPS — derecha, a la altura de la carga. */}
      <motion.div
        {...entrada(0.5)}
        className="absolute right-[3%] top-[42%] w-[7.25rem] sm:top-[38%] sm:w-[10rem] lg:top-[40%] lg:w-[12.5rem] xl:right-[5.5%]"
      >
      <Guia lado="izquierda" />
      <div
        className={`vidrio flota ${s.brillo} relative overflow-hidden rounded-[13px] p-2 text-center sm:rounded-[16px] sm:p-2.5`}
        style={{ animation: "flotar 7s var(--ease-in-out-quint) infinite" }}
      >
        <div className="mb-1.5 flex items-center justify-between px-0.5 sm:mb-2">
          <span className="flex items-center gap-1.5">
            <span className={`${s.testigo} size-1.5 rounded-full bg-[var(--morado-ui)]`} />
            <span className="dato text-[9.5px] uppercase tracking-[0.12em] text-[var(--texto-sec)]">
              GPS
            </span>
          </span>
          <span className="dato text-[9.5px] uppercase tracking-[0.08em] text-[var(--morado-texto)]">
            En ruta
          </span>
        </div>

        <div className="relative h-[44px] overflow-hidden rounded-[8px] bg-[color-mix(in_oklab,var(--fondo)_62%,transparent)] sm:h-[62px] sm:rounded-[10px] lg:h-[74px]">
          {/* Retícula del mapa, muy tenue. */}
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--texto-sec) 1px, transparent 1px), linear-gradient(to bottom, var(--texto-sec) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <svg viewBox="0 0 176 74" className="absolute inset-0 size-full" fill="none">
            <path
              d={TRAZADO}
              stroke="color-mix(in oklab, var(--morado-ui) 42%, transparent)"
              strokeWidth="1.6"
              strokeDasharray="4 5"
              strokeLinecap="round"
            />
            <circle cx="6" cy="56" r="2.5" fill="color-mix(in oklab, white 75%, transparent)" />
            <circle cx="170" cy="56" r="2.5" fill="color-mix(in oklab, white 40%, transparent)" />

            <circle className={s.halo} r="4" fill="var(--morado-ui)" />
            <circle className={s.recorrido} r="4" fill="var(--morado-ui)" />
            <circle className={s.recorrido} r="1.6" fill="white" />
          </svg>
        </div>

        <p className="mt-1.5 text-[10.5px] font-semibold leading-[1.25] tracking-[-0.015em] text-[var(--texto)] sm:mt-2 sm:text-[12.5px]">
          Monitoreo en ruta
        </p>
        <p className="mt-0.5 hidden text-[11px] leading-[1.4] text-[var(--texto)] opacity-80 sm:block">
          Trazabilidad del retiro a la entrega
        </p>
      </div>
      </motion.div>

      {/* Marca — izquierda, abajo. Logo grande y bajada aprobada. */}
      <motion.div
        {...entrada(0.65)}
        className="absolute left-[3%] top-[42%] w-[7.25rem] sm:top-[54%] sm:w-[10rem] lg:bottom-[19%] lg:top-auto lg:w-[12.5rem] xl:left-[5.5%]"
      >
      <Guia lado="derecha" />
      <div
        className={`vidrio flota ${s.brillo} relative overflow-hidden rounded-[13px] px-2 pb-2 pt-3 text-center sm:rounded-[16px] sm:px-3 sm:pb-3 sm:pt-4`}
        style={{
          animation: "flotar 8.5s var(--ease-in-out-quint) infinite",
          animationDelay: "-3.2s",
        }}
        data-barrido="tarde"
      >
        <Image
          src="/logo-lockup-blanco.png"
          alt=""
          width={1048}
          height={954}
          className="mx-auto h-[42px] w-auto sm:h-[58px] lg:h-[74px]"
        />

        <div className={`${s.rutaMini} mt-2 sm:mt-3.5`} aria-hidden="true">
          <span className={s.segmentadaMini} />
        </div>

        <p className="mt-1.5 text-[9.5px] leading-[1.35] text-[var(--texto)] opacity-80 sm:mt-2.5 sm:text-[11.5px]">
          Transporte de carga
          <br />
          en todo Chile
        </p>
      </div>
      </motion.div>
    </div>
  );
}
