<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Contexto de diseño — Main Logistics

Antes de tocar cualquier interfaz, leer en este orden:

1. `PRODUCT.md` — registro (brand), a quién le habla, personalidad, anti-referencias y los 5 principios de diseño.
2. `DESIGN.md` — sistema visual: paleta con contrastes verificados, tipografía, vidrio, motion, layout.
3. `brand/main-logistics-marca.md` — documento de marca original del cliente. Es la fuente; donde `DESIGN.md` se aparta de él, la razón está anotada.

Reglas que se rompen seguido y no hay que romper:

- **`--morado-ui` (#8B5CF6) nunca como texto bajo 24px, y nunca sobre `--sup-2`.** Para texto morado va `--morado-texto` (#AF95FF). Verificar con `node scripts/contraste.mjs`.
- **Cero glow, cero degradado de neón, cero texto con degradado.** La profundidad viene de nivel de superficie y sombra.
- **Vidrio solo donde algo flota sobre otra cosa** (nav, tarjetas del hero, overlays sobre imagen o video). Sobre fondo plano es un gris caro.
- **Geist Mono solo para dato auditable** (patentes, folios, tonelajes, normativas). Es regla semántica, no decorativa.
- **Sin eyebrow en mayúsculas sobre cada sección.** Sin numeración de secciones salvo el timeline, que sí es una secuencia.
- **Ninguna cifra ni certificación entra al sitio sin confirmación del cliente.** Ver la lista de pendientes en `brand/main-logistics-marca.md` §11.

Verificación visual: `npm run dev` y después `node scripts/shot.mjs ../shots` (capturas en varios viewports) y `node scripts/pruebas.mjs` (palabra larga del rotador, menú móvil, reduced-motion).
