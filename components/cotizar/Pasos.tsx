"use client";

import { CampoTexto, Selector, Tarjetas, Casillas } from "./Campos";
import { REGIONES, comunasDe } from "../datos/chile";
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
} from "../datos/cotizacion";
import type { Cotizacion, Errores } from "../datos/formulario";
import type { Mensajes } from "@/mensajes";

/**
 * Los seis pasos del formulario.
 *
 * Cada paso se MONTA y DESMONTA — no se oculta con CSS. Con pasos ocultos y
 * `required` nativo, el navegador lanza "An invalid form control is not
 * focusable" y el envío falla en silencio. Por eso además el formulario va
 * con `noValidate` y la validación en JS es la fuente de verdad; los `type`
 * e `inputMode` quedan solo por el teclado que abren.
 *
 * `m` baja por prop hasta el último campo. No hay contexto de React de por
 * medio a propósito: media sección del sitio son componentes de servidor y
 * no podrían leerlo.
 */

type Props = {
  d: Cotizacion;
  set: <K extends keyof Cotizacion>(campo: K, valor: Cotizacion[K]) => void;
  e: Errores;
  m: Mensajes;
};

/* Los nombres de región son la dirección real de un lugar de Chile: van
   iguales en los cuatro idiomas, igual que "Main Logistics". */
const REGIONES_OPCIONES = REGIONES.map((r) => ({
  valor: r.region,
  etiqueta: r.region,
}));

/* ── 1 · Su carga ────────────────────────────────────────────────────── */

function PasoCarga({ d, set, e, m }: Props) {
  const c = m.cotizar.campos;

  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="tipoCarga"
        leyenda={c.tipoCargaLeyenda}
        valor={d.tipoCarga}
        alCambiar={(v) => set("tipoCarga", v)}
        opciones={tiposCarga(m)}
        error={e.tipoCarga}
        columnas={3}
      />

      {d.tipoCarga === "otra" && (
        <CampoTexto
          id="tipoCargaOtra"
          etiqueta={c.tipoCargaOtraEtiqueta}
          valor={d.tipoCargaOtra}
          alCambiar={(v) => set("tipoCargaOtra", v)}
          error={e.tipoCargaOtra}
          placeholder={c.tipoCargaOtraPlaceholder}
          maxLength={120}
          autoComplete="off"
        />
      )}

      <Tarjetas
        nombre="equipo"
        leyenda={c.equipoLeyenda}
        ayuda={c.equipoAyuda}
        valor={d.equipo}
        alCambiar={(v) => set("equipo", v)}
        opciones={equipos(m)}
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
  m,
}: Props & { lado: "origen" | "destino"; leyenda: string }) {
  const c = m.cotizar.campos;
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
          etiqueta={c.region}
          valor={region}
          alCambiar={(v) => {
            set(cRegion, v);
            // La comuna elegida deja de pertenecer a la región nueva.
            if (d[cComuna]) set(cComuna, "");
          }}
          opciones={REGIONES_OPCIONES}
          vacio={c.regionVacio}
          error={e[cRegion]}
        />

        <Selector
          id={cComuna}
          etiqueta={c.comuna}
          valor={d[cComuna]}
          alCambiar={(v) => set(cComuna, v)}
          // Los nombres de comuna tampoco se traducen: son direcciones.
          opciones={comunasDe(region).map((co) => ({ valor: co, etiqueta: co }))}
          vacio={region ? c.comunaVacio : c.comunaSinRegion}
          deshabilitado={!region}
          error={e[cComuna]}
        />

        <CampoTexto
          id={cDireccion}
          etiqueta={c.direccion}
          opcional={c.opcional}
          valor={d[cDireccion]}
          alCambiar={(v) => set(cDireccion, v)}
          placeholder={c.direccionPlaceholder}
          maxLength={160}
          autoComplete="off"
        />
      </div>
    </fieldset>
  );
}

function PasoRuta(p: Props) {
  const c = p.m.cotizar.campos;

  return (
    <div className="flex flex-col gap-8">
      <Extremo {...p} lado="origen" leyenda={c.origen} />
      <div className="h-px bg-[color-mix(in_oklab,var(--borde)_70%,transparent)]" />
      <Extremo {...p} lado="destino" leyenda={c.destino} />
    </div>
  );
}

/* ── 3 · Cuándo ──────────────────────────────────────────────────────── */

