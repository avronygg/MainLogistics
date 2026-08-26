import Image from "next/image";
import Link from "next/link";
import RutaChile from "./RutaChile";
import Revelar from "./Revelar";
import Contador from "./Contador";
import Etiqueta from "./Etiqueta";

/**
 * Bento de apoyo de la sección de servicios: control en ruta, cobertura
 * y seguridad. No abre banda propia — se renderiza dentro de <Servicios />
 * para no romper la alternancia claro/oscuro de la página.
 *
 * Ritmo tomado de la referencia verde: una card alta con foto a la
 * izquierda y, a la derecha, bloques de distinto peso — uno con el dato
 * grande y un gráfico hecho en código, y uno sólido de marca.
 *
 * Reglas del sistema que se respetan acá:
 * - Una sola card sólida por fila (la morada, en la fila de abajo).
 * - Radio variable: 28px en cards de imagen, 18px en las de dato.
 * - El texto sobre foto va siempre abajo a la izquierda, y el degradado
 *   cubre solo esa franja: si lo cubre todo, tapa la foto entera.
 * - Todo el copy sale del bloque aprobado del doc de marca §7.
 */

const CARGAS = [
  "General",
  "Minera",
  "Peligrosa",
  "Refrigerada",
  "Forestal",
  "Contenedores",
  "Maquinaria",
  "Sobredimensionada",
];

