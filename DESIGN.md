# Design

Sistema visual de Main Logistics. Deriva de `brand/main-logistics-marca.md` §8; donde este documento se aparta del original, la razón está anotada.

## Aesthetic lane

**Consola de operaciones a las tres de la mañana.**

Ni landing de logística modal (foto de camión al atardecer, degradado azul, tres tarjetas con ícono redondeado), ni editorial-tipográfico, ni SaaS-oscuro genérico. La referencia física es un panel de instrumentos leído de noche: fondo casi negro con tinte frío, información densa donde importa, vidrio real donde algo flota de verdad, y una sola fuente de luz por escena.

El dato es la decoración. La carretera del isotipo es el único ornamento.

## Theme

**Oscuro, y no por defecto.** La escena: un jefe de logística abre esto un martes a las 22:40, en el teléfono, después de que le avisaron de un atraso. Ya está mirando pantallas hace catorce horas. El fondo oscuro no es estética, es la temperatura correcta de esa conversación — y es lo que separa a la marca de la competencia, que va toda en blanco y azul.

La única excepción deliberada: **la sección de formulario se invierte a claro.** Campos oscuros con placeholder gris son incómodos, y ese bloque es la conversión.

## Color

Estrategia: **Committed.** Dosis 70 oscuro / 25 morado / 5 amarillo. El morado carga la identidad; la oscuridad carga la confianza.

### Superficies

| Token | Hex | OKLCH | Uso |
|---|---|---|---|
| `--fondo` | `#0E1519` | `oklch(19.0% 0.013 233)` | Fondo base |
| `--sup-1` | `#172935` | `oklch(27.1% 0.033 239)` | Superficie de card |
| `--sup-2` | `#22394A` | `oklch(33.3% 0.042 242)` | Card elevada |
| `--borde` | `#2E4658` | `oklch(38.2% 0.043 242)` | Bordes sutiles |

La separación entre bloques se hace con **niveles de superficie**, nunca con bordes grises. Los neutros ya vienen con tinte frío propio (croma 0.013–0.043 hacia hue 233–242); no se les agrega calidez.

### Morado — tres pasos, no dos

El documento de marca define dos valores de morado. La verificación de contraste obligó a un tercero: `#8B5CF6` da **4.35:1** sobre `--fondo` y **2.83:1** sobre `--sup-2`, así que como texto pequeño reprueba AA en todas las superficies y como elemento de UI reprueba sobre `--sup-2`.

| Token | Hex | Contraste | Uso permitido |
|---|---|---|---|
| `--morado-solido` | `#6735E1` | 6.62:1 con blanco encima | **Solo relleno.** Botón primario, una card de marca por fila. Nunca como texto. |
| `--morado-ui` | `#8B5CF6` | 4.35 / 3.53 sobre fondo / sup-1 | Íconos ≥24px, líneas, bordes activos, y **texto ≥24px** (titular del hero). Nunca sobre `--sup-2`. |
| `--morado-texto` | `#AF95FF` | 7.51 / 6.10 / 4.89 | **Todo texto morado bajo 24px**, en cualquier superficie. Enlaces, etiquetas, estados activos. |

`--morado-texto` es `oklch(74% 0.16 292.7)`: mismo hue de marca, subido en luminosidad hasta pasar 4.5:1 contra la superficie más clara.

### Acento y texto

| Token | Hex | Uso |
|---|---|---|
| `--amarillo` | `#FFCF27` | **Un solo elemento por pantalla.** Sobre oscuro contrasta el doble, así que la misma cantidad grita el doble. |
| `--texto` | `#E6E9EC` | Cuerpo. 15.1 / 12.3 / 9.8 sobre las tres superficies |
| `--texto-sec` | `#9AA7B2` | Secundario. 7.5 / 6.1 / 4.9 — pasa AA en las tres |

Semánticos `#12B76A` `#F79009` `#F04438` solo para estados de documentación, fuera de la paleta de marca, y siempre acompañados de texto o forma: el estado nunca se comunica solo por color.

### Prohibiciones de color

- **Cero glow, cero neón, cero bloom.** Ningún `box-shadow: 0 0 Npx <morado>`. La profundidad viene de superficie y sombra proyectada.
- **Cero texto con degradado.** `background-clip: text` está prohibido. Énfasis por peso y tamaño.
- Una sola luz de escena por sección: un radial suave y de baja opacidad, no un halo por elemento.

## Typography

**Geist** y **Geist Mono**, vía `next/font/google` (subset `latin`, que cubre á é í ó ú ñ ¿ ¡).

