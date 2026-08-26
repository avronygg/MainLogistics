import Titulo from "./Titulo";
import MarcoImagen from "./MarcoImagen";
import { IconoCarga } from "./Iconos";
/**
 * Cuarta sección: qué movemos.
 *
 * Ocho tarjetas iguales con ícono y título arriba es el patrón que delata
 * plantilla, y además diría menos: el doc de marca §3 es explícito en que
 * "la amplitud se comunica siempre acompañada de la exigencia técnica,
 * nunca sola". Así que va como ficha técnica — cada carga con lo que esa
 * carga exige, y la normativa en mono, que se lee como registro y no como
 * marketing.
 *
 * Ojo con lo que dice cada fila: describe lo que la CARGA exige, no lo que
 * la empresa tiene. Los marcos normativos salen del doc §8; el resto son
 * hechos del rubro. Ninguna fila afirma una capacidad propia sin confirmar.
 */

type Carga = {
  nombre: string;
  exige: string;
  /** Marcos normativos o códigos: van en mono. */
  normas?: string[];
};

const CARGAS: Carga[] = [
  {
    nombre: "General",
    exige: "Rampla plana, furgón o carga paletizada, según volumen y ruta.",
  },
  {
    nombre: "Minera",
    exige: "Homologación para entrar a faena y control de fatiga en ruta.",
    normas: ["SICEP"],
  },
  {
    nombre: "Peligrosa",
    exige: "Rotulación, hoja de seguridad y conductor con curso vigente.",
    normas: ["DS 298", "ASIQUIM"],
  },
  {
    nombre: "Refrigerada",
    exige: "Cadena de frío continua con registro de temperatura del viaje.",
    normas: ["SAG"],
  },
  {
    nombre: "Forestal",
    exige: "Amarre certificado y rutas rurales con tránsito de faena.",
    normas: ["CORMA"],
  },
  {
    nombre: "Contenedores",
    exige: "Coordinación portuaria, ventana de retiro y sello verificado.",
  },
  {
    nombre: "Maquinaria",
    exige: "Cama baja, cálculo de altura libre y permisos de circulación.",
  },
  {
    nombre: "Sobredimensionada",
    exige: "Permiso especial, escolta y horario de circulación restringido.",
  },
];

export default function QueMovemos() {
  return (
    <section
      id="cargas"
      className="mx-auto w-full max-w-[var(--ancho-max)] scroll-mt-[clamp(6rem,12vw,8.5rem)] px-[var(--borde-x)] py-[var(--seccion-y)]"
    >
      <div className="grid gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-[clamp(7rem,13vw,9rem)] lg:self-start">
          <Titulo linea1="Cada carga exige lo suyo." destacado="Nosotros lo cumplimos" />
          <p className="mt-4 max-w-[42ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            Cada carga tiene su norma, su equipo y su documentación.{" "}
            <span className="realce">
              Esta es la de cada una.
            </span>
          </p>

          <MarcoImagen
            className="mt-8 h-[clamp(12rem,20vw,16rem)] rounded-[var(--r-img)]"
            icono={<IconoCarga className="size-7" />}
            brief="Plano abierto de la rampla cargada con mezcla de carga: pallets, un contenedor y maquinaria en el mismo patio. Es la foto que prueba la versatilidad."
          />

          <p className="dato mt-8 flex items-baseline gap-2.5 leading-none">
            <span
              className="font-semibold tracking-[-0.045em] text-[var(--morado-ui)]"
              style={{ fontSize: "clamp(2.5rem, 3.5vw + 1rem, 4rem)" }}
            >
              08
            </span>
            <span className="text-[12.5px] uppercase tracking-[0.1em] text-[var(--texto-sec)]">
              tipos de carga
            </span>
          </p>
        </div>

        <ul className="border-t border-[color-mix(in_oklab,var(--borde)_55%,transparent)]">
          {CARGAS.map((c) => (
            <li
              key={c.nombre}
              className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-2 border-b border-[color-mix(in_oklab,var(--borde)_55%,transparent)] py-5 transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:bg-[color-mix(in_oklab,var(--sup-1)_55%,transparent)] sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:px-3"
            >
              <h3 className="text-[clamp(1.0625rem,0.6vw+0.9rem,1.25rem)] font-semibold tracking-[-0.02em] text-[var(--texto)]">
                {c.nombre}
              </h3>

              <div>
                <p className="text-[14.5px] leading-[1.55] text-[var(--texto-sec)]">
                  {c.exige}
                </p>

                {c.normas && (
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {c.normas.map((n) => (
                      <li
                        key={n}
                        className="dato rounded-[var(--r-chip)] border border-[color-mix(in_oklab,var(--borde)_80%,transparent)] px-2 py-0.5 text-[11px] text-[var(--morado-texto)]"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
