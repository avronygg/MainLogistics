import Image from "next/image";
import Revelar from "./Revelar";
import { IconoCasco, IconoEscudo, IconoSenal } from "./Iconos";
import Titulo from "./Titulo";

/**
 * Séptima sección: el equipo. Sobre fondo oscuro, entre "cómo funciona"
 * (clara) y el formulario (claro).
 *
 * Sirve al pilar de presencia del doc de marca §3: "hay una operación real
 * detrás... personas con nombre y apellido. No es una app: es una empresa
 * que responde". Por eso el bloque va con rostro y con fierro, no con
 * ilustraciones.
 *
 * ⚠️ DOS ADVERTENCIAS DEL DOC DE MARCA §9, ambas decididas por el cliente:
 *
 * 1. La foto del camión con el logo pintado "implica activos". Si la flota
 *    es de terceros y no propia, esa imagen afirma algo que no es. Ninguna
 *    línea de copy de acá dice "flota propia" — la foto no debería decirlo
 *    sola.
 * 2. La foto del portal muestra un dashboard operando, lo que el doc
 *    prohíbe mientras el portal no exista. Por eso lleva el rótulo visible
 *    "en desarrollo", que es la salida que el propio doc indica.
 *
 * Tampoco se afirma ninguna cifra de dotación ni de años de experiencia: no
 * hay una confirmada.
 */

const ESTANDARES = [
  {
    Icono: IconoEscudo,
    titulo: "Papeles al día, revisados",
    detalle:
      "Documentación del transportista, del equipo y del conductor, revisada y vigente el día del despacho.",
  },
  {
    Icono: IconoCasco,
    titulo: "Experiencia en la carga que usted mueve",
    detalle:
      "Conductores y personal de bodega y descarga que ya trabajaron su tipo de carga antes de este despacho.",
  },
  {
    Icono: IconoSenal,
    titulo: "Una central que responde",
    detalle:
      "Alguien con nombre del otro lado durante todo el viaje, y que contesta el mismo día.",
  },
];

