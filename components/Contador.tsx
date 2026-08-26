"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Contador que sube hasta su valor cuando entra en pantalla.
 *
 * Formato chileno: punto como separador de miles. Se usa `Intl` en vez de
 * armarlo a mano para que no se rompa con otros valores.
 *
 * Con movimiento reducido aparece directo en su valor final: un número que
 * salta solo es ruido para quien pidió que las cosas no se muevan.
 */
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
  const [valor, setValor] = useState(0);

  useEffect(() => {
    // Con movimiento reducido no se anima nada: el valor final se deriva
    // en el render, sin pasar por estado.
    if (!enVista || reducir) return;

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
  }, [enVista, hasta, duracion, reducir]);

  const mostrado = reducir ? hasta : valor;

  return (
    <span ref={ref} className="tabular-nums">
      {new Intl.NumberFormat("es-CL").format(mostrado)}
    </span>
  );
}
