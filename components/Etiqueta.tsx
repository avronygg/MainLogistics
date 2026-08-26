import type { ReactNode } from "react";

/**
 * Etiqueta de esquina: dice qué es la tarjeta antes de que se lea el título.
 *
 * Es un rótulo, no un componente con peso propio. Antes usaba la clase
 * `.vidrio`, que le agregaba sombra proyectada de tarjeta y la hacía leerse
 * como un elemento grande flotando encima. Ahora el fondo es un tinte de la
 * propia superficie más un borde de un pixel: se ve, ubica, y no compite con
 * el título que tiene debajo.
 *
 * Con `testigo` incluye un punto que parpadea, para las que reportan estado.
 */
export default function Etiqueta({
  children,
  className = "",
  testigo = false,
  claro = false,
}: {
  children: ReactNode;
  className?: string;
  testigo?: boolean;
  /** Para fondos de marca sólidos, donde el tinte va en blanco. */
  claro?: boolean;
}) {
  return (
    <span
      className={[
        "z-[1] inline-flex items-center gap-1.5 rounded-full px-2 py-[3px]",
        "dato text-[9.5px] uppercase tracking-[0.09em]",
        claro
          ? "border border-white/25 bg-white/12 text-white"
          : "border border-[color-mix(in_oklab,var(--borde)_75%,transparent)] bg-[color-mix(in_oklab,var(--sup-2)_45%,transparent)] text-[var(--texto-sec)] backdrop-blur-sm",
        className,
      ].join(" ")}
    >
      {testigo && (
        <span className="testigo-etiqueta size-[5px] shrink-0 rounded-full bg-[var(--morado-ui)]" />
      )}
      {children}
    </span>
  );
}
