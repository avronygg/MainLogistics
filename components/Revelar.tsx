"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Entrada al aparecer en pantalla.
 *
 * Una sola pieza para todas las secciones: así el movimiento del sitio es
 * uno y no una colección de efectos distintos.
 *
 * Regla importante: el contenido está VISIBLE por defecto y la animación
 * solo lo mejora. Nunca se condiciona la visibilidad a que la animación
 * dispare — las transiciones se pausan en pestañas ocultas y en renderers
 * sin scroll, y el bloque terminaría publicándose en blanco.
 *
 * Con `prefers-reduced-motion` no hay desplazamiento ni desenfoque: el
 * elemento aparece y ya.
 */
export default function Revelar({
  children,
  retraso = 0,
  desplazamiento = 18,
  className = "",
}: {
  children: ReactNode;
  /** Segundos. Para escalonar elementos de una misma fila. */
  retraso?: number;
  desplazamiento?: number;
  className?: string;
}) {
  const reducir = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reducir
          ? false
          : { opacity: 0, y: desplazamiento, filter: "blur(6px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: reducir ? 0 : 0.7,
        delay: reducir ? 0 : retraso,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
