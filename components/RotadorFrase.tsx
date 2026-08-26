"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Mensajes } from "@/mensajes";

/**
 * La palabra que cambia, dentro de una cápsula de vidrio.
 *
 * La cápsula resuelve el problema de layout: su ancho es fijo — el de la
 * frase más larga — así que "SIEMPRE" no se mueve nunca y el titular se
 * queda quieto aunque la palabra cambie. El aire que le sobra a una palabra
 * corta se lee como parte de la cápsula, no como un hueco.
 *
 * Adentro, las palabras se van pasando en vertical dentro de la ranura
 * recortada.
 *
 * Las frases vienen del diccionario (`m.hero.rotador.frases`) como arreglo:
 * son una secuencia, se recorren y se miden en orden, y el número de frases
 * puede cambiar de un idioma a otro sin tocar el componente. La versión para
 * lector de pantalla va como una sola cadena aparte y no se arma uniendo el
 * arreglo: cada idioma puntúa y coordina la enumeración a su manera — el
 * chino ni siquiera usa coma con espacio — y armarla con separadores del
 * diccionario deja código ilegible por un resultado peor.
 */

/**
 * Cortes de escena del video del hero, medidos sobre el archivo original con
 * detección de escena de ffmpeg (`select='gt(scene,0.2)'`). Son cinco tomas
 * de aproximadamente un segundo.
 *
 * La palabra cambia justo en cada corte: el titular y la imagen se mueven en
 * el mismo golpe. Si el video se reemplaza, hay que volver a medir con
 * `scripts/video-cortes.mjs`.
 */
const CORTES = [0, 1.0, 2.042, 3.083, 4.083];

/** Solo se usa si no hay video reproduciéndose. */
const INTERVALO = 2600;
const TRANSICION = 0.3; // s. Con cortes de ~1s, mas largo no alcanza a asentar
const VIAJE = 130; // % del alto de la palabra: supera la ranura, entra y sale limpia

export default function RotadorFrase({ m }: { m: Mensajes }) {
  const frases = m.hero.rotador.frases;
  const reducir = useReducedMotion();
  const [i, setI] = useState(0);
  const [ancho, setAncho] = useState(0);
  const fantasmas = useRef<(HTMLSpanElement | null)[]>([]);

  // Se mide la más ancha una sola vez: la cápsula no cambia de tamaño.
  const medir = useCallback(() => {
    const anchos = fantasmas.current.map((el) => el?.getBoundingClientRect().width ?? 0);
    const max = Math.max(...anchos, 0);
    if (max > 0) setAncho(max);
  }, []);

  // El titular es fluido (clamp): hay que remedir al cambiar el viewport,
  // y otra vez cuando Geist reemplaza a la fuente de respaldo.
  useLayoutEffect(() => {
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(document.documentElement);
    document.fonts?.ready.then(medir).catch(() => {});
    return () => ro.disconnect();
  }, [medir]);

  const cantidad = frases.length;

  useEffect(() => {
    if (reducir) return;

    const video = document.querySelector<HTMLVideoElement>("video[data-hero]");
    let raf = 0;
    let intervalo = 0;
    let escenaPrevia = -1;

    const escenaDe = (t: number) => {
      for (let n = CORTES.length - 1; n >= 0; n--) if (t >= CORTES[n]) return n;
      return 0;
    };

    const porIntervalo = () => {
      window.clearInterval(intervalo);
      intervalo = window.setInterval(
        () => setI((n) => (n + 1) % cantidad),
        INTERVALO,
      );
    };

    if (!video) {
      porIntervalo();
      return () => window.clearInterval(intervalo);
    }

    // Se sigue currentTime por cuadro: `timeupdate` dispara unas cuatro veces
    // por segundo y llegaría tarde a cortes que están a un segundo.
    let ultimoTiempo = -1;
    let quietoDesde = 0;

    const seguir = (ahora: number) => {
      const t = video.currentTime;

      // Autoplay bloqueado o video detenido: se cae al intervalo para que
      // el titular no quede congelado.
      if (t === ultimoTiempo) {
        if (!quietoDesde) quietoDesde = ahora;
        else if (ahora - quietoDesde > 1500) {
          porIntervalo();
          return;
        }
      } else {
        ultimoTiempo = t;
        quietoDesde = 0;
      }

      const escena = escenaDe(t);
      if (escenaPrevia === -1) escenaPrevia = escena;
      else if (escena !== escenaPrevia) {
        escenaPrevia = escena;
        setI((n) => (n + 1) % cantidad);
      }

      raf = requestAnimationFrame(seguir);
    };

    raf = requestAnimationFrame(seguir);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(intervalo);
    };
  }, [reducir, cantidad]);

  return (
    <>
      {/* Capa de medición: caja de tamaño cero, no aporta al ancho de la línea. */}
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 block size-0 overflow-hidden"
      >
        <span className="absolute whitespace-nowrap">
          {frases.map((f, n) => (
            <span
              key={n}
              ref={(el) => {
                fantasmas.current[n] = el;
              }}
            >
              {f}
            </span>
          ))}
        </span>
      </span>

      {/* El titular completo, una sola vez, para lectores de pantalla. */}
      <span className="sr-only">{m.hero.rotador.alternativas}</span>

      <span
        aria-hidden="true"
        className="capsula-frase relative block h-[1.48em] shrink-0 overflow-hidden rounded-full"
        style={{ width: ancho ? `calc(${ancho}px + 0.92em)` : undefined }}
      >
        <AnimatePresence initial={false}>
          {/* La clave es el índice y no la palabra: dos idiomas pueden repetir
              la misma palabra en la lista y ahí la animación no dispararía. */}
          <motion.span
            key={i}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
            initial={{ y: reducir ? 0 : `${VIAJE}%`, opacity: reducir ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reducir ? 0 : `-${VIAJE}%`, opacity: 0 }}
            transition={{ duration: reducir ? 0 : TRANSICION, ease: [0.16, 1, 0.3, 1] }}
          >
            {frases[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