function PasoFecha({ d, set, e, m }: Props) {
  const c = m.cotizar.campos;

  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="fecha"
        leyenda={c.fechaLeyenda}
        valor={d.fecha}
        alCambiar={(v) => set("fecha", v)}
        opciones={fechas(m)}
        error={e.fecha}
        columnas={3}
      />

      {/* "Esta semana" y "Flexible" existen justamente para no obligar a
          abrir el calendario en un teléfono. */}
      {d.fecha === "especifica" && (
        <CampoTexto
          id="fechaDia"
          etiqueta={c.fechaDiaEtiqueta}
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

function PasoModalidad({ d, set, e, m }: Props) {
  const c = m.cotizar.campos;

  return (
    <div className="flex flex-col gap-7">
      <Tarjetas
        nombre="modalidad"
        leyenda={c.modalidadLeyenda}
        valor={d.modalidad}
        alCambiar={(v) => set("modalidad", v)}
        opciones={modalidades(m)}
        error={e.modalidad}
        columnas={3}
      />

      {/* Los condicionales se revelan en línea y el foco NO se mueve solo:
          el control revelado ya queda siguiente en el orden de tabulación. */}
      {d.modalidad === "recurrente" && (
        <Selector
          id="frecuencia"
          etiqueta={c.frecuenciaEtiqueta}
          valor={d.frecuencia}
          alCambiar={(v) => set("frecuencia", v)}
          opciones={frecuencias(m)}
          vacio={c.frecuenciaVacio}
          error={e.frecuencia}
        />
      )}

      {d.modalidad === "contrato" && (
        <Selector
          id="duracion"
          etiqueta={c.duracionEtiqueta}
          valor={d.duracion}
          alCambiar={(v) => set("duracion", v)}
          opciones={duraciones(m)}
          vacio={c.duracionVacio}
          error={e.duracion}
        />
      )}
    </div>
  );
}

/* ── 5 · Requisitos ──────────────────────────────────────────────────── */

function PasoRequisitos({ d, set, e, m }: Props) {
  const c = m.cotizar.campos;

  return (
    <div className="flex flex-col gap-7">
      <Casillas
        nombre="requisitos"
        leyenda={c.requisitosLeyenda}
        ayuda={c.requisitosAyuda}
        valores={d.requisitos}
        alCambiar={(v) => set("requisitos", v)}
        opciones={requisitos(m)}
      />

      {d.requisitos.includes("otro") && (
        <CampoTexto
          id="requisitoOtro"
          etiqueta={c.requisitoOtroEtiqueta}
          valor={d.requisitoOtro}
          alCambiar={(v) => set("requisitoOtro", v)}
          error={e.requisitoOtro}
          maxLength={120}
          autoComplete="off"
        />
      )}

      <Tarjetas
        nombre="valor"
        leyenda={c.valorLeyenda}
        ayuda={c.valorAyuda}
        valor={d.valor}
        alCambiar={(v) => set("valor", v)}
        opciones={valoresDeclarados(m)}
        error={e.valor}
      />
    </div>
  );
}

/* ── 6 · Sus datos ───────────────────────────────────────────────────── */

function PasoContacto({ d, set, e, m }: Props) {
  const c = m.cotizar.campos;

  return (
    <div className="flex flex-col gap-5">
      <CampoTexto
        id="empresa"
        etiqueta={c.empresa}
        valor={d.empresa}
        alCambiar={(v) => set("empresa", v)}
        error={e.empresa}
        placeholder={c.empresaPlaceholder}
        maxLength={100}
        autoComplete="organization"
      />
      <CampoTexto
        id="nombre"
        etiqueta={c.nombre}
        valor={d.nombre}
        alCambiar={(v) => set("nombre", v)}
        error={e.nombre}
        maxLength={80}
        autoComplete="name"
      />
      <CampoTexto
        id="correo"
        etiqueta={c.correo}
        tipo="email"
        valor={d.correo}
        alCambiar={(v) => set("correo", v)}
        error={e.correo}
        placeholder={c.correoPlaceholder}
        maxLength={120}
        autoComplete="email"
        inputMode="email"
      />
      <CampoTexto
        id="telefono"
        etiqueta={c.telefono}
        tipo="tel"
        valor={d.telefono}
        alCambiar={(v) => set("telefono", v)}
        error={e.telefono}
        placeholder={c.telefonoPlaceholder}
        maxLength={40}
        autoComplete="tel"
        inputMode="tel"
      />

      <Tarjetas
        nombre="canal"
        leyenda={c.canalLeyenda}
        valor={d.canal}
        alCambiar={(v) => set("canal", v)}
        opciones={canales(m)}
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
