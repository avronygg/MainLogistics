"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CIUDADES } from "@/components/datos/presentacion";
import s from "./presentacion.module.css";

/**
 * Arica → Punta Arenas, recorrida con el scroll.
 *
 * La línea avanza mientras el capítulo entra, y el punto va marcando la
 * latitud real por la que pasa. Es el único gráfico de la página y sigue la
 * regla del sitio: lo que se mueve es una ruta que avanza.
 *
 * Termina justo cuando el capítulo queda encuadrado, para que al presentar en
 * pantalla completa, donde cada capítulo calza con la pantalla, la ruta se vea
 * completa. Con `prefers-reduced-motion` aparece completa desde el inicio, y
 * eso lo resuelve el CSS: el servidor no sabe la preferencia, y decidirlo en el
 * render hace que servidor y cliente pinten árboles distintos.
 *
 * Las ciudades se leen siempre: lo único que depende de la animación es el
 * relleno de su punto, nunca el texto.
 */

const NORTE = CIUDADES[0].lat;
const SUR = CIUDADES[CIUDADES.length - 1].lat;
const fraccion = (lat: number) => (lat - NORTE) / (SUR - NORTE);

/** −33,45 → 33°27′ S. Misma notación que las coordenadas fijas. */
function coordenada(lat: number) {
  const absoluta = Math.abs(lat);
  let grados = Math.floor(absoluta);
  let minutos = Math.round((absoluta - grados) * 60);
  if (minutos === 60) {
    grados += 1;
    minutos = 0;
  }
  return `${grados}°${String(minutos).padStart(2, "0")}′ S`;
}

function Ciudad({
  ciudad,
  avance,
}: {
  ciudad: (typeof CIUDADES)[number];
  avance: MotionValue<number>;
}) {
  const f = fraccion(ciudad.lat);
  const relleno = useTransform(avance, [Math.max(f - 0.01, 0), f], [0, 1]);

  return (
    <li className={s.ciudad} style={{ top: `${f * 100}%` }}>
      <span className={s.ciudadPunto} aria-hidden="true">
        <motion.span className={s.ciudadRelleno} style={{ opacity: relleno }} />
      </span>
      <span className={s.ciudadNombre}>{ciudad.nombre}</span>
      <span className={`dato ${s.ciudadCoord}`}>{ciudad.coord}</span>
    </li>
  );
}

export default function RutaCobertura({ etiqueta }: { etiqueta: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.92"],
  });

  const alto = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lectura = useTransform(scrollYProgress, (v) =>
    coordenada(NORTE + (SUR - NORTE) * Math.min(Math.max(v, 0), 1)),
  );

  // En los extremos la lectura repetiría la coordenada de Arica y Punta Arenas,
  // que ya están escritas al lado.
  const opacidadLectura = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={s.ruta}>
      <div className={s.rutaPista} aria-hidden="true">
        <motion.div className={s.rutaAvance} style={{ height: alto }} />
      </div>
      <motion.div className={s.rutaMarca} style={{ top: alto }} aria-hidden="true">
        <motion.span className={`dato ${s.rutaLectura}`} style={{ opacity: opacidadLectura }}>
          {lectura}
        </motion.span>
        <span className={s.rutaPunto} />
      </motion.div>
      <ol className={s.ciudades} aria-label={etiqueta}>
        {CIUDADES.map((ciudad) => (
          <Ciudad key={ciudad.nombre} ciudad={ciudad} avance={scrollYProgress} />
        ))}
      </ol>
    </div>
  );
}
