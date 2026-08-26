"use client";

import { useEffect, useRef } from "react";
import s from "./HeroBackdrop.module.css";

/**
 * Video de fondo del hero.
 *
 * El original del cliente viene en HEVC, que Firefox no reproduce y Chrome
 * solo con decodificación por hardware en algunas plataformas. Se sirven
 * H.264 y VP9, generados con `node scripts/video-hero.mjs`.
 *
 * El orden de <source> importa: primero los de 1080p con media query, y al
 * final el de 1280px sin media como red. Si un navegador ignorara el
 * atributo media, cae en el primero compatible y sigue funcionando.
 */
export default function VideoFondo({ poster }: { poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // React no siempre refleja `muted` como propiedad, y sin la propiedad
    // puesta el autoplay queda bloqueado.
    v.muted = true;

    // Movimiento reducido: no se reproduce un fondo en bucle sin permiso.
    // Queda el cartel fijo, que es un fotograma real del video.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      if (mq.matches) {
        v.pause();
        v.removeAttribute("autoplay");
      } else {
        v.play().catch(() => {
          /* autoplay bloqueado por el navegador: queda el cartel */
        });
      }
    };
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  return (
    <video
      ref={ref}
      className={s.video}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      data-hero=""
    >
      <source src="/hero.webm" type="video/webm" media="(min-width: 768px)" />
      <source src="/hero.mp4" type="video/mp4" media="(min-width: 768px)" />
      <source src="/hero-movil.mp4" type="video/mp4" />
    </video>
  );
}
