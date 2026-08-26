"use client";

import { Fragment, type ReactNode } from "react";

/**
 * Piezas de campo del formulario de cotización.
 *
 * Tres correcciones respecto del formulario anterior, las tres por el
 * contexto de uso que fija PRODUCT.md — un teléfono, en terreno, a pleno sol:
 *
 * 1. Los inputs van en 16px. Bajo 16px, iOS Safari hace zoom al enfocar
 *    cualquier campo, y en un formulario por pasos eso descoloca la pantalla
 *    en cada campo. Antes estaban en 15px.
 * 2. Las etiquetas van en 14px peso 500. Antes 12.5px, que a pleno sol y con
 *    guantes no se lee.
 * 3. El texto del error va en `--texto`, no en `--error`. `--error` (#F04438)
 *    da 3,76:1 sobre blanco: reprueba AA como texto bajo 24px. El rojo se
 *    usa en el borde y el ícono, donde la norma pide 3:1, no 4,5:1.
 *
 * El estado nunca se comunica solo por color: borde + ícono + mensaje.
 */

/* ── Plantillas de texto ─────────────────────────────────────────────── */

/**
 * Rellena una plantilla del diccionario: `"Paso {n} de {total}"`.
 *
 * Va con plantilla y no con trozos concatenados porque el orden de las
 * palabras cambia de un idioma a otro. Partir la frase en pedazos obligaría
 * a los cuatro idiomas a armarla en el orden del español, que es justo lo
 * que no se puede pedir.
 *
 * Una llave que no tenga valor se deja como está: se ve el hueco y se
 * arregla, en vez de desaparecer sin dejar rastro.
 */
export function rellenar(
  plantilla: string,
  valores: Record<string, string | number>,
): string {
  return plantilla.replace(/\{(\w+)\}/g, (todo, clave: string) =>
    clave in valores ? String(valores[clave]) : todo,
  );
}

/**
 * Igual que `rellenar`, pero las piezas son nodos: un enlace dentro de una
 * frase. Sin esto, la frase de error se partiría en tres cadenas y ningún
 * idioma podría mover el enlace de lugar.
 */
export function Plantilla({
  texto,
  piezas,
}: {
  texto: string;
  piezas: Record<string, ReactNode>;
}) {
  return (
    <>
      {texto.split(/(\{\w+\})/g).map((parte, i) => {
        const clave = /^\{\w+\}$/.test(parte) ? parte.slice(1, -1) : null;
        return (
          <Fragment key={i}>
            {clave && clave in piezas ? piezas[clave] : parte}
          </Fragment>
        );
      })}
    </>
  );
}

/* Foco de 3px. El anillo anterior era del morado al 14%, que sobre el fondo
   claro prácticamente no se ve — y el foco es la única señal de dónde está
   parado quien navega con teclado. */
const FOCO =
  "focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)]";

const BASE_CONTROL = [
  "w-full rounded-[12px] border min-h-[48px] px-3.5",
  "text-[16px] text-[var(--texto)]",
  "bg-[color-mix(in_oklab,var(--sup-1)_58%,transparent)] backdrop-blur-sm",
  "placeholder:text-[color-mix(in_oklab,var(--texto-sec)_85%,transparent)]",
  "transition-[border-color,background-color,box-shadow] duration-[var(--dur-hover)]",
  "hover:border-[color-mix(in_oklab,var(--morado-ui)_40%,var(--borde))]",
  "focus:border-[var(--morado-ui)] focus:bg-[color-mix(in_oklab,var(--sup-1)_92%,transparent)]",
  FOCO,
  "disabled:opacity-60",
].join(" ");

function borde(error?: string) {
  return error
    ? "border-[var(--error)]"
    : "border-[color-mix(in_oklab,var(--borde)_80%,transparent)]";
}

export function IconoAviso({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="6.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 4.8v3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11" r="0.85" fill="currentColor" />
    </svg>
  );
}

/** Mensaje de error de un campo. Ícono en rojo, texto en color de lectura. */
export function Error({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="mt-2 flex items-start gap-1.5 text-[14px] leading-[1.45] text-[var(--texto)]"
    >
      <IconoAviso className="mt-[2px] size-4 shrink-0 text-[var(--error)]" />
      <span>{children}</span>
    </p>
  );
}

