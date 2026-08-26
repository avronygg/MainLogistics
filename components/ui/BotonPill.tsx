import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  /**
   * `primario`: píldora morada sólida. Un solo primario por pantalla.
   * `fantasma`: sin relleno. Texto con subrayado que crece y flecha en
   *   círculo de contorno. Deliberadamente de otra familia visual, para
   *   que los dos llamados no compitan por el mismo peso.
   */
  variante?: "primario" | "fantasma";
  className?: string;
};

export default function BotonPill({
  href,
  children,
  variante = "primario",
  className = "",
}: Props) {
  if (variante === "fantasma") {
    return (
      <Link
        href={href}
        className={[
          "group inline-flex min-h-[52px] shrink-0 items-center gap-3 rounded-full py-2 pl-2 pr-4",
          "text-[15px] font-medium tracking-[-0.01em] text-[var(--texto)]",
          // En móvil el botón cae sobre la franja del video que va sin velo,
          // así que se sostiene solo: fondo propio y desenfoque. Desde lg
          // vuelve a ser texto puro, que es como debe verse en escritorio.
          "bg-[color-mix(in_oklab,var(--fondo)_58%,transparent)] backdrop-blur-md",
          "lg:bg-transparent lg:backdrop-blur-none",
          "",
          className,
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "grid size-9 shrink-0 place-items-center rounded-full",
            "border border-[color-mix(in_oklab,white_34%,transparent)]",
            "transition-colors duration-[var(--dur-estado)] ease-[var(--ease-quart)]",
            "group-hover:border-[color-mix(in_oklab,white_70%,transparent)]",
            "group-hover:bg-[color-mix(in_oklab,white_16%,transparent)]",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="size-4 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-expo)] group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
          >
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Subrayado que crece desde la izquierda: el énfasis está en la
            palabra, no en una segunda caja de color. */}
        <span className="relative pr-1">
          {children}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-0 bg-[color-mix(in_oklab,white_70%,transparent)] transition-[width] duration-[var(--dur-estado)] ease-[var(--ease-expo)] group-hover:w-full motion-reduce:transition-none"
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={[
        "group inline-flex min-h-[52px] shrink-0 items-center gap-3 rounded-full py-2 pl-6 pr-2",
        "text-[15px] font-medium tracking-[-0.01em] text-white",
        "bg-[var(--morado-solido)]",
        "shadow-[0_6px_18px_-8px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.22)]",
        "transition-[background-color,box-shadow] duration-[var(--dur-estado)] ease-[var(--ease-quart)]",
        "hover:bg-[color-mix(in_oklab,var(--morado-solido)_86%,white)]",
        "hover:shadow-[0_10px_26px_-10px_rgb(0_0_0/0.85),inset_0_1px_0_rgb(255_255_255/0.32)]",
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[var(--morado-solido)] transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:scale-[1.08] motion-reduce:group-hover:scale-100"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="size-4 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-expo)] group-hover:translate-x-[3px] motion-reduce:group-hover:translate-x-0"
        >
          <path
            d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
