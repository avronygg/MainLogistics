"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Titulo from "./Titulo";
import { IconoCarga, IconoReloj, IconoEscudo } from "./Iconos";
import Riel from "./cotizar/Riel";
import CuerpoPaso from "./cotizar/Pasos";
import ResumenPedido from "./cotizar/Resumen";
import {
  COTIZACION_VACIA,
  PASOS,
  validarPaso,
  pasoCompleto,
  primerPasoIncompleto,
  type Cotizacion,
  type Errores,
} from "./datos/formulario";
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
} from "./datos/cotizacion";

/**
 * Última sección: cotización, por pasos.
 *
 * Fondo claro por decisión del doc de marca §8: "la sección de formulario se
 * invierte a claro. Campos oscuros con placeholder gris son incómodos, y es
 * la conversión".
 *
 * Es una HOJA DE PEDIDO por pasos, no un wizard de onboarding: sin
 * celebraciones, sin checkmarks que rebotan, sin "¡buen trabajo!". A un jefe
 * de logística no se lo felicita por completar un formulario. La emoción
 * objetivo sigue siendo alivio anticipado.
 *
 * Decisiones que parecen detalles y no lo son:
 *
 * - **El botón "Siguiente" NUNCA se deshabilita.** A pleno sol, en un
 *   teléfono, un botón deshabilitado es un botón que se toca y no pasa nada,
 *   sin explicación. Para lector de pantalla es peor: no hay forma de
 *   descubrir qué falta. El botón siempre responde; lo que hace al responder
 *   es decir qué falta y llevar el foco ahí.
 * - **Se valida al avanzar**, no al tipear. Una vez que un campo está en
 *   error, se revalida en cada tecla para que el error desaparezca apenas se
 *   corrige. Premiar temprano, castigar tarde.
 * - **Los pasos se montan y desmontan**, no se ocultan con CSS. Con campos
 *   ocultos y `required` nativo el navegador lanza "An invalid form control
 *   is not focusable" y el envío falla en silencio. Por eso además va
 *   `noValidate` y la validación en JS es la fuente de verdad.
 * - **Enter avanza, jamás envía.** Cada paso es su propio formulario y solo
 *   el resumen hace el POST.
 * - **Contacto al final.** Pedir los datos primero se lee como recolección
 *   de datos, no como cotización, y activa justo la desconfianza que el
 *   sitio entero trata de desactivar.
 * - **El guardado es local**, en su teléfono, y se le avisa. Nada de guardar
 *   parciales en el servidor: es quedarse con datos que la persona todavía
 *   no aceptó entregar.
 *
 * El envío va a `app/api/cotizar/route.ts`, que despacha por Resend. Si esa
 * ruta no está configurada o falla, el formulario NO dice que se envió:
 * muestra el error y ofrece WhatsApp con la solicitud ya escrita. Una
 * consulta perdida en silencio es lo peor que puede hacer esta sección.
 *
 * ⚠️ "Le respondemos en 24 horas" es un COMPROMISO, y el doc de marca §11 lo
 * lista como pendiente de definir. Está acá porque el cliente lo definió; si
 * operación no lo puede sostener, hay que bajarlo antes de publicar.
 *
 * 👉 ANTES DE PUBLICAR: completar `.env.local` con RESEND_API_KEY,
 * COTIZA_DESTINO, COTIZA_REMITENTE y NEXT_PUBLIC_WHATSAPP.
 */

/** Formato internacional sin signos: 56 9 XXXX XXXX → "569XXXXXXXX". */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "";

const LLAVE = "main-logistics:cotizacion";

const GARANTIAS = [
  { Icono: IconoReloj, texto: "Le respondemos en menos de 24 horas hábiles" },
  { Icono: IconoEscudo, texto: "Sin compromiso ni registro previo" },
  { Icono: IconoCarga, texto: "Si su ruta no nos calza, se lo decimos" },
];

type Estado = "quieto" | "enviando" | "listo" | "error";

/** El resumen no es un paso más: es la pantalla de revisión. */
const RESUMEN = PASOS.length;