export default function Pilares() {
  return (
    <div className="mt-[clamp(3.5rem,6vw,5rem)] border-t border-[color-mix(in_oklab,var(--borde)_60%,transparent)] pt-[clamp(2.5rem,4vw,3.5rem)]">
      <div className="max-w-[46rem]">
        <h3 className="text-[clamp(1.5rem,1.8vw+1.05rem,2.15rem)] font-semibold leading-[1.12] tracking-[-0.032em] text-[var(--texto)]">
          Con MAIN, su carga siempre{" "}
          <span className="text-[var(--morado-texto)]">bajo control</span>.
        </h3>
        <p className="mt-3.5 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
          <span className="realce">Saber dónde está</span> en cada momento.{" "}
          <span className="realce">Cumplir la norma</span> que exige su
          industria. <span className="realce">Llegar a la hora</span> acordada.
        </p>
      </div>

      <div className="mt-[clamp(2rem,3vw,2.75rem)] grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* Tecnología — card alta de imagen. */}
          <article className="group sobre-foto relative isolate overflow-hidden rounded-[var(--r-img)] md:col-span-5">
            <Image
              src="/fotos/tecnologia-equipo.webp"
              alt="Equipo de monitoreo con la marca Main Logistics, con el conector de datos a la vista"
              width={1536}
              height={1024}
              quality={90}
              sizes="(min-width: 768px) 44vw, 100vw"
              className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            />
            {/* Degradado solo en la franja inferior, donde va el texto. */}
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_55%,transparent)] to-transparent" />

            <Etiqueta className="absolute left-5 top-5" testigo>
              GPS en ruta
            </Etiqueta>

            <div className="relative flex h-full min-h-[clamp(17rem,24vw,21rem)] flex-col items-start justify-end p-6 sm:p-7">
              <h4 className="max-w-[17ch] text-[clamp(1.35rem,1.5vw+1rem,1.85rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--texto)]">
                Vea su carga en{" "}
                <span className="text-[var(--morado-texto)]">tiempo real</span>,
                no espere el llamado.
              </h4>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.55] text-[var(--texto-sec)]">
                <span className="font-medium text-[var(--texto)]">
                  GPS y monitoreo permanente.
                </span>{" "}
                Trazabilidad desde el retiro hasta la entrega, con reportes
                auditables en línea.
              </p>
            </div>
          </article>

          {/* Cobertura — el dato manda, el gráfico lo sostiene. */}
          <article
              id="cobertura"
              className="relative scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden rounded-[var(--r-img)] bg-[var(--sup-1)] md:col-span-7"
            >
            <Etiqueta className="absolute left-6 top-6 sm:left-7 sm:top-7">
              Cobertura
            </Etiqueta>

            <div className="grid grid-cols-1 items-center gap-6 p-6 pt-16 lg:grid-cols-[1fr_auto] lg:gap-8 lg:p-7 lg:pt-[4.75rem]">
              <div>
                <h4 className="text-[clamp(1.35rem,1.5vw+1rem,1.85rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--texto)]">
                  De Arica a Punta Arenas.
                </h4>

                {/* El dato es la decoración: el número domina el bloque. */}
                <p className="mt-5 flex items-baseline gap-2 leading-none">
                  <span
                    className="dato font-semibold tracking-[-0.045em] text-[var(--morado-ui)]"
                    style={{ fontSize: "clamp(3rem, 5vw + 1rem, 5.25rem)" }}
                  >
                    <Contador hasta={4270} />
                  </span>
                  <span className="dato text-[clamp(1.1rem,1vw+0.7rem,1.6rem)] font-medium tracking-[-0.02em] text-[var(--morado-ui)]">
                    km
                  </span>
                </p>

                <p className="mt-3 max-w-[34ch] text-[14.5px] leading-[1.55] text-[var(--texto-sec)]">
                  <span className="realce">Cobertura nacional</span>, con el
                  equipo y la documentación que pide cada industria.
                </p>
              </div>

              <RutaChile />
            </div>
          </article>

          {/* Qué movemos. Copy reescrito: "un solo proveedor para todo lo
              que mueve" arrastraba dos veces el verbo y se leía torpe. El
              número al frente es más directo y además es un dato real. */}
          <Revelar className="md:col-span-7" retraso={0.16}>
            <article className="relative flex h-full min-h-[clamp(19rem,26vw,23rem)] flex-col overflow-hidden rounded-[var(--r-card)] bg-[var(--morado-solido)] p-6 sm:p-7">
              <Etiqueta claro>Qué movemos</Etiqueta>

              <h4 className="mt-5 max-w-[22ch] text-[clamp(1.35rem,1.5vw+1rem,1.85rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
                Ocho tipos de carga, un solo proveedor.
              </h4>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-white/75">
                Desde carga general hasta sobredimensionada, con el equipo que cada una exige.
              </p>

              <ul className="mt-5 flex flex-wrap gap-1.5">
                {CARGAS.map((c) => (
                  <li
                    key={c}
                    className="rounded-[var(--r-chip)] bg-white/18 px-2.5 py-1 text-[12.5px] leading-none text-white"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <Link
                href="#cargas"
                className="group mt-auto inline-flex w-fit items-center gap-2 pt-7 text-[14.5px] font-medium text-white"
              >
                Vea qué exige cada una
                <span className="grid size-7 place-items-center rounded-full bg-white/22 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:scale-110 motion-reduce:group-hover:scale-100">
                  <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                    <path
                      d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </article>
          </Revelar>

          {/* Seguridad — card de imagen chica. */}
          <article className="group sobre-foto relative isolate overflow-hidden rounded-[var(--r-img)] md:col-span-5">
            <Image
              src="/fotos/seguridad-amarre.webp"
              alt="Amarre de carga con eslinga y trinquete tensado sobre la plataforma de un remolque"
              width={1536}
              height={1024}
              quality={90}
              sizes="(min-width: 768px) 44vw, 100vw"
              className="absolute inset-0 size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_58%,transparent)] to-transparent" />

            <Etiqueta className="absolute left-5 top-5">Seguridad</Etiqueta>

            <div className="relative flex h-full min-h-[clamp(17rem,24vw,21rem)] flex-col items-start justify-end p-6">
              <h4 className="max-w-[15ch] text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                Su carga siempre{" "}
                <span className="text-[var(--morado-texto)]">segura</span>.
              </h4>
              <p className="mt-2.5 max-w-[32ch] text-[14.5px] leading-[1.5] text-[var(--texto-sec)]">
                <span className="font-medium text-[var(--texto)]">
                  Transportistas verificados
                </span>
                , documentación al día y el estándar de cada industria.
              </p>
            </div>
          </article>

      </div>
    </div>
  );
}
