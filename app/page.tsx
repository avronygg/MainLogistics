import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pilares from "@/components/Pilares";
import QueMovemos from "@/components/QueMovemos";
import Cumplimiento from "@/components/Cumplimiento";
import Resenas from "@/components/Resenas";
import ComoFunciona from "@/components/ComoFunciona";
import Equipo from "@/components/Equipo";
import Cotizar from "@/components/Cotizar";
import Pie from "@/components/Pie";
import Asesor from "@/components/Asesor";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        {/* El fondo alterna banda a banda, sin dos iguales seguidas:
            hero oscuro · claro · oscuro · claro · oscuro · claro · oscuro ·
            claro · pie oscuro. */}
        <Hero />
        <Pilares />
        <QueMovemos />
        <Cumplimiento />
        <Resenas />
        <ComoFunciona />
        <Equipo />
        <Cotizar />
      </main>
      <Pie />
      <Asesor />
    </>
  );
}
