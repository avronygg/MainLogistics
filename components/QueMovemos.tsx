import Titulo from "./Titulo";
import MarcoImagen from "./MarcoImagen";
import { IconoCarga } from "./Iconos";
import type { Mensajes } from "@/mensajes";
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
  /** Clave de la carga dentro de `m.cargas.tipos`. */
  clave: keyof Mensajes["cargas"]["tipos"];
  /**
   * Marcos normativos o códigos: van en mono. Quedan acá y no en el
   * diccionario a propósito — SICEP, ASIQUIM, SAG y CORMA son siglas de
   * organismos chilenos y "DS 298" es el número de un decreto. Son nombres
   * propios: no cambian de idioma, y tenerlos en un solo lugar evita que
   * una traducción los deforme.
   */
  normas?: string[];
};

/**
 * El arreglo guarda solo la clave y los códigos; los textos viven en el
 * diccionario. Se eligió esto por sobre una función que reciba `m` porque
 * el orden de las filas es una decisión de esta sección —de lo más común a
 * lo más excepcional— y así se lee de un vistazo sin las cadenas encima.
 */
const CARGAS: Carga[] = [
  { clave: "general" },
  { clave: "minera", normas: ["SICEP"] },
  { clave: "peligrosa", normas: ["DS 298", "ASIQUIM"] },
  { clave: "refrigerada", normas: ["SAG"] },
  { clave: "forestal", normas: ["CORMA"] },
  { clave: "contenedores" },
  { clave: "maquinaria" },
  { clave: "sobredimensionada" },
];

export default function QueMovemos({ m }: { m: Mensajes }) {
  return (
    <section
      id="cargas"
      className="mx-auto w-full max-w-[var(--ancho-max)] scroll-mt-[clamp(6rem,12vw,8.5rem)] px-[var(--borde-x)] py-[var(--seccion-y)]"
    >
      <div className="grid gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-[clamp(7rem,13vw,9rem)] lg:self-start">
          <Titulo linea1={m.cargas.tituloLinea1} destacado={m.cargas.tituloDestacado} />
          <p className="mt-4 max-w-[42ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            {m.cargas.bajada}{" "}
            <span className="realce">
              {m.cargas.bajadaRealce}
            </span>
          </p>

          <MarcoImagen
            m={m}
            className="mt-8 h-[clamp(12rem,20vw,16rem)] rounded-[var(--r-img)]"
            icono={<IconoCarga className="size-7" />}
            brief={m.cargas.briefFoto}
          />

          <p className="dato mt-8 flex items-baseline gap-2.5 leading-none">
            {/* La cifra no sale del diccionario: es el largo de CARGAS, no
                una frase. Si se tradujera, una traducción podría prometer
                un número que el sitio no muestra. */}
            <span
              className="font-semibold tracking-[-0.045em] text-[var(--morado-ui)]"
              style={{ fontSize: "clamp(2.5rem, 3.5vw + 1rem, 4rem)" }}
            >
              {String(CARGAS.length).padStart(2, "0")}
            </span>
            <span className="text-[12.5px] uppercase tracking-[0.1em] text-[var(--texto-sec)]">
              {m.cargas.etiquetaTipos}
            </span>
          </p>
        </div>

        <ul className="border-t border-[color-mix(in_oklab,var(--borde)_55%,transparent)]">
          {CARGAS.map((c) => {
            const tipo = m.cargas.tipos[c.clave];

            return (
              <li
                key={c.clave}
                className="group grid grid-cols-1 items-baseline gap-x-6 gap-y-2 border-b border-[color-mix(in_oklab,var(--borde)_55%,transparent)] py-5 transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:bg-[color-mix(in_oklab,var(--sup-1)_55%,transparent)] sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:px-3"
              >
                <h3 className="text-[clamp(1.0625rem,0.6vw+0.9rem,1.25rem)] font-semibold tracking-[-0.02em] text-[var(--texto)]">
                  {tipo.nombre}
                </h3>

                <div>
                  <p className="text-[14.5px] leading-[1.55] text-[var(--texto-sec)]">
                    {tipo.exige}
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
            );
          })}
        </ul>
      </div>
    </section>
  );
}
