import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IDIOMAS, NOMBRES, cargar, esIdioma } from "@/mensajes";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import Documento from "@/components/legal/Documento";
import { TERMINOS } from "@/components/datos/legal";

/**
 * Términos de uso del sitio, que no son las condiciones del transporte.
 *
 * La distinción importa y por eso está en la bajada: lo que se contrata se
 * rige por el contrato y la carta de porte. Un término de uso que pretenda
 * regular el flete termina contradiciendo al contrato, y ahí el que pierde
 * es Main.
 */

export function generateStaticParams() {
  return IDIOMAS.map((idioma) => ({ idioma }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idioma: string }>;
}): Promise<Metadata> {
  const { idioma } = await params;
  if (!esIdioma(idioma)) return {};
  const m = await cargar(idioma);

  return {
    title: `${m.legal.terminos} | Main Logistics`,
    description: TERMINOS.bajada,
    alternates: {
      canonical: `/${idioma}/legal/terminos`,
      languages: Object.fromEntries(
        IDIOMAS.map((i) => [NOMBRES[i].html, `/${i}/legal/terminos`]),
      ),
    },
  };
}

export default async function PaginaTerminos({
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
        <Documento doc={TERMINOS} m={m} idioma={idioma} />
      </main>
      <Pie m={m} idioma={idioma} />
    </>
  );
}
