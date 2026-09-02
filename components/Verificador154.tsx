"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CampoTexto, Selector } from "./cotizar/Campos";
import { REGIONES } from "./datos/chile";
import {
  FUENTES,
  REQUISITOS,
  TIPOS_TRASLADO,
  validarPatente,
  validarRut,
  type ClaveRequisito,
} from "./datos/resolucion154";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";
import { NOMBRES } from "@/mensajes/idiomas";

/**
 * Verificador de Resolución 154 del SII.
 *
 * El brief §8.1 lo marca máxima prioridad, y la razón es de calendario: el
 * 1 de noviembre de 2026 miles de operadores que hoy coordinan por WhatsApp
 * y planilla quedan fuera de norma. Quien llega acá tiene un problema con
 * fecha, y esa es exactamente la persona que después necesita un
 * transportista que ya emita bien.
 *
 * ── Decisiones ──────────────────────────────────────────────────────────
 *
 * Una sola pantalla, no seis pasos. El cotizador se parte en pasos porque
 * es un embudo de venta y conviene pedir de a poco; esto es una
 * herramienta de diagnóstico, y quien la abre quiere ver la lista completa
 * de lo que la norma exige aunque no complete nada. La lista ES parte del
 * valor.
 *
 * El RUT se valida por módulo 11 de verdad, no por expresión regular. Un
 * RUT bien escrito e inexistente pasa cualquier regex, y es justamente el
 * error que aparece en una guía llenada a mano.
 *
 * El PDF sale por `window.print()` y una hoja de estilos de impresión, sin
 * librería. El brief pide "descarga de checklist en PDF"; cargar 300 KB de
 * generador de PDF para producir lo que el navegador ya sabe hacer, y peor
 * en accesibilidad, no vale la pena.
 *
 * Nada se envía a ninguna parte. El formulario no tiene POST: se calcula en
 * el navegador y ahí se queda. Una herramienta que promete revisar su
 * cumplimiento tributario y de paso se lleva los datos sería exactamente el
 * gesto que hace desconfiar de ella.
 */

type Datos = {
  origenDireccion: string;
  origenRegion: string;
  origenComuna: string;
  destinoDireccion: string;
  destinoRegion: string;
  destinoComuna: string;
  choferNombre: string;
  choferRut: string;
  transportistaRut: string;
  patente: string;
  patenteCarro: string;
  sinCarro: boolean;
  sinPatente: boolean;
  bienNombre: string;
  bienCantidad: string;
  bienUnidad: string;
  bienPeso: string;
  bienPrecio: string;
  sinPrecio: boolean;
  tipoTraslado: string;
  fechaSalida: string;
  horaSalida: string;
  unaPorVehiculo: boolean;
  prolongado: boolean;
  fechaLlegada: string;
  declaraProlongado: boolean;
};

const VACIO: Datos = {
  origenDireccion: "",
  origenRegion: "",
  origenComuna: "",
  destinoDireccion: "",
  destinoRegion: "",
  destinoComuna: "",
  choferNombre: "",
  choferRut: "",
  transportistaRut: "",
  patente: "",
  patenteCarro: "",
  sinCarro: false,
  sinPatente: false,
  bienNombre: "",
  bienCantidad: "",
  bienUnidad: "",
  bienPeso: "",
  bienPrecio: "",
  sinPrecio: false,
  tipoTraslado: "",
  fechaSalida: "",
  horaSalida: "",
  unaPorVehiculo: false,
  prolongado: false,
  fechaLlegada: "",
  declaraProlongado: false,
};

/** Casilla de verificación, con área de toque de 44px. */
function Casilla({
  id,
  etiqueta,
  marcado,
  alCambiar,
}: {
  id: string;
  etiqueta: string;
  marcado: boolean;
  alCambiar: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[14.5px] leading-[1.5] text-[var(--texto-sec)]"
    >
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={marcado}
        onChange={(e) => alCambiar(e.target.checked)}
        className="size-[18px] shrink-0 accent-[var(--morado-solido)]"
      />
      {etiqueta}
    </label>
  );
}