Una sola familia con contraste fuerte de peso y tamaño, más la mono como voz separada. No se agrega una tercera.

- **Títulos:** 600–700, tracking `-0.03em`. Piso absoluto `-0.04em`.
- **Display del hero:** `clamp()` con techo de 6rem. Por encima la página grita, no diseña.
- **Cuerpo:** 400, 17px, `--texto`, ancho de línea 65–75ch.
- **Interlineado sobre oscuro:** +0.06 respecto de lo habitual. El texto claro sobre fondo oscuro se lee más liviano y necesita más aire.
- `text-wrap: balance` en h1–h3, `pretty` en prosa larga.

### Geist Mono — el argumento

Mono **solo para dato codificado**: patentes, folios, RUT, tonelajes, IDs de viaje, códigos de ruta, kilometrajes, normativas (`DS 298`, `SICEP`, `ASIQUIM`). En mono el dato se lee como registro verificable y no como marketing.

No es mono-como-disfraz-técnico: es una regla semántica. Si el texto no es un dato que alguien podría auditar, va en Geist normal.

### Cadencia entre secciones

**Sin eyebrow.** Nada de etiquetas diminutas en mayúscula con tracking abierto sobre cada título — es la gramática de IA saturada. La jerarquía la dan el tamaño del título, el nivel de superficie y la composición de cada bloque, que cambia deliberadamente entre secciones.

Numeración solo donde el orden **es** información: el timeline de tres hitos. En ningún otro lado.

## Layout

**Bento grid**, 12 columnas, gap constante de 20px.

- Tres tamaños de card: chica (4 col), media (6), ancha (8–12).
- **Una sola card sólida por fila.** Un bloque de color entre neutros es la proporción que se ve cara; tres seguidas se vuelven pesadas.
- Máximo 6 cards por sección. Más que eso deja de ser bento y pasa a ser lista.
- Espaciado fluido con `clamp()`, variado para dar ritmo: separaciones generosas entre secciones, agrupaciones apretadas dentro.

### Radios — variables, nunca uniformes

| Valor | Uso |
|---|---|
| 28px | Cards de imagen, contenedores grandes |
| 18px | Cards de dato |
| 10px | Elementos chicos, chips, inputs |
| 999px | Botones pill, chips de estado |

## Glass

Vidrio **neutro**: toma prestado el color de lo que tiene detrás, no emite color propio. Es la diferencia entre iOS y cripto.

```css
backdrop-filter: blur(24px) saturate(140%);
background: color-mix(in oklab, var(--sup-1) 62%, transparent);
border: 1px solid color-mix(in oklab, white 10%, transparent);
box-shadow: 0 8px 32px rgb(0 0 0 / 0.45);
```

**Dónde se permite** — solo donde algo flota de verdad sobre otra cosa:

1. La barra de navegación
2. Las tarjetas flotantes del hero
3. Overlays sobre imagen o video

En todo lo demás la profundidad viene de `--sup-1` / `--sup-2` y sombra. Vidrio decorativo sobre fondo plano está prohibido: sin nada detrás que desenfocar, es un gris caro.

Siempre `@supports (backdrop-filter: blur(1px))` con caída a superficie sólida opaca.

## Motion

Curvas exponenciales de salida. Sin rebote, sin elástico.

| Token | Curva | Uso |
|---|---|---|
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Default de UI |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entradas y reveals |
| `--ease-in-out-quint` | `cubic-bezier(0.83, 0, 0.17, 1)` | Transformaciones de estado |

Duraciones: 150ms hover · 300ms transición de estado · 600ms entrada · 900ms coreografía del hero.

**La carretera:** todo movimiento en pantalla existe porque una ruta avanza. Ni blobs, ni partículas, ni formas abstractas.

**Reduced motion no es opcional.** Cada animación necesita alternativa real: el titular rotativo se detiene en su estado final, los reveals pasan a inmediatos, la carretera deja de avanzar. Los reveals mejoran un estado ya visible — nunca se condiciona la visibilidad del contenido a una clase, porque las transiciones se pausan en pestañas ocultas y el bloque se publica en blanco.

## Imagery

Fotos propias con textura real —polvo, ripio, acero, faena— tratadas en duotono morado. Prohibidas las fotos de stock y los rostros de banco de imágenes: el rubro las detecta al segundo.

