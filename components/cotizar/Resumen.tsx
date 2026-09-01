"use client";

import {
  tiposCarga,
  equipos,
  fechas,
  modalidades,
  frecuencias,
  duraciones,
  requisitos,
  valoresDeclarados,
  canales,
  etiquetaDe,
  etiquetasDe,
} from "../datos/cotizacion";
import { pasos, type Cotizacion } from "../datos/formulario";
import type { Mensajes } from "@/mensajes";

/**
 * Resumen previo al envío.
 *
 * NO es el paso 7. El riel se muestra lleno, 6/6, y esto se titula "Revise
 * antes de enviar": contar el resumen como un séptimo paso rompe la promesa
 * de seis que se hizo en la entrada, justo en el último metro.
 *
 * Se compone como una hoja de pedido: etiqueta a la izquierda, valor a la
 * derecha, filas separadas por línea. Con este comprador, ver qué está
 * mandando antes de mandarlo no es un trámite: es la parte que genera
 * confianza.
 *
 * Geist Mono SOLO en el dato auditable — la fecha, el valor declarado, la
 * duración del contrato. Nombre, empresa, comuna y dirección van en la
 * tipografía normal: la regla de la mono es semántica, no decorativa.
 *
 * Acá se usan las listas TRADUCIDAS: esto lo lee quien cotiza. El correo que
 * sale al equipo se arma aparte, en español, en `app/api/cotizar/route.ts`.
 */

type Fila = { k: string; v: string; mono?: boolean };

function filasDe(d: Cotizacion, m: Mensajes): Fila[][] {
  const t = m.cotizar.resumen;
  const carga = etiquetaDe(tiposCarga(m), d.tipoCarga);

  const modalidad = [
    etiquetaDe(modalidades(m), d.modalidad),
    // Sin minúscula forzada: en chino no existe y en portugués e inglés la
    // frecuencia se lee mejor con su capitalización propia.
    d.modalidad === "recurrente" && d.frecuencia
      ? etiquetaDe(frecuencias(m), d.frecuencia)
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const listaRequisitos = [
    etiquetasDe(requisitos(m), d.requisitos),
    d.requisitos.includes("otro") && d.requisitoOtro ? `(${d.requisitoOtro})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    [
      {
        k: t.tipoCarga,
        v: d.tipoCarga === "otra" && d.tipoCargaOtra ? `${carga} — ${d.tipoCargaOtra}` : carga,
      },
      { k: t.equipo, v: etiquetaDe(equipos(m), d.equipo) },
    ],
    [
      {
        k: t.origen,
        v: [d.origenComuna, d.origenRegion].filter(Boolean).join(", ") +
          (d.origenDireccion ? ` — ${d.origenDireccion}` : ""),
      },
      {
        k: t.destino,
        v: [d.destinoComuna, d.destinoRegion].filter(Boolean).join(", ") +
          (d.destinoDireccion ? ` — ${d.destinoDireccion}` : ""),
      },
    ],
    [
      { k: t.cuando, v: etiquetaDe(fechas(m), d.fecha) },
      ...(d.fecha === "especifica" && d.fechaDia
        ? [{ k: t.dia, v: d.fechaDia, mono: true }]
        : []),
    ],
    [
      { k: t.modalidad, v: modalidad },
      ...(d.modalidad === "contrato" && d.duracion
        ? [{ k: t.duracion, v: etiquetaDe(duraciones(m), d.duracion), mono: true }]
        : []),
    ],
    [
      { k: t.requisitos, v: listaRequisitos || t.sinRequisitos },
      { k: t.valorDeclarado, v: etiquetaDe(valoresDeclarados(m), d.valor), mono: true },
    ],
    [
      { k: t.empresa, v: d.empresa },
      { k: t.contacto, v: d.nombre },
      { k: t.correo, v: d.correo },
      { k: t.telefono, v: d.telefono },
      { k: t.prefiere, v: etiquetaDe(canales(m), d.canal) },
    ],
  ];
}

export default function Resumen({
  d,
  editar,
  m,
}: {
  d: Cotizacion;
  editar: (paso: number) => void;
  m: Mensajes;
}) {
  const grupos = filasDe(d, m);
  const PASOS = pasos(m);

  return (
    <div className="flex flex-col gap-6">
      {grupos.map((filas, i) => (
        <section
          key={PASOS[i].id}
          aria-labelledby={`resumen-${PASOS[i].id}`}
          className="rounded-[14px] border border-[color-mix(in_oklab,var(--borde)_70%,transparent)] bg-[color-mix(in_oklab,var(--sup-1)_45%,transparent)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[color-mix(in_oklab,var(--borde)_70%,transparent)] px-4">
            <h3
              id={`resumen-${PASOS[i].id}`}
              className="py-3 text-[14px] font-semibold tracking-[-0.01em] text-[var(--texto)]"
            >
              {PASOS[i].titulo}
            </h3>
            {/* Fila táctil de 48px, no un enlace de 13px. */}
            <button
              type="button"
              onClick={() => editar(i)}
              className="-mr-2 flex min-h-[48px] items-center rounded-[10px] px-2 text-[14px] font-medium text-[var(--morado-texto)] underline underline-offset-4 focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)]"
            >
              {m.cotizar.resumen.editar}
              <span className="sr-only"> {PASOS[i].titulo}</span>
            </button>
          </div>

          <dl className="px-4 py-1">
            {filas.map((f, j) => (
              <div
                key={f.k}
                className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5 ${
                  j > 0
                    ? "border-t border-[color-mix(in_oklab,var(--borde)_45%,transparent)]"
                    : ""
                }`}
              >
                <dt className="text-[14px] leading-[1.4] text-[var(--texto-sec)]">
                  {f.k}
                </dt>
                <dd
                  className={`min-w-0 text-right text-[14.5px] font-medium leading-[1.4] text-[var(--texto)] ${
                    f.mono ? "dato" : ""
                  }`}
                >
                  {/* La raya de campo vacío es un signo, no una palabra: no
                      pasa por el diccionario. */}
                  {f.v || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