export default function Equipo() {
  return (
    <section
      id="equipo"
      className="relative isolate scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden"
    >
      {/* Una sola luz de escena por sección, contenida. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[30rem] w-[min(90vw,48rem)] translate-x-1/3 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 32%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <Revelar className="max-w-[46rem]">
          <Titulo linea1="Quién mueve" destacado="su carga" />
          <p className="mt-4 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            Conductores, bodega y descarga.{" "}
            <span className="realce">
              Todos pasan el mismo estándar antes de tocar su carga
            </span>
            , sin importar de qué industria venga.
          </p>
        </Revelar>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-5 md:grid-cols-12">
          {/* Conductor: el rostro de la operación. */}
          <Revelar className="md:col-span-5" retraso={0.1}>
            <article className="sobre-foto group relative isolate flex h-full min-h-[clamp(24rem,38vw,31rem)] flex-col justify-end overflow-hidden rounded-[var(--r-img)]">
              <Image
                src="/fotos/equipo-conductor.webp"
                alt="Conductor de Main Logistics en la cabina, con gorra de la marca"
                width={1122}
                height={1402}
                quality={90}
                sizes="(min-width: 768px) 42vw, 100vw"
                className="absolute inset-0 size-full object-cover object-[50%_38%] transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_58%,transparent)] to-transparent" />

              <div className="relative p-6 sm:p-7">
                <h3 className="max-w-[18ch] text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                  Transportistas{" "}
                  <span className="text-[var(--morado-texto)]">verificados</span>{" "}
                  antes de cargar.
                </h3>
              </div>
            </article>
          </Revelar>

          {/* Los tres estándares. */}
          <div className="grid gap-4 md:col-span-7">
            {ESTANDARES.map(({ Icono, titulo, detalle }, i) => (
              <Revelar key={titulo} retraso={0.18 + i * 0.1}>
                <article className="flex items-start gap-4 rounded-[var(--r-card)] border border-[color-mix(in_oklab,var(--borde)_60%,transparent)] bg-[color-mix(in_oklab,var(--sup-1)_75%,transparent)] p-5 transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:border-[color-mix(in_oklab,var(--morado-ui)_40%,var(--borde))]">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[color-mix(in_oklab,var(--morado-solido)_22%,transparent)] text-[var(--morado-texto)]">
                    <Icono className="size-[22px]" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--texto)]">
                      {titulo}
                    </h3>
                    <p className="mt-1.5 max-w-[52ch] text-[14.5px] leading-[1.55] text-[var(--texto-sec)]">
                      {detalle}
                    </p>
                  </div>
                </article>
              </Revelar>
            ))}
          </div>

          {/* Fierro con la marca. */}
          <Revelar className="md:col-span-4" retraso={0.14}>
            <article className="sobre-foto group relative isolate flex h-full min-h-[clamp(16rem,22vw,19rem)] flex-col justify-end overflow-hidden rounded-[var(--r-img)]">
              <Image
                src="/fotos/flota-puerta.webp"
                alt="Puerta de camión con la marca Main Logistics"
                width={1122}
                height={1402}
                quality={90}
                sizes="(min-width: 768px) 34vw, 100vw"
                className="absolute inset-0 size-full object-cover object-[60%_40%] transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_58%,transparent)] to-transparent" />

              <div className="relative p-6 sm:p-7">
                <h3 className="max-w-[24ch] text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                  El estándar es el mismo, lo maneje quien lo maneje.
                </h3>
              </div>
            </article>
          </Revelar>

          {/* Bodega: la otra mitad del equipo, que el titular nombra. */}
          <Revelar className="md:col-span-4" retraso={0.18}>
            <article className="sobre-foto group relative isolate flex h-full min-h-[clamp(16rem,22vw,19rem)] flex-col justify-end overflow-hidden rounded-[var(--r-img)]">
              <Image
                src="/fotos/equipo-bodega.webp"
                alt="Operario de Main Logistics revisando pallets en bodega con una tablet"
                width={1092}
                height={1440}
                quality={90}
                sizes="(min-width: 768px) 34vw, 100vw"
                className="absolute inset-0 size-full object-cover object-[55%_35%] transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_58%,transparent)] to-transparent" />

              <div className="relative p-6">
                <h3 className="max-w-[20ch] text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                  Bodega y descarga, con el{" "}
                  <span className="text-[var(--morado-texto)]">mismo control</span>.
                </h3>
              </div>
            </article>
          </Revelar>

          {/* Portal, rotulado como exige el doc §9. */}
          <Revelar className="md:col-span-4" retraso={0.26}>
            <article className="sobre-foto group relative isolate flex h-full min-h-[clamp(16rem,22vw,19rem)] flex-col justify-end overflow-hidden rounded-[var(--r-img)]">
              <Image
                src="/fotos/portal-tablet.webp"
                alt="Tablet en cabina mostrando la ruta activa en el portal de Main Logistics"
                width={916}
                height={1717}
                quality={90}
                sizes="(min-width: 768px) 42vw, 100vw"
                className="absolute inset-0 size-full object-cover object-[50%_35%] transition-transform duration-[900ms] ease-[var(--ease-expo)] group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[var(--velo-foto)] via-[color-mix(in_oklab,var(--velo-foto)_58%,transparent)] to-transparent" />

              {/* Rótulo obligatorio mientras el portal no esté disponible. */}
              <span className="absolute right-5 top-5 z-[1] inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--amarillo)_45%,transparent)] bg-[color-mix(in_oklab,var(--fondo)_72%,transparent)] px-2.5 py-1 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-[var(--amarillo)]" />
                <span className="dato text-[10.5px] uppercase tracking-[0.1em] text-[var(--amarillo)]">
                  En desarrollo
                </span>
              </span>

              <div className="relative p-6">
                <h3 className="max-w-[20ch] text-[clamp(1.2rem,1vw+0.95rem,1.5rem)] font-semibold leading-[1.18] tracking-[-0.028em] text-[var(--texto)]">
                  El portal para seguir su carga.
                </h3>
              </div>
            </article>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
