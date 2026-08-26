import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 cambió el default de `qualities` a solo [75] y coacciona
     * cualquier otro valor al más cercano de la lista. Sin declarar 90 acá,
     * el `quality={90}` de los <Image> caía en silencio a 75 — que sobre
     * fotos oscuras con degradados produce bandas visibles.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
