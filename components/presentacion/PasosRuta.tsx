"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import s from "./presentacion.module.css";

/**
 * Los tres pasos, unidos por una carretera que se llena con el scroll.
 *
 * Es el único lugar de la página con números: acá el orden sí es información
 * (DESIGN.md, "timeline"). El avance baja como variable CSS y el CSS decide si
 * se llena a lo ancho (escritorio) o a lo alto (móvil).
 */
export default function PasosRuta({
  pasos,
}: {
  pasos: { titulo: string; cuerpo: string; entrega: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.95"],
  });

  return (
    <motion.div
      ref={ref}
      className={s.pasosMarco}
      style={{ "--avance": scrollYProgress } as React.CSSProperties}
    >
      <span className={s.pasosPista} aria-hidden="true">
        <span className={s.pasosAvance} />
      </span>
      {/* `role`: Safari le quita la semántica de lista a un `list-style: none`,
          y acá el orden de los pasos es lo que importa. */}
      <ol role="list" className={s.pasos}>
        {pasos.map((paso, i) => (
          <li key={paso.titulo} className={s.paso}>
            <span className={s.pasoNumero} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={s.pasoTitulo}>{paso.titulo}</h3>
            <p className={s.pasoCuerpo}>{paso.cuerpo}</p>
            <p className={s.pasoEntrega}>{paso.entrega}</p>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
