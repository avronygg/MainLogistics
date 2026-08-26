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

/* ── Equipos y servicios ──────────────────────────────────────────────
   Ocho íconos, uno por servicio. Cada uno dibuja el equipo real, no una
   metáfora: el comprador de logística reconoce una batea de un silo a
   simple vista, y confundirlos delata que no se conoce el rubro. */

/** Contenedor corrugado con gancho de grúa: retiro en puerto. */
export function IconoContenedor(p: Props) {
  return (
    <Base {...p}>
      <path d="M12 2.5v3M9.5 5.5h5" />
      <rect x="3" y="9" width="18" height="9" rx="1.2" />
      <path d="M7.5 9v9M12 9v9M16.5 9v9" />
    </Base>
  );
}

/** Perfil de cama baja: cuello alto y plataforma hundida al centro. */
export function IconoCamaBaja(p: Props) {
  return (
    <Base {...p}>
      <path d="M2 9h4l2 3h8l2-3h4" />
      <circle cx="7" cy="16" r="1.7" />
      <circle cx="17" cy="16" r="1.7" />
    </Base>
  );
}

/** Rampla plana: plataforma recta con carga paletizada encima. */
export function IconoRampla(p: Props) {
  return (
    <Base {...p}>
      <path d="M2 13h20" />
      <rect x="6.5" y="7.5" width="9" height="5.5" rx="0.8" />
      <path d="M11 7.5v5.5" />
      <circle cx="7" cy="16.5" r="1.7" />
      <circle cx="17" cy="16.5" r="1.7" />
    </Base>
  );
}

/** Camión pequeño de reparto: cabina corta y furgón. */
export function IconoCamionPequeno(p: Props) {
  return (
    <Base {...p}>
      <path d="M2 15V7.5h11V15" />
      <path d="M13 10.5h3.8L20 14v1h-7" />
      <circle cx="6.5" cy="16.8" r="1.7" />
      <circle cx="16.5" cy="16.8" r="1.7" />
    </Base>
  );
}

/** Batea: tolva que se angosta abajo, para áridos y graneles. */
export function IconoBatea(p: Props) {
  return (
    <Base {...p}>
      <path d="M3.5 7.5h17l-2.6 7H6.1z" />
      <path d="M3.5 7.5h17" />
      <circle cx="8.5" cy="17" r="1.7" />
      <circle cx="16" cy="17" r="1.7" />
    </Base>
  );
}

/** Silo: estanque cilíndrico sobre patas, carga a granel cerrada. */
export function IconoSilo(p: Props) {
  return (
    <Base {...p}>
      <rect x="3.5" y="8" width="17" height="7.5" rx="3.75" />
      <path d="M9 8v7.5M15 8v7.5" />
      <path d="M7.5 15.5v2.5M16.5 15.5v2.5" />
    </Base>
  );
}

/** Módulo BESS: batería con borne y el rayo de carga. */
export function IconoBess(p: Props) {
  return (
    <Base {...p}>
      <rect x="2.5" y="7" width="16" height="10" rx="1.6" />
      <path d="M18.5 10.5v3" />
      <path d="M11.6 9.4 9 12.4h3l-1.4 2.6" />
    </Base>
  );
}

/** Bodega con estantería: desconsolidado y almacenaje. */
export function IconoBodega(p: Props) {
  return (
    <Base {...p}>
      <path d="M3 9.5 12 4.5l9 5" />
      <path d="M4.5 9.5V20h15V9.5" />
      <path d="M3 20h18" />
      <path d="M8.5 20v-5.5h7V20" />
      <path d="M12 14.5V20" />
    </Base>
  );
}
