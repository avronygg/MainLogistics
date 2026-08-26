import Image from "next/image";
import s from "./FranjaConfianza.module.css";
import type { Mensajes } from "@/mensajes";

/**
 * Cinta de clientes.
 *
 * Los logos son los archivos reales, tomados del sitio del socio
 * (logisticayireh.cl) donde la misma empresa ya los publica, y procesados a
 * blanco monocromo con `node scripts/logos-clientes.mjs`. Once de los
 * originales venían con fondo blanco: sobre la banda oscura del hero se
 * habrían visto como cajas blancas.
 *
 * El monocromo no es solo por el fondo: unifica trece identidades muy
 * distintas en una sola cinta. Es lo que hace que se lea como un conjunto y
 * no como un collage.
 *
 * ⚠️ PENDIENTE COMERCIAL, no de diseño: usar la marca de un cliente en
 * material propio necesita su visto bueno, aunque la relación sea real. Es
 * el riesgo del doc de marca §9 — este comprador verifica. Y si Main
 * participó junto al socio y no como proveedor titular, el encabezado
 * honesto es el que está comentado más abajo.
 */

type Marca = {
  archivo: string;
  nombre: string;
  /** Los dos de origen ancho se muestran algo más chicos para igualar peso. */
  escala?: string;
};

/**
 * Esta lista no pasa por el diccionario: `nombre` es la razón social del
 * cliente y va igual en los cuatro idiomas. Traducir "Guanaco Compañía
 * Minera" sería inventar una empresa que no existe.
 */
const MARCAS: Marca[] = [
  { archivo: "cliente-02", nombre: "Ultraport" },
  { archivo: "cliente-09", nombre: "Antucoya · Antofagasta Minerals" },
  { archivo: "cliente-10", nombre: "Unacem" },
  { archivo: "cliente-05", nombre: "Yamana Gold" },
  { archivo: "cliente-12", nombre: "Lhoist" },
  { archivo: "cliente-08", nombre: "Scan Global Logistics" },
  { archivo: "cliente-03", nombre: "Guanaco Compañía Minera" },
  { archivo: "cliente-06", nombre: "Caemin" },
  { archivo: "cliente-11", nombre: "TGL Chile" },
  { archivo: "cliente-07", nombre: "Caleras San Juan" },
  { archivo: "cliente-01", nombre: "Reinvent" },
  { archivo: "cargo-services", nombre: "Cargo Services", escala: "h-[clamp(2.6rem,3.8vw,3.5rem)]" },
  { archivo: "proquimin", nombre: "Proquimin", escala: "h-[clamp(2.6rem,3.8vw,3.5rem)]" },
];

function Logo({ marca }: { marca: Marca }) {
  return (
    <li className="flex w-[clamp(9.5rem,15vw,13rem)] shrink-0 items-center justify-center px-4">
      <Image
        src={`/clientes/${marca.archivo}.webp`}
        alt={marca.nombre}
        width={199}
        height={96}
        quality={90}
        className={[
          marca.escala ?? "h-[clamp(2.15rem,3.1vw,2.9rem)]",
          "w-auto object-contain opacity-70 transition-opacity duration-[var(--dur-estado)] ease-[var(--ease-quart)] hover:opacity-100",
        ].join(" ")}
      />
    </li>
  );
}

export default function FranjaConfianza({ m }: { m: Mensajes }) {
  return (
    <div className="flex flex-col items-center gap-3 sm:gap-6">
      <p className="hidden px-[var(--borde-x)] text-[12.5px] tracking-[-0.005em] text-[var(--texto-sec)] sm:block">
        {/* Alternativa honesta si Main participó junto al socio y no como
            proveedor titular: "Operaciones atendidas junto a Logística Yireh" */}
        {m.resenas.franja.encabezado}
      </p>

      <div className={`${s.ventana} w-full`}>
        <div className={s.cinta}>
          {/* Dos pasadas: la segunda entra justo cuando la primera sale. */}
          {[0, 1].map((copia) => (
            <ul key={copia} aria-hidden={copia === 1} className="flex items-center">
              {MARCAS.map((marca) => (
                <Logo key={`${copia}-${marca.archivo}`} marca={marca} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
