# Product

## Register

brand

## Users

Gerentes y jefes de logística, abastecimiento y operaciones en empresas chilenas que mueven volumen y no pueden permitirse fallar. Perfil conservador: licitan, auditan y compran confiabilidad, no entusiasmo. Lo que compran realmente es la certeza de no tener que explicar un incumplimiento en una reunión.

Sectores: minería (homologación de faena, control de fatiga, continuidad de abastecimiento), retail y consumo masivo (ventanas horarias, quiebres de stock), industria y manufactura (insumos regulados, maquinaria), agroexportación y salmonicultura (cadena de frío, temporada, protocolos fitosanitarios), forestal (volumen, rutas rurales), farmacéutica y alto valor (seguridad, trazabilidad, temperatura).

**Contexto de uso:** el sitio se navega en dos situaciones opuestas y ambas mandan. En oficina, durante una evaluación de proveedores, comparando contra la competencia. Y en terreno, en un teléfono, con sol directo. Mobile es el caso principal, no la adaptación.

## Product Purpose

One-page de Fase 1 para Main Logistics, empresa de transporte de carga por carretera en Chile con cobertura de Arica a Punta Arenas y respaldo del grupo MainBrain. Mueve carga general, minera, peligrosa, refrigerada, forestal, contenedores, maquinaria y sobredimensionada.

No es un sitio para ser encontrado: en Fase 1 se comparte por WhatsApp, correo y reuniones. Es la pieza que se abre después de una conversación, y su trabajo es que la conversación siga. Cada sección se escribe como el resumen de lo que en Fase 2 se convierte en su propia URL, sin rediseñar nada.

**Éxito:** que un jefe de logística que nunca oyó el nombre lo abra, y en menos de un minuto llegue a las tres reacciones, en este orden:

1. "Estos están más avanzados que el resto." → tecnología
2. "Y son una empresa seria, no un invento." → presencia
3. "Pueden con cualquier carga que les mande." → versatilidad

## Brand Personality

**Técnico · directo · seguro.** Sin adornos.

Frases cortas, verbos activos, sujeto claro. Específico antes que impresionante: "rampla plana 3 ejes" pesa más que "soluciones integrales". Los números se dicen, no se adornan; si no hay número real, no se inventa uno. Se le habla de usted.

La emoción a producir no es entusiasmo: es **alivio anticipado**. La sensación de que esto ya está resuelto y no va a ser su problema.

**Prohibido en la voz:** lenguaje startup ("revolucionamos", "disrupción", "sinergia", "partner estratégico") y superlativos vacíos ("líderes", "los mejores", "excelencia").

## Anti-references

**Las cuatro cosas que no debe parecer**, en orden de riesgo:

1. **Extranjera recién llegada.** El riesgo más real: el nombre está en inglés y no ancla ni al rubro ni al país. Todo lo visual debe empujar en contra — mapa de Chile, señales de terreno chileno, datos legales visibles, dominio `.cl`.
2. **Startup liviana / cripto.** Glow, degradados neón, bloom, morado emitiendo luz. Es el límite exacto entre "serio y moderno" y "startup de cripto".
3. **Fletero.** Nunca usar "flete" como término principal: mezcla mudanzas y B2C y diluye el posicionamiento.
4. **Empresa antigua sin tecnología.** El fondo oscuro y la precisión existen para matar esto.

**Anti-referencias visuales concretas:**

- Landing de logística modal: foto de camión al atardecer, degradado azul, "soluciones integrales", tres tarjetas idénticas con ícono redondeado arriba. Es exactamente lo que hace la competencia.
- Editorial-tipográfico (serif display en itálica + etiquetas mono + filetes + monocromo). Lane saturado y además register equivocado: esto no es una revista.
- Fotos de stock y rostros de banco de imágenes. El rubro las detecta al segundo.
- Dashboard operando que no existe todavía. Si se muestra, va rotulado "en desarrollo".
- Camión pintado con el logo si no hay flota propia: implica activos que no están.

## Design Principles

1. **El dato es la decoración.** La credibilidad no viene de adjetivos ni de ilustraciones: viene de patentes, folios, tonelajes, normativas y códigos de ruta puestos en Geist Mono, donde se leen como registro verificable y no como marketing. Es la decisión que más credibilidad aporta por menos esfuerzo. Si un bloque necesita un adorno, probablemente le falta un dato.

2. **La carretera es el único ornamento.** El isotipo es una carretera en perspectiva con punto de fuga. Ese motivo —líneas que convergen, segmentada que avanza, profundidad real— es el sistema decorativo completo. No se agregan formas abstractas, blobs ni partículas: si algo se mueve en pantalla, se mueve porque una ruta avanza.

3. **Anclar a Chile en cada oportunidad.** Cada vez que exista la opción entre lo genérico y lo chileno, gana lo chileno: Arica y Punta Arenas antes que "cobertura nacional", SICEP y DS 298 antes que "cumplimiento normativo", el mapa del país antes que un globo terráqueo. Es la defensa activa contra el riesgo número uno.

4. **Vidrio como instrumento, no como decoración.** El liquid glass aparece donde algo flota de verdad sobre otra cosa: la barra de navegación, una tarjeta sobre una imagen, un overlay. Vidrio neutro que toma prestado el color del fondo, nunca vidrio que emite morado. En todo lo demás, la profundidad viene de niveles de superficie y sombra.

5. **No prometer lo que no se puede auditar.** Con este comprador una afirmación que no se sostiene no genera una queja: genera que lo saquen de la lista de proveedores. Ninguna cifra, certificación ni capacidad entra al sitio sin confirmación. Ante la duda, la afirmación se baja o se rotula.

## Accessibility & Inclusion

**WCAG 2.2 AA como piso, no como aspiración.** El contexto de uso lo exige más que la norma: el sitio se lee en un teléfono a pleno sol, en terreno.

- Cuerpo de texto ≥ 4.5:1 contra su superficie; títulos grandes ≥ 3:1. El texto secundario `--texto-sec` se verifica contra cada nivel de superficie donde aparece, no solo contra el fondo base.
- Tamaño mínimo de texto y contraste alto **no son negociables** y no se sacrifican por estética.
- La sección de formulario se invierte a fondo claro a propósito: campos oscuros con placeholder gris son incómodos, y es la conversión.
- El estado no se comunica solo por color. Los chips de verificación de transportistas llevan punto **y** texto; los estados de documentación llevan forma o etiqueta además del semáforo.
- `prefers-reduced-motion` con alternativa real en cada animación: el titular rotativo se detiene en su estado final, los reveals se vuelven inmediatos, la carretera deja de avanzar.
- Objetivos táctiles ≥ 44px. El CTA fijo y el botón de WhatsApp se mantienen fuera del área del pulgar donde tapan contenido.
- Verificar tildes, ñ y signos `¿ ¡` en todos los pesos tipográficos antes de cerrar.
