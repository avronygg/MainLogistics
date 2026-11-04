"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { CAPITULOS, type Capitulo } from "@/components/datos/presentacion";
import s from "./presentacion.module.css";

/**
 * El mando de la presentación: lo que en las láminas eran el número y el
 * rótulo de cada una.
 *
 * El avance es una carretera segmentada, con un tramo por capítulo: el mismo
 * motivo del isotipo, y además navegable. Las flechas del teclado pasan de
 * capítulo como en una lámina. "Presentar" pone el sitio en pantalla completa,
 * oculta barra y pie, y cada capítulo calza con la pantalla (`html.presentando`
 * en globals.css); se proyecta en una reunión sin abrir otro archivo.
 *
 * Se pide pantalla completa sobre <html> y no sobre un contenedor para que la
 * ventana siga siendo lo que hace scroll: las animaciones ligadas al scroll y
 * los observadores siguen funcionando sin un segundo caso.
 *
 * Compartir manda el capítulo que se está viendo, no solo la página.
 */

type Textos = {
  etiqueta: string;
  anterior: string;
  siguiente: string;
  presentar: string;
  salir: string;
  compartir: string;
  copiado: string;
  cotizar: string;
};

const nada = () => () => {};

function alCambiarPantallaCompleta(aviso: () => void) {
  document.addEventListener("fullscreenchange", aviso);
  return () => document.removeEventListener("fullscreenchange", aviso);
}

