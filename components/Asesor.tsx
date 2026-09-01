"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import s from "./Asesor.module.css";
import type { Mensajes } from "@/mensajes";
import { WHATSAPP } from "./datos/contacto";

/**
 * Asesor flotante, abajo a la derecha.
 *
 * Secuencia: a los 2 s aparece el globo con "escribiendo…", 3 s después se
 * reemplaza por el mensaje. Al abrir, tres salidas en filas tipo app: cotizar,
 * pedir contacto, o WhatsApp directo.
 *
 * Lenguaje iOS de verdad, no solo la burbuja: tarjeta de vidrio con esquinas
 * de 26px, filas de lista con separador a sangría, íconos en cápsula
 * redondeada y objetivos táctiles de 56px.
 *
 * ⚠️ SOBRE LA IDENTIDAD DE QUIEN "HABLA"
 *
 * La foto es un retrato generado. Por eso el rótulo dice el equipo y no un
 * nombre de persona: `NOMBRE` está en la marca a propósito. Si hay alguien
 * real atendiendo comercial, poner su nombre de pila acá es lo que hace que
 * esto funcione de verdad — un nombre inventado sobre una cara generada es
 * justo lo que el doc de marca §9 marca como detectable al segundo.
 *
 * Lo mismo con el punto verde: dice "en línea". Si nadie contesta fuera de
 * horario, el widget no debería mostrarlo. El pie dice el horario real.
 */

const FOTO_ASESORA = "/asesora.webp";

/**
 * Nombre de pila de quien realmente contesta. Si no hay, queda el equipo.
 * No entra al diccionario: es un nombre propio, igual en los cuatro idiomas.
 * El cargo sí, y va en `m.asesor.cargo`.
 */
const NOMBRE = "Main Logistics";



const ESPERA_APARECER = 2000;
const ESPERA_ESCRIBIENDO = 3000;

function Avatar() {
  return (
    <Image
      src={FOTO_ASESORA}
      alt=""
      width={320}
      height={320}
      quality={90}
      className="size-full rounded-full object-cover"
    />
  );
}

/** Punto de estado con anillo, para que se lea sobre cualquier fondo. */
function PuntoEnLinea({ tamano }: { tamano: number }) {
  return (
    <span
      className="absolute bottom-0 right-0 grid place-items-center rounded-full bg-[var(--sup-1)]"
      style={{ width: tamano + 5, height: tamano + 5 }}
    >
      <span
        className={`${s.enLinea} rounded-full bg-[var(--ok)]`}
        style={{ width: tamano, height: tamano }}
      />
    </span>
  );
}

