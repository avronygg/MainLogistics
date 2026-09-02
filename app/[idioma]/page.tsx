import { notFound } from "next/navigation";
import { cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import QueMovemos from "@/components/QueMovemos";
import Cumplimiento from "@/components/Cumplimiento";
import Resenas from "@/components/Resenas";
import ComoFunciona from "@/components/ComoFunciona";
import Equipo from "@/components/Equipo";
import CotizarExpress from "@/components/CotizarExpress";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";

/**
 * Los textos se cargan acá, en el servidor, y bajan como props.
 *
 * Sin contexto de React: los componentes de servidor no pueden leerlo, y
 * partir el sitio en "los que sí" y "los que no" por un detalle de
 * infraestructura sería peor que pasar una prop. La prop además deja a la
 * vista qué sección usa qué textos.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ idioma: string }>;
}) {
  const { idioma } = await params;
  if (!esIdioma(idioma)) notFound();
  const m = await cargar(idioma);

  return (
    <>
      <Nav m={m} idioma={idioma} />
      <main>
        {/* El fondo alterna banda a banda, sin dos iguales seguidas:
            hero oscuro · claro · oscuro · claro · oscuro · claro · oscuro ·
            claro · pie oscuro. */}
        <Hero m={m} />
        <Servicios m={m} />
        <QueMovemos m={m} />
        <Cumplimiento m={m} />
        <Resenas m={m} />
        <ComoFunciona m={m} />
        <Equipo m={m} />
        <CotizarExpress m={m} idioma={idioma} />
      </main>
      <Pie m={m} />
      <Asesor m={m} />
    </>
  );
}