const Icono = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={s.mandoIcono}>
    <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Mando({
  textos,
  capitulos,
  titulo,
  hrefCotizar,
}: {
  textos: Textos;
  capitulos: Record<Capitulo, string>;
  titulo: string;
  hrefCotizar: string;
}) {
  const reducir = useReducedMotion();
  const [activo, setActivo] = useState(0);
  const [oculto, setOculto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  // iPhone no tiene Fullscreen API, y ahí el botón no haría nada.
  const sePuedePresentar = useSyncExternalStore(
    nada,
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );
  const presentando = useSyncExternalStore(
    alCambiarPantallaCompleta,
    () => Boolean(document.fullscreenElement),
    () => false,
  );

  // A dónde se está yendo. Con el scroll suave en curso, `activo` todavía no
  // cambió, y tres toques rápidos de flecha contarían desde el mismo capítulo.
  const objetivo = useRef<{ indice: number; hasta: number } | null>(null);

  const ir = useCallback(
    (indice: number, { enfocar = false } = {}) => {
      const final = Math.min(Math.max(indice, 0), CAPITULOS.length - 1);
      objetivo.current = { indice: final, hasta: performance.now() + 800 };
      const capitulo = document.getElementById(CAPITULOS[final]);
      capitulo?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
      // Con teclado el foco acompaña: si no, el siguiente Tab vuelve atrás.
      if (enfocar) capitulo?.focus({ preventScroll: true });
    },
    [reducir],
  );

  /** El capítulo de partida, medido ahora y no el del último render. */
  const indiceBase = useCallback(() => {
    const o = objetivo.current;
    if (o && performance.now() < o.hasta) return o.indice;
    const medio = window.innerHeight / 2;
    const i = CAPITULOS.findIndex((id) => {
      const r = document.getElementById(id)?.getBoundingClientRect();
      return r && r.top <= medio && r.bottom > medio;
    });
    // Ningún capítulo en la línea media: estamos sobre el pie.
    return i < 0 ? CAPITULOS.length - 1 : i;
  }, []);

  // El capítulo activo es el que cruza la línea media de la pantalla.
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          const i = CAPITULOS.indexOf(entrada.target.id as Capitulo);
          // Lo único observado fuera de los capítulos es el pie: ya se pasó el último.
          setActivo(i < 0 ? CAPITULOS.length - 1 : i);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const id of CAPITULOS) {
      const capitulo = document.getElementById(id);
      if (capitulo) observador.observe(capitulo);
    }
    const pie = document.querySelector("footer");
    if (pie) observador.observe(pie);
    return () => observador.disconnect();
  }, []);

  // Sobre el pie estorba: tapa sus enlaces y ya no hay capítulo que recorrer.
  useEffect(() => {
    const pie = document.querySelector("footer");
    if (!pie) return;
    // El margen evita que cuente como "visible" el pie que apenas toca el borde
    // de la ventana: pasa justo con el último capítulo encuadrado, y dejaba a la
    // persona sin mando para volver.
    const observador = new IntersectionObserver(
      ([entrada]) => setOculto(entrada.isIntersecting),
      { rootMargin: "0px 0px -8px 0px" },
    );
    observador.observe(pie);
    return () => observador.disconnect();
  }, []);

  // Al entrar o salir de pantalla completa el alto de cada capítulo cambia, y
  // sin este ajuste se aterriza a mitad de otro.
  const capituloActual = useRef(activo);
  useEffect(() => {
    capituloActual.current = activo;
  }, [activo]);
  // Solo al cambiar, nunca al montar: al abrir `#cobertura` desde WhatsApp este
  // salto cancelaba el del navegador y dejaba a la persona en la portada.
  // `instant` porque `auto` hereda el `scroll-behavior: smooth` del sitio.
  const presentandoAntes = useRef(presentando);
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.classList.toggle("presentando", presentando);
    if (presentandoAntes.current !== presentando) {
      presentandoAntes.current = presentando;
      document.getElementById(CAPITULOS[capituloActual.current])?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
    return () => raiz.classList.remove("presentando");
  }, [presentando]);

  // "Cotizar" lleva a otra página, donde no hay botón para salir.
  useEffect(
    () => () => {
      if (document.fullscreenElement) void document.exitFullscreen();
    },
    [],
  );

  useEffect(() => {
    function alTeclear(e: KeyboardEvent) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const objetivo = e.target as HTMLElement | null;
      if (objetivo?.closest("input, textarea, select, [contenteditable]")) return;
      // Espacio sobre un enlace o botón los activa: no se le quita eso.
      const sobreControl = Boolean(objetivo?.closest("a, button"));

      const siguiente = () => ir(indiceBase() + 1, { enfocar: true });
      const anterior = () => ir(indiceBase() - 1, { enfocar: true });

      // En lectura normal, abajo y arriba siguen siendo scroll del navegador.
      const acciones: Record<string, () => void> = presentando
        ? {
            ArrowRight: siguiente,
            ArrowDown: siguiente,
            PageDown: siguiente,
            ...(sobreControl ? {} : { " ": siguiente }),
            ArrowLeft: anterior,
            ArrowUp: anterior,
            PageUp: anterior,
            Home: () => ir(0, { enfocar: true }),
            End: () => ir(CAPITULOS.length - 1, { enfocar: true }),
          }
        : { ArrowRight: siguiente, ArrowLeft: anterior };

      const accion = acciones[e.key];
      if (!accion) return;
      e.preventDefault();
      accion();
    }
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [indiceBase, ir, presentando]);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  async function alternarPresentacion() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
        // Espacio es la tecla natural para pasar lámina, y con el foco en este
        // botón cerraba la presentación recién abierta.
        (document.activeElement as HTMLElement | null)?.blur();
      }
    } catch {
      // El navegador lo rechazó; la página sigue igual de legible.
    }
  }

  async function compartir() {
    const id = CAPITULOS[activo];
    const { origin, pathname } = window.location;
    const url = `${origin}${pathname}${id === "portada" ? "" : `#${id}`}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch (error) {
        // Cerrar el menú de compartir no es un error. Otro rechazo sí, y ahí
        // sigue abajo y copia, para que el botón nunca quede sin hacer nada.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles no queda alternativa.
    }
  }

  const id = CAPITULOS[activo];

  return (
    <nav
      aria-label={textos.etiqueta}
      className={`vidrio ${s.mando}`}
      data-oculto={oculto && !presentando ? "" : undefined}
    >
      <ol className={s.pista}>
        {CAPITULOS.map((capitulo, i) => (
          <li key={capitulo} className={s.tramoCelda}>
            <a
              href={`#${capitulo}`}
              title={capitulos[capitulo]}
              aria-label={capitulos[capitulo]}
              aria-current={i === activo ? "step" : undefined}
              className={s.tramo}
              data-estado={i === activo ? "actual" : i < activo ? "hecho" : "pendiente"}
            />
          </li>
        ))}
      </ol>

      <p className={s.mandoRotulo} aria-hidden="true">
        <span className={`dato ${s.mandoNumero}`}>
          {String(activo + 1).padStart(2, "0")}/{CAPITULOS.length}
        </span>
        <span className={s.mandoNombre}>{copiado ? textos.copiado : capitulos[id]}</span>
      </p>
      <span role="status" className={s.soloLector}>
        {copiado ? textos.copiado : ""}
      </span>

      <div className={s.mandoGrupo}>
        <button
          type="button"
          className={s.mandoBoton}
          aria-label={textos.anterior}
          title={textos.anterior}
          aria-disabled={activo === 0}
          onClick={() => {
            if (activo > 0) ir(indiceBase() - 1);
          }}
        >
          <Icono d="M12 4.5 6.5 10l5.5 5.5" />
        </button>
        <button
          type="button"
          className={s.mandoBoton}
          aria-label={textos.siguiente}
          title={textos.siguiente}
          aria-disabled={activo === CAPITULOS.length - 1}
          onClick={() => {
            if (activo < CAPITULOS.length - 1) ir(indiceBase() + 1);
          }}
        >
          <Icono d="M8 4.5 13.5 10 8 15.5" />
        </button>
        <button
          type="button"
          className={s.mandoBoton}
          aria-label={textos.compartir}
          title={textos.compartir}
          onClick={compartir}
        >
          <Icono d="M10 12.5V3.5M6.5 6.5 10 3l3.5 3.5M4 11v4.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V11" />
        </button>
        {sePuedePresentar && (
          <button
            type="button"
            className={`${s.mandoBoton} ${s.mandoPresentar}`}
            aria-label={presentando ? textos.salir : textos.presentar}
            title={presentando ? textos.salir : textos.presentar}
            onClick={alternarPresentacion}
          >
            <Icono
              d={
                presentando
                  ? "M8 3.5V8H3.5M12 3.5V8h4.5M8 16.5V12H3.5M12 16.5V12h4.5"
                  : "M3.5 8V3.5H8M12 3.5h4.5V8M3.5 12v4.5H8M16.5 12v4.5H12"
              }
            />
          </button>
        )}
      </div>

      {id !== "cierre" && (
        <Link href={hrefCotizar} className={s.mandoCotizar}>
          {textos.cotizar}
        </Link>
      )}
    </nav>
  );
}
