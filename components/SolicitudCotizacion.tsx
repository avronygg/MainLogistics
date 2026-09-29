"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CampoTexto, Plantilla, Selector } from "./cotizar/Campos";
import Hoja, { HOJA_ALTO, HOJA_ANCHO } from "./solicitud/Hoja";
import { CORREO, WHATSAPP } from "./datos/contacto";
import {
  EQUIPOS,
  LINEA_VACIA,
  MAX_LINEAS,
  MODALIDADES,
  OBLIGATORIOS,
  SOLICITUD_VACIA,
  TIPOS_CARGA,
  cantidadValida,
  correoValido,
  fechaValida,
  formatearRut,
  rutValido,
  telefonoValido,
  type Linea,
  type Solicitud,
} from "./datos/solicitud";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";

/**
 * Solicitud de cotización: el formulario a un lado, el documento armándose
 * al otro.
 *
 * ── Por qué la hoja se dibuja grande y se escala ─────────────────────────
 *
 * La hoja siempre mide 794×1123, el A4 a 96 dpi, y un `transform: scale`
 * la lleva al ancho que haya. La alternativa —recalcular cada tamaño en
 * función del contenedor— haría que el documento se viera distinto en cada
 * pantalla, y lo que vende esta página es justamente que el cliente vea el
 * documento REAL tomando forma.
 *
 * ── Móvil ────────────────────────────────────────────────────────────────
 *
 * En un teléfono no caben las dos columnas, y encoger la hoja hasta que
 * quepa al lado la vuelve ilegible. Van dos pestañas, Datos y Vista previa,
 * con la hoja a ancho completo. Es el mismo patrón que usa la herramienta
 * interna.
 */

const LLAVE = "lt-solicitud";

