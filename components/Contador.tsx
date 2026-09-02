"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Contador que sube hasta su valor cuando entra en pantalla.
 *
 * ── EL VALOR FINAL VA EN EL HTML SERVIDO ───────────────────────────────
 *
 * Antes arrancaba en `useState(0)`, así que el HTML que sirve el servidor
 * decía `0` y el número real solo aparecía después de que el navegador
 * ejecutara la animación. Google y los asistentes de IA no la ejecutan: para
 * ellos la cobertura de Main Logistics eran cero kilómetros.
 *
 * No es una hipótesis. El brief de desarrollo (§6.5) lo detectó también en
 * Sotraser, Nazar y Agunsa: sus contadores animados devuelven `0` en el HTML
 * y sus cifras son invisibles para los buscadores. Los dos únicos sitios del
 * benchmark cuyos números "existen" son los que los escriben en texto plano.
 *
 * La solución: el estado inicial es el valor FINAL, así el servidor lo pinta.
 * Ya en el cliente, y ANTES del primer pintado, se baja a cero para poder
 * animar. Va en `useLayoutEffect` justamente por eso — con `useEffect` el
 * navegador alcanza a pintar el número final y se ve un parpadeo feo.
 *
 * Con movimiento reducido no se toca nada: queda el valor final del servidor.
 */

/**
 * `useLayoutEffect` no existe en el servidor y React avisa si se llama ahí.
 * Se resuelve en el módulo, no dentro del componente: así no es una llamada
 * condicional a un hook.
 */
const useEfectoDePintado = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Contador({
  hasta,
  duracion = 1600,
}: {
  hasta: number;
  duracion?: number;
}) {
  const reducir = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const enVista = useInView(ref, { once: true, amount: 0.5 });

  // Estado inicial = valor final. Es lo que sale en el HTML del servidor.
  const [valor, setValor] = useState(hasta);
  const [animable, setAnimable] = useState(false);

  useEfectoDePintado(() => {
    if (reducir) return;
    setValor(0);
    setAnimable(true);
  }, [reducir]);

  useEffect(() => {
    if (!animable || !enVista || reducir) return;

    let raf = 0;
    let inicio: number | null = null;
    // Salida exponencial: arranca rápido y frena, como el resto del sistema.
    const suavizar = (t: number) => 1 - Math.pow(2, -10 * t);

    const paso = (ahora: number) => {
      inicio ??= ahora;
      const t = Math.min((ahora - inicio) / duracion, 1);
      setValor(Math.round(suavizar(t) * hasta));
      if (t < 1) raf = requestAnimationFrame(paso);
      else setValor(hasta);
    };

    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [animable, enVista, hasta, duracion, reducir]);

  const mostrado = reducir ? hasta : valor;

  return (
    <span ref={ref} className="tabular-nums">
      {/* Formato chileno: punto como separador de miles. Se usa `Intl` en vez
          de armarlo a mano para que no se rompa con otros valores. */}
      {new Intl.NumberFormat("es-CL").format(mostrado)}
    </span>
  );
}
