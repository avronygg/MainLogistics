import Image from "next/image";
import s from "./Resenas.module.css";
import Titulo from "./Titulo";

/**
 * Tercera sección: reseñas, en carrusel infinito de dos hileras cruzadas.
 *
 * ⚠️ ATRIBUCIÓN VACANTE — NO PUBLICAR ASÍ.
 *
 * Las citas son texto de referencia y las personas no existen: dicen
 * "Nombre Apellido · Cargo · Empresa" a propósito. La tarjeta ya acepta la
 * foto real (`foto: "/clientes/loquesea.webp"`) y no hay que tocar nada más
 * del diseño cuando lleguen.
 *
 * Lo que no voy a poner es una cara de stock o generada con IA sobre una
 * cita inventada, y hay dos razones:
 *
 * 1. Deja de ser un placeholder y pasa a ser un testimonio falso atribuido
 *    a una persona con nombre, cargo y empresa.
 * 2. El doc de marca §9 lo prohíbe igual — "no usar rostros ni fotos de
 *    stock, el rubro las detecta al segundo". Con este comprador una cara
 *    de banco de imágenes resta credibilidad, no suma.
 *
 * El avatar cae en iniciales sobre morado: se ve resuelto y no simula a
 * nadie.
 *
 * Para completarla bastan cuatro preguntas por cliente:
 *   · ¿Qué problema concreto tenían antes?
 *   · ¿Qué pasó en un despacho puntual que salió bien?
 *   · ¿Qué le dirían a un par que está evaluando proveedor?
 *   · ¿Autoriza publicar su nombre, cargo y empresa?
 */

type Resena = {
  cita: string;
  nombre: string;
  cargo: string;
  empresa: string;
  industria: string;
  /** Foto real cuando exista. Sin esto, cae en iniciales. */
  foto?: string;
};

const RESENAS: Resena[] = [
  {
    cita: "Acá va una cita concreta: un plazo que se cumplió con la planta parada, no una frase sobre calidad de servicio.",
    nombre: "Nombre Apellido",
    cargo: "Jefe de Logística",
    empresa: "Empresa",
    industria: "Minería",
  },
  {
    cita: "La segunda conviene que hable de la visibilidad. Qué cambió cuando dejaron de tener que llamar para saber dónde estaba la carga.",
    nombre: "Nombre Apellido",
    cargo: "Gerente de Operaciones",
    empresa: "Empresa",
    industria: "Agroexportación",
  },
  {
    cita: "Una sobre cumplimiento documental: la auditoría que pasó sin observaciones.",
    nombre: "Nombre Apellido",
    cargo: "Jefe de Abastecimiento",
    empresa: "Empresa",
    industria: "Retail",
  },
  {
    cita: "Una que muestre que el estándar no cambia según lo que se mueva. Idealmente de quien mueve carga peligrosa.",
    nombre: "Nombre Apellido",
    cargo: "Jefe de Planta",
    empresa: "Empresa",
    industria: "Industria",
  },
  {
    cita: "Otra sobre qué pasó cuando algo se desvió en ruta y cómo se enteraron antes de tener que preguntar.",
    nombre: "Nombre Apellido",
    cargo: "Coordinadora de Transporte",
    empresa: "Empresa",
    industria: "Forestal",
  },
  {
    cita: "La última puede ser corta. Qué le diría a un par que está evaluando proveedor.",
    nombre: "Nombre Apellido",
    cargo: "Gerente de Supply Chain",
    empresa: "Empresa",
    industria: "Farmacéutica",
  },
];

function Avatar({ resena }: { resena: Resena }) {
  if (resena.foto) {
    return (
      <Image
        src={resena.foto}
        alt=""
        width={96}
        height={96}
        quality={90}
        className="size-10 shrink-0 rounded-full object-cover"
      />
    );
  }

  const iniciales = resena.nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--morado-solido)] text-[13px] font-semibold tracking-[-0.01em] text-white"
    >
      {iniciales}
    </span>
  );
}

function Tarjeta({ resena }: { resena: Resena }) {
  return (
    <figure className="flex w-[clamp(19rem,26vw,23rem)] shrink-0 flex-col rounded-[var(--r-card)] border border-[color-mix(in_oklab,var(--borde)_65%,transparent)] bg-[var(--sup-1)] p-6">
      <div className="flex items-start justify-between gap-4">
        <svg
          viewBox="0 0 32 24"
          aria-hidden="true"
          className="h-4 w-auto shrink-0 fill-[var(--morado-ui)]"
        >
          <path d="M0 24V13.4C0 6.6 3.9 1.8 11.2 0l1.5 3.3C8.4 5 6.2 7.6 6.2 11h5.6v13H0Zm19.3 0V13.4c0-6.8 3.9-11.6 11.2-13.4L32 3.3C27.7 5 25.5 7.6 25.5 11h5.6v13H19.3Z" />
        </svg>

        <span className="dato shrink-0 rounded-full border border-[color-mix(in_oklab,var(--borde)_80%,transparent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-[var(--texto-sec)]">
          {resena.industria}
        </span>
      </div>

      <blockquote className="mt-4 text-[15px] leading-[1.6] text-[var(--texto)]">
        {resena.cita}
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-[color-mix(in_oklab,var(--borde)_55%,transparent)] pt-4 [margin-top:1.5rem]">
        <Avatar resena={resena} />
        <span className="min-w-0">
          <span className="block text-[14px] font-medium tracking-[-0.015em] text-[var(--texto)]">
            {resena.nombre}
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-[var(--texto-sec)]">
            {resena.cargo} · {resena.empresa}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Una hilera con dos copias: el bucle cierra sin costura. */
function Hilera({
  resenas,
  sentido,
}: {
  resenas: Resena[];
  sentido: "izquierda" | "derecha";
}) {
  return (
    <div className={s.ventana}>
      <div
        className={`${s.pista} ${
          sentido === "izquierda" ? s.haciaIzquierda : s.haciaDerecha
        }`}
      >
        {[0, 1].map((copia) => (
          <div key={copia} className={s.grupo} aria-hidden={copia === 1}>
            {resenas.map((r, i) => (
              <Tarjeta key={`${copia}-${i}`} resena={r} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Resenas() {
  // Cada hilera lleva la lista completa: con menos tarjetas, una copia mide
  // menos que el viewport y el bucle deja un hueco. La de abajo va rotada
  // para que las dos no se lean como la misma cinta.
  const arriba = RESENAS;
  const abajo = [...RESENAS.slice(3), ...RESENAS.slice(0, 3)];

  return (
    <section
      id="clientes"
      className="relative isolate scroll-mt-[clamp(6rem,12vw,8.5rem)] overflow-hidden py-[var(--seccion-y)]"
    >
      {/* Una sola luz de escena por sección, contenida. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[min(120vw,70rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in oklab, var(--morado-solido) 30%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto mb-[clamp(2.5rem,4vw,3.5rem)] w-full max-w-[var(--ancho-max)] px-[var(--borde-x)]">
        <Titulo linea1="Lo que dicen" destacado="nuestros clientes" />
        <p className="mt-4 max-w-[52ch] text-[clamp(1rem,0.4vw+0.92rem,1.125rem)] leading-[1.6] text-[var(--texto-sec)]">
          Jefes de logística y abastecimiento que{" "}
          <span className="realce">responden el teléfono</span> si un colega
          pregunta por nosotros.
        </p>
      </div>

      <div className="relative flex flex-col gap-5">
        <Hilera resenas={arriba} sentido="izquierda" />
        <Hilera resenas={abajo} sentido="derecha" />
      </div>
    </section>
  );
}
