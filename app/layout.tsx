/**
 * ════════════════════════════════════════════════════════════════════════
 *  MAIN LOGISTICS · Sitio corporativo
 *
 *  Diseñado y desarrollado por Aaron Tardón
 *  Marketing Manager · MAIN BRAIN
 *
 *  Construido bajo el estándar de agencia de MAIN BRAIN.
 * ════════════════════════════════════════════════════════════════════════
 *
 *  Esta firma vive solo en el código fuente. `layout.tsx` es un componente
 *  de servidor, así que este comentario no viaja en el bundle del cliente
 *  ni aparece en el HTML servido.
 *
 *  Antes de tocar cualquier interfaz, leer en este orden:
 *    1. PRODUCT.md   — registro, audiencia, anti-referencias, principios
 *    2. DESIGN.md    — paleta verificada, tipografía, vidrio, motion
 *    3. brand/main-logistics-marca.md — documento de marca del cliente
 *
 *  Verificación antes de publicar:
 *    node scripts/pruebas.mjs          desbordes, menú móvil, reduced-motion
 *    node scripts/contraste.mjs        contraste AA, tema oscuro
 *    node scripts/tema-claro.mjs       contraste AA, tema claro
 *    node scripts/anclas.mjs           enlaces internos que resuelven
 *    node scripts/alternancia.mjs      bandas claro/oscuro sin repetir
 *    node scripts/nitidez.mjs          fotos sin ampliación
 *    node scripts/auditoria-movil.mjs  hero en pantallas chicas
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"], // cubre á é í ó ú ñ ¿ ¡
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // §9 del doc de marca: nunca el nombre solo en el title tag.
  title: "Transporte de carga en todo Chile | Main Logistics",
  description:
    "Main Logistics mueve carga general, minera, peligrosa, refrigerada, forestal, contenedores, maquinaria y sobredimensionada de Arica a Punta Arenas, con monitoreo permanente y el estándar que exige cada industria.",
  metadataBase: new URL("https://mainlogistics.cl"),
  openGraph: {
    title: "Transporte de carga en todo Chile | Main Logistics",
    description:
      "Cualquier carga. Cualquier destino de Chile. Con visibilidad total y cero sorpresas.",
    locale: "es_CL",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1519",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CL"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
