"use client";

import {
  TIPOS_CARGA,
  EQUIPOS,
  FECHAS,
  MODALIDADES,
  FRECUENCIAS,
  DURACIONES,
  REQUISITOS,
  VALORES,
  CANALES,
  etiquetaDe,
  etiquetasDe,
} from "../datos/cotizacion";
import { PASOS, type Cotizacion } from "../datos/formulario";

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
 */

type Fila = { k: string; v: string; mono?: boolean };

function filasDe(d: Cotizacion): Fila[][] {
  const carga = etiquetaDe(TIPOS_CARGA, d.tipoCarga);

  const modalidad = [
    etiquetaDe(MODALIDADES, d.modalidad),
    d.modalidad === "recurrente" && d.frecuencia
      ? etiquetaDe(FRECUENCIAS, d.frecuencia).toLowerCase()
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const requisitos = [
    etiquetasDe(REQUISITOS, d.requisitos),
    d.requisitos.includes("otro") && d.requisitoOtro ? `(${d.requisitoOtro})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return [
    [
      {
        k: "Tipo de carga",
        v: d.tipoCarga === "otra" && d.tipoCargaOtra ? `${carga} — ${d.tipoCargaOtra}` : carga,
      },
      { k: "Equipo", v: etiquetaDe(EQUIPOS, d.equipo) },
    ],
    [
      {
        k: "Origen",
        v: [d.origenComuna, d.origenRegion].filter(Boolean).join(", ") +
          (d.origenDireccion ? ` — ${d.origenDireccion}` : ""),
      },
      {
        k: "Destino",
        v: [d.destinoComuna, d.destinoRegion].filter(Boolean).join(", ") +
          (d.destinoDireccion ? ` — ${d.destinoDireccion}` : ""),
      },
    ],
    [
      { k: "Cuándo", v: etiquetaDe(FECHAS, d.fecha) },
      ...(d.fecha === "especifica" && d.fechaDia
        ? [{ k: "Día", v: d.fechaDia, mono: true }]
        : []),
    ],
    [
      { k: "Modalidad", v: modalidad },
      ...(d.modalidad === "contrato" && d.duracion
        ? [{ k: "Duración", v: etiquetaDe(DURACIONES, d.duracion), mono: true }]
        : []),
    ],
    [
      { k: "Requisitos", v: requisitos || "Ninguno indicado" },
      { k: "Valor declarado", v: etiquetaDe(VALORES, d.valor), mono: true },
    ],
    [
      { k: "Empresa", v: d.empresa },
      { k: "Contacto", v: d.nombre },
      { k: "Correo", v: d.correo },
      { k: "Teléfono", v: d.telefono },
      { k: "Prefiere", v: etiquetaDe(CANALES, d.canal) },
    ],
  ];
}

export default function Resumen({
  d,
  editar,
}: {
  d: Cotizacion;
  editar: (paso: number) => void;
}) {
  const grupos = filasDe(d);

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
              Editar
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