export function Etiqueta({
  htmlFor,
  children,
  ayuda,
  opcional,
}: {
  htmlFor?: string;
  children: ReactNode;
  ayuda?: string;
  /**
   * El texto de "(opcional)" ya traducido, o nada si el campo es obligatorio.
   * Es una cadena y no un booleano justamente para que el texto venga del
   * diccionario: un booleano obligaría a escribir la palabra acá adentro.
   */
  opcional?: string;
}) {
  return (
    <>
      <label
        htmlFor={htmlFor}
        className="block text-[14px] font-medium leading-[1.35] text-[var(--texto)]"
      >
        {children}
        {/* Se marca lo opcional, no lo obligatorio: casi todo el formulario
            es obligatorio y sembrar asteriscos es puro ruido. */}
        {opcional && (
          <span className="ml-1.5 font-normal text-[var(--texto-sec)]">
            {opcional}
          </span>
        )}
      </label>
      {ayuda && (
        <p className="mt-1 text-[13.5px] leading-[1.45] text-[var(--texto-sec)]">
          {ayuda}
        </p>
      )}
    </>
  );
}

export function CampoTexto({
  id,
  etiqueta,
  valor,
  alCambiar,
  error,
  ayuda,
  opcional,
  tipo = "text",
  ...resto
}: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  error?: string;
  ayuda?: string;
  opcional?: string;
  tipo?: "text" | "email" | "tel" | "date";
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange" | "type"
>) {
  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda} opcional={opcional}>
        {etiqueta}
      </Etiqueta>
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 ${BASE_CONTROL} ${borde(error)}`}
        {...resto}
      />
      {error && <Error id={`${id}-error`}>{error}</Error>}
    </div>
  );
}

export function Selector({
  id,
  etiqueta,
  valor,
  alCambiar,
  opciones,
  vacio,
  error,
  deshabilitado,
  ayuda,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  opciones: { valor: string; etiqueta: string }[];
  vacio: string;
  error?: string;
  deshabilitado?: boolean;
  ayuda?: string;
}) {
  return (
    <div>
      <Etiqueta htmlFor={id} ayuda={ayuda}>
        {etiqueta}
      </Etiqueta>
      {/* Select NATIVO a propósito. Un combobox flotante con 346 comunas, en
          terreno, con guantes y señal mala, es peor en todos los ejes: el
          picker del sistema ya funciona con lector de pantalla y sin JS. */}
      <select
        id={id}
        name={id}
        value={valor}
        disabled={deshabilitado}
        onChange={(e) => alCambiar(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22 fill=%22none%22%3E%3Cpath d=%22m4 6.5 4 4 4-4%22 stroke=%22%236b7280%22 stroke-width=%221.6%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10 ${BASE_CONTROL} ${borde(error)}`}
      >
        <option value="">{vacio}</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
      {error && <Error id={`${id}-error`}>{error}</Error>}
    </div>
  );
}

/**
 * Grupo de opción única, en tarjetas.
 *
 * Radios REALES ocultos visualmente, no divs con onClick: así las flechas
 * del teclado navegan solas y el lector de pantalla anuncia "1 de 6". Es la
 * diferencia entre un control y un dibujo de un control.
 *
 * Sin autoavance al seleccionar: con dedos gruesos y reflejo de sol, un
 * toque errado mandaría al paso siguiente sin forma obvia de deshacerlo.
 */
