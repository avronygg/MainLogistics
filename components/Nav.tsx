"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SelectorIdioma from "./SelectorIdioma";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";

/**
 * Lockup horizontal en blanco sobre transparencia, sin caja ni fondo.
 * Se genera con `node scripts/logo-horizontal.mjs`, que le quita el negro
 * al original y lo recorta a su contenido. El horizontal es el que sirve en
 * una barra: el isotipo solo deja la marca sin nombre, y el vertical se
 * vuelve ilegible a la altura de un nav.
 */
function Isotipo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logo-horizontal-blanco.png"
      alt="Main Logistics"
      width={1541}
      height={343}
      priority
      className={`w-auto ${className}`}
    />
  );
}

export default function Nav({ m, idioma }: { m: Mensajes; idioma: Idioma }) {
  // Los anclas son de la página, no del idioma: `#servicios` sigue siendo
  // `#servicios` en chino. Traducir el fragmento rompería cada enlace que
  // alguien ya compartió.
  const enlaces = [
    { href: "#servicios", texto: m.nav.servicios },
    { href: "#cargas", texto: m.nav.queMovemos },
    { href: "#cobertura", texto: m.nav.cobertura },
    { href: "#contacto", texto: m.nav.contacto },
  ];

  const [compacto, setCompacto] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const reducirMovimiento = useReducedMotion();

  useEffect(() => {
    const alScroll = () => setCompacto(window.scrollY > 28);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Con el panel abierto: se bloquea el scroll del fondo y Escape cierra.
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] px-[var(--borde-x)] pt-3 sm:pt-4">
      <nav
        aria-label={m.nav.principal}
        data-compacto={compacto || abierto}
        className={[
          // Tres columnas de 1fr/auto/1fr: los enlaces quedan centrados
          // respecto de la barra, no respecto del espacio que sobra.
          "vidrio-nav mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4",
          "rounded-full",
          "transition-[max-width,padding] duration-[var(--dur-estado)] ease-[var(--ease-quint)]",
          "max-w-[900px] p-1.5 sm:p-2",
          "data-[compacto=true]:max-w-[820px]",
        ].join(" ")}
      >
        <Link
          href="#inicio"
          aria-label={m.nav.inicio}
          className="col-start-1 flex w-fit items-center rounded-full px-2.5 py-1"
          onClick={() => setAbierto(false)}
        >
          <Isotipo className="h-[22px] sm:h-[25px]" />
        </Link>

        <ul className="col-start-2 hidden items-center gap-1 lg:flex">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className={[
                  "relative block rounded-full px-3.5 py-1.5 text-[14px] tracking-[-0.01em]",
                  "text-[var(--texto)] transition-colors duration-[var(--dur-hover)]",
                  "hover:bg-white/[0.1]",
                ].join(" ")}
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <Link
            href="#cotizar"
            className={[
              // `whitespace-nowrap` no es cosmético: el CTA es la palabra más
              // variable del nav — "Cotizar" son 7 caracteres y "Get a quote"
              // son 11 — y sin esto se parte en dos líneas, estira la píldora
              // y descuadra la barra entera. Que crezca a lo ancho, no a lo alto.
              "group hidden min-h-[40px] items-center gap-2 whitespace-nowrap rounded-full bg-[var(--morado-solido)] py-1.5 pl-4 pr-1.5",
              "text-[14px] font-medium tracking-[-0.01em] text-white sm:inline-flex",
              "shadow-[0_4px_14px_-6px_rgb(0_0_0/0.8),inset_0_1px_0_rgb(255_255_255/0.24)]",
              "transition-[background-color,box-shadow] duration-[var(--dur-estado)] ease-[var(--ease-quart)]",
              "hover:bg-[color-mix(in_oklab,var(--morado-solido)_86%,white)]",
              "hover:shadow-[0_8px_20px_-8px_rgb(0_0_0/0.85),inset_0_1px_0_rgb(255_255_255/0.32)]",
            ].join(" ")}
          >
            {m.nav.cotizar}
            <span
              aria-hidden="true"
              className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:scale-110 motion-reduce:group-hover:scale-100"
            >
              <svg viewBox="0 0 16 16" fill="none" className="size-3.5 transition-transform duration-[var(--dur-estado)] ease-[var(--ease-expo)] group-hover:translate-x-[2px] motion-reduce:group-hover:translate-x-0">
                <path d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          {/* Visible en todos los anchos: en móvil el CTA de "Cotizar" se
              esconde, así que acá sobra el espacio, y esconder el cambio de
              idioma detrás del menú lo vuelve invisible justo para quien más
              lo necesita — alguien que abrió el sitio y no entiende nada. */}
          <SelectorIdioma actual={idioma} etiqueta={m.nav.cambiarIdioma} />

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? m.nav.cerrarMenu : m.nav.abrirMenu}
            className="grid size-10 place-items-center rounded-full border border-white/15 text-[var(--texto)] transition-colors duration-[var(--dur-hover)] hover:bg-white/[0.06] lg:hidden"
          >
            <svg viewBox="0 0 20 20" fill="none" className="size-5">
              <path
                d={abierto ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 13h14"}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {abierto && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{
              duration: reducirMovimiento ? 0 : 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="vidrio-nav mx-auto mt-2 max-w-[var(--ancho-max)] overflow-hidden rounded-[28px] p-2 lg:hidden"
          >
            <ul>
              {enlaces.map((e, i) => (
                <motion.li
                  key={e.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducirMovimiento ? 0 : 0.35,
                    delay: reducirMovimiento ? 0 : 0.05 + i * 0.045,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={e.href}
                    onClick={() => setAbierto(false)}
                    className="flex min-h-[52px] items-center justify-between rounded-[14px] px-4 text-[17px] tracking-[-0.01em] text-[var(--texto)] transition-colors duration-[var(--dur-hover)] hover:bg-white/[0.06]"
                  >
                    {e.texto}
                    <svg viewBox="0 0 16 16" fill="none" className="size-4 text-[var(--texto-sec)]">
                      <path
                        d="M6 3.5L10.5 8L6 12.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </motion.li>
              ))}
            </ul>

            <Link
              href="#cotizar"
              onClick={() => setAbierto(false)}
              className="mt-2 flex min-h-[52px] items-center justify-center rounded-[14px] bg-[var(--morado-solido)] px-4 text-[16px] font-medium text-white sm:hidden"
            >
              {m.nav.cotizarMovil}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
