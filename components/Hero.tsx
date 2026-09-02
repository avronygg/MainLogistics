import HeroBackdrop from "./HeroBackdrop";
import RotadorFrase from "./RotadorFrase";
import BotonPill from "./ui/BotonPill";
import TarjetasFlotantes from "./TarjetasFlotantes";
import type { Mensajes } from "@/mensajes";

export default function Hero({ m }: { m: Mensajes }) {
  return (
    <section
      id="inicio"
      /* Reparto vertical del wireframe: titular arriba, el camión respira en
         el medio, y los botones anclados abajo. */
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-[clamp(2rem,3.5vw,3rem)] pt-[7rem] sm:pt-[clamp(5.75rem,9.5vw,7.25rem)]"
    >
      <HeroBackdrop conVideo />

      <div className="relative z-[var(--z-contenido)] mx-auto w-full max-w-[var(--ancho-max)] px-[var(--borde-x)]">
        <div className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
          <h1
            className="titular-hero w-full uppercase leading-[1.04] text-[var(--texto)]"
          >
            {/* Dos líneas fijas: la primera completa, la segunda es la palabra
                que no cambia más la cápsula que rota. El corte no lo decide el
                ancho — está en el diccionario — así que cada idioma tiene que
                repartir el titular en esas dos líneas y no en tres. */}
            <span className="titulo-degradado block font-light tracking-[-0.012em]">
              {m.hero.tituloLinea1}
            </span>
            <span className="flex items-center justify-center gap-[0.26em] font-extrabold tracking-[-0.038em] text-[var(--morado-ui)]">
              <span>{m.hero.tituloLinea2}</span>
              <RotadorFrase m={m} />
            </span>
          </h1>

          <p className="mt-[clamp(0.85rem,1.8vw,1.5rem)] text-[clamp(0.95rem,0.42vw+0.86rem,1.125rem)] leading-[1.55] text-[var(--texto)]">
            {m.hero.bajadaLinea1}{" "}
            {/* En móvil el corte es fijo: dos líneas parejas en vez de un
                bloque de tres que se parte donde caiga. */}
            <br className="sm:hidden" />
            {m.hero.bajadaLinea2}
          </p>
        </div>
      </div>

      {/* Las tarjetas flanquean al camión. En pantallas chicas se apagan:
          sobre el video y en una sola columna solo taparían al camión. */}
      <TarjetasFlotantes m={m} />

      <div className="relative z-[var(--z-contenido)] mt-auto flex w-full flex-col items-center pt-[clamp(3rem,10vw,6rem)]">
        <div className="flex flex-wrap items-center justify-center gap-3 px-[var(--borde-x)]">
          <BotonPill href="#cotizar">{m.hero.ctaPrincipal}</BotonPill>
          <BotonPill href="#cargas" variante="fantasma">
            {m.hero.ctaSecundario}
          </BotonPill>
        </div>

        {/* Acá iba la cinta de trece logos de clientes bajo "Confían en
            nosotros". Se retiró: ninguna de esas empresas es cliente
            facturado de Main Logistics, así que el encabezado afirmaba una
            relación comercial que no existe. Ver el brief de desarrollo,
            §1.2 — en un mercado donde los jefes de logística se consultan
            entre ellos, eso se descubre en la primera reunión, y además usar
            marcas registradas de terceros para sugerir una relación que no
            existe es exposición legal.

            Lo que va en su lugar está en el §6.2 del brief: declarar la
            alianza operacional con nombre y RUT, que el comprador verifica
            en el SII en treinta segundos. Necesita la autorización escrita
            de la empresa aliada antes de publicarse. */}
      </div>

    </section>
  );
}
