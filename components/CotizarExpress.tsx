"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Titulo from "./Titulo";
import { Selector } from "./cotizar/Campos";
import { REGIONES } from "./datos/chile";
import { TIPOS_CARGA } from "./datos/cotizacion";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";

/**
 * La puerta fría: tres campos y nada más.
 *
 * El cotizador de seis pasos está bien —califica, pide el equipo, deja los
 * datos personales al final— pero durante un tiempo fue la ÚNICA puerta, y un
 * visitante en frío no completa seis pasos. El brief de desarrollo (§7.2) lo
 * plantea como tres puertas según qué tan decidida viene la persona: esta es
 * la de veinte segundos, el formulario completo es la de en medio, y WhatsApp
 * es la de quien ya decidió escribir.
 *
 * No manda nada: lleva a `/cotizar` con lo escrito en la URL, y el formulario
 * completo arranca con esos tres campos ya puestos. Así lo respondido acá no
 * se pierde ni se pregunta dos veces.
 *
 * Región y no comuna a propósito. Son 346 comunas y elegir la exacta es
 * trabajo; la región alcanza para saber si la ruta calza, y la comuna se pide
 * después, cuando la persona ya se comprometió con el proceso.
 */
export default function CotizarExpress({
  m,
  idioma,
}: {
  m: Mensajes;
  idioma: Idioma;
}) {
  const router = useRouter();
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [carga, setCarga] = useState("");

  const regiones = REGIONES.map((r) => ({ valor: r.region, etiqueta: r.region }));
  const cargas = TIPOS_CARGA.map((o) => ({
    valor: o.valor,
    etiqueta: m.cotizar.tiposCarga[o.clave as keyof typeof m.cotizar.tiposCarga].etiqueta,
  }));

  function continuar(e: React.FormEvent) {
    e.preventDefault();
    /* Solo viaja lo que se completó. Nada es obligatorio acá: el objetivo es
       que la persona llegue al formulario completo, no filtrarla en la
       entrada. Si no eligió nada, igual pasa y empieza de cero. */
    const p = new URLSearchParams();
    if (origen) p.set("origen", origen);
    if (destino) p.set("destino", destino);
    if (carga) p.set("carga", carga);
    const cadena = p.toString();
    router.push(`/${idioma}/cotizar${cadena ? `?${cadena}` : ""}`);
  }

  return (
    <section
      id="cotizar"
      className="tema-claro relative isolate scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[34rem] w-[min(90vw,52rem)] -translate-y-1/4 translate-x-1/4 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 26%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <div className="max-w-[46rem]">
          <Titulo linea1={m.express.titulo} destacado={m.cotizar.tituloDestacado} />
          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            {m.express.bajada}
          </p>
        </div>

        <form
          onSubmit={continuar}
          noValidate
          className="vidrio mt-[clamp(2rem,3.5vw,3rem)] rounded-[var(--r-img)] p-6 sm:p-8"
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <Selector
              id="express-origen"
              etiqueta={m.express.origen}
              valor={origen}
              alCambiar={setOrigen}
              opciones={regiones}
              vacio={m.express.vacioRegion}
            />
            <Selector
              id="express-destino"
              etiqueta={m.express.destino}
              valor={destino}
              alCambiar={setDestino}
              opciones={regiones}
              vacio={m.express.vacioRegion}
            />
            <Selector
              id="express-carga"
              etiqueta={m.express.carga}
              valor={carga}
              alCambiar={setCarga}
              opciones={cargas}
              vacio={m.express.vacioCarga}
            />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="submit"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-[var(--morado-solido)] px-6 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)] motion-reduce:hover:translate-y-0"
            >
              {m.express.continuar}
              <span className="grid size-6 place-items-center rounded-full bg-white/22 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3">
                  <path
                    d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <a
              href={`/${idioma}/cotizar`}
              className="text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
            >
              {m.express.completo}
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}
