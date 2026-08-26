/**
 * Set de íconos de línea del sitio.
 *
 * Un solo set, mismo grosor (1.6), mismas terminaciones redondeadas y la
 * misma caja de 24. El doc de marca §8 lo pide explícito: "íconos de línea,
 * un solo set, mismo grosor. Nunca 3D". Mezclar sets es de lo que más
 * delata una plantilla.
 *
 * Todos heredan `currentColor`, así que el color lo decide el contexto.
 */

type Props = { className?: string };

function Base({ children, className = "" }: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Documento con línea de firma: cotización, papeleo. */
export function IconoCotizar(p: Props) {
  return (
    <Base {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Base>
  );
}

/** Camión de reparto: retiro. */
export function IconoRetiro(p: Props) {
  return (
    <Base {...p}>
      <path d="M3 7h10v9H3zM13 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </Base>
  );
}

/** Paquete con visto: entrega conforme. */
export function IconoEntrega(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Base>
  );
}

/** Reloj: plazos. */
export function IconoReloj(p: Props) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Base>
  );
}

/** Escudo con visto: cumplimiento, seguridad. */
export function IconoEscudo(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 3 19 5.6v5.9c0 3.9-2.9 6.9-7 8.5-4.1-1.6-7-4.6-7-8.5V5.6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </Base>
  );
}

/** Pin de mapa: cobertura. */
export function IconoMapa(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </Base>
  );
}

/** Casco de seguridad: personas en terreno. */
export function IconoCasco(p: Props) {
  return (
    <Base {...p}>
      <path d="M3.5 17h17M4.5 17v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M10 8V4.8A1.3 1.3 0 0 1 11.3 3.5h1.4A1.3 1.3 0 0 1 14 4.8V8" />
      <path d="M2.5 17h19a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1h-19a1 1 0 0 1-1-1V18a1 1 0 0 1 1-1z" />
    </Base>
  );
}

/** Señal de antena: monitoreo en ruta. */
export function IconoSenal(p: Props) {
  return (
    <Base {...p}>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.8 18.2a9 9 0 0 1 0-12.4M18.2 5.8a9 9 0 0 1 0 12.4" />
    </Base>
  );
}

/** Cajas apiladas: tipos de carga. */
export function IconoCarga(p: Props) {
  return (
    <Base {...p}>
      <path d="M3 9h8v5H3zM13 5h8v9h-8zM3 14h18v5H3z" />
      <path d="M7 9V6.5M17 5v3" />
    </Base>
  );
}
