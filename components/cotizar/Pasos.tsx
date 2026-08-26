"use client";

import { CampoTexto, Selector, Tarjetas, Casillas } from "./Campos";
import { REGIONES, comunasDe } from "../datos/chile";
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
} from "../datos/cotizacion";
import type { Cotizacion, Errores } from "../datos/formulario";

/**
 * Los seis pasos del formulario.
 *
 * Cada paso se MONTA y DESMONTA — no se oculta con CSS. Con pasos ocultos y
 * `required` nativo, el navegador lanza "An invalid form control is not
 * focusable" y el envío falla en silencio. Por eso además el formulario va
 * con `noValidate` y la validación en JS es la fuente de verdad; los `type`
 * e `inputMode` quedan solo por el teclado que abren.
 */

type Props = {
  d: Cotizacion;
  set: <K extends keyof Cotizacion>(campo: K, valor: Cotizacion[K]) => void;
  e: Errores;
};

const REGIONES_OPCIONES = REGIONES.map((r) => ({
  valor: r.region,
  etiqueta: r.region,
}));

/* ── 1 · Su carga ────────────────────────────────────────────────────── */

function PasoCarga({ d, set, e }: Props) {
  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="tipoCarga"
        leyenda="¿Qué va a transportar?"
        valor={d.tipoCarga}
        alCambiar={(v) => set("tipoCarga", v)}
        opciones={TIPOS_CARGA}
        error={e.tipoCarga}
        columnas={3}
      />

      {d.tipoCarga === "otra" && (
        <CampoTexto
          id="tipoCargaOtra"
          etiqueta="¿Qué carga es?"
          valor={d.tipoCargaOtra}
          alCambiar={(v) => set("tipoCargaOtra", v)}
          error={e.tipoCargaOtra}
          placeholder="Descríbala en pocas palabras"
          maxLength={120}
          autoComplete="off"
        />
      )}

      <Tarjetas
        nombre="equipo"
        leyenda="¿Qué equipo necesita?"
        ayuda="Si no está seguro, elija la última opción y lo asesoramos."
        valor={d.equipo}
        alCambiar={(v) => set("equipo", v)}
        opciones={EQUIPOS}
        error={e.equipo}
      />
    </div>
  );
}

/* ── 2 · La ruta ─────────────────────────────────────────────────────── */

/** Un extremo de la ruta. Va en fieldset propio: sin la leyenda, el lector
 *  de pantalla lee "Región, Comuna, Dirección, Región, Comuna, Dirección" y
 *  no hay forma de saber cuál es cuál. */
function Extremo({
  lado,
  leyenda,
  d,
  set,
  e,
}: Props & { lado: "origen" | "destino"; leyenda: string }) {
  const cRegion = `${lado}Region` as const;
  const cComuna = `${lado}Comuna` as const;
  const cDireccion = `${lado}Direccion` as const;
  const region = d[cRegion];

  return (
    <fieldset>
      <legend className="text-[15px] font-semibold leading-[1.3] tracking-[-0.02em] text-[var(--texto)]">
        {leyenda}
      </legend>

      <div className="mt-3 flex flex-col gap-4">
        <Selector
          id={cRegion}
          etiqueta="Región"
          valor={region}
          alCambiar={(v) => {
            set(cRegion, v);
            // La comuna elegida deja de pertenecer a la región nueva.
            if (d[cComuna]) set(cComuna, "");
          }}
          opciones={REGIONES_OPCIONES}
          vacio="Seleccione región"
          error={e[cRegion]}
        />

        <Selector
          id={cComuna}
          etiqueta="Comuna"
          valor={d[cComuna]}
          alCambiar={(v) => set(cComuna, v)}
          opciones={comunasDe(region).map((c) => ({ valor: c, etiqueta: c }))}
          vacio={region ? "Seleccione comuna" : "Elija primero la región"}
          deshabilitado={!region}
          error={e[cComuna]}
        />

        <CampoTexto
          id={cDireccion}
          etiqueta="Dirección o referencia"
          opcional
          valor={d[cDireccion]}
          alCambiar={(v) => set(cDireccion, v)}
          placeholder="Calle, número, sector, faena…"
          maxLength={160}
          autoComplete="off"
        />
      </div>
    </fieldset>
  );
}

function PasoRuta(p: Props) {
  return (
    <div className="flex flex-col gap-8">
      <Extremo {...p} lado="origen" leyenda="Origen" />
      <div className="h-px bg-[color-mix(in_oklab,var(--borde)_70%,transparent)]" />
      <Extremo {...p} lado="destino" leyenda="Destino" />
    </div>
  );
}

/* ── 3 · Cuándo ──────────────────────────────────────────────────────── */