/** Fila de opción, en el patrón de lista de iOS. */
function Opcion({
  href,
  externo = false,
  icono,
  titulo,
  detalle,
  tono = "neutro",
  onClick,
}: {
  href: string;
  externo?: boolean;
  icono: React.ReactNode;
  titulo: string;
  detalle: string;
  tono?: "neutro" | "verde" | "morado";
  onClick?: () => void;
}) {
  const capsula =
    tono === "verde"
      ? "bg-[color-mix(in_oklab,var(--ok)_22%,transparent)] text-[var(--ok)]"
      : tono === "morado"
        ? "bg-[var(--morado-solido)] text-white"
        : "bg-[color-mix(in_oklab,var(--morado-solido)_20%,transparent)] text-[var(--morado-texto)]";

  return (
    <a
      href={href}
      onClick={onClick}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex min-h-[56px] items-center gap-3 rounded-[16px] px-2.5 py-2 transition-colors duration-[var(--dur-hover)] hover:bg-white/[0.07] active:bg-white/10"
    >
      <span className={`grid size-9 shrink-0 place-items-center rounded-[11px] ${capsula}`}>
        {icono}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium leading-tight tracking-[-0.01em] text-[var(--texto)]">
          {titulo}
        </span>
        <span className="mt-0.5 block text-[12px] leading-tight text-[var(--texto-sec)]">
          {detalle}
        </span>
      </span>

      <svg
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="size-4 shrink-0 text-[color-mix(in_oklab,var(--texto-sec)_70%,transparent)] transition-transform duration-[var(--dur-hover)] group-hover:translate-x-0.5"
      >
        <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export default function Asesor({ m }: { m: Mensajes }) {
  const reducir = useReducedMotion();
  const [fase, setFase] = useState<"oculto" | "escribiendo" | "mensaje">("oculto");
  const [abierto, setAbierto] = useState(false);
  const [cerrado, setCerrado] = useState(false);
  /** El formulario de cotización está en pantalla: hay que apartarse. */
  const [enCotizar, setEnCotizar] = useState(false);

  useEffect(() => {
    const seccion = document.getElementById("cotizar");
    if (!seccion) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setEnCotizar(entrada.isIntersecting),
      // Basta con que asome un cuarto de la sección: para entonces la barra
      // del formulario ya puede estar en el borde inferior.
      { threshold: 0.25 },
    );
    observador.observe(seccion);
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const a = window.setTimeout(() => setFase("escribiendo"), ESPERA_APARECER);
    const b = window.setTimeout(
      () => setFase("mensaje"),
      ESPERA_APARECER + ESPERA_ESCRIBIENDO,
    );
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto]);

  const entrada = {
    initial: { opacity: 0, y: reducir ? 0 : 12, scale: reducir ? 1 : 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: reducir ? 0 : 8, scale: reducir ? 1 : 0.97 },
    transition: { duration: reducir ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] as const },
  };

  const cerrarPanel = () => setAbierto(false);

  return (
    <div
      // Se aparta mientras el formulario de cotización está en pantalla: el
      // botón "Siguiente" del formulario vive en una barra pegada al fondo,
      // y en un teléfono este widget se le para justo encima. Entre tapar el
      // botón principal de la conversión y esconder el asesor un momento, no
      // hay discusión.
      aria-hidden={enCotizar || undefined}
      className={`pointer-events-none fixed bottom-0 right-0 z-[var(--z-toast)] flex flex-col items-end gap-3 p-[clamp(1rem,3vw,1.75rem)] transition-opacity duration-[var(--dur-estado)] ${
        enCotizar ? "opacity-0 lg:opacity-100" : "opacity-100"
      }`}
    >
      {/* Globo con el mensaje automático. */}
      <AnimatePresence>
        {!abierto && !cerrado && fase !== "oculto" && (
          <motion.div
            key="globo"
            {...entrada}
            className="burbuja-clara pointer-events-auto relative max-w-[min(19rem,calc(100vw-3rem))] rounded-[22px] rounded-br-[8px] p-3.5 pr-9"
          >
            <button
              type="button"
              onClick={() => setCerrado(true)}
              aria-label={m.asesor.cerrarMensaje}
              className="absolute right-2 top-2 grid size-6 place-items-center rounded-full text-[#16212a]/55 transition-colors duration-[var(--dur-hover)] hover:bg-black/[0.07] hover:text-[#16212a]"
            >
              <svg viewBox="0 0 14 14" fill="none" className="size-3">
                <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {fase === "escribiendo" ? (
              <span className="flex items-center gap-1.5 py-1" aria-label={m.asesor.escribiendo}>
                <span className={`${s.punto} size-[7px] rounded-full bg-[#16212a]/45`} />
                <span className={`${s.punto} ${s.punto2} size-[7px] rounded-full bg-[#16212a]/45`} />
                <span className={`${s.punto} ${s.punto3} size-[7px] rounded-full bg-[#16212a]/45`} />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setAbierto(true)}
                className="block text-left text-[14.5px] font-medium leading-[1.45] text-[#16212a]"
              >
                {m.asesor.mensaje}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel abierto. */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="panel"
            {...entrada}
            role="dialog"
            aria-label={m.asesor.tituloPanel}
            className="vidrio pointer-events-auto w-[min(21.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-[26px]"
          >
            <div className="flex items-center gap-3 p-4">
              <span className="relative size-14 shrink-0">
                <Avatar />
                <PuntoEnLinea tamano={12} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold tracking-[-0.015em] text-[var(--texto)]">
                  {NOMBRE}
                </span>
                <span className="block text-[12.5px] text-[var(--texto-sec)]">
                  {m.asesor.cargo}
                </span>
              </span>

              <button
                type="button"
                onClick={cerrarPanel}
                aria-label={m.asesor.cerrarPanel}
                className="grid size-8 shrink-0 place-items-center rounded-full text-[var(--texto-sec)] transition-colors duration-[var(--dur-hover)] hover:bg-white/10 hover:text-[var(--texto)]"
              >
                <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Burbuja del mensaje, en el lado de quien habla. */}
            <div className="border-t border-white/10 px-4 pb-3 pt-3.5">
              <p className="burbuja-clara w-fit max-w-full rounded-[18px] rounded-bl-[6px] px-3.5 py-2.5 text-[14px] font-medium leading-[1.5]">
                {m.asesor.mensaje}
              </p>
            </div>

            {/* Opciones, en filas de lista tipo app. */}
            <div className="flex flex-col px-2 pb-2">
              <Opcion
                href="#cotizar"
                onClick={cerrarPanel}
                tono="morado"
                titulo={m.asesor.opciones.cotizar.titulo}
                detalle={m.asesor.opciones.cotizar.detalle}
                icono={
                  <svg viewBox="0 0 20 20" fill="none" className="size-[18px]">
                    <path d="M11.5 2.5H6a1.7 1.7 0 0 0-1.7 1.7v11.6A1.7 1.7 0 0 0 6 17.5h8a1.7 1.7 0 0 0 1.7-1.7V6.7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M11.5 2.5v4.2h4.2M7.5 11h5M7.5 14h3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />

              <span aria-hidden="true" className="ml-[3.4rem] h-px bg-white/[0.08]" />

              <Opcion
                href="#cotizar"
                onClick={cerrarPanel}
                titulo={m.asesor.opciones.contacto.titulo}
                detalle={m.asesor.opciones.contacto.detalle}
                icono={
                  <svg viewBox="0 0 20 20" fill="none" className="size-[18px]">
                    <path d="M6.4 3.5 8 6.6 6.5 8.2a9.6 9.6 0 0 0 5.3 5.3l1.6-1.5 3.1 1.6v2.4c0 .6-.5 1.1-1.1 1A13.6 13.6 0 0 1 3 4.6c0-.6.4-1.1 1-1.1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                }
              />

              {WHATSAPP && (
                <>
                  <span aria-hidden="true" className="ml-[3.4rem] h-px bg-white/[0.08]" />
                  <Opcion
                    href={`https://wa.me/${WHATSAPP}`}
                    externo
                    tono="verde"
                    titulo={m.asesor.opciones.whatsapp.titulo}
                    detalle={m.asesor.opciones.whatsapp.detalle}
                    icono={
                      <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]">
                        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1s-.7 1-.9 1.2c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
                      </svg>
                    }
                  />
                </>
              )}
            </div>

            <p className="border-t border-white/10 px-4 py-2.5 text-center text-[11.5px] leading-[1.4] text-[var(--texto-sec)]">
              {/* Horario real, no una promesa de 24/7 sin confirmar. */}
              {m.asesor.horario}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón permanente. */}
      <button
        type="button"
        onClick={() => {
          setAbierto((v) => !v);
          setCerrado(false);
        }}
        aria-expanded={abierto}
        aria-label={abierto ? m.asesor.cerrarAsesor : m.asesor.abrirAsesor}
        className="vidrio pointer-events-auto relative grid size-[62px] shrink-0 place-items-center rounded-full p-[3px] transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:scale-[1.05] active:scale-95 motion-reduce:hover:scale-100"
      >
        <span className="relative size-full">
          <Avatar />
        </span>
        <PuntoEnLinea tamano={12} />
      </button>
    </div>
  );
}
