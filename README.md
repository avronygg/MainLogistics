# Main Logistics — sitio corporativo

Next.js 16 · React 19 · Tailwind 4 · Motion

Diseñado y desarrollado por **Aaron Tardón** · Marketing Manager · **MAIN BRAIN**.
Ver [CREDITOS.md](CREDITOS.md).

---

## Levantarlo en local

Requiere **Node 20.9 o superior** (Next 16 no arranca con versiones anteriores).
Verificar con `node -v`.

```bash
npm install
npm run dev
```

Queda en http://localhost:3000

> **La carpeta `node_modules` no viene en el paquete y no debe venir.** Trae
> binarios compilados para el sistema donde se instaló: `ffmpeg-static` incluye
> un `ffmpeg.exe` de Windows que no corre en macOS ni Linux. `npm install`
> descarga el que corresponda.

Para correr los scripts de verificación hace falta además el navegador de
Playwright, que vive fuera del proyecto:

```bash
npx playwright install chromium
```

---

## Antes de tocar la interfaz

Leer en este orden. No es formalidad: cada decisión visual del sitio sale de
ahí y varias se ven arbitrarias sin ese contexto.

1. **`PRODUCT.md`** — a quién le habla, personalidad, anti-referencias, los 5 principios
2. **`DESIGN.md`** — paleta con contrastes verificados, tipografía, vidrio, motion
3. **`brand/main-logistics-marca.md`** — documento de marca del cliente

Reglas que se rompen seguido y no hay que romper:

- **`--morado-ui` (#8B5CF6) nunca como texto bajo 24px ni sobre `--sup-2`.**
  Para texto morado va `--morado-texto`. Verificar con `node scripts/contraste.mjs`.
- **Cero glow, cero degradado de neón.** La profundidad viene de nivel de
  superficie y sombra.
- **Vidrio solo donde algo flota sobre otra cosa.** Sobre fondo plano es un
  gris caro.
- **Geist Mono solo para dato auditable** — patentes, folios, tonelajes,
  normativas. Es regla semántica, no decorativa.
- **Ninguna cifra ni certificación entra sin confirmación del cliente.**
  Lista de pendientes en `brand/main-logistics-marca.md` §11.

---

## Verificación

Todo esto tiene que pasar antes de publicar. Cada script comprueba una regla
concreta del sistema, no es decoración.

```bash
node scripts/pruebas.mjs            # desbordes 320→1920, titular en 2 líneas, menú móvil, reduced-motion
node scripts/contraste.mjs          # contraste AA, tema oscuro
node scripts/tema-claro.mjs         # contraste AA, tema claro
node scripts/anclas.mjs             # enlaces internos que resuelven
node scripts/alternancia.mjs        # bandas claro/oscuro sin dos iguales seguidas
node scripts/nitidez.mjs            # ninguna foto se amplía
node scripts/auditoria-movil.mjs    # hero en cuatro equipos reales
node scripts/asesor.mjs             # secuencia del asesor flotante
node scripts/prueba-formulario.mjs  # el formulario nunca dice que envió si falló
node scripts/todas.mjs              # todas las secciones renderizan
```

Y lo de siempre: `npx tsc --noEmit`, `npx eslint components app`, `npm run build`.

---

## Regenerar imágenes

Los originales viven en `brand/fotos-origen/` y `brand/logos-origen/`.
Lo que sirve el sitio sale de ahí:

```bash
node scripts/fotos.mjs           # fotos → public/fotos/*.webp
node scripts/logos-clientes.mjs  # logos → public/clientes/*.webp (blanco monocromo)
node scripts/video-hero.mjs      # video del hero → H.264 + VP9 + cartel
node scripts/logo-horizontal.mjs # logo blanco sobre transparencia
```

> **El optimizador de imágenes de Next cachea por URL, no por contenido.** Si
> se recodifica una foto sin borrar `.next/cache/images`, sigue sirviendo la
> versión anterior indefinidamente y parece que el cambio no se aplicó. Los
> scripts ya la borran al terminar.

---

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar. **`.env.local` no se versiona
ni se comparte nunca.**

| Variable | Para qué |
|---|---|
| `RESEND_API_KEY` | Envío del formulario |
| `COTIZA_DESTINO` | Correo que recibe las solicitudes |
| `COTIZA_REMITENTE` | Remitente verificado en Resend |
| `NEXT_PUBLIC_WHATSAPP` | Opcional. El número comercial ya está en el código |

Sin configurar, la ruta `/api/cotizar` responde 503 y el formulario **muestra
el error** en vez de fingir que envió. Es deliberado.

---

## Pendientes que bloquean publicar

| Qué | Dónde |
|---|---|
| Clave de Resend y remitente verificado | variables en Vercel |
| RUT, razón social y dirección | hoy el pie muestra solo correo y teléfono |
| Citas reales de clientes, con autorización | `components/Resenas.tsx` |
| Autorización de uso de marca de los 13 clientes | gestión comercial |
| Las 6 fotos marcadas "Foto pendiente" | el encargo está escrito en cada marco |
| Nombre real de quien contesta comercial | `components/Asesor.tsx` → `NOMBRE` |
| §11 del doc de marca | GPS, central 24/7, peligrosa/refrigerada, seguro |

Ver [CREDITOS.md](CREDITOS.md) para el detalle de qué no se hizo a propósito.
