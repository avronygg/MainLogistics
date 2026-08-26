import Link from "next/link";
import Titulo from "./Titulo";
import Pilares from "./Pilares";
import {
  IconoContenedor,
  IconoCamaBaja,
  IconoRampla,
  IconoCamionPequeno,
  IconoBatea,
  IconoSilo,
  IconoBess,
  IconoBodega,
} from "./Iconos";

/**
 * Sección de servicios: los ocho, con el ícono del equipo real.
 *
 * Por qué íconos y no fotos: son ocho piezas en una grilla. Ocho fotos
 * distintas de camiones se leen como un catálogo de stock y compiten
 * entre sí; ocho íconos del mismo set se leen como un sistema. Las fotos
 * ya cargan las secciones que sí las necesitan (cumplimiento, equipo).
 *
 * Esta sección hospeda además el bento de <Pilares />. No es capricho de
 * composición: las nueve bandas de la página alternan claro/oscuro sin dos
 * iguales seguidas, así que meter una sección suelta obliga a voltear todo
 * lo que sigue hasta el pie. Van juntas en una sola banda clara, y
 * `scripts/alternancia.mjs` sigue pasando.
 *
 * El ancla #servicios vive acá; #cobertura sigue viviendo en el bento.
 */

type Servicio = {
  nombre: string;
  detalle: string;
  /** Qué admite el equipo. Describe la pieza, no promete una capacidad. */
  lleva: string[];
  Icono: (p: { className?: string }) => React.ReactElement;
};

/* Copy heredado del sitio de Logística Yireh — mismo grupo, mismos
   servicios— pasado de "tú" a "usted", que es el trato del resto del
   sitio. Ver PRODUCT.md: el comprador es un jefe de operaciones, no un
   consumidor final. */
const SERVICIOS: Servicio[] = [
  {
    nombre: "Retiro de contenedores",
    detalle:
      "Retiramos sus contenedores en puerto y los movemos a destino sin demoras.",
    lleva: ["Contenedor 20′", "Contenedor 40′", "Puerto"],
    Icono: IconoContenedor,
  },
  {
    nombre: "Cama baja",
    detalle:
      "Carga sobredimensionada y maquinaria pesada con equipos especializados.",
    lleva: ["Maquinaria", "Sobredimensionada"],
    Icono: IconoCamaBaja,
  },
  {
    nombre: "Ramplas planas",
    detalle:
      "Carga general y paletizada sobre ramplas planas, para todo tipo de operación.",
    lleva: ["General", "Paletizada"],
    Icono: IconoRampla,
  },
  {
    nombre: "Camiones pequeños",
    detalle: "Distribución ágil para cargas menores y entregas de última milla.",
    lleva: ["Carga menor", "Última milla"],
    Icono: IconoCamionPequeno,
  },
  {
    nombre: "Bateas",
    detalle: "Traslado de áridos y graneles en batea, con cobertura puerto-destino.",
    lleva: ["Áridos", "Graneles"],
    Icono: IconoBatea,
  },
  {
    nombre: "Silos",
    detalle: "Transporte especializado de carga en silo para la industria.",
    lleva: ["Granel cerrado"],
    Icono: IconoSilo,
  },
  {
    nombre: "Carga BESS",
    detalle:
      "Traslado de baterías y sistemas de almacenamiento de energía con manejo especializado.",
    lleva: ["Baterías", "Alto valor"],
    Icono: IconoBess,
  },
  {
    nombre: "Desconsolidado y almacenaje",
    detalle: "Desconsolidamos y almacenamos su carga en bodegas estratégicas.",
    lleva: ["Bodega", "Consolidado"],
    Icono: IconoBodega,
  },
];

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="tema-claro scroll-mt-[clamp(6rem,12vw,8.5rem)]"
    >
      <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <div className="max-w-[46rem]">
          <Titulo linea1="Un solo operador para" destacado="toda su operación" />
          <p className="mt-4 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            Contenedores, maquinaria, graneles o almacenaje.{" "}
            <span className="realce">Ocho servicios</span> con el equipo que cada
            carga exige, coordinados desde un mismo lugar.
          </p>
        </div>

        {/* Roster, no grilla de tarjetas.
            Sin animacion de entrada fila por fila: un catalogo dense se
            muestra entero, y ademas Revelar arranca en opacity 0, asi que
            las filas que no alcanzan a entrar en viewport se quedan en
            blanco. El movimiento de esta lista vive en el hover.
            Ocho cajas iguales con el ícono en un chip redondeado arriba es
            literalmente la anti-referencia de PRODUCT.md: "lo que hace la
            competencia". Acá no hay cajas — hay filetes, como un manifiesto
            de equipos. El comprador de este rubro escanea para comparar, y
            una lista densa se compara; ocho tarjetas separadas, no. */}
        <ul className="mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-1 sm:grid-cols-2">
          {SERVICIOS.map(({ nombre, detalle, lleva, Icono }, i) => (
            <li
              key={nombre}
              className={[
                "group relative border-t border-[var(--borde)]",
                // El filete vertical solo en la columna derecha, y solo
                // cuando hay dos columnas.
                i % 2 === 1 ? "sm:border-l" : "",
                // Última fila: filete de cierre para que la lista no quede
                // abierta abajo.
                i >= SERVICIOS.length - 2 ? "sm:border-b" : "",
                i === SERVICIOS.length - 1 ? "border-b sm:border-b" : "",
              ].join(" ")}
            >
              <div className="flex h-full items-start gap-4 rounded-[var(--r-chip)] px-1 py-6 transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:bg-[color-mix(in_oklab,var(--sup-1)_70%,transparent)] sm:px-6">
                <Icono
                  className="mt-0.5 size-7 shrink-0 text-[var(--texto-sec)] transition-colors duration-[var(--dur-estado)] group-hover:text-[var(--morado-texto)]"
                />

                <div className="min-w-0">
                  <h3 className="text-[16.5px] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--texto)]">
                    {nombre}
                  </h3>
                  <p className="mt-1.5 max-w-[42ch] text-[14px] leading-[1.55] text-[var(--texto-sec)]">
                    {detalle}
                  </p>

                  {/* Qué carga admite cada equipo. Es lo que el comprador
                      viene a resolver — "¿pueden con lo mío?" — y describe
                      el equipo, no promete una capacidad que habría que
                      confirmar. Sin Geist Mono: son palabras, no dato
                      auditable, y la mono es regla semántica. */}
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {lleva.map((l) => (
                      <li
                        key={l}
                        className="rounded-[var(--r-chip)] bg-[var(--sup-1)] px-2 py-[3px] text-[12px] leading-none text-[var(--texto-sec)] transition-colors duration-[var(--dur-estado)] group-hover:bg-[var(--sup-2)]"
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Una sola salida al final de la grilla, no un CTA por tarjeta:
            ocho botones idénticos no ayudan a decidir, sólo hacen ruido. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="#cotizar"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--morado-solido)] px-5 py-3 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            Cotice su carga
            <span className="grid size-6 place-items-center rounded-full bg-white/22 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
              <svg viewBox="0 0 16 16" fill="none" className="size-3">
                <path
                  d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
          <p className="text-[14.5px] leading-[1.5] text-[var(--texto-sec)]">
            ¿No sabe qué equipo necesita?{" "}
            <span className="font-medium text-[var(--texto)]">Lo asesoramos.</span>
          </p>
        </div>

        {/* El bento de apoyo: control en ruta, cobertura y seguridad. */}
        <Pilares />
      </div>
    </section>
  );
}