export function Tarjetas({
  nombre,
  leyenda,
  ayuda,
  valor,
  alCambiar,
  opciones,
  error,
  columnas = 2,
}: {
  nombre: string;
  leyenda: string;
  ayuda?: string;
  valor: string;
  alCambiar: (v: string) => void;
  opciones: { valor: string; etiqueta: string; detalle?: string }[];
  error?: string;
  columnas?: 2 | 3;
}) {
  return (
    <fieldset aria-describedby={error ? `${nombre}-error` : undefined}>
      <legend className="text-[14px] font-medium leading-[1.35] text-[var(--texto)]">
        {leyenda}
      </legend>
      {ayuda && (
        <p className="mt-1 text-[13.5px] leading-[1.45] text-[var(--texto-sec)]">
          {ayuda}
        </p>
      )}

      <div
        className={`mt-3 grid gap-2.5 ${
          columnas === 3
            ? "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 min-[400px]:grid-cols-2"
        }`}
      >
        {opciones.map((o) => {
          const activo = valor === o.valor;
          return (
            <label
              key={o.valor}
              className={[
                "group relative flex min-h-[56px] cursor-pointer flex-col justify-center rounded-[14px] border p-3.5",
                "transition-[border-color,background-color,box-shadow] duration-[var(--dur-hover)]",
                "has-[:focus-visible]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)]",
                activo
                  ? "border-[var(--morado-ui)] bg-[color-mix(in_oklab,var(--morado-solido)_10%,transparent)]"
                  : `${borde(error)} bg-[color-mix(in_oklab,var(--sup-1)_58%,transparent)] hover:border-[color-mix(in_oklab,var(--morado-ui)_40%,var(--borde))]`,
              ].join(" ")}
            >
              <input
                type="radio"
                name={nombre}
                value={o.valor}
                checked={activo}
                onChange={() => alCambiar(o.valor)}
                className="sr-only"
              />
              <span className="flex items-start gap-2.5">
                {/* El estado no depende solo del color: hay un disco que se
                    llena, visible también en escala de grises. */}
                <span
                  aria-hidden="true"
                  className={`mt-[1px] grid size-[18px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-[var(--dur-hover)] ${
                    activo
                      ? "border-[var(--morado-ui)]"
                      : "border-[color-mix(in_oklab,var(--texto-sec)_55%,transparent)]"
                  }`}
                >
                  {activo && (
                    <span className="size-[9px] rounded-full bg-[var(--morado-ui)]" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-medium leading-[1.3] text-[var(--texto)]">
                    {o.etiqueta}
                  </span>
                  {o.detalle && (
                    <span className="mt-0.5 block text-[13px] leading-[1.4] text-[var(--texto-sec)]">
                      {o.detalle}
                    </span>
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {error && <Error id={`${nombre}-error`}>{error}</Error>}
    </fieldset>
  );
}

/** Selección múltiple. Checkboxes reales, misma lógica que <Tarjetas />. */
export function Casillas({
  nombre,
  leyenda,
  ayuda,
  valores,
  alCambiar,
  opciones,
}: {
  nombre: string;
  leyenda: string;
  ayuda?: string;
  valores: string[];
  alCambiar: (v: string[]) => void;
  opciones: { valor: string; etiqueta: string }[];
}) {
  function alternar(v: string) {
    alCambiar(valores.includes(v) ? valores.filter((x) => x !== v) : [...valores, v]);
  }

  return (
    <fieldset>
      <legend className="text-[14px] font-medium leading-[1.35] text-[var(--texto)]">
        {leyenda}
      </legend>
      {ayuda && (
        <p className="mt-1 text-[13.5px] leading-[1.45] text-[var(--texto-sec)]">
          {ayuda}
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2">
        {opciones.map((o) => {
          const activo = valores.includes(o.valor);
          return (
            <label
              key={o.valor}
              className={[
                "flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-[14px] border p-3.5",
                "transition-[border-color,background-color,box-shadow] duration-[var(--dur-hover)]",
                "has-[:focus-visible]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_38%,transparent)]",
                activo
                  ? "border-[var(--morado-ui)] bg-[color-mix(in_oklab,var(--morado-solido)_10%,transparent)]"
                  : "border-[color-mix(in_oklab,var(--borde)_80%,transparent)] bg-[color-mix(in_oklab,var(--sup-1)_58%,transparent)] hover:border-[color-mix(in_oklab,var(--morado-ui)_40%,var(--borde))]",
              ].join(" ")}
            >
              <input
                type="checkbox"
                name={nombre}
                value={o.valor}
                checked={activo}
                onChange={() => alternar(o.valor)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border-2 transition-colors duration-[var(--dur-hover)] ${
                  activo
                    ? "border-[var(--morado-ui)] bg-[var(--morado-ui)]"
                    : "border-[color-mix(in_oklab,var(--texto-sec)_55%,transparent)]"
                }`}
              >
                {activo && (
                  <svg viewBox="0 0 12 12" fill="none" className="size-[11px]">
                    <path
                      d="m2.5 6.2 2.2 2.2 4.8-5"
                      stroke="#fff"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-[15px] font-medium leading-[1.3] text-[var(--texto)]">
                {o.etiqueta}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
