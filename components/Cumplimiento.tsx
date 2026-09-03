"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Titulo from "./Titulo";
import MarcoImagen from "./MarcoImagen";
import { MARCO_VISIBLE } from "./datos/encargos-foto";
import type { ClaveEncargo } from "./datos/encargos-foto";
import { IconoEscudo } from "./Iconos";
import type { Mensajes } from "@/mensajes";

/**
 * Quinta sección: cumplimiento, con pestañas por industria.
 *
 * Es la pieza que el doc de marca §3 marca como diferencial: "un solo
 * mensaje de marca con una traducción distinta por industria. Es lo que
 * ningún competidor está haciendo". Cinco marcos normativos en el espacio
 * de uno.
 *
 * Va sobre fondo claro, alternando con las secciones oscuras.
 *
 * Accesibilidad: es un patrón de tabs real, no botones sueltos. Navegación
 * con flechas, Home y End, `aria-selected`, y el panel enlazado por
 * `aria-labelledby`. Un tab que solo responde al clic deja fuera a quien
 * navega con teclado.
 */

type Industria = {
  id: string;
  nombre: string;
  /**
   * Chips del marco normativo. Los códigos y siglas —SICEP, DS 298, ASIQUIM,
   * SAG, CORMA— NO salen del diccionario: son el identificador de la norma y
   * se escriben igual en los cuatro idiomas. La única etiqueta que además es
   * una palabra, y por eso sí viene de `m`, es la de contenedores.
   */
  marco: string[];
  /** Qué foto va en esta pestaña. El texto vive en datos/encargos-foto.ts. */
  encargo: ClaveEncargo;
  titulo: string;
  detalle: string;
  puntos: string[];
};

/**
 * La lista se arma como función de `m` en vez de guardar solo claves: así
 * cada pestaña se sigue leyendo entera en un solo lugar —nombre, encargo de
 * foto, título, detalle y puntos juntos— y se ve de una qué muestra cada
 * tab. Un arreglo de puras claves obligaría a saltar al diccionario para
 * entender qué hay adentro.
 */
function industrias(m: Mensajes): Industria[] {
  const c = m.cumplimiento;

  return [
    {
      id: "mineria",
      nombre: c.mineria.nombre,
      marco: ["SICEP"],
      encargo: "mineria" as const,
      titulo: c.mineria.titulo,
      detalle: c.mineria.detalle,
      puntos: [
        c.mineria.puntos.homologacion,
        c.mineria.puntos.fatiga,
        c.mineria.puntos.continuidad,
      ],
    },
    {
      id: "peligrosa",
      nombre: c.peligrosa.nombre,
      marco: ["DS 298", "ASIQUIM"],
      encargo: "peligrosa" as const,
      titulo: c.peligrosa.titulo,
      detalle: c.peligrosa.detalle,
      puntos: [
        c.peligrosa.puntos.rotulacion,
        c.peligrosa.puntos.hojaSeguridad,
        c.peligrosa.puntos.curso,
      ],
    },
    {
      id: "agro",
      nombre: c.agro.nombre,
      marco: ["SAG"],
      encargo: "refrigerada" as const,
      titulo: c.agro.titulo,
      detalle: c.agro.detalle,
      puntos: [
        c.agro.puntos.temperatura,
        c.agro.puntos.fitosanitario,
        c.agro.puntos.ventanas,
      ],
    },
    {
      id: "forestal",
      nombre: c.forestal.nombre,
      marco: ["CORMA"],
      encargo: "forestal" as const,
      titulo: c.forestal.titulo,
      detalle: c.forestal.detalle,
      puntos: [
        c.forestal.puntos.buenasPracticas,
        c.forestal.puntos.amarre,
        c.forestal.puntos.transito,
      ],
    },
    {
      id: "contenedores",
      nombre: c.contenedores.nombre,
      // "Puerto" no es una sigla ni el código de una norma: es una palabra
      // que hay que traducir, al revés que los chips de las otras pestañas.
      marco: [c.contenedores.marcoPuerto],
      encargo: "contenedores" as const,
      titulo: c.contenedores.titulo,
      detalle: c.contenedores.detalle,
      puntos: [
        c.contenedores.puntos.ventana,
        c.contenedores.puntos.sello,
        c.contenedores.puntos.diasLibres,
      ],
    },
  ];
}

