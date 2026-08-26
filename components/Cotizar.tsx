"use client";

import { useState } from "react";
import Titulo from "./Titulo";
import { IconoCarga, IconoReloj, IconoEscudo } from "./Iconos";

/**
 * Última sección: cotización.
 *
 * Fondo claro por decisión del doc de marca §8: "la sección de formulario se
 * invierte a claro. Campos oscuros con placeholder gris son incómodos, y es
 * la conversión".
 *
 * Los campos van en dos bloques con encabezado propio — la carga primero, el
 * contacto después. Diez campos en una sola lista se leen como un trámite;
 * partidos en dos, cada bloque se contesta de corrido y se ve cuánto falta.
 *
 * El envío va a `app/api/cotizar/route.ts`, que despacha por Resend. Si esa
 * ruta no está configurada o falla, el formulario NO dice que se envió:
 * muestra el error y ofrece WhatsApp con la solicitud ya escrita. Una
 * consulta perdida en silencio es lo peor que puede hacer esta sección.
 *
 * ⚠️ "Le respondemos en 24 horas" es un COMPROMISO, y el doc de marca §11 lo
 * lista como pendiente de definir. Está acá porque el cliente lo definió; si
 * operación no lo puede sostener, hay que bajarlo antes de publicar. Con este
 * comprador, un plazo incumplido pesa más que no ofrecer ninguno.
 *
 * 👉 ANTES DE PUBLICAR: completar `.env.local` con RESEND_API_KEY,
 * COTIZA_DESTINO, COTIZA_REMITENTE y NEXT_PUBLIC_WHATSAPP.
 */

/** Formato internacional sin signos: 56 9 XXXX XXXX → "569XXXXXXXX". */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "";

const TIPOS = [
  "Carga general",
  "Minera",
  "Peligrosa",
  "Refrigerada",
  "Forestal",
  "Contenedores",
  "Maquinaria",
  "Sobredimensionada",
];

const FRECUENCIAS = ["Despacho puntual", "Semanal", "Mensual", "Contrato anual"];

const PLAZOS = ["Esta semana", "Este mes", "Próximo mes", "Aún por definir"];

const CAMPOS_INICIALES = {
  origen: "",
  destino: "",
  tipo: "",
  volumen: "",
  frecuencia: "",
  plazo: "",
  nombre: "",
  empresa: "",
  correo: "",
  telefono: "",
  /** Trampa para robots: si viene con algo, no es una persona. */
  web: "",
};

type Campos = typeof CAMPOS_INICIALES;
type Estado = "quieto" | "enviando" | "listo" | "error";

const GARANTIAS = [
  { Icono: IconoReloj, texto: "Le respondemos en menos de 24 horas hábiles" },
  { Icono: IconoEscudo, texto: "Sin compromiso ni registro previo" },
  { Icono: IconoCarga, texto: "Si su ruta no nos calza, se lo decimos" },
];

const claseCampo = [
  "w-full rounded-[12px] border border-[color-mix(in_oklab,var(--borde)_80%,transparent)]",
  "bg-[color-mix(in_oklab,var(--sup-1)_58%,transparent)] backdrop-blur-sm",
  "min-h-[48px] px-3.5 text-[15px] text-[var(--texto)]",
  "placeholder:text-[color-mix(in_oklab,var(--texto-sec)_85%,transparent)]",
  "transition-[border-color,background-color,box-shadow] duration-[var(--dur-hover)]",
  "hover:border-[color-mix(in_oklab,var(--morado-ui)_40%,var(--borde))]",
  "focus:border-[var(--morado-ui)] focus:bg-[color-mix(in_oklab,var(--sup-1)_92%,transparent)]",
  "focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_14%,transparent)]",
  "focus:outline-none disabled:opacity-60",
].join(" ");

function Campo({
  id,
  etiqueta,
  children,
  ancho = "medio",
}: {
  id: string;
  etiqueta: string;
  children: React.ReactNode;
  ancho?: "medio" | "completo";
}) {
  return (
    <div className={ancho === "completo" ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12.5px] font-medium tracking-[-0.01em] text-[var(--texto)]"
      >
        {etiqueta}
      </label>
      {children}
    </div>
  );
}

/** Encabezado de bloque, con su número en mono. */
function Bloque({ n, titulo }: { n: number; titulo: string }) {
  return (
    <div className="flex items-center gap-2.5 sm:col-span-2">
      <span className="dato grid size-6 shrink-0 place-items-center rounded-full bg-[color-mix(in_oklab,var(--morado-solido)_16%,transparent)] text-[10.5px] font-semibold text-[var(--morado-texto)]">
        {n}
      </span>
      <span className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--texto)]">
        {titulo}
      </span>
      <span className="ml-1 h-px flex-1 bg-[color-mix(in_oklab,var(--borde)_70%,transparent)]" />
    </div>
  );
}

function textoWhatsapp(c: Campos) {
  return [
    "Solicitud de cotización — Main Logistics",
    "",
    `Origen: ${c.origen}`,
    `Destino: ${c.destino}`,
    `Tipo de carga: ${c.tipo}`,
    `Peso o volumen: ${c.volumen}`,
    `Frecuencia: ${c.frecuencia}`,
    `Cuándo: ${c.plazo}`,
    "",
    `Nombre: ${c.nombre}`,
    `Empresa: ${c.empresa}`,
    `Correo: ${c.correo}`,
    `Teléfono: ${c.telefono}`,
  ].join("\n");
}

