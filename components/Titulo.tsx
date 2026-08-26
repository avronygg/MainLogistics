"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Título de sección en dos líneas.
 *
 * Estructura fija en todo el sitio: la primera línea sostiene el contexto y
 * la segunda carga el mensaje, en morado y subrayada. Leído de reojo —que es
 * como se lee una landing— la segunda línea sola tiene que decir de qué se
 * trata la sección.
 *
 * El subrayado se dibuja de izquierda a derecha al entrar en pantalla: es el
 * mismo motivo de ruta que recorre el sitio, a escala de detalle. Va por
 * debajo de la línea de base y con las puntas redondeadas, no pegado al
 * texto, para que se lea como trazo y no como borde de caja.
 */
export default function Titulo({
  linea1,
  destacado,
  className = "",
  tamano = "seccion",
}: {
  linea1: string;
  destacado: string;
  className?: string;
  /** `seccion` para h2; `tarjeta` para h3 dentro de una card. */
  tamano?: "seccion" | "tarjeta";
}) {
  const reducir = useReducedMotion();
  const esSeccion = tamano === "seccion";

  return (
    <h2
      className={[
        "font-semibold tracking-[-0.035em] text-[var(--texto)]",
        esSeccion
          ? "text-[clamp(1.85rem,2.4vw+1.1rem,3.1rem)] leading-[1.1]"
          : "text-[clamp(1.35rem,1.5vw+1rem,1.85rem)] leading-[1.15]",
        className,
      ].join(" ")}
    >
      <span className="block">{linea1}</span>

      <span className="relative inline-block text-[var(--morado-ui)]">
        {destacado}
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-[0.12em] left-0 h-[0.09em] w-full origin-left rounded-full bg-[color-mix(in_oklab,var(--morado-ui)_55%,transparent)]"
          initial={{ scaleX: reducir ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{
            duration: reducir ? 0 : 0.9,
            delay: reducir ? 0 : 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </span>
    </h2>
  );
}
