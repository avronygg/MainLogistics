import type { ReactNode } from "react";
import {
  ENCARGOS,
  MARCO_VISIBLE,
  ROTULO_ENCARGO,
  type ClaveEncargo,
} from "./datos/encargos-foto";

/**
 * Marco para una foto que todavía no existe.
 *
 * No es un rectángulo gris: es un espacio compuesto que se sostiene solo
 * mientras tanto, y que además deja escrito QUÉ foto va ahí. Así el brief no
 * vive en una conversación que se pierde, sino en el propio layout.
 *
 * El fondo reusa el motivo de carretera del isotipo, que es el único
 * ornamento del sistema.
 *
 * Cuando la foto exista, se reemplaza el <MarcoImagen> por un <Image> con
 * la misma clase de contenedor y no cambia nada más.
 */
export default function MarcoImagen({
  encargo,
  icono,
  className = "",
  posicion = "centro",
  comoFondo = false,
  children,
}: {
  /**
   * Qué foto va acá. Solo la clave: el texto del encargo vive en
   * `datos/encargos-foto.ts` y no pasa por el diccionario de idiomas, que se
   * serializa entero al navegador. Ver ese archivo.
   */
  encargo: ClaveEncargo;
  icono?: ReactNode;
  className?: string;
  /**
   * `centro`: el encargo manda, para tarjetas que solo son la reserva.
   * `esquina`: compacto arriba a la derecha, para tarjetas que además
   * llevan título y texto propio y donde el encargo no puede taparlos.
   */
  posicion?: "centro" | "esquina";
  /**
   * Cuando el marco es la capa de fondo de una tarjeta que ademas lleva
   * texto propio. Lo aplica el componente, no el llamador: si `absolute`
   * llegara por `className`, quedaria compitiendo con el `relative` de aca
   * y cual gana depende del orden de la hoja generada, no del string.
   */
  comoFondo?: boolean;
  /** Contenido que va encima del marco, si la tarjeta lo necesita. */
  children?: ReactNode;
}) {
  /* Segunda barrera, además de la que ponen los dos llamadores.
     Ellos deciden el LAYOUT —si la grilla reserva una columna o no— y eso
     no se puede resolver desde acá. Pero que el rectángulo no se dibuje en
     producción sí, y conviene que sea imposible: durante un tiempo se
     ocultó solo el texto del encargo y quedó la caja, que en pantalla se
     lee como una foto que no cargó. */
  if (!MARCO_VISIBLE) return null;

  const enEsquina = posicion === "esquina";

  return (
    <div
      className={[
        comoFondo ? "absolute inset-0" : "relative",
        "overflow-hidden bg-[var(--sup-1)]",
        className,
      ].join(" ")}
    >
      {/* Carretera en perspectiva, muy tenue: el mismo motivo del isotipo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 105%, color-mix(in oklab, var(--morado-solido) 34%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-1/2 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent calc(50% - 1px), var(--texto) calc(50% - 1px), var(--texto) calc(50% + 1px), transparent calc(50% + 1px))",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 40%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 40%, transparent)",
        }}
      />

      {/* El encargo, dentro de un recuadro punteado que se lee como reserva.
          Llegar hasta acá ya implica estar en desarrollo: la salida
          temprana de arriba se encarga del resto. */}
      <div
        className={
          enEsquina
            ? "relative z-[2] flex justify-end p-5"
            : "relative z-[2] flex h-full flex-col items-center justify-center p-6 text-center"
        }
      >
        <div
          className={[
            "flex flex-col gap-2 rounded-[var(--r-card)] border border-dashed",
            "border-[color-mix(in_oklab,var(--morado-ui)_45%,transparent)]",
            "bg-[color-mix(in_oklab,var(--fondo)_55%,transparent)] backdrop-blur-sm",
            enEsquina
              ? "max-w-[24ch] px-3.5 py-3"
              : "max-w-[32ch] items-center gap-3 px-5 py-4",
          ].join(" ")}
        >
          <span
            className={[
              "flex items-center gap-2 text-[var(--morado-texto)]",
              enEsquina ? "" : "flex-col",
            ].join(" ")}
          >
            {icono}
            <span className="dato text-[10px] uppercase tracking-[0.14em]">
              {ROTULO_ENCARGO}
            </span>
          </span>
          <span
            className={[
              "leading-[1.45] text-[var(--texto-sec)]",
              enEsquina ? "text-[11.5px]" : "text-[13px] leading-[1.5]",
            ].join(" ")}
          >
            {ENCARGOS[encargo]}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