export default function Cotizar() {
  const [campos, setCampos] = useState<Campos>(CAMPOS_INICIALES);
  const [estado, setEstado] = useState<Estado>("quieto");

  const cambiar =
    (k: keyof Campos) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCampos((c) => ({ ...c, [k]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("enviando");

    try {
      const r = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campos),
      });
      setEstado(r.ok ? "listo" : "error");
    } catch {
      setEstado("error");
    }
  };

  const enlaceWhatsapp = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(textoWhatsapp(campos))}`
    : null;

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
        {/* El encabezado va a ancho completo. Dentro de la columna de 23rem,
            "Le respondemos en 24 horas" se partía en tres líneas irregulares
            y el título se leía desordenado. */}
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
          </div>

          <div className="vidrio relative overflow-hidden rounded-[var(--r-img)] p-6 sm:p-8">
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
                    setCampos(CAMPOS_INICIALES);
                    setEstado("quieto");
                  }}
                  className="mt-6 min-h-[44px] text-[14.5px] font-medium text-[var(--morado-texto)] underline underline-offset-4"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={enviar}>
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
                    value={campos.web}
                    onChange={cambiar("web")}
                  />
                </div>

                <fieldset disabled={estado === "enviando"} className="contents">
                  <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                    <Bloque n={1} titulo="Su carga" />

                    <Campo id="origen" etiqueta="Origen">
                      <input
                        id="origen"
                        name="origen"
                        required
                        maxLength={120}
                        autoComplete="off"
                        placeholder="Comuna o planta"
                        value={campos.origen}
                        onChange={cambiar("origen")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="destino" etiqueta="Destino">
                      <input
                        id="destino"
                        name="destino"
                        required
                        maxLength={120}
                        autoComplete="off"
                        placeholder="Comuna o faena"
                        value={campos.destino}
                        onChange={cambiar("destino")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="tipo" etiqueta="Tipo de carga">
                      <select
                        id="tipo"
                        name="tipo"
                        required
                        value={campos.tipo}
                        onChange={cambiar("tipo")}
                        className={claseCampo}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {TIPOS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Campo>

                    <Campo id="volumen" etiqueta="Peso o volumen">
                      <input
                        id="volumen"
                        name="volumen"
                        required
                        maxLength={80}
                        autoComplete="off"
                        placeholder="Ej. 24 t · 2 pallets"
                        value={campos.volumen}
                        onChange={cambiar("volumen")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="frecuencia" etiqueta="Frecuencia">
                      <select
                        id="frecuencia"
                        name="frecuencia"
                        required
                        value={campos.frecuencia}
                        onChange={cambiar("frecuencia")}
                        className={claseCampo}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {FRECUENCIAS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </Campo>

                    <Campo id="plazo" etiqueta="Cuándo la necesita">
                      <select
                        id="plazo"
                        name="plazo"
                        required
                        value={campos.plazo}
                        onChange={cambiar("plazo")}
                        className={claseCampo}
                      >
                        <option value="" disabled>
                          Seleccione
                        </option>
                        {PLAZOS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </Campo>

                    <div className="mt-3 sm:col-span-2">
                      <Bloque n={2} titulo="Sus datos" />
                    </div>

                    <Campo id="nombre" etiqueta="Nombre">
                      <input
                        id="nombre"
                        name="nombre"
                        required
                        maxLength={80}
                        autoComplete="name"
                        placeholder="Quién consulta"
                        value={campos.nombre}
                        onChange={cambiar("nombre")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="empresa" etiqueta="Empresa">
                      <input
                        id="empresa"
                        name="empresa"
                        required
                        maxLength={100}
                        autoComplete="organization"
                        placeholder="Razón social o nombre de fantasía"
                        value={campos.empresa}
                        onChange={cambiar("empresa")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="correo" etiqueta="Correo">
                      <input
                        id="correo"
                        name="correo"
                        type="email"
                        required
                        maxLength={120}
                        autoComplete="email"
                        placeholder="nombre@empresa.cl"
                        value={campos.correo}
                        onChange={cambiar("correo")}
                        className={claseCampo}
                      />
                    </Campo>

                    <Campo id="telefono" etiqueta="Teléfono">
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        maxLength={40}
                        autoComplete="tel"
                        placeholder="+56 9 1234 5678"
                        value={campos.telefono}
                        onChange={cambiar("telefono")}
                        className={claseCampo}
                      />
                    </Campo>
                  </div>

                  <button
                    type="submit"
                    className={[
                      "group mt-7 inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full",
                      "bg-[var(--morado-solido)] py-2 pl-6 pr-2 text-[15px] font-medium tracking-[-0.01em] text-white",
                      "shadow-[0_8px_22px_-10px_rgb(0_0_0/0.55),inset_0_1px_0_rgb(255_255_255/0.24)]",
                      "transition-[background-color,box-shadow] duration-[var(--dur-estado)] ease-[var(--ease-quart)]",
                      "hover:bg-[color-mix(in_oklab,var(--morado-solido)_86%,white)]",
                      "hover:shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.32)]",
                      "disabled:cursor-progress disabled:opacity-80 sm:w-auto",
                    ].join(" ")}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      {estado !== "enviando" && (
                        <span
                          aria-hidden="true"
                          className="testigo-etiqueta size-[6px] rounded-full bg-white/70"
                        />
                      )}
                      {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[var(--morado-solido)] transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:scale-[1.08] motion-reduce:group-hover:scale-100">
                      <svg viewBox="0 0 16 16" fill="none" className="size-4">
                        <path
                          d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </fieldset>

                {estado === "error" && (
                  <div
                    role="alert"
                    className="mt-5 rounded-[12px] border border-[color-mix(in_oklab,var(--error)_40%,var(--borde))] bg-[color-mix(in_oklab,var(--error)_8%,transparent)] p-4"
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
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