/** Hoy, en hora local, como AAAA-MM-DD: el mínimo del selector de fecha. */
function hoy() {
  const f = new Date();
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${f.getFullYear()}-${dos(f.getMonth() + 1)}-${dos(f.getDate())}`;
}

type Estado = "escribiendo" | "enviando" | "enviado" | "error";

export default function SolicitudCotizacion({
  m,
  idioma,
}: {
  m: Mensajes;
  idioma: Idioma;
}) {
  const t = m.solicitud;

  const [datos, setDatos] = useState<Solicitud>(SOLICITUD_VACIA);
  const [intentado, setIntentado] = useState(false);
  const [estado, setEstado] = useState<Estado>("escribiendo");
  const [vista, setVista] = useState<"datos" | "hoja">("datos");

  const set = <K extends keyof Solicitud>(campo: K, valor: Solicitud[K]) =>
    setDatos((d) => ({ ...d, [campo]: valor }));

  const setLinea = (i: number, campo: keyof Linea, valor: string) =>
    setDatos((d) => ({
      ...d,
      lineas: d.lineas.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)),
    }));

  /* ── Borrador en el navegador ─────────────────────────────────────────
     Una solicitud con detalle lleva rato escribirla. Si alguien cierra la
     pestaña por error, no se pierde. Nunca sale del equipo hasta enviar. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(LLAVE);
      if (!crudo) return;
      const guardado = JSON.parse(crudo) as Partial<Solicitud>;
      if (!guardado.razonSocial && !guardado.tipoCarga) return;
      setDatos({ ...SOLICITUD_VACIA, ...guardado });
    } catch {
      /* almacenamiento bloqueado o JSON corrupto: se sigue en blanco */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const montado = useRef(false);
  useEffect(() => {
    if (!montado.current) {
      montado.current = true;
      return;
    }
    try {
      const { web: _web, ...resto } = datos;
      void _web;
      localStorage.setItem(LLAVE, JSON.stringify(resto));
    } catch {
      /* sin almacenamiento no se rompe nada: solo no se puede retomar */
    }
  }, [datos]);

  /* ── La hoja, escalada al ancho que haya ─────────────────────────── */
  const marco = useRef<HTMLDivElement>(null);
  const [escalaAjuste, setEscalaAjuste] = useState(0.5);
  const hoja = useRef<HTMLDivElement>(null);
  const [altoHoja, setAltoHoja] = useState(HOJA_ALTO);
  const [zoom, setZoom] = useState<"ajustar" | "cerca">("ajustar");
  const primeraMedida = useRef(true);
  const acuse = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = marco.current;
    if (!el) return;
    const medir = () => {
      const ajuste = Math.min(1, el.clientWidth / HOJA_ANCHO);
      setEscalaAjuste(ajuste);

      /* En una pantalla donde la hoja tendría que achicarse a menos de la
         mitad, "ajustar" la deja bonita y sin leer: en un teléfono el
         cuerpo de 11px queda en menos de 5. Ahí se parte de cerca, y quien
         quiera ver la hoja completa toca "Ajustar".

         El umbral mira la LEGIBILIDAD, no el aparato: una ventana angosta
         en un escritorio tiene el mismo problema. */
      if (primeraMedida.current) {
        primeraMedida.current = false;
        if (ajuste < 0.6) setZoom("cerca");
      }
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);

    /* La hoja crece si el contenido lo pide: el marco sigue su alto real. */
    const interior = hoja.current;
    const midiendo = new ResizeObserver(() => {
      if (interior) setAltoHoja(Math.max(HOJA_ALTO, interior.scrollHeight));
    });
    if (interior) midiendo.observe(interior);
    return () => {
      observador.disconnect();
      midiendo.disconnect();
    };
  }, []);

  const escala = zoom === "ajustar" ? escalaAjuste : 1;

  /* ── Validación ──────────────────────────────────────────────────── */
  const revisar = useCallback((d: Solicitud) => {
    const fallos: Record<string, string> = {};
    for (const campo of Object.keys(OBLIGATORIOS)) {
      if (campo === "rut" && d.extranjero) continue;
      if (!String(d[campo as keyof Solicitud] ?? "").trim()) {
        fallos[campo] = t.errores.requerido;
      }
    }
    if (d.correo.trim() && !correoValido(d.correo)) fallos.correo = t.errores.correo;

    if (!d.extranjero && d.rut.trim()) {
      const digitos = d.rut.replace(/[^\dK]/gi, "").length;
      if (digitos < 8) fallos.rut = t.errores.rutFormato;
      else if (!rutValido(d.rut)) fallos.rut = t.errores.rut;
    }

    if (d.telefono.trim() && !telefonoValido(d.telefono)) {
      fallos.telefono = t.errores.telefono;
    }

    if (d.fechaEstimada && (!fechaValida(d.fechaEstimada) || d.fechaEstimada < hoy())) {
      fallos.fechaEstimada = t.errores.fechaPasada;
    }

    /* La primera línea es el corazón de la solicitud y no puede ir vacía.
       Las que se agregan después se revisan solo si se empezaron a llenar:
       una línea en blanco que nadie tocó no es un error. */
    d.lineas.forEach((l, i) => {
      const empezada = l.descripcion.trim() || l.cantidad.trim() || l.equipo;
      if (i > 0 && !empezada) return;
      if (!l.descripcion.trim()) fallos[`linea-${i}-descripcion`] = t.errores.requerido;
      if (!l.cantidad.trim()) fallos[`linea-${i}-cantidad`] = t.errores.requerido;
      else if (!cantidadValida(l.cantidad)) fallos[`linea-${i}-cantidad`] = t.errores.cantidad;
    });

    return fallos;
  }, [t.errores]);

  /* Los errores se CALCULAN, no se guardan: son una función pura de los
     datos, y tenerlos en estado obligaba a sincronizarlos desde un efecto.
     Solo se muestran una vez que alguien intentó enviar; marcar en rojo un
     campo que la persona todavía no ha tocado es regañarla por adelantado. */
  const errores = useMemo(
    () => (intentado ? revisar(datos) : {}),
    [datos, intentado, revisar],
  );

  async function enviar() {
    const fallos = revisar(datos);
    setIntentado(true);
    if (Object.keys(fallos).length > 0) {
      setVista("datos");
      /* Al primer dato que falta, no al comienzo del formulario: en un
         teléfono el formulario mide varias pantallas y "falta algo más
         arriba" obliga a buscar qué. */
      requestAnimationFrame(() => {
        const primero = document.querySelector<HTMLElement>(
          '#solicitud-form [aria-invalid="true"]',
        );
        primero?.scrollIntoView({ block: "center", behavior: "smooth" });
        primero?.focus({ preventScroll: true });
      });
      return;
    }

    setEstado("enviando");
    try {
      const r = await fetch("/api/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (!r.ok) throw new Error(String(r.status));
      setEstado("enviado");
      /* Subir al acuse. Sin esto la página se queda donde estaba —abajo,
         en el pie— y quien envió no ve ninguna señal de que funcionó. */
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        acuse.current?.focus();
      });
      try {
        localStorage.removeItem(LLAVE);
      } catch {
        /* nada que hacer */
      }
    } catch {
      setEstado("error");
    }
  }

  const enlaceWhatsapp = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
        m.asesor.whatsappMensaje,
      )}`
    : null;

  /* ── Enviado ─────────────────────────────────────────────────────── */
  if (estado === "enviado") {
    return (
      <div className="mx-auto w-full max-w-[46rem] px-[var(--borde-x)] py-[var(--seccion-y)] text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_18%,transparent)]"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-8">
            <path
              d="M4 12.5l5 5L20 7"
              stroke="var(--morado-texto)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2
          ref={acuse}
          tabIndex={-1}
          className="mt-6 text-[clamp(1.6rem,2vw+1.1rem,2.25rem)] font-semibold tracking-[-0.03em] text-[var(--texto)] outline-none"
        >
          {t.exito.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-[var(--texto-sec)]">
          {t.exito.detalle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => {
              setDatos(SOLICITUD_VACIA);
              setIntentado(false);
              setEstado("escribiendo");
            }}
            className="inline-flex min-h-[52px] items-center rounded-full bg-[var(--morado-solido)] px-7 text-[15px] font-medium text-white"
          >
            {t.exito.otra}
          </button>
          <Link
            href={`/${idioma}`}
            className="text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
          >
            {m.legal.volver}
          </Link>
        </div>
      </div>
    );
  }

  const campo = (
    id: keyof Solicitud,
    etiqueta: string,
    extra?: {
      opcional?: boolean;
      tipo?: "text" | "email" | "tel" | "date";
      ejemplo?: string;
      ayuda?: string;
      formatear?: (v: string) => string;
      autoComplete?: string;
      inputMode?: "text" | "numeric" | "tel" | "email";
      min?: string;
    },
  ) => (
    <CampoTexto
      id={`sol-${String(id)}`}
      etiqueta={etiqueta}
      valor={String(datos[id] ?? "")}
      alCambiar={(v) =>
        set(id, (extra?.formatear ? extra.formatear(v) : v) as Solicitud[typeof id])
      }
      error={errores[String(id)]}
      ayuda={extra?.ayuda}
      opcional={extra?.opcional ? t.campos.opcional : undefined}
      tipo={extra?.tipo}
      placeholder={extra?.ejemplo}
      autoComplete={extra?.autoComplete ?? "off"}
      inputMode={extra?.inputMode}
      min={extra?.min}
    />
  );

  const lista = (valores: readonly string[]) =>
    valores.map((v) => ({ valor: v, etiqueta: v }));

  return (
    <div className="mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] pb-[var(--seccion-y)] pt-[clamp(7.5rem,13vw,10rem)]">
      <header className="max-w-[52rem]">
        <h1 className="text-[clamp(2rem,2.6vw+1.2rem,3.25rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[var(--texto)]">
          <span className="block">{t.titulo}</span>
          <span className="text-[var(--morado-ui)]">{t.destacado}</span>
        </h1>
        <p className="mt-5 max-w-[56ch] text-[clamp(1rem,0.4vw+0.92rem,1.15rem)] leading-[1.6] text-[var(--texto-sec)]">
          {t.bajada}
        </p>
        <p className="mt-5 max-w-[60ch] border-l-2 border-[color-mix(in_oklab,var(--morado-ui)_55%,transparent)] pl-4 text-[14.5px] leading-[1.6] text-[var(--texto-sec)]">
          {t.avisoSinPrecios}
        </p>
      </header>

      {/* Pestañas: solo hasta lg, donde no caben las dos columnas. */}
      <div
        role="tablist"
        aria-label={t.titulo}
        className="mt-10 flex gap-2 rounded-full border border-[var(--borde)] bg-[var(--sup-1)] p-1.5 lg:hidden"
      >
        {(["datos", "hoja"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={vista === v}
            onClick={() => setVista(v)}
            className={[
              "min-h-[44px] flex-1 rounded-full text-[15px] font-medium transition-colors duration-[var(--dur-hover)]",
              vista === v
                ? "bg-[var(--morado-solido)] text-white"
                : "text-[var(--texto-sec)]",
            ].join(" ")}
          >
            {v === "datos" ? t.pestanaDatos : t.pestanaVista}
          </button>
        ))}
      </div>

      {/* `minmax(0,1fr)` también en una sola columna, y no solo en lg: sin
          eso la columna implícita es `auto` y crece hasta los 794px de la
          hoja. En un teléfono eso desbordaba la página 424px y dejaba la
          escala en 1, con el documento sin achicar. */}
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:gap-14">
        {/* ── Formulario ─────────────────────────────────────────────── */}
        <form
          id="solicitud-form"
          onSubmit={(e) => {
            e.preventDefault();
            enviar();
          }}
          noValidate
          className={[
            "flex flex-col gap-9",
            vista === "datos" ? "" : "hidden lg:flex",
          ].join(" ")}
        >
          {/* Trampa para robots: fuera de pantalla y fuera del foco. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 overflow-hidden">
            <label htmlFor="sol-web">{t.campos.trampaBots}</label>
            <input
              id="sol-web"
              name="web"
              tabIndex={-1}
              autoComplete="off"
              value={datos.web}
              onChange={(e) => set("web", e.target.value)}
            />
          </div>

          <p className="text-[14px] leading-[1.5] text-[var(--texto-sec)]">{t.leyenda}</p>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--morado-texto)]">
              {t.secciones.cliente}
            </legend>
            {campo("razonSocial", t.campos.razonSocial, { ejemplo: t.ejemplos.razonSocial })}
            {datos.extranjero
              ? campo("rut", t.campos.rutExtranjero, {
                  opcional: true,
                  ayuda: t.ayudas.rutExtranjero,
                })
              : campo("rut", t.campos.rut, {
                  ejemplo: t.ejemplos.rut,
                  ayuda: t.ayudas.rut,
                  formatear: formatearRut,
                  inputMode: "text",
                })}
            <label className="-mt-2 flex min-h-[44px] cursor-pointer items-center gap-3 text-[14.5px] text-[var(--texto)]">
              <input
                type="checkbox"
                checked={datos.extranjero}
                onChange={(e) => {
                  const marcado = e.target.checked;
                  setDatos((d) => ({
                    ...d,
                    extranjero: marcado,
                    /* Un RUT a medio escribir no sirve como identificación
                       extranjera: se limpia al pasar de uno a otro. */
                    rut: marcado && !rutValido(d.rut) ? "" : d.rut,
                  }));
                }}
                className="size-5 shrink-0 accent-[var(--morado-solido)]"
              />
              {t.campos.sinRut}
            </label>
            {campo("contacto", t.campos.contacto, {
              ejemplo: t.ejemplos.contacto,
              ayuda: t.ayudas.contacto,
            })}
            {campo("cargo", t.campos.cargo, { opcional: true, ejemplo: t.ejemplos.cargo })}
            {campo("correo", t.campos.correo, {
              tipo: "email",
              ayuda: t.ayudas.correo,
              autoComplete: "email",
              inputMode: "email",
            })}
            {campo("telefono", t.campos.telefono, {
              tipo: "tel",
              ayuda: t.ayudas.telefono,
              autoComplete: "tel",
              inputMode: "tel",
            })}
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--morado-texto)]">
              {t.secciones.servicio}
            </legend>
            <Selector
              id="sol-tipoCarga"
              etiqueta={t.campos.tipoCarga}
              valor={datos.tipoCarga}
              alCambiar={(v) => set("tipoCarga", v)}
              opciones={lista(TIPOS_CARGA)}
              vacio={t.campos.elija}
              ayuda={t.ayudas.tipoCarga}
              error={errores.tipoCarga}
            />
            <Selector
              id="sol-equipo"
              etiqueta={t.campos.equipo}
              valor={datos.equipo}
              alCambiar={(v) => set("equipo", v)}
              opciones={lista(EQUIPOS)}
              vacio={t.campos.elija}
              ayuda={t.ayudas.equipo}
              error={errores.equipo}
            />
            <Selector
              id="sol-modalidad"
              etiqueta={t.campos.modalidad}
              valor={datos.modalidad}
              alCambiar={(v) => set("modalidad", v)}
              opciones={lista(MODALIDADES)}
              vacio={t.campos.elija}
              ayuda={t.ayudas.modalidad}
              error={errores.modalidad}
            />
            {campo("fechaEstimada", t.campos.fechaEstimada, {
              tipo: "date",
              ayuda: t.ayudas.fechaEstimada,
              min: hoy(),
            })}
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--morado-texto)]">
              {t.secciones.ruta}
            </legend>
            {campo("origen", t.campos.origen, {
              ejemplo: t.ejemplos.origen,
              ayuda: t.ayudas.origen,
            })}
            {campo("destino", t.campos.destino, {
              ejemplo: t.ejemplos.destino,
              ayuda: t.ayudas.destino,
            })}
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--morado-texto)]">
              {t.secciones.detalle}
            </legend>
            {datos.lineas.map((l, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-[var(--r-card)] border border-[var(--borde)] bg-[color-mix(in_oklab,var(--sup-1)_58%,transparent)] p-4"
              >
                <CampoTexto
                  id={`sol-linea-${i}-descripcion`}
                  etiqueta={t.campos.descripcion}
                  valor={l.descripcion}
                  alCambiar={(v) => setLinea(i, "descripcion", v)}
                  error={errores[`linea-${i}-descripcion`]}
                  ayuda={t.ayudas.descripcion}
                  placeholder={t.ejemplos.descripcion}
                  autoComplete="off"
                />
                <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
                  <Selector
                    id={`sol-linea-${i}-equipo`}
                    etiqueta={t.campos.equipo}
                    valor={l.equipo}
                    alCambiar={(v) => setLinea(i, "equipo", v)}
                    opciones={lista(EQUIPOS)}
                    vacio={t.campos.elija}
                  />
                  <CampoTexto
                    id={`sol-linea-${i}-cantidad`}
                    etiqueta={t.campos.cantidad}
                    valor={l.cantidad}
                    alCambiar={(v) => setLinea(i, "cantidad", v)}
                    error={errores[`linea-${i}-cantidad`]}
                    ayuda={t.ayudas.cantidad}
                    placeholder={t.ejemplos.cantidad}
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>
                {datos.lineas.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDatos((d) => ({
                        ...d,
                        lineas: d.lineas.filter((_, j) => j !== i),
                      }))
                    }
                    className="self-start text-[14px] text-[var(--texto-sec)] underline underline-offset-4 hover:text-[var(--texto)]"
                  >
                    {t.acciones.quitar}
                  </button>
                )}
              </div>
            ))}
            {datos.lineas.length < MAX_LINEAS && (
              <button
                type="button"
                onClick={() =>
                  setDatos((d) => ({ ...d, lineas: [...d.lineas, { ...LINEA_VACIA }] }))
                }
                className="self-start text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
              >
                {t.acciones.agregar}
              </button>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-5">
            <legend className="mb-1 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--morado-texto)]">
              {t.secciones.observaciones}
            </legend>
            <div>
              <label
                htmlFor="sol-observaciones"
                className="block text-[14px] font-medium tracking-[-0.01em] text-[var(--texto)]"
              >
                {t.campos.observaciones}
                <span className="ml-1.5 font-normal text-[var(--texto-sec)]">
                  {t.campos.opcional}
                </span>
              </label>
              <textarea
                id="sol-observaciones"
                name="observaciones"
                rows={4}
                value={datos.observaciones}
                onChange={(e) => set("observaciones", e.target.value)}
                placeholder={t.ejemplos.observaciones}
                className="mt-2 w-full rounded-[14px] border border-[var(--borde)] bg-[var(--sup-1)] p-4 text-[16px] leading-[1.6] text-[var(--texto)] outline-none transition-[border-color,box-shadow] duration-[var(--dur-estado)] focus-visible:border-[var(--morado-solido)] focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_28%,transparent)]"
              />
            </div>
          </fieldset>

          {intentado && Object.keys(errores).length > 0 && (
            <p role="alert" className="text-[14.5px] text-[var(--morado-texto)]">
              {t.errores.faltan}
            </p>
          )}

          {estado === "error" && (
            <div
              role="alert"
              className="rounded-[var(--r-card)] border border-[color-mix(in_oklab,var(--morado-ui)_45%,var(--borde))] bg-[color-mix(in_oklab,var(--sup-1)_70%,transparent)] p-4"
            >
              <p className="text-[15px] font-medium text-[var(--texto)]">
                {t.errorEnvio.titulo}
              </p>
              <p className="mt-1.5 text-[14px] leading-[1.5] text-[var(--texto-sec)]">
                <Plantilla
                  texto={t.errorEnvio.detalle}
                  piezas={{
                    whatsapp: enlaceWhatsapp ? (
                      <a
                        href={enlaceWhatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
                      >
                        {t.errorEnvio.enlaceWhatsapp}
                      </a>
                    ) : (
                      t.errorEnvio.enlaceWhatsapp
                    ),
                    correo: (
                      <a
                        href={`mailto:${CORREO}`}
                        className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
                      >
                        {CORREO}
                      </a>
                    ),
                  }}
                />
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <p className="max-w-[56ch] text-[13.5px] leading-[1.6] text-[var(--texto-sec)]">
              {m.legal.consentimiento}{" "}
              <Link
                href={`/${idioma}/legal/privacidad`}
                className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
              >
                {m.legal.consentimientoEnlace}
              </Link>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--morado-solido)] px-7 text-[15px] font-medium text-white transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 disabled:opacity-70 motion-reduce:hover:translate-y-0"
              >
                {estado === "enviando"
                  ? t.acciones.enviando
                  : estado === "error"
                    ? t.errorEnvio.reintentar
                    : t.acciones.enviar}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDatos(SOLICITUD_VACIA);
                  setIntentado(false);
                }}
                className="text-[14.5px] text-[var(--texto-sec)] underline underline-offset-4 hover:text-[var(--texto)]"
              >
                {t.acciones.limpiar}
              </button>
            </div>
          </div>
        </form>

        {/* ── La hoja ────────────────────────────────────────────────── */}
        <div
          style={{ maxWidth: HOJA_ANCHO }}
          className={[
            "mx-auto w-full lg:sticky lg:top-[7rem] lg:self-start",
            vista === "hoja" ? "" : "hidden lg:block",
          ].join(" ")}
        >
          {/* El zoom no es un adorno: una hoja A4 a ancho de teléfono deja
              el texto en cinco píxeles. Dos estados, no un gesto de pellizco:
              dos botones se descubren solos y funcionan con teclado. */}
          <div
            className={["mb-3 items-center justify-end gap-1.5", escalaAjuste >= 1 ? "hidden" : "flex"].join(" ")}
          >
            {(["ajustar", "cerca"] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoom(z)}
                aria-pressed={zoom === z}
                className={[
                  "min-h-[36px] rounded-full px-4 text-[13.5px] font-medium transition-colors duration-[var(--dur-hover)]",
                  zoom === z
                    ? "bg-[var(--morado-solido)] text-white"
                    : "border border-[var(--borde)] text-[var(--texto-sec)]",
                ].join(" ")}
              >
                {z === "ajustar" ? t.zoom.ajustar : t.zoom.cerca}
              </button>
            ))}
          </div>

          {/* De cerca la hoja es más ancha que la pantalla. Que se pueda
              deslizar no se ve: se dice. */}
          {zoom === "cerca" && escalaAjuste < 1 && (
            <p className="mb-2 text-right text-[12.5px] text-[var(--texto-ter)]">
              {t.zoom.deslice}
            </p>
          )}

          <div
            ref={marco}
            className="w-full max-w-full rounded-[var(--r-img)] shadow-[0_16px_50px_-24px_rgb(0_0_0/0.55)]"
            style={{
              /* Ajustada, la hoja cabe entera y no hay nada que desplazar.
                 De cerca mide 794px de ancho: el marco se desplaza DE LADO y
                 nada más. El desplazamiento vertical sigue siendo el de la
                 página, que es como se lee en un teléfono; un visor con
                 desplazamiento propio deja el dedo atrapado en la hoja. */
              height: altoHoja * escala,
              overflowX: zoom === "ajustar" ? "hidden" : "auto",
              overflowY: "hidden",
              overscrollBehavior: "contain",
            }}
          >
            <div
              ref={hoja}
              aria-live="polite"
              style={{
                width: HOJA_ANCHO,
                minHeight: HOJA_ALTO,
                transform: `scale(${escala})`,
                transformOrigin: "top left",
              }}
            >
              <Hoja datos={datos} m={m} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