function PasoFecha({ d, set, e }: Props) {
  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="fecha"
        leyenda="¿Cuándo necesita el servicio?"
        valor={d.fecha}
        alCambiar={(v) => set("fecha", v)}
        opciones={FECHAS}
        error={e.fecha}
        columnas={3}
      />

      {/* "Esta semana" y "Flexible" existen justamente para no obligar a
          abrir el calendario en un teléfono. */}
      {d.fecha === "especifica" && (
        <CampoTexto
          id="fechaDia"
          etiqueta="Día del servicio"
          tipo="date"
          valor={d.fechaDia}
          alCambiar={(v) => set("fechaDia", v)}
          error={e.fechaDia}
          min={new Date().toISOString().slice(0, 10)}
        />
      )}
    </div>
  );
}

/* ── 4 · Modalidad ───────────────────────────────────────────────────── */

function PasoModalidad({ d, set, e }: Props) {
  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="modalidad"
        leyenda="¿Es un traslado puntual o se repite?"
        valor={d.modalidad}
        alCambiar={(v) => set("modalidad", v)}
        opciones={MODALIDADES}
        error={e.modalidad}
        columnas={3}
      />

      {/* Los condicionales se revelan en línea y el foco NO se mueve solo:
          el control revelado ya queda siguiente en el orden de tabulación. */}
      {d.modalidad === "recurrente" && (
        <Selector
          id="frecuencia"
          etiqueta="¿Cada cuánto?"
          valor={d.frecuencia}
          alCambiar={(v) => set("frecuencia", v)}
          opciones={FRECUENCIAS}
          vacio="Seleccione frecuencia"
          error={e.frecuencia}
        />
      )}

      {d.modalidad === "contrato" && (
        <Selector
          id="duracion"
          etiqueta="Duración del contrato"
          valor={d.duracion}
          alCambiar={(v) => set("duracion", v)}
          opciones={DURACIONES}
          vacio="Seleccione duración"
          error={e.duracion}
        />
      )}
    </div>
  );
}

/* ── 5 · Requisitos ──────────────────────────────────────────────────── */

function PasoRequisitos({ d, set, e }: Props) {
  return (
    <div className="flex flex-col gap-7">
      <Casillas
        nombre="requisitos"
        leyenda="¿Su carga tiene alguna exigencia especial?"
        ayuda="Marque las que correspondan. Si no aplica ninguna, siga."
        valores={d.requisitos}
        alCambiar={(v) => set("requisitos", v)}
        opciones={REQUISITOS}
      />

      {d.requisitos.includes("otro") && (
        <CampoTexto
          id="requisitoOtro"
          etiqueta="¿Cuál es el requisito?"
          valor={d.requisitoOtro}
          alCambiar={(v) => set("requisitoOtro", v)}
          error={e.requisitoOtro}
          maxLength={120}
          autoComplete="off"
        />
      )}

      <Tarjetas
        nombre="valor"
        leyenda="Valor declarado de la carga"
        ayuda="Define la cobertura del seguro. Si no lo tiene a mano, elija la última opción."
        valor={d.valor}
        alCambiar={(v) => set("valor", v)}
        opciones={VALORES}
        error={e.valor}
      />
    </div>
  );
}

/* ── 6 · Sus datos ───────────────────────────────────────────────────── */

function PasoContacto({ d, set, e }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <CampoTexto
        id="empresa"
        etiqueta="Empresa"
        valor={d.empresa}
        alCambiar={(v) => set("empresa", v)}
        error={e.empresa}
        placeholder="Razón social o nombre de fantasía"
        maxLength={100}
        autoComplete="organization"
      />
      <CampoTexto
        id="nombre"
        etiqueta="Nombre de contacto"
        valor={d.nombre}
        alCambiar={(v) => set("nombre", v)}
        error={e.nombre}
        maxLength={80}
        autoComplete="name"
      />
      <CampoTexto
        id="correo"
        etiqueta="Correo"
        tipo="email"
        valor={d.correo}
        alCambiar={(v) => set("correo", v)}
        error={e.correo}
        placeholder="nombre@empresa.cl"
        maxLength={120}
        autoComplete="email"
        inputMode="email"
      />
      <CampoTexto
        id="telefono"
        etiqueta="Teléfono o WhatsApp"
        tipo="tel"
        valor={d.telefono}
        alCambiar={(v) => set("telefono", v)}
        error={e.telefono}
        placeholder="+56 9 1234 5678"
        maxLength={40}
        autoComplete="tel"
        inputMode="tel"
      />

      <Tarjetas
        nombre="canal"
        leyenda="¿Por dónde prefiere que le respondamos?"
        valor={d.canal}
        alCambiar={(v) => set("canal", v)}
        opciones={CANALES}
        error={e.canal}
        columnas={3}
      />
    </div>
  );
}

/* ── Despacho ────────────────────────────────────────────────────────── */

const CUERPOS = [
  PasoCarga,
  PasoRuta,
  PasoFecha,
  PasoModalidad,
  PasoRequisitos,
  PasoContacto,
];

export default function CuerpoPaso({ indice, ...p }: Props & { indice: number }) {
  const Cuerpo = CUERPOS[indice];
  return <Cuerpo {...p} />;
}