function textoWhatsapp(d: Cotizacion) {
  const origen = [d.origenComuna, d.origenRegion].filter(Boolean).join(", ");
  const destino = [d.destinoComuna, d.destinoRegion].filter(Boolean).join(", ");
  return [
    "Solicitud de cotización — Main Logistics",
    "",
    `Tipo de carga: ${etiquetaDe(TIPOS_CARGA, d.tipoCarga)}${
      d.tipoCargaOtra ? ` (${d.tipoCargaOtra})` : ""
    }`,
    `Equipo: ${etiquetaDe(EQUIPOS, d.equipo)}`,
    `Origen: ${origen}${d.origenDireccion ? ` — ${d.origenDireccion}` : ""}`,
    `Destino: ${destino}${d.destinoDireccion ? ` — ${d.destinoDireccion}` : ""}`,
    `Cuándo: ${etiquetaDe(FECHAS, d.fecha)}${d.fechaDia ? ` — ${d.fechaDia}` : ""}`,
    `Modalidad: ${etiquetaDe(MODALIDADES, d.modalidad)}${
      d.frecuencia ? ` · ${etiquetaDe(FRECUENCIAS, d.frecuencia)}` : ""
    }${d.duracion ? ` · ${etiquetaDe(DURACIONES, d.duracion)}` : ""}`,
    `Requisitos: ${etiquetasDe(REQUISITOS, d.requisitos) || "ninguno"}${
      d.requisitoOtro ? ` (${d.requisitoOtro})` : ""
    }`,
    `Valor declarado: ${etiquetaDe(VALORES, d.valor)}`,
    "",
    `Empresa: ${d.empresa}`,
    `Contacto: ${d.nombre}`,
    `Correo: ${d.correo}`,
    `Teléfono: ${d.telefono}`,
    `Prefiere: ${etiquetaDe(CANALES, d.canal)}`,
  ].join("\n");
}