export default function Cumplimiento({ m }: { m: Mensajes }) {
  const reducir = useReducedMotion();
  const [activa, setActiva] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const INDUSTRIAS = industrias(m);

  const alTeclear = (e: React.KeyboardEvent) => {
    const ultimo = INDUSTRIAS.length - 1;
    let siguiente: number | null = null;

    if (e.key === "ArrowRight") siguiente = activa === ultimo ? 0 : activa + 1;
    else if (e.key === "ArrowLeft") siguiente = activa === 0 ? ultimo : activa - 1;
    else if (e.key === "Home") siguiente = 0;
    else if (e.key === "End") siguiente = ultimo;

    if (siguiente !== null) {
      e.preventDefault();
      setActiva(siguiente);
      refs.current[siguiente]?.focus();
    }
  };

  const ind = INDUSTRIAS[activa];

  return (
    <section id="cumplimiento" className="tema-claro scroll-mt-[clamp(6rem,12vw,8.5rem)]">
      <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <div className="max-w-[46rem]">
          <Titulo
            linea1={m.cumplimiento.tituloLinea1}
            destacado={m.cumplimiento.tituloDestacado}
          />
          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            {/* El `{" "}` explícito deja el espacio entre el realce y el resto
                de la frase en el JSX y no al inicio de un valor del
                diccionario, donde se pierde apenas alguien lo traduce. */}
            <span className="realce">{m.cumplimiento.bajadaRealce}</span>{" "}
            {m.cumplimiento.bajadaResto}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={m.cumplimiento.etiquetaPestanas}
          onKeyDown={alTeclear}
          className="mt-[clamp(2rem,3.5vw,3rem)] flex flex-wrap gap-2"
        >
          {INDUSTRIAS.map((i, n) => {
            const sel = n === activa;
            return (
              <button
                key={i.id}
                ref={(el) => {
                  refs.current[n] = el;
                }}
                role="tab"
                id={`${base}-tab-${i.id}`}
                aria-selected={sel}
                aria-controls={`${base}-panel-${i.id}`}
                tabIndex={sel ? 0 : -1}
                onClick={() => setActiva(n)}
                className={[
                  "min-h-[44px] rounded-full px-4 text-[14.5px] font-medium tracking-[-0.01em]",
                  "transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)]",
                  sel
                    ? "bg-[var(--morado-solido)] text-white"
                    : "border border-[var(--borde)] text-[var(--texto-sec)] hover:border-[color-mix(in_oklab,var(--morado-ui)_45%,var(--borde))] hover:text-[var(--texto)]",
                ].join(" ")}
              >
                {i.nombre}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${base}-panel-${ind.id}`}
          aria-labelledby={`${base}-tab-${ind.id}`}
          className="mt-5 rounded-[var(--r-img)] bg-[var(--sup-1)] p-6 sm:p-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: reducir ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducir ? 0 : -10 }}
              transition={{ duration: reducir ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "grid items-stretch gap-x-10 gap-y-6",
                MARCO_VISIBLE ? "md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]" : "",
              ].join(" ")}
            >
              {/* Sin la foto, todo el contenido quedaba pegado a la
                  izquierda y media tarjeta en blanco. La lista de chequeo
                  se pasa a ese lado: llena el espacio con contenido real,
                  que es distinto de rellenarlo. */}
              <div
                className={
                  MARCO_VISIBLE
                    ? ""
                    : "md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-start md:gap-x-12"
                }
              >
                <div>
                <ul className="flex flex-wrap gap-1.5">
                  {/* `codigo` y no `m`: acá `m` es el diccionario. */}
                  {ind.marco.map((codigo) => (
                    <li
                      key={codigo}
                      className="dato rounded-[var(--r-chip)] bg-[color-mix(in_oklab,var(--morado-solido)_12%,transparent)] px-2.5 py-1 text-[11.5px] uppercase tracking-[0.06em] text-[var(--morado-texto)]"
                    >
                      {codigo}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-4 max-w-[20ch] text-[clamp(1.3rem,1.3vw+1rem,1.75rem)] font-semibold leading-[1.18] tracking-[-0.03em] text-[var(--texto)]">
                  {ind.titulo}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--texto-sec)]">
                  {ind.detalle}
                </p>

                </div>

                <ul
                  className={[
                    "flex flex-col gap-3",
                    MARCO_VISIBLE ? "mt-6" : "mt-6 md:mt-0",
                  ].join(" ")}
                >
                  {ind.puntos.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[3px] grid size-[18px] shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_14%,transparent)]"
                      >
                        <svg viewBox="0 0 12 12" fill="none" className="size-[11px]">
                          <path
                            d="m2.5 6.2 2.2 2.2 4.8-5"
                            stroke="var(--morado-texto)"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[14.5px] leading-[1.5] text-[var(--texto)]">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {MARCO_VISIBLE && (
                <MarcoImagen
                  className="order-first h-[clamp(11rem,18vw,14rem)] rounded-[var(--r-img)] md:order-last md:h-full md:min-h-[15rem]"
                  icono={<IconoEscudo className="size-7" />}
                  encargo={ind.encargo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
