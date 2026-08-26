"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Titulo from "./Titulo";
import MarcoImagen from "./MarcoImagen";
import { IconoEscudo } from "./Iconos";

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
  marco: string[];
  /** Encargo de la foto que va en esta pestaña. */
  foto: string;
  titulo: string;
  detalle: string;
  puntos: string[];
};

const INDUSTRIAS: Industria[] = [
  {
    id: "mineria",
    nombre: "Minería",
    marco: ["SICEP"],
    foto: "Camión de Main entrando a faena minera: portería, polvo, chaleco reflectante y el equipo homologado a la vista.",
    titulo: "La homologación se pide antes de cargar.",
    detalle:
      "Documentación del transportista, del equipo y del conductor, revisada y vigente el día del despacho. En la portería ya es tarde.",
    puntos: [
      "Homologación de transportista y equipo para faena",
      "Control de fatiga y descansos en ruta",
      "Continuidad de abastecimiento en turnos",
    ],
  },
  {
    id: "peligrosa",
    nombre: "Carga peligrosa",
    marco: ["DS 298", "ASIQUIM"],
    foto: "Detalle del rótulo de sustancia peligrosa en la rampla, con la hoja de seguridad en primer plano.",
    titulo: "Lo que no está rotulado, no sale.",
    detalle:
      "Rotulación según la clase de la sustancia, hoja de seguridad a bordo y conductor con curso vigente. La documentación viaja con la carga, no después.",
    puntos: [
      "Rotulación y segregación según clase",
      "Hoja de seguridad y elementos de emergencia a bordo",
      "Conductor con curso de sustancias peligrosas vigente",
    ],
  },
  {
    id: "agro",
    nombre: "Agro y salmonicultura",
    marco: ["SAG"],
    foto: "Interior de un furgón refrigerado con el registrador de temperatura en pantalla y la carga estibada.",
    titulo: "La cadena de frío se corta una vez.",
    detalle:
      "Temperatura registrada durante todo el viaje, no solo al cargar y al descargar. En temporada, la ventana horaria manda tanto como el termómetro.",
    puntos: [
      "Registro de temperatura del viaje completo",
      "Protocolos fitosanitarios y certificación de origen",
      "Ventanas de temporada y coordinación de packing",
    ],
  },
  {
    id: "forestal",
    nombre: "Forestal",
    marco: ["CORMA"],
    foto: "Rollizos amarrados sobre la rampla en camino de tierra, con la eslinga tensada en primer plano.",
    titulo: "El amarre se revisa antes de salir y en cada parada.",
    detalle:
      "Volumen alto sobre caminos que no siempre están pavimentados, con tránsito de faena en la misma ruta.",
    puntos: [
      "Buenas prácticas de seguridad en faena forestal",
      "Amarre certificado y revisión en ruta",
      "Coordinación con tránsito de faena",
    ],
  },
  {
    id: "contenedores",
    nombre: "Contenedores",
    marco: ["Puerto"],
    foto: "Contenedor saliendo del terminal portuario con el sello visible en la puerta.",
    titulo: "La ventana de retiro no espera.",
    detalle:
      "Coordinación con terminal, sello verificado y devolución dentro del plazo libre. Un día de sobreestadía cuesta más que el flete.",
    puntos: [
      "Coordinación de ventana con el terminal",
      "Verificación de sello al retiro y a la entrega",
      "Control de días libres y devolución",
    ],
  },
];

export default function Cumplimiento() {
  const reducir = useReducedMotion();
  const [activa, setActiva] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
          <Titulo linea1="Permisos y certificaciones" destacado="al día en cada despacho" />
          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            <span className="realce">Elija su industria</span> y vea qué se
            revisa antes de que su carga salga.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Marcos normativos por industria"
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
              className="grid items-stretch gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]"
            >
              <div>
                <ul className="flex flex-wrap gap-1.5">
                  {ind.marco.map((m) => (
                    <li
                      key={m}
                      className="dato rounded-[var(--r-chip)] bg-[color-mix(in_oklab,var(--morado-solido)_12%,transparent)] px-2.5 py-1 text-[11.5px] uppercase tracking-[0.06em] text-[var(--morado-texto)]"
                    >
                      {m}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-4 max-w-[20ch] text-[clamp(1.3rem,1.3vw+1rem,1.75rem)] font-semibold leading-[1.18] tracking-[-0.03em] text-[var(--texto)]">
                  {ind.titulo}
                </h3>
                <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.6] text-[var(--texto-sec)]">
                  {ind.detalle}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
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

              <MarcoImagen
                className="order-first h-[clamp(11rem,18vw,14rem)] rounded-[var(--r-img)] md:order-last md:h-full md:min-h-[15rem]"
                icono={<IconoEscudo className="size-7" />}
                brief={ind.foto}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