export default function Cotizar() {
  const [datos, setDatos] = useState<Cotizacion>(COTIZACION_VACIA);
  const [paso, setPaso] = useState(0);
  const [errores, setErrores] = useState<Errores>({});
  const [intentado, setIntentado] = useState<number[]>([]);
  const [estado, setEstado] = useState<Estado>("quieto");
  const [aviso, setAviso] = useState("");
  const [retomado, setRetomado] = useState(false);
  /** Al editar desde el resumen se vuelve AL RESUMEN, no al paso siguiente. */
  const [volverAlResumen, setVolverAlResumen] = useState(false);

  const encabezado = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const montado = useRef(false);
  /** Solo se enfoca cuando la navegación fue pedida, nunca al montar. */
  const debeEnfocar = useRef(false);

  /* ── Guardado local ──────────────────────────────────────────────── */

  // La lectura del guardado va en un efecto A PROPÓSITO, y no como estado
  // inicial perezoso: `localStorage` no existe en el servidor, así que el
  // HTML servido sale siempre en blanco. Sembrar el estado inicial con lo
  // guardado produciría un desajuste de hidratación — el servidor pinta
  // campos vacíos y el cliente campos llenos. Leerlo después de montar es
  // la forma correcta de resolver un valor que solo existe en el cliente.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(LLAVE);
      if (!crudo) return;
      const guardado = JSON.parse(crudo) as Partial<Cotizacion>;
      // Solo se retoma si hay algo real escrito, no por un roce.
      if (!guardado.tipoCarga && !guardado.empresa) return;
      setDatos({ ...COTIZACION_VACIA, ...guardado });
      setRetomado(true);
    } catch {
      /* Almacenamiento bloqueado o JSON corrupto: se sigue en blanco. */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

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
      /* Sin almacenamiento no se rompe nada: solo no se puede retomar. */
    }
  }, [datos]);

  function descartarGuardado() {
    setDatos(COTIZACION_VACIA);
    setErrores({});
    setIntentado([]);
    setPaso(0);
    setRetomado(false);
    try {
      localStorage.removeItem(LLAVE);
    } catch {
      /* nada que hacer */
    }
  }

  /* ── Navegación ──────────────────────────────────────────────────── */

  const irA = useCallback((destino: number, empujar = true) => {
    debeEnfocar.current = true;
    setPaso(destino);
    setErrores({});
    setAviso("");
    if (empujar && typeof window !== "undefined") {
      window.history.pushState({ cotizar: destino }, "");
    }
  }, []);

  // El gesto de volver atrás en Android destruiría el formulario completo,
  // que es el abandono más caro de todos. No se crean rutas por paso: es una
  // one-page que se abre desde un enlace de WhatsApp.
  useEffect(() => {
    function alVolver(e: PopStateEvent) {
      const p = (e.state as { cotizar?: number } | null)?.cotizar;
      if (typeof p === "number") {
        debeEnfocar.current = true;
        setPaso(p);
      }
    }
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  // Foco al encabezado del paso, NO al primer campo: enfocar un input abre
  // el teclado de inmediato y tapa el título, y la persona ve un campo sin
  // saber qué le están preguntando.
  //
  // Se enfoca solo cuando la navegación fue PEDIDA, con una bandera que pone
  // `irA`. Detectar "el primer render" con un ref no sirve: en desarrollo
  // React ejecuta los efectos dos veces, la primera pasada consumía la
  // bandera y la segunda enfocaba igual — la página abría en el formulario,
  // scrolleada 11.848px, con el foco robado. Nadie que abre el sitio pidió
  // ir a cotizar.
  useEffect(() => {
    if (!debeEnfocar.current) return;
    debeEnfocar.current = false;
    encabezado.current?.focus();
    panel.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [paso]);

  function set<K extends keyof Cotizacion>(campo: K, valor: Cotizacion[K]) {
    setDatos((prev) => {
      const siguiente = { ...prev, [campo]: valor };
      // Revalidación en vivo solo si el paso ya se intentó avanzar: así el
      // error desaparece apenas se corrige, sin castigar a quien va por la
      // mitad de escribir.
      if (intentado.includes(paso)) setErrores(validarPaso(paso, siguiente));
      return siguiente;
    });
  }

  function siguiente(e: React.FormEvent) {
    e.preventDefault();
    const fallos = validarPaso(paso, datos);
    setIntentado((prev) => (prev.includes(paso) ? prev : [...prev, paso]));

    if (Object.keys(fallos).length) {
      setErrores(fallos);
      const faltan = Object.values(fallos).length;
      setAviso(
        `Falta${faltan > 1 ? "n" : ""} ${faltan} dato${faltan > 1 ? "s" : ""} para continuar.`,
      );
      // El foco va al primer campo inválido — única excepción a enfocar el
      // encabezado.
      const primero = Object.keys(fallos)[0];
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(
          `#${primero}, [name="${primero}"]`,
        );
        el?.focus();
      });
      return;
    }

    if (volverAlResumen) {
      setVolverAlResumen(false);
      irA(RESUMEN);
      return;
    }
    irA(paso < PASOS.length - 1 ? paso + 1 : RESUMEN);
  }

  function editarDesdeResumen(i: number) {
    setVolverAlResumen(true);
    irA(i);
  }

  /* ── Envío ───────────────────────────────────────────────────────── */

  async function enviar() {
    const incompleto = primerPasoIncompleto(datos);
    if (incompleto !== -1) {
      setIntentado((prev) =>
        prev.includes(incompleto) ? prev : [...prev, incompleto],
      );
      setAviso("Falta completar un paso antes de enviar.");
      irA(incompleto);
      return;
    }

    setEstado("enviando");
    setAviso("Enviando su solicitud.");
    try {
      const r = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      // Nunca hay éxito optimista: el único camino a "listo" es r.ok.
      setEstado(r.ok ? "listo" : "error");
      setAviso(r.ok ? "Solicitud recibida." : "No pudimos enviar su solicitud.");
      if (r.ok) {
        try {
          localStorage.removeItem(LLAVE);
        } catch {
          /* nada que hacer */
        }
      }
    } catch {
      setEstado("error");
      setAviso("No pudimos enviar su solicitud.");
    }
  }

  const enlaceWhatsapp = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoWhatsapp(datos))}`
    : null;

  const completados = PASOS.map((_, i) => i).filter((i) => pasoCompleto(i, datos));
  const enResumen = paso === RESUMEN;

  return (
    <section
      id="cotizar"
      className="tema-claro relative isolate scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden"
    >
      {/* Una sola luz de escena por sección: le da al vidrio algo que
          desenfocar. Sin esto, el panel sería un gris caro. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[36rem] w-[min(90vw,54rem)] -translate-y-1/4 translate-x-1/4 rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 26%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[var(--seccion-y)]">
        <div className="max-w-[46rem]">
          <Titulo linea1="Cotice su carga." destacado="Le respondemos en 24 horas" />

          <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
            Cuéntenos qué mueve y le devolvemos una evaluación de factibilidad
            de la ruta, no un precio suelto.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-[clamp(2rem,4vw,3.5rem)] lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-[clamp(7rem,13vw,9rem)] lg:self-start">
            <ul className="flex flex-col gap-3.5 border-t border-[var(--borde)] pt-6 lg:border-t-0 lg:pt-0">
              {GARANTIAS.map(({ Icono, texto }) => (
                <li key={texto} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[color-mix(in_oklab,var(--morado-solido)_14%,transparent)] text-[var(--morado-texto)]"
                  >
                    <Icono className="size-4" />
                  </span>
                  <span className="pt-1.5 text-[14.5px] leading-[1.45] text-[var(--texto-sec)]">
                    {texto}
                  </span>
                </li>
              ))}
            </ul>

            {/* El costo percibido se baja ANTES de que vea el contador, no
                con el contador. */}
            {estado !== "listo" && (
              <p className="mt-5 text-[13.5px] leading-[1.5] text-[var(--texto-sec)]">
                Seis pasos cortos.{" "}
                <span className="font-medium text-[var(--texto)]">
                  Sus datos van al final.
                </span>
              </p>
            )}
          </div>

          {/* `overflow-clip` y no `overflow-hidden`: hidden crea un contenedor
              de scroll y la barra sticky del pie se pegaría a él, que no
              scrollea. clip recorta igual y no rompe el sticky. */}
          <div
            ref={panel}
            className="vidrio relative overflow-clip rounded-[var(--r-img)] p-6 scroll-mt-[clamp(6rem,12vw,8.5rem)] sm:p-8"
          >
            {/* Una sola región viva, para validación y estado de envío.
                Nunca "assertive": interrumpiría la lectura del campo que la
                persona está corrigiendo. */}
            <p aria-live="polite" className="sr-only">
              {aviso}
            </p>

            {estado === "listo" ? (
              <div
                role="status"
                className="flex min-h-[26rem] flex-col items-start justify-center"
              >
                <span
                  aria-hidden="true"
                  className="grid size-14 place-items-center rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_14%,transparent)]"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="size-7">
                    <path
                      d="m4.5 10.5 3.5 3.5 7.5-8"
                      stroke="var(--morado-texto)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <h3 className="mt-5 text-[clamp(1.3rem,1.2vw+1rem,1.6rem)] font-semibold tracking-[-0.03em] text-[var(--texto)]">
                  Recibimos su solicitud.
                </h3>
                <p className="mt-3 max-w-[40ch] text-[15px] leading-[1.6] text-[var(--texto-sec)]">
                  Le respondemos en menos de 24 horas hábiles con una
                  evaluación de factibilidad de la ruta. Si necesita moverlo
                  antes, escríbanos por WhatsApp.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setDatos(COTIZACION_VACIA);
                    setIntentado([]);
                    setEstado("quieto");
                    setPaso(0);
                  }}
                  className="mt-6 min-h-[44px] text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <>
                {retomado && (
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[color-mix(in_oklab,var(--borde)_70%,transparent)] bg-[color-mix(in_oklab,var(--sup-1)_55%,transparent)] px-4 py-3">
                    <p className="text-[14px] leading-[1.4] text-[var(--texto)]">
                      Retomamos donde quedó.
                    </p>
                    <button
                      type="button"
                      onClick={descartarGuardado}
                      className="min-h-[44px] text-[14px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
                    >
                      Empezar de nuevo
                    </button>
                  </div>
                )}

                <Riel
                  actual={Math.min(paso, PASOS.length - 1)}
                  completados={completados}
                  irA={(i) => {
                    setVolverAlResumen(false);
                    irA(i);
                  }}
                  enResumen={enResumen}
                />

                {enResumen ? (
                  <div className="mt-7">
                    <h2
                      ref={encabezado}
                      tabIndex={-1}
                      className="text-[clamp(1.2rem,1vw+0.95rem,1.45rem)] font-semibold tracking-[-0.03em] text-[var(--texto)] focus:outline-none focus-visible:outline-none"
                    >
                      Revise antes de enviar
                    </h2>
                    <p className="mt-2 text-[14.5px] leading-[1.55] text-[var(--texto-sec)]">
                      Si algo no está bien, edítelo y vuelve acá mismo.
                    </p>

                    <div className="mt-6">
                      <ResumenPedido d={datos} editar={editarDesdeResumen} />
                    </div>

                    {estado === "error" && (
                      <div
                        role="alert"
                        className="mt-6 rounded-[12px] border border-[color-mix(in_oklab,var(--error)_40%,var(--borde))] bg-[color-mix(in_oklab,var(--error)_8%,transparent)] p-4"
                      >
                        <p className="text-[14.5px] font-medium text-[var(--texto)]">
                          No pudimos enviar su solicitud.
                        </p>
                        <p className="mt-1.5 text-[14px] leading-[1.5] text-[var(--texto-sec)]">
                          {enlaceWhatsapp ? (
                            <>
                              Nada se perdió:{" "}
                              <a
                                href={enlaceWhatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
                              >
                                envíela por WhatsApp
                              </a>{" "}
                              con los datos ya escritos, o escriba a{" "}
                              <a
                                href="mailto:contacto@mainlogistics.cl"
                                className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
                              >
                                contacto@mainlogistics.cl
                              </a>
                              .
                            </>
                          ) : (
                            <>
                              Escríbanos a{" "}
                              <a
                                href="mailto:contacto@mainlogistics.cl"
                                className="font-medium text-[var(--morado-texto)] underline underline-offset-4"
                              >
                                contacto@mainlogistics.cl
                              </a>{" "}
                              y le respondemos igual.
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    <BarraPaso
                      atras={() => irA(PASOS.length - 1)}
                      etiquetaAtras="Volver"
                      principal={enviar}
                      etiquetaPrincipal={
                        estado === "enviando" ? "Enviando…" : "Enviar solicitud"
                      }
                      ocupado={estado === "enviando"}
                    />
                  </div>
                ) : (
                  // Cada paso es su propio formulario: Enter avanza, y el
                  // POST vive únicamente en el resumen.
                  <form onSubmit={siguiente} noValidate className="mt-7">
                    {/* Trampa para robots: fuera de pantalla y fuera del foco. */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-0 h-0 overflow-hidden"
                    >
                      <label htmlFor="web">No completar</label>
                      <input
                        id="web"
                        name="web"
                        tabIndex={-1}
                        autoComplete="off"
                        value={datos.web}
                        onChange={(ev) => set("web", ev.target.value)}
                      />
                    </div>

                    <section aria-labelledby="paso-titulo">
                      <h2
                        id="paso-titulo"
                        ref={encabezado}
                        tabIndex={-1}
                        className="text-[clamp(1.2rem,1vw+0.95rem,1.45rem)] font-semibold tracking-[-0.03em] text-[var(--texto)] focus:outline-none focus-visible:outline-none"
                      >
                        <span className="sr-only">
                          Paso {paso + 1} de {PASOS.length}.{" "}
                        </span>
                        {PASOS[paso].bajada}
                      </h2>

                      <div className="mt-6">
                        <CuerpoPaso indice={paso} d={datos} set={set} e={errores} />
                      </div>
                    </section>

                    <BarraPaso
                      atras={paso > 0 ? () => irA(paso - 1) : undefined}
                      etiquetaAtras="Atrás"
                      etiquetaPrincipal={
                        volverAlResumen
                          ? "Guardar y volver al resumen"
                          : paso === PASOS.length - 1
                            ? "Revisar solicitud"
                            : "Siguiente"
                      }
                    />
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Barra de paso, pegada al fondo del panel.
 *
 * `sticky` y no `fixed`: convive mucho mejor con el teclado abierto en
 * Android e iOS. El botón principal no se deshabilita nunca salvo mientras
 * se está enviando, que es el único caso donde tocar dos veces haría daño.
 */
function BarraPaso({
  atras,
  etiquetaAtras,
  principal,
  etiquetaPrincipal,
  ocupado,
}: {
  atras?: () => void;
  etiquetaAtras: string;
  principal?: () => void;
  etiquetaPrincipal: string;
  ocupado?: boolean;
}) {
  return (
    <div className="sticky bottom-0 -mx-6 mt-8 flex items-center gap-3 border-t border-[color-mix(in_oklab,var(--borde)_60%,transparent)] bg-[color-mix(in_oklab,var(--sup-1)_82%,transparent)] px-6 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
      {atras && (
        <button
          type="button"
          onClick={atras}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-[15px] font-medium text-[var(--texto)] transition-colors duration-[var(--dur-hover)] hover:bg-[color-mix(in_oklab,var(--sup-2)_70%,transparent)] focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)]"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
            <path
              d="M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {etiquetaAtras}
        </button>
      )}

      <button
        type={principal ? "button" : "submit"}
        onClick={principal}
        disabled={ocupado}
        className="group ml-auto inline-flex min-h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full bg-[var(--morado-solido)] px-6 text-[15px] font-medium text-white transition-[transform,opacity] duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:-translate-y-0.5 focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)] disabled:translate-y-0 disabled:opacity-70 motion-reduce:hover:translate-y-0 sm:flex-none"
      >
        {etiquetaPrincipal}
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
    </div>
  );
}
