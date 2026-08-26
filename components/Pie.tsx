import Image from "next/image";
import Link from "next/link";

/**
 * Pie de página.
 *
 * No es decorativo: el doc de marca §5 identifica como riesgo número uno que
 * la empresa se lea como "extranjera recién llegada", porque el nombre está
 * en inglés y no ancla ni al rubro ni al país. Los datos legales visibles
 * —RUT, dirección, teléfono chileno, dominio .cl— son parte de la defensa.
 *
 * ⚠️ DATOS PENDIENTES. RUT, dirección y teléfono están marcados como
 * vacantes en la constante LEGALES. Un pie con datos inventados es peor que
 * un pie sin datos: este comprador los verifica.
 */

const LEGALES = {
  razonSocial: "Razón social pendiente",
  rut: "RUT pendiente",
  direccion: "Dirección pendiente",
  telefono: "Teléfono pendiente",
  correo: "contacto@mainlogistics.cl",
};

const NAVEGACION = [
  {
    titulo: "Servicios",
    enlaces: [
      { href: "#servicios", texto: "Tecnología y monitoreo" },
      { href: "#cargas", texto: "Qué movemos" },
      { href: "#cobertura", texto: "Cobertura nacional" },
      { href: "#cumplimiento", texto: "Cumplimiento" },
    ],
  },
  {
    titulo: "Empresa",
    enlaces: [
      { href: "#como-funciona", texto: "Cómo funciona" },
      { href: "#clientes", texto: "Clientes" },
      { href: "#cotizar", texto: "Cotizar" },
    ],
  },
];

export default function Pie() {
  const año = 2026;

  return (
    <footer
      id="contacto"
      className="relative isolate scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden border-t border-[color-mix(in_oklab,var(--borde)_50%,transparent)]"
    >
      {/* Luz de escena baja, para que el pie no cierre en negro plano. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[28rem] w-[min(120vw,64rem)] -translate-x-1/2 translate-y-1/3 rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 30%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)] py-[clamp(3rem,6vw,5rem)]">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-20">
          <div className="max-w-[34rem]">
            <Image
              src="/logo-horizontal-blanco.png"
              alt="Main Logistics"
              width={1541}
              height={343}
              quality={90}
              className="h-[26px] w-auto"
            />

            <p className="mt-5 max-w-[38ch] text-[15px] leading-[1.6] text-[var(--texto-sec)]">
              Transporte de carga por carretera en todo Chile, de Arica a Punta
              Arenas. Respaldo del grupo{" "}
              <span className="text-[var(--texto)]">MainBrain</span>.
            </p>

            <a
              href="#cotizar"
              className="group mt-6 inline-flex items-center gap-2.5 text-[15px] font-medium text-[var(--morado-texto)]"
            >
              Cotice su carga
              <span className="grid size-7 place-items-center rounded-full border border-[color-mix(in_oklab,var(--morado-ui)_45%,transparent)] transition-transform duration-[var(--dur-estado)] ease-[var(--ease-quart)] group-hover:scale-110 motion-reduce:group-hover:scale-100">
                <svg viewBox="0 0 16 16" fill="none" className="size-3.5">
                  <path
                    d="M2.5 8h11m0 0L9 3.5M13.5 8L9 12.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-16">
            {NAVEGACION.map((col) => (
              <nav key={col.titulo} aria-label={col.titulo}>
                <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--texto)]">
                  {col.titulo}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.enlaces.map((e) => (
                    <li key={e.href}>
                      <Link
                        href={e.href}
                        className="text-[14px] text-[var(--texto-sec)] transition-colors duration-[var(--dur-hover)] hover:text-[var(--texto)]"
                      >
                        {e.texto}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--texto)]">
                Contacto
              </h2>
              {/* Los datos legales van en mono: se leen como registro
                  verificable, que es exactamente su función acá. */}
              <ul className="vidrio dato mt-4 flex flex-col gap-2.5 rounded-[var(--r-card)] p-4 text-[13px] leading-[1.5] text-[var(--texto-sec)]">
                <li>{LEGALES.razonSocial}</li>
                <li>{LEGALES.rut}</li>
                <li>{LEGALES.direccion}</li>
                <li>{LEGALES.telefono}</li>
                <li>
                  <a
                    href={`mailto:${LEGALES.correo}`}
                    className="transition-colors duration-[var(--dur-hover)] hover:text-[var(--texto)]"
                  >
                    {LEGALES.correo}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-3 border-t border-[color-mix(in_oklab,var(--borde)_50%,transparent)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--texto-sec)]">
            © {año} Main Logistics · Transporte de carga en todo Chile
          </p>
          <p className="dato text-[12px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--texto-sec)_75%,transparent)]">
            Arica → Punta Arenas
          </p>
        </div>
      </div>
    </footer>
  );
}