**Estado actual: no hay material fotográfico todavía.** Hasta que exista, los espacios de imagen llevan marcos de reserva diseñados y rotulados (relación de aspecto real, motivo de carretera generativo, nota de qué foto va ahí). No son rectángulos grises: son composiciones que funcionan solas y se reemplazan sin tocar el layout.

El hero tiene el slot de video preparado (`HeroBackdrop`, prop `videoSrc`). Mientras no exista el metraje, renderiza la carretera generativa.

Texto sobre foto o video **siempre** con overlay o degradado: sin eso se vuelve ilegible sobre cielo claro o polvo.

## Components

- **Botones pill** con flecha en círculo. Primario `--morado-solido`; secundario con contorno. Nunca un segundo color sólido.
- **Chips de estado** con punto de color **y** texto, para verificación de transportistas.
- **Timeline vertical** de tres hitos numerados para "cómo funciona". El único lugar con números.
- **Card de dato grande** para la cifra principal.
- **Tabs por industria** en cumplimiento: cinco marcos normativos en el espacio de uno.
- **Íconos de línea**, un solo set, mismo grosor. Nunca 3D, nunca ícono redondeado sobre cada título.

## Mobile

Caso principal, no adaptación. Se navega en terreno y con sol.

- Todo colapsa a una columna; el orden se decide card por card según prioridad, no por orden de escritorio.
- **CTA fijo y botón de WhatsApp siempre visibles**, fuera del área donde el pulgar tapa contenido.
- Contraste alto y tamaño mínimo de texto **no negociables**.
- Objetivos táctiles ≥ 44px.
- El titular se prueba a cada breakpoint: palabra larga (`sobredimensionada`) + `clamp()` alto + grilla angosta es la receta del desborde.

---

## Decisiones del hero que se apartan del doc de marca

Tomadas con el cliente, mirando el wireframe y la referencia Premier Cargo.
Quedan anotadas acá para que nadie las "corrija" después sin saber por qué.

| Decisión | Qué dice el doc original | Por qué se cambió | Cómo revertir |
|---|---|---|---|
| **Titular en tuteo** — "Con Main, tu carga" | §6: "Se le habla de usted" | Decisión del cliente. El resto del sitio sigue en usted, así que hoy conviven los dos tratos | Cambiar dos palabras en `Hero.tsx` |
| **Titular en versales** | No estaba definido | Wireframe del cliente. Caps solo en el titular; el cuerpo nunca | Quitar `uppercase` del `h1` |
| **Pesos 300 / 800** | §8: "Títulos: 600–700" | Contraste tipográfico pedido por el cliente. Geist es variable, sale del mismo archivo | `font-light` / `font-extrabold` en `Hero.tsx` |
| **Degradado en la línea 1** | §8: "cero degradados" | Referencia Premier Cargo, pedido explícito. Acotado: la parada más oscura no baja de `--texto-sec` (7.5:1) | Quitar la clase `.titulo-degradado` |
| **Cápsula de vidrio en la palabra rotativa** | — | Resuelve el problema de layout: con ancho fijo, "SIEMPRE" no se mueve al cambiar la palabra | — |

## Video del hero

Fuente del cliente: 1920×1080, HEVC (`hvc1`), 5,04 s, 17,8 Mbps.

**HEVC no sirve para web**: Firefox no lo reproduce y Chrome solo con
decodificación por hardware en algunas plataformas. Se transcodifica con
`node scripts/video-hero.mjs`:

| Archivo | Formato | Peso | Para |
|---|---|---|---|
| `hero.mp4` | H.264 1920×1080, CRF 20 | 3,5 MB | Universal |
| `hero.webm` | VP9 1920×1080, CRF 32 | 1,7 MB | Chrome, Firefox, Edge |
| `hero-movil.mp4` | H.264 1280×720, CRF 23 | 1,2 MB | Bajo 768px |
| `hero-poster.jpg` | Primer fotograma | 144 KB | Cartel |

**Encuadre.** El video es 16:9 con `object-fit: cover` sobre un hero de alto
completo, así que en pantallas verticales se recorta a lo ancho. Medido con
`node scripts/video-encuadre.mjs`:

- 1920px o más de ancho: se ve el 100% del cuadro
- Laptop 1440×900: se ve el 90%
- iPad vertical: 42%
- **Teléfono: 26%** — solo se ve la zona central del cuadro

El scrim va **solo arriba y abajo**, nunca a los lados: oscurecer los costados
encajona el cuadro y le quita amplitud. La legibilidad del texto sobre el
video la sostienen ese scrim superior más `text-shadow` / `drop-shadow`, no un
oscurecido general del metraje.