function Bloque({
  titulo,
  exige,
  referencia,
  tags,
  children,
}: {
  titulo: string;
  exige: string;
  referencia: string;
  tags: readonly string[];
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-[var(--borde)] pt-7">
      <legend className="sr-only">{titulo}</legend>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10">
        <div>
          <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-[var(--texto)]">
            {titulo}
          </h3>
          <p className="mt-2 max-w-[42ch] text-[14px] leading-[1.6] text-[var(--texto-sec)]">
            {exige}
          </p>
          {/* Referencia y tags en mono: son dato auditable, que es
              exactamente el criterio del sistema de diseño para la mono. */}
          <p className="dato mt-3 text-[12px] leading-[1.6] text-[color-mix(in_oklab,var(--texto-sec)_78%,transparent)]">
            {referencia}
            {tags.length > 0 && <> · {tags.join(" · ")}</>}
          </p>
        </div>
        <div className="space-y-5">{children}</div>
      </div>
    </fieldset>
  );
}

export default function Verificador154({
  m,
  idioma,
}: {
  m: Mensajes;
  idioma: Idioma;
}) {
  const t = m.verificador;
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [revisado, setRevisado] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Datos>(campo: K, valor: Datos[K]) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const regiones = REGIONES.map((r) => ({ valor: r.region, etiqueta: r.region }));
  const comunasDe = (region: string) =>
    (REGIONES.find((r) => r.region === region)?.comunas ?? []).map((c) => ({
      valor: c,
      etiqueta: c,
    }));

  /* Errores de formato, que se muestran apenas hay algo escrito y no solo
     al revisar: un RUT mal tipeado conviene avisarlo ahí mismo. */
  const errorRut = (valor: string) => {
    if (!valor.trim()) return undefined;
    const r = validarRut(valor);
    if (r.valido) return undefined;
    return r.motivo === "digito" ? t.errores.rutDigito : t.errores.rutFormato;
  };
  const errorPatente = (valor: string) => {
    if (!valor.trim()) return undefined;
    return validarPatente(valor).valido ? undefined : t.errores.patenteFormato;
  };

  const evaluacion = useMemo(() => {
    const lleno = (v: string) => v.trim().length > 0;
    const rutOk = (v: string) => validarRut(v).valido;
    const patenteOk = (v: string) => validarPatente(v).valido;

    /* Tres estados y no dos. El requisito de traslado prolongado solo rige
       si el viaje dura más de un día; con el formulario en blanco, marcarlo
       como "está" dice que se cumplió algo que nadie declaró, y marcarlo
       como "falta" manda a corregir algo que la norma no le pide a ese
       viaje. Las dos respuestas son mentira, así que hay una tercera. */
    const juzgar = (cumplido: boolean): "ok" | "falta" => (cumplido ? "ok" : "falta");

    const estado: Record<ClaveRequisito, "ok" | "falta" | "noAplica"> = {
      origen: juzgar(lleno(datos.origenDireccion) && lleno(datos.origenComuna)),
      destino: juzgar(lleno(datos.destinoDireccion) && lleno(datos.destinoComuna)),
      chofer: juzgar(lleno(datos.choferNombre) && rutOk(datos.choferRut)),
      transportista: juzgar(rutOk(datos.transportistaRut)),
      /* Declarar expresamente que no se conocen las patentes SÍ cumple: es
         lo que dice el resolutivo 1 c). Dejar el campo vacío, no. */
      patentes: juzgar(
        datos.sinPatente
          ? true
          : patenteOk(datos.patente) && (datos.sinCarro || patenteOk(datos.patenteCarro)),
      ),
      bienes: juzgar(
        lleno(datos.bienNombre) &&
          lleno(datos.bienCantidad) &&
          lleno(datos.bienUnidad) &&
          lleno(datos.bienPeso) &&
          (datos.sinPrecio || lleno(datos.bienPrecio)),
      ),
      tipoTraslado: juzgar(lleno(datos.tipoTraslado)),
      unaPorVehiculo: juzgar(datos.unaPorVehiculo),
      prolongado: !datos.prolongado
        ? "noAplica"
        : juzgar(datos.declaraProlongado && lleno(datos.fechaLlegada)),
      salida: juzgar(lleno(datos.fechaSalida) && lleno(datos.horaSalida)),
    };

    const faltan = REQUISITOS.filter((r) => estado[r.clave] === "falta");
    /* El total del que se cuenta son los que aplican. Decir "faltan 9 de
       diez" cuando uno de los diez no rige para ese viaje infla el problema
       y hace dudar del resto de la cuenta. */
    const aplican = REQUISITOS.filter((r) => estado[r.clave] !== "noAplica").length;
    return { estado, faltan, aplican };
  }, [datos]);

  function revisar(e: React.FormEvent) {
    e.preventDefault();
    setRevisado(true);
    /* El foco va al resultado, no solo el scroll: quien navega con lector
       de pantalla necesita que se le anuncie, y no lo hace un scroll. */
    requestAnimationFrame(() => resultadoRef.current?.focus());
  }

  const fecha = new Intl.DateTimeFormat(NOMBRES[idioma].html, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const todoOk = evaluacion.faltan.length === 0;

  return (
    <section
      id="verificador"
      className="tema-claro scroll-mt-[clamp(6rem,12vw,8.5rem)]"
    >
      <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] pb-[var(--seccion-y)] pt-[clamp(7.5rem,13vw,10rem)]">
        <header className="max-w-[52rem]">
          <h1 className="text-[clamp(2rem,2.6vw+1.2rem,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--texto)]">
            <span className="block">{t.titulo}</span>
            <span className="text-[var(--morado-ui)]">{t.destacado}</span>
          </h1>
          <p className="mt-5 max-w-[54ch] text-[clamp(1rem,0.4vw+0.92rem,1.15rem)] leading-[1.6] text-[var(--texto-sec)]">
            {t.bajada}
          </p>
          <p className="mt-5 max-w-[64ch] text-[15px] leading-[1.7] text-[var(--texto-sec)]">
            {t.intro}
          </p>

          {/* El descargo va visible y arriba, no en letra chica al pie. Una
              herramienta que orienta sobre cumplimiento tributario y esconde
              que no es asesoría está pidiendo que le crean de más. */}
          <p className="mt-6 max-w-[62ch] border-l-2 border-[color-mix(in_oklab,var(--morado-ui)_55%,transparent)] pl-4 text-[14px] leading-[1.6] text-[var(--texto-sec)]">
            {t.descargo}
          </p>

          {idioma !== "es" && (
            <p className="mt-4 max-w-[62ch] text-[14px] leading-[1.6] text-[color-mix(in_oklab,var(--texto-sec)_85%,transparent)]">
              {t.avisoIdioma}
            </p>
          )}

          <p className="dato mt-6 text-[12.5px] leading-[1.7] text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]">
            {t.fuentes}:{" "}
            {FUENTES.map((f, i) => (
              <span key={f.url}>
                {i > 0 && " · "}
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-[var(--texto)]"
                >
                  {f.etiqueta}
                </a>
              </span>
            ))}
          </p>
        </header>

        <form
          onSubmit={revisar}
          noValidate
          className="mt-[clamp(3rem,5vw,4.5rem)] space-y-8 print:hidden"
        >
          <Bloque {...REQUISITOS[0]}>
            <CampoTexto
              id="origenDireccion"
              etiqueta={t.formulario.direccion}
              valor={datos.origenDireccion}
              alCambiar={(v) => set("origenDireccion", v)}
              autoComplete="off"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Selector
                id="origenRegion"
                etiqueta={m.cotizar.campos.region}
                valor={datos.origenRegion}
                alCambiar={(v) => {
                  set("origenRegion", v);
                  set("origenComuna", "");
                }}
                opciones={regiones}
                vacio={m.cotizar.campos.regionVacio}
              />
              <Selector
                id="origenComuna"
                etiqueta={m.cotizar.campos.comuna}
                valor={datos.origenComuna}
                alCambiar={(v) => set("origenComuna", v)}
                opciones={comunasDe(datos.origenRegion)}
                vacio={m.cotizar.campos.comunaVacio}
                deshabilitado={!datos.origenRegion}
              />
            </div>
          </Bloque>

          <Bloque {...REQUISITOS[1]}>
            <CampoTexto
              id="destinoDireccion"
              etiqueta={t.formulario.direccion}
              valor={datos.destinoDireccion}
              alCambiar={(v) => set("destinoDireccion", v)}
              autoComplete="off"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Selector
                id="destinoRegion"
                etiqueta={m.cotizar.campos.region}
                valor={datos.destinoRegion}
                alCambiar={(v) => {
                  set("destinoRegion", v);
                  set("destinoComuna", "");
                }}
                opciones={regiones}
                vacio={m.cotizar.campos.regionVacio}
              />
              <Selector
                id="destinoComuna"
                etiqueta={m.cotizar.campos.comuna}
                valor={datos.destinoComuna}
                alCambiar={(v) => set("destinoComuna", v)}
                opciones={comunasDe(datos.destinoRegion)}
                vacio={m.cotizar.campos.comunaVacio}
                deshabilitado={!datos.destinoRegion}
              />
            </div>
          </Bloque>

          <Bloque {...REQUISITOS[2]}>
            <CampoTexto
              id="choferNombre"
              etiqueta={t.formulario.nombreChofer}
              valor={datos.choferNombre}
              alCambiar={(v) => set("choferNombre", v)}
              autoComplete="off"
            />
            <CampoTexto
              id="choferRut"
              etiqueta={t.formulario.rutChofer}
              valor={datos.choferRut}
              alCambiar={(v) => set("choferRut", v)}
              error={errorRut(datos.choferRut)}
              inputMode="text"
              placeholder="12345678-9"
              autoComplete="off"
            />
          </Bloque>

          <Bloque {...REQUISITOS[3]}>
            <CampoTexto
              id="transportistaRut"
              etiqueta={t.formulario.rutTransportista}
              valor={datos.transportistaRut}
              alCambiar={(v) => set("transportistaRut", v)}
              error={errorRut(datos.transportistaRut)}
              placeholder="76123456-7"
              autoComplete="off"
            />
          </Bloque>

          <Bloque {...REQUISITOS[4]}>
            <CampoTexto
              id="patente"
              etiqueta={t.formulario.patente}
              valor={datos.patente}
              alCambiar={(v) => set("patente", v)}
              error={errorPatente(datos.patente)}
              placeholder="BBCC12"
              autoComplete="off"
              disabled={datos.sinPatente}
            />
            <CampoTexto
              id="patenteCarro"
              etiqueta={t.formulario.patenteCarro}
              valor={datos.patenteCarro}
              alCambiar={(v) => set("patenteCarro", v)}
              error={errorPatente(datos.patenteCarro)}
              placeholder="AB1234"
              autoComplete="off"
              disabled={datos.sinPatente || datos.sinCarro}
            />
            <Casilla
              id="sinCarro"
              etiqueta={t.formulario.sinCarro}
              marcado={datos.sinCarro}
              alCambiar={(v) => set("sinCarro", v)}
            />
            <Casilla
              id="sinPatente"
              etiqueta={t.formulario.sinPatente}
              marcado={datos.sinPatente}
              alCambiar={(v) => set("sinPatente", v)}
            />
          </Bloque>

          <Bloque {...REQUISITOS[5]}>
            <CampoTexto
              id="bienNombre"
              etiqueta={t.formulario.bienNombre}
              valor={datos.bienNombre}
              alCambiar={(v) => set("bienNombre", v)}
              autoComplete="off"
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <CampoTexto
                id="bienCantidad"
                etiqueta={t.formulario.bienCantidad}
                valor={datos.bienCantidad}
                alCambiar={(v) => set("bienCantidad", v)}
                inputMode="decimal"
                autoComplete="off"
              />
              <CampoTexto
                id="bienUnidad"
                etiqueta={t.formulario.bienUnidad}
                valor={datos.bienUnidad}
                alCambiar={(v) => set("bienUnidad", v)}
                autoComplete="off"
              />
              <CampoTexto
                id="bienPeso"
                etiqueta={t.formulario.bienPeso}
                valor={datos.bienPeso}
                alCambiar={(v) => set("bienPeso", v)}
                autoComplete="off"
              />
            </div>
            <CampoTexto
              id="bienPrecio"
              etiqueta={t.formulario.bienPrecio}
              valor={datos.bienPrecio}
              alCambiar={(v) => set("bienPrecio", v)}
              inputMode="decimal"
              autoComplete="off"
              disabled={datos.sinPrecio}
            />
            <Casilla
              id="sinPrecio"
              etiqueta={t.formulario.sinPrecio}
              marcado={datos.sinPrecio}
              alCambiar={(v) => set("sinPrecio", v)}
            />
          </Bloque>

          <Bloque {...REQUISITOS[6]}>
            <Selector
              id="tipoTraslado"
              etiqueta={t.formulario.tipoTraslado}
              valor={datos.tipoTraslado}
              alCambiar={(v) => set("tipoTraslado", v)}
              opciones={TIPOS_TRASLADO.map((o) => ({
                valor: o.valor,
                etiqueta: `${o.valor}. ${o.etiqueta}`,
              }))}
              vacio={t.formulario.elijaTipo}
            />
          </Bloque>

          <Bloque {...REQUISITOS[7]}>
            <Casilla
              id="unaPorVehiculo"
              etiqueta={t.formulario.unaPorVehiculo}
              marcado={datos.unaPorVehiculo}
              alCambiar={(v) => set("unaPorVehiculo", v)}
            />
          </Bloque>

          <Bloque {...REQUISITOS[8]}>
            <Casilla
              id="prolongado"
              etiqueta={t.formulario.prolongado}
              marcado={datos.prolongado}
              alCambiar={(v) => set("prolongado", v)}
            />
            {datos.prolongado && (
              <>
                <CampoTexto
                  id="fechaLlegada"
                  etiqueta={t.formulario.fechaLlegada}
                  valor={datos.fechaLlegada}
                  alCambiar={(v) => set("fechaLlegada", v)}
                  tipo="date"
                />
                <Casilla
                  id="declaraProlongado"
                  etiqueta={t.formulario.declaraProlongado}
                  marcado={datos.declaraProlongado}
                  alCambiar={(v) => set("declaraProlongado", v)}
                />
              </>
            )}
          </Bloque>

          <Bloque {...REQUISITOS[9]}>
            <div className="grid gap-5 sm:grid-cols-2">
              <CampoTexto
                id="fechaSalida"
                etiqueta={t.formulario.fechaSalida}
                valor={datos.fechaSalida}
                alCambiar={(v) => set("fechaSalida", v)}
                tipo="date"
              />
              {/* `type="time"` no está en la lista de `CampoTexto`, y
                  ampliarla por un campo tocaría el formulario de cotización.
                  Se arma acá, con las mismas clases. */}
              <div>
                <label
                  htmlFor="horaSalida"
                  className="block text-[14px] font-medium tracking-[-0.01em] text-[var(--texto)]"
                >
                  {t.formulario.horaSalida}
                </label>
                <input
                  id="horaSalida"
                  name="horaSalida"
                  type="time"
                  value={datos.horaSalida}
                  onChange={(e) => set("horaSalida", e.target.value)}
                  className="mt-2 min-h-[52px] w-full rounded-[14px] border border-[var(--borde)] bg-[var(--sup-1)] px-4 text-[16px] text-[var(--texto)] outline-none transition-[border-color,box-shadow] duration-[var(--dur-estado)] focus-visible:border-[var(--morado-solido)] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_28%,transparent)]"
                />
              </div>
            </div>
          </Bloque>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--borde)] pt-8">
            <button
              type="submit"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--morado-solido)] px-7 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)] motion-reduce:hover:translate-y-0"
            >
              {t.acciones.revisar}
            </button>
            <button
              type="button"
              onClick={() => {
                setDatos(VACIO);
                setRevisado(false);
              }}
              className="text-[14.5px] font-medium text-[var(--texto-sec)] underline underline-offset-4 hover:text-[var(--texto)]"
            >
              {t.acciones.limpiar}
            </button>
          </div>
        </form>

        {revisado && (
          <div
            ref={resultadoRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="mt-[clamp(3rem,5vw,4rem)] scroll-mt-[clamp(6rem,12vw,8.5rem)] outline-none"
          >
            <h2 className="text-[clamp(1.5rem,1.6vw+1.1rem,2rem)] font-semibold tracking-[-0.03em] text-[var(--texto)]">
              {todoOk
                ? t.resultado.cumple
                : t.resultado.noCumple
                    .replace("{n}", String(evaluacion.faltan.length))
                    .replace("{total}", String(evaluacion.aplican))}
            </h2>
            <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.7] text-[var(--texto-sec)]">
              {todoOk ? t.resultado.cumpleTexto : t.resultado.noCumpleTexto}
            </p>
            <p className="dato mt-3 text-[12.5px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--texto-sec)_78%,transparent)]">
              {t.resultado.revisadoEl} {fecha}
            </p>

            <ul className="mt-8 border-t border-[var(--borde)]">
              {REQUISITOS.map((r) => {
                const estado = evaluacion.estado[r.clave];
                const falta = estado === "falta";
                return (
                  <li
                    key={r.clave}
                    /* La primera columna va a ancho FIJO y no `auto`. Cada
                       fila es su propia grilla, así que con `auto` la fila
                       que dice "NO APLICA" se corre respecto de las que
                       dicen "FALTA", y una lista de diez puntos que no
                       alinea se lee como diez cosas sueltas. */
                    className="grid gap-x-5 gap-y-1 border-b border-[var(--borde)] py-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-baseline"
                  >
                    <span
                      className={[
                        "dato text-[11.5px] uppercase tracking-[0.08em]",
                        falta
                          ? "font-semibold text-[var(--morado-texto)]"
                          : "text-[color-mix(in_oklab,var(--texto-sec)_80%,transparent)]",
                      ].join(" ")}
                    >
                      {estado === "ok" && t.resultado.listo}
                      {estado === "falta" && t.resultado.pendiente}
                      {estado === "noAplica" && t.resultado.noAplica}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-[var(--texto)]">
                      {r.titulo}
                      {falta && (
                        <span className="mt-1 block max-w-[58ch] text-[13.5px] leading-[1.6] text-[var(--texto-sec)]">
                          {r.exige}
                        </span>
                      )}
                    </span>
                    <span className="dato text-[12px] text-[color-mix(in_oklab,var(--texto-sec)_78%,transparent)]">
                      {r.referencia}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-[48px] items-center rounded-full border border-[var(--borde)] px-6 text-[14.5px] font-medium text-[var(--texto)] transition-colors duration-[var(--dur-hover)] hover:bg-[var(--sup-2)]"
              >
                {t.acciones.imprimir}
              </button>
            </div>

            {/* El CTA va DESPUÉS del resultado y nunca antes. Poner la venta
                delante de la respuesta convierte la herramienta en un cebo,
                y quien lo nota no vuelve. */}
            <div className="mt-10 rounded-[var(--r-card)] border border-[var(--borde)] bg-[var(--sup-1)] p-6 sm:p-8 print:hidden">
              <h3 className="text-[clamp(1.15rem,1vw+0.9rem,1.4rem)] font-semibold tracking-[-0.02em] text-[var(--texto)]">
                {t.resultado.ctaTitulo}
              </h3>
              <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.65] text-[var(--texto-sec)]">
                {t.resultado.ctaTexto}
              </p>
              <Link
                href={`/${idioma}/cotizar`}
                className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--morado-solido)] px-7 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
              >
                {t.resultado.ctaBoton}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
