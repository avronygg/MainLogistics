"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IDIOMAS, NOMBRES, type Idioma } from "@/mensajes/idiomas";
import { BANDERAS } from "./Banderas";

/**
 * Selector de idioma.
 *
 * Cada idioma es una URL propia (`/es`, `/en`, `/pt`, `/zh`), no un estado
 * de cliente: así se puede mandar por WhatsApp el enlace ya en el idioma del
 * destinatario, que es el caso de uso real del sitio en Fase 1.
 *
 * Al elegir se deja una cookie de un año. La próxima visita a la raíz entra
 * directo en ese idioma: una elección explícita pesa más que lo que declare
 * el navegador, que muchas veces trae el idioma del sistema operativo y no
 * el de la persona.
 *
 * El nombre de cada idioma va EN ese idioma — "中文", no "Chino". Quien busca
 * el suyo en una lista no lo reconoce traducido al que está viendo. Y la
 * bandera nunca va sola: un idioma no es un país, así que la bandera ayuda a
 * reconocer y el nombre es el que informa.
 */

/**
 * Deja la elección en una cookie de un año, para que la próxima visita a la
 * raíz entre directo en ese idioma.
 *
 * Vive fuera del componente porque escribir `document.cookie` es mutar algo
 * externo a React, y el compilador lo marca — con razón — si ocurre dentro.
 */
function recordarPreferencia(idioma: Idioma) {
  document.cookie = `ml-idioma=${idioma}; path=/; max-age=31536000; samesite=lax`;
}

export default function SelectorIdioma({
  actual,
  etiqueta,
  className = "",
}: {
  actual: Idioma;
  /** "Cambiar idioma", ya traducido. */
  etiqueta: string;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const ruta = usePathname();

  useEffect(() => {
    if (!abierto) return;
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    function alTocarFuera(e: MouseEvent) {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    }
    window.addEventListener("keydown", alTeclear);
    document.addEventListener("mousedown", alTocarFuera);
    return () => {
      window.removeEventListener("keydown", alTeclear);
      document.removeEventListener("mousedown", alTocarFuera);
    };
  }, [abierto]);

  function elegir(idioma: Idioma) {
    recordarPreferencia(idioma);
    setAbierto(false);
    /* Se cambia SOLO el primer tramo. Con `/${idioma}` a secas, alguien que
       estuviera en /es/transportistas y eligiera inglés terminaba en la
       home: cambiar de idioma no debería costarte la página en la que
       estás.

       `replace` y no `push`: el idioma anterior no es un paso atrás que
       alguien quiera deshacer, y ensuciaría el historial del formulario. */
    const resto = ruta.split("/").slice(2).join("/");
    router.replace(`/${idioma}${resto ? "/" + resto : ""}`);
  }

  const BanderaActual = BANDERAS[actual];

  return (
    <div ref={contenedor} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="listbox"
        aria-label={`${etiqueta} — ${NOMBRES[actual].propio}`}
        className="flex min-h-[40px] items-center gap-1.5 rounded-full border border-white/15 px-3 text-[13.5px] font-medium tracking-[-0.01em] text-[var(--texto)] transition-colors duration-[var(--dur-hover)] hover:bg-white/[0.08] focus:outline-none focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--morado-solido)_45%,transparent)]"
      >
        <BanderaActual className="h-[13px] w-[17px]" />
        {NOMBRES[actual].corto}
      </button>

      {abierto && (
        <ul
          role="listbox"
          aria-label={etiqueta}
          /* Más sólido que la barra: un menú se lee, no ambienta. Con la
             opacidad del nav, el hero se colaba detrás de los nombres y
             "中文" quedaba encima de la tarjeta del GPS. */
          className="vidrio-nav absolute right-0 top-[calc(100%+0.5rem)] z-10 min-w-[10.5rem] rounded-[16px] bg-[color-mix(in_oklab,var(--sup-1)_94%,transparent)] p-1.5"
        >
          {IDIOMAS.map((i) => {
            const Bandera = BANDERAS[i];
            return (
            <li key={i}>
              <button
                type="button"
                role="option"
                aria-selected={i === actual}
                onClick={() => elegir(i)}
                className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-[11px] px-3 text-[14.5px] transition-colors duration-[var(--dur-hover)] hover:bg-white/[0.08] focus:outline-none focus-visible:bg-white/[0.08] ${
                  i === actual
                    ? "font-medium text-[var(--texto)]"
                    : "text-[var(--texto-sec)]"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Bandera className="h-[13px] w-[17px]" />
                  {NOMBRES[i].propio}
                </span>
                {/* El idioma activo no se marca solo con el peso de la
                    tipografía: lleva una marca que se ve en escala de grises. */}
                {i === actual && (
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                    className="size-3 text-[var(--morado-texto)]"
                  >
                    <path
                      d="m2 6.2 2.4 2.4L10 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
