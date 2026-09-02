import Image from "next/image";
import { CORREO, TELEFONO, TELEFONO_ENLACE } from "./datos/contacto";
import Link from "next/link";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";

/**
 * Pie de página.
 *
 * No es decorativo: el doc de marca §5 identifica como riesgo número uno que
 * la empresa se lea como "extranjera recién llegada", porque el nombre está
 * en inglés y no ancla ni al rubro ni al país. Los datos legales visibles
 * —RUT, dirección, teléfono chileno, dominio .cl— son parte de la defensa.
 *
 * ⚠️ DATOS PENDIENTES. Razón social, RUT, dirección y teléfono siguen
 * vacantes y hoy muestran un aviso. Un pie con datos inventados es peor que
 * un pie sin datos: este comprador los verifica.
 */

/**
 * El único dato legal ya confirmado, y por eso el único que queda acá: una
 * casilla de correo es una dirección, no texto traducible.
 *
 * Solo correo y teléfono, por decisión del cliente. Antes había cuatro
 * líneas que decían "Razón social pendiente", "RUT pendiente" y compañía:
 * eso era una nota interna publicada en producción, y a un comprador que
 * está evaluando proveedores le dice que la empresa no está constituida.
 * Mejor mostrar dos datos ciertos que seis con cuatro avisos.
 *
 * No pasan por el diccionario: un número de teléfono chileno y una
 * dirección de correo se escriben igual en los cuatro idiomas.
 */


/**
 * Las columnas se arman con el diccionario en mano en vez de quedar como
 * constante de módulo. Los `href` no entran al diccionario: el ancla es de
 * la página, no del idioma, y traducir `#servicios` rompería cada enlace ya
 * compartido.
 */
function columnas(m: Mensajes, idioma: Idioma) {
  /* El ancla lleva la ruta del idioma delante. Suelto, `#servicios` solo
     funciona estando en la home: desde /cotizar, /transportistas o una
     página legal el navegador lo busca en la página actual, no lo encuentra
     y el enlace no hace nada. Es el mismo arreglo que ya se hizo en el nav.

     El fragmento en sí NO se traduce: `#servicios` sigue siendo
     `#servicios` en chino, porque traducirlo rompería cada enlace que
     alguien ya compartió. */
  const inicio = `/${idioma}`;

  return [
    {
      titulo: m.pie.columnaServicios.titulo,
      enlaces: [
        { href: `${inicio}#servicios`, texto: m.pie.columnaServicios.tecnologia },
        { href: `${inicio}#cargas`, texto: m.pie.columnaServicios.queMovemos },
        { href: `${inicio}#cobertura`, texto: m.pie.columnaServicios.cobertura },
        { href: `${inicio}#cumplimiento`, texto: m.pie.columnaServicios.cumplimiento },
        /* El verificador va acá y no en la columna legal. Esa columna es la
           letra chica del sitio; esto es una herramienta que Main ofrece, y
           enterrarla entre la política de privacidad y los términos la
           esconde de la única persona que la anda buscando. */
        { href: `${inicio}/verificador-resolucion-154`, texto: m.verificador.enlace },
      ],
    },
    {
      titulo: m.pie.columnaEmpresa.titulo,
      enlaces: [
        { href: `${inicio}#como-funciona`, texto: m.pie.columnaEmpresa.comoFunciona },
        { href: `${inicio}#clientes`, texto: m.pie.columnaEmpresa.clientes },
        { href: `${inicio}/cotizar`, texto: m.pie.columnaEmpresa.cotizar },
      ],
    },
    {
      titulo: m.legal.columna,
      enlaces: [
        { href: `${inicio}/legal/privacidad`, texto: m.legal.privacidad },
        { href: `${inicio}/legal/terminos`, texto: m.legal.terminos },
      ],
    },
  ];
}

export default function Pie({ m, idioma }: { m: Mensajes; idioma: Idioma }) {
  const año = 2026;

  // La bajada viaja entera en el diccionario y se parte acá por el nombre
  // del grupo, que no se traduce y aparece igual en los cuatro idiomas. Así

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
              {m.pie.descripcion}
            </p>

            <Link
              href={`/${idioma}/cotizar`}
              className="group mt-6 inline-flex items-center gap-2.5 text-[15px] font-medium text-[var(--morado-texto)]"
            >
              {m.pie.ctaCotizar}
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
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 lg:grid-cols-4 lg:gap-x-12">
            {columnas(m, idioma).map((col) => (
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

            <div className="col-span-2 lg:col-span-1">
              <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--texto)]">
                {m.pie.contacto.titulo}
              </h2>
              {/* Los datos legales van en mono: se leen como registro
                  verificable, que es exactamente su función acá. */}
              <ul className="vidrio dato mt-4 flex flex-col gap-2.5 rounded-[var(--r-card)] p-4 text-[13px] leading-[1.5] text-[var(--texto-sec)]">
                <li>
                  <a
                    href={`tel:${TELEFONO_ENLACE}`}
                    className="transition-colors duration-[var(--dur-hover)] hover:text-[var(--texto)]"
                  >
                    {TELEFONO}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CORREO}`}
                    className="transition-colors duration-[var(--dur-hover)] hover:text-[var(--texto)]"
                  >
                    {CORREO}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-3 border-t border-[color-mix(in_oklab,var(--borde)_50%,transparent)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[var(--texto-sec)]">
            © {año} Main Logistics · {m.pie.derechos}
          </p>
          {/* Dos comunas y una flecha: no hay nada que traducir acá. Arica y
              Punta Arenas son la dirección real de un lugar y se escriben
              igual en los cuatro idiomas, así que la línea no va al
              diccionario. */}
          <p className="dato text-[12px] uppercase tracking-[0.08em] text-[color-mix(in_oklab,var(--texto-sec)_75%,transparent)]">
            Arica → Punta Arenas
          </p>
        </div>
      </div>
    </footer>
  );
}
