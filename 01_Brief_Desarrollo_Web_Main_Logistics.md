# BRIEF DE DESARROLLO WEB — MAIN LOGISTICS
## Documento de especificación para el equipo digital

**Versión:** 1.0
**Fecha:** 2 de septiembre de 2026
**Alcance:** sitio web público (mainlogistics.cl). No cubre TMS, torre de control ni portal interno.
**Stack actual detectado:** Next.js (App Router), i18n con ruta `/es`, imágenes vía `_next/image`, video hero `.webm`, despliegue Vercel.
**Estado del sitio actual:** publicado con contenido placeholder en producción. **Requiere intervención urgente antes de cualquier campaña comercial.**

---

# 0. CÓMO LEER ESTE DOCUMENTO

Este brief no es una lista de features. Es una especificación de **sistema comercial**. Cada decisión de diseño responde a una restricción real del mercado chileno de transporte de carga, documentada en la auditoría de mercado que acompaña a este documento.

Las secciones marcadas **[BLOQUEANTE]** deben ejecutarse antes de dirigir tráfico al sitio. Las marcadas **[FASE 1]**, **[FASE 2]** y **[FASE 3]** siguen la secuencia recomendada.

**Prioridad absoluta:** las tres correcciones de la sección 1. Todo lo demás es secundario mientras esas estén pendientes.

---

# 1. INTERVENCIÓN URGENTE — QUÉ ELIMINAR HOY [BLOQUEANTE]

El sitio está publicado con contenido de maqueta visible para cualquier visitante. Esto no es un detalle estético: es riesgo comercial, reputacional y legal.

## 1.1 Testimonios con texto de brief

**Ubicación:** sección "Lo que dicen nuestros clientes".

**Contenido actual en producción:**
> *"Acá va una cita concreta: un plazo que se cumplió con la planta parada, no una frase sobre calidad de servicio."*
> — NA · Nombre Apellido · Jefe de Logística · Empresa

Son seis testimonios, todos con el texto de instrucción del redactor visible, atribuidos a "Nombre Apellido · Empresa", y el carrusel los repite cuatro veces.

**Acción:** eliminar la sección completa. No reemplazar con testimonios inventados. Ver sección 6.4 para qué va en su lugar.

## 1.2 Logo wall de clientes no facturados

**Ubicación:** hero, bajo el título "Confían en nosotros".

**Contenido actual:** trece logos — Ultraport, Antucoya (Antofagasta Minerals), Unacem, Yamana Gold, Lhoist, Scan Global Logistics, Guanaco, Caemin, TGL Chile, Caleras San Juan, Reinvent, Cargo Services, Proquimin.

**Problema:** ninguna de esas empresas es cliente facturado de Main Logistics. El encabezado "Confían en nosotros" afirma una relación comercial inexistente. En un mercado donde los jefes de logística se consultan entre ellos antes de contratar a un proveedor desconocido, esto se descubre en la primera reunión. Además, usar marcas registradas de terceros para sugerir una relación comercial que no existe es exposición legal.

**Acción:** eliminar el bloque. Ver sección 6 para las tres fuentes de credibilidad que sí son legítimas y verificables.

## 1.3 Placeholders de imagen visibles

**Ubicación:** sección "Cada carga exige lo suyo" y sección "Permisos y certificaciones".

**Contenido actual:** el texto literal *"Foto pendiente"* seguido de la descripción del encuadre solicitado al fotógrafo (*"Plano abierto de la rampla cargada con mezcla de carga…"*, *"Camión de Main entrando a faena minera: portería, polvo, chaleco reflectante…"*).

**Acción:** reemplazar por imagen real o eliminar el bloque contenedor. Nunca publicar el brief de producción.

## 1.4 Datos legales sin completar

**Ubicación:** footer, columna "Contacto".

**Contenido actual:** "Razón social pendiente · RUT pendiente · Dirección pendiente · Teléfono pendiente".

**Acción:** completar con datos reales. Ver sección 6.1 — esto no es un trámite, es la señal de confianza número uno y ningún competidor chileno la entrega.

---

# 2. OBJETIVO COMERCIAL DEL SITIO

## 2.1 Qué debe lograr

El sitio tiene **dos embudos independientes** que compiten por espacio y deben coexistir sin diluirse:

| Embudo | Público | Objetivo | Métrica |
|---|---|---|---|
| **Demanda** | Dador de carga (jefe de logística, abastecimiento, contratista minero) | Solicitud de cotización calificada | Cotizaciones válidas/mes |
| **Capacidad** | Transportista con equipo propio | Registro de transportista en la red | Carriers homologados/mes |

El segundo embudo es tan importante como el primero: en un modelo asset-light **la capacidad es el producto**. Hoy el sitio no tiene una sola puerta para transportistas, y en un benchmark de diez operadores logísticos chilenos, **cero de diez** captan capacidad desde su web, aunque todos subcontratan. Es el canal de adquisición más desatendido del mercado.

## 2.2 Qué NO debe intentar lograr

- **No debe vender ocho tipos de carga.** Ver sección 3.3.
- **No debe competir por precio.** Ningún transportista B2B chileno publica tarifas; entrar por ahí es una carrera al fondo.
- **No debe prometer capacidades no acreditadas.** Cada promesa publicada es una promesa auditable por un cliente potencial.

## 2.3 Definición correcta de conversión

**Conversión no es formulario enviado. Es conversación iniciada con un lead calificado.**

Un sitio que convierte 15% en solicitudes que el equipo no puede atender ni calificar es peor que uno que convierte 4% en oportunidades reales. Con un equipo comercial pequeño, el filtro es parte del diseño, no un obstáculo.

**Métrica objetivo:** no "tasa de conversión" agregada, sino **cotizaciones con ruta, volumen y frecuencia identificables** por mes.

---

# 3. POSICIONAMIENTO Y MENSAJE

## 3.1 El problema del mensaje actual

El sitio dice hoy: *"Transporte de carga en todo Chile. Cualquier carga. Cualquier destino."*

Esa frase la puede decir Sotraser, que tiene más de 600 camiones y tres bases, o Nazar, que tiene 550 tractos y diez bases de Arica a Punta Arenas. Main Logistics no puede ganar esa frase, y al intentarlo se posiciona como una versión menor de ellos.

## 3.2 El posicionamiento recomendado

Main Logistics no es un transportista con menos camiones. Es una categoría distinta, y conviene decirlo:

> **Usted contrata a uno. Nosotros respondemos por los cuarenta.**

Main coordina capacidad verificada de terceros y asume frente al cliente la responsabilidad, la homologación, la documentación y la trazabilidad de una flota que el cliente no quiere ni puede auditar.

**Por qué este ángulo funciona:**

1. **Es legalmente exacto.** El artículo 168 del Código de Comercio establece que quien se obliga a conducir y encarga la conducción a un tercero conserva su carácter de porteador frente al cargador. Main responde por sus subcontratistas quiera o no. Convertir esa obligación en propuesta de valor es honesto y diferenciador.

2. **Ataca un dolor real y no atendido.** La Ley 20.123 hace al dador de carga solidariamente responsable de las obligaciones laborales y previsionales de sus contratistas, y esa responsabilidad solo baja a subsidiaria si ejerce efectivamente los derechos de información y retención. Ningún competidor chileno aborda esto en su web.

3. **Es terreno donde el asset-light gana.** Quien tiene camiones propios no tiene ese problema que resolver, y por lo tanto no puede vender la solución.

## 3.3 Reducción de la promesa [BLOQUEANTE]

**Problema detectado:** el sitio actual presenta **dos taxonomías de "ocho"** que no se cruzan entre sí:

| Ocho servicios (por equipo) | Ocho tipos de carga |
|---|---|
| Retiro de contenedores | General |
| Cama baja | Minera |
| Ramplas planas | Peligrosa |
| Camiones pequeños | Refrigerada |
| Bateas | Forestal |
| Silos | Contenedores |
| Carga BESS | Maquinaria |
| Desconsolidado y almacenaje | Sobredimensionada |

No son el mismo eje. La carga refrigerada no tiene equipo reefer en la lista de servicios; BESS no aparece entre los tipos de carga; forestal no tiene equipo asociado. El visitante tiene que traducir mentalmente entre dos listas incompletas.

**Además, dos servicios deben salir de la oferta inicial:**

- **Última milla** ("camiones pequeños · distribución ágil y entregas de última milla"). Es el único segmento del transporte chileno con un incumbente dominante: Blue Express tiene entre 30% y 40% de participación según la Fiscalía Nacional Económica, con Copec detrás. Es la peor pelea disponible y contradice el mensaje de carga pesada B2B.
- **Desconsolidado y almacenaje.** Mueve a Main de coordinador de transporte a operador logístico integral, sin infraestructura ni historial. Aumenta la superficie de promesa sin aumentar la capacidad de cumplirla.

**Acción:** unificar en **una sola taxonomía** —recomendada: por tipo de carga, que es el lenguaje del comprador— y reducirla a **tres servicios ancla** más un cuarto de nicho. Ver sección 4.

---

# 4. TARGETS Y ARQUITECTURA DE AUDIENCIA

La elección de targets vale más que todo el diseño junto. Estos cuatro salen de la auditoría de mercado y de la capacidad real disponible vía la alianza operacional.

## 4.1 Target primario A — Contratistas y proveedores mineros (Antofagasta / Calama / Mejillones)

**Quién es:** jefe de logística o administrador de contrato de una empresa contratista o proveedora de faena. **No el mandante minero** — esa puerta exige tres años de estados financieros y homologación previa.

**Su dolor:** continuidad de abastecimiento. Si el insumo no llega, la faena se detiene y él responde. Necesita capacidad disponible en ventana, con documentación al día y transportista habilitado para entrar a portería.

**Por qué Main puede ganarlo:** la región concentra unos USD 40.734 millones de cartera minera 2025–2034, y existe un déficit estructural de ácido sulfúrico de 2,88 Mt en 2026 que sostiene demanda de insumos en todo el corredor. Hay presencia operacional en la zona vía la alianza.

**Mensaje:** *"Capacidad homologada, en ventana, con la documentación revisada antes de que el camión salga."*

## 4.2 Target primario B — Importadores y agentes de aduana (San Antonio / Valparaíso → RM)

**Quién es:** jefe de importaciones, agente de aduana, forwarder o coordinador de centro de distribución.

**Su dolor:** demurrage y detention. Cada día que el contenedor no se retira cuesta dinero, y la congestión portuaria es estructural — no habrá capacidad vial nueva en el corredor Santiago–San Antonio antes de ~2032 ni capacidad portuaria nueva antes de ~2036.

**Por qué es el mejor punto de entrada:** ciclo corto, decisión rápida, riesgo bajo, alta frecuencia. **Es lo que genera historial facturable en 60 días** para poder vender lo demás.

**Mensaje:** *"Su contenedor retirado en ventana. Sin días de demurrage que explicar."*

## 4.3 Target primario C — Proyectos de energía y carga BESS

**Quién es:** coordinador de transporte o jefe de proyecto de un EPC o desarrollador de plantas solares y sistemas de almacenamiento.

**Su dolor:** carga de altísimo valor, frecuentemente sobredimensionada, con permisos MOP y ventanas críticas de obra. No existe un proveedor especializado que lo comunique en Chile.

**Por qué es el nicho más defendible:** mercado nuevo, sin incumbente establecido, cliente técnico que compra competencia y no precio. Y conecta directamente con la capacidad de camas bajas ya disponible.

**Acción de diseño:** BESS **merece una página propia**, no una tarjeta entre ocho. Es el activo de diferenciación más fuerte que hoy existe en el sitio y está enterrado.

## 4.4 Target secundario — El transportista

**Quién es:** dueño de una a diez unidades, o empresa de transporte pequeña con capacidad ociosa y necesidad de flujo de caja.

**Su dolor:** cobra a 60–90 días. Camión detenido es pérdida. Y no tiene forma de acceder a carga recurrente sin vendedor propio.

**Qué lo mueve — importante:** el gancho es **financiero, no tecnológico**. No le interesa la app; le interesa cuándo le pagan. Referencias de mercado: Carga Inteligente paga a 48 horas hábiles; Loadsmart publica factoring al 2,5% sin comisiones ocultas.

**Acción:** portal de transportistas con **plazo de pago publicado en el hero**. Ver sección 7.

## 4.5 Targets explícitamente descartados

| Descartado | Motivo |
|---|---|
| Última milla / e-commerce | Blue Express 30–40% con Copec detrás |
| Rollizo forestal al sur del Biobío | Sin cobertura de seguros disponible para pymes de la zona; 17 camiones quemados solo en Lumaco en mayo de 2026 |
| Refrigerada de exportación (año 1) | Una falla de cadena de frío no es un descuento: Sernapesca no autoriza la exportación. Pérdida total del valor |
| Mandantes mineros directos | Requisito de tres años de EEFF y certificación bancaria vía REGIC. Piso fáctico de 2–3 años de operación |

---

# 5. ARQUITECTURA DE INFORMACIÓN

## 5.1 El problema estructural actual

El sitio es **una sola página**. Todos los enlaces del menú y del footer son anclas internas (`#servicios`, `#cargas`, `#cobertura`, `#cumplimiento`, `#como-funciona`, `#clientes`, `#cotizar`).

Consecuencia: **no existe una sola URL indexable** por servicio, por tipo de carga ni por ruta. Todo el long tail de búsqueda queda fuera de alcance, y en Chile ese long tail está prácticamente libre —los operadores establecidos no producen contenido, y varios ni siquiera sirven HTML en sus dominios.

## 5.2 Sitemap objetivo

```
/                                    Home — selector de audiencia
│
├── /transporte-de-carga/            Hub de servicios
│   ├── /contenedores                [FASE 1] Retiro y devolución en puerto
│   ├── /carga-general               [FASE 1] Rampla plana, paletizada
│   ├── /insumos-mineros             [FASE 1] Faena, MRO, materiales
│   ├── /bess-y-energia              [FASE 1] ★ Página de nicho, alta prioridad
│   ├── /maquinaria-y-camabaja       [FASE 2]
│   ├── /graneles                    [FASE 2] Bateas y silos
│   └── /carga-peligrosa             [FASE 3] Solo con homologación acreditada
│
├── /rutas/                          Hub de corredores
│   ├── /santiago-antofagasta        [FASE 2]
│   ├── /santiago-calama             [FASE 2]
│   ├── /antofagasta-calama          [FASE 2]
│   ├── /san-antonio-santiago        [FASE 2]
│   ├── /valparaiso-santiago         [FASE 2]
│   ├── /santiago-concepcion         [FASE 2]
│   ├── /santiago-iquique            [FASE 3]
│   └── /santiago-puerto-montt       [FASE 3]
│
├── /industrias/                     Hub por vertical
│   ├── /mineria                     [FASE 1]
│   ├── /energia                     [FASE 1]
│   └── /comercio-exterior           [FASE 1]
│
├── /transportistas/                 ★ SEGUNDO EMBUDO [FASE 1]
│   ├── /requisitos                  Checklist documental
│   └── /registro                    Formulario de alta
│
├── /cumplimiento/                   [FASE 1] Credibilidad
│   ├── /resolucion-154              ★ Alta prioridad — ver 8.1
│   ├── /responsabilidad-solidaria   Ley 20.123, art. 183-C
│   └── /seguros-y-cobertura
│
├── /herramientas/                   [FASE 2] Imanes de captación
│   ├── /verificador-guia-despacho   ★ Ver 8.1
│   ├── /autoevaluacion-subcontratacion  Ver 8.2
│   └── /calculadora-volumen
│
├── /empresa/
│   ├── /quienes-somos               Estructura societaria real
│   ├── /red-de-transportistas       Cifras agregadas de la red
│   └── /contacto
│
├── /cotizar                         Cotizador completo
├── /legal/privacidad                Ley 19.628 y Ley 21.719
├── /legal/terminos
├── /robots.txt
├── /sitemap.xml
└── /llms.txt                        ★ Ver 9.5
```

## 5.3 Regla de navegación

El menú actual está organizado por el organigrama interno (Servicios / Empresa / Contacto). Es el patrón de todos los competidores chilenos y es el equivocado.

**Organizar el menú por el problema del visitante:**

```
Qué movemos  |  Rutas  |  Industrias  |  Cumplimiento  |  Transportistas  |  [Cotizar]
```

`Transportistas` va en el menú principal, no escondido en el footer. Es el 50% del negocio.

---

# 6. SISTEMA DE CREDIBILIDAD

Main no tiene historial operacional propio. La credibilidad no se escribe: **se transfiere desde donde sí existe**. Hay tres fuentes legítimas y ninguna está siendo usada.

## 6.1 Fuente 1 — Existencia legal verificable [BLOQUEANTE]

**Hallazgo del benchmark: cero de diez operadores logísticos chilenos publica su RUT.** Es lo primero que copia un jefe de abastecimiento para consultar en el SII antes de llamar. Es la mejora más barata y de mayor retorno de todo este documento.

**Especificación — footer de todas las páginas:**

```
Razón social:        [nombre legal completo]
RUT:                 [XX.XXX.XXX-X]
Domicilio comercial: [dirección completa, comuna, región]
Representante legal: [nombre]
Teléfono:            [fijo, no solo móvil]
Correo:              contacto@mainlogistics.cl
```

Agregar página `/empresa/quienes-somos` con constitución, giros inscritos y estructura societaria.

**Requisito técnico:** estos datos en **texto plano en el HTML**, no en imagen ni renderizados por JavaScript. Deben ser copiables y indexables.

## 6.2 Fuente 2 — La alianza operacional declarada

**Forma incorrecta:** presentar operaciones de la empresa aliada como casos propios de Main Logistics. Repite exactamente el error del logo wall actual.

**Forma correcta y considerablemente más potente:** declarar la alianza con nombre, RUT y datos verificables.

> **Operación respaldada por Transportes Yireh SpA**
> RUT 76.606.931-2 · Antofagasta · Operando desde 2016
> Base operativa en Antofagasta · Bodega en Alto Hospicio · Taller mecánico propio
> Flota: tractocamiones, ramplas planas, camas bajas, camiones livianos y grúas horquilla

Esto el comprador **lo verifica en el SII en treinta segundos**. Una prueba comprobable vale más que trece logos que no puede comprobar.

> ⚠️ **Requisito previo:** confirmar con la empresa aliada los datos exactos y obtener su autorización escrita para figurar. Los datos anteriores provienen de directorios públicos de terceros y **deben validarse con la fuente antes de publicarse**.

## 6.3 Fuente 3 — El respaldo tecnológico, en su lugar correcto

**Corrección importante sobre el footer actual.** Hoy dice *"Respaldo del grupo MainBrain"*. Main Brain es una empresa del rubro digital.

Un jefe de logística minero que lea eso va a buscar el nombre, va a encontrar una empresa de tecnología, y va a concluir que Main Logistics es un proyecto de gente de marketing sin experiencia en camiones. **En ese contexto, la mención resta credibilidad en vez de sumarla.**

**Acción:**
- El aval visible en el footer y en el hero debe ser la **operación de transporte**, no la tecnológica.
- Main Brain se menciona en `/empresa/quienes-somos` como accionista y proveedor de tecnología, con su rol explicado: *"la plataforma de trazabilidad y control documental de Main Logistics es desarrollo propio del grupo"*. Ahí suma, porque explica por qué un operador nuevo tiene mejor tecnología que los establecidos.

## 6.4 Sustitución de los testimonios: la Garantía Main

Los testimonios eliminados en 1.1 no se reemplazan con testimonios. Se reemplazan con **compromisos publicados y refutables** — el patrón funciona precisamente porque no requiere historial previo.

**Especificación del bloque "Nuestro compromiso":**

| Compromiso | Formulación pública |
|---|---|
| Respuesta | Toda cotización respondida en menos de 24 horas hábiles |
| Factibilidad | Si la ruta no calza con nuestra capacidad, se lo decimos ese mismo día |
| Documentación | La guía de despacho se emite completa antes de que el camión salga |
| Trazabilidad | Usted sabe dónde va su carga sin tener que llamar |
| Excepciones | Si algo se desvía, lo informamos antes de que usted pregunte |
| Verificación | Todo transportista de nuestra red pasa control documental el día del despacho |

Cada compromiso debe ser **concreto y verificable**. Un compromiso que no se puede incumplir no es un compromiso: es publicidad.

## 6.5 Cifras en texto plano — requisito técnico crítico

**Hallazgo del benchmark:** los contadores animados de Sotraser, Nazar y Agunsa devuelven `0` en el HTML servido. Sus cifras son **invisibles para Google y para los asistentes de IA**. Los dos únicos sitios cuyos números "existen" son los que los escriben en texto plano.

**Regla:** toda cifra de la que Main quiera ser encontrado —transportistas en red, equipos disponibles, rutas activas, años de la operación aliada— debe estar en el HTML como texto, con la animación aplicada sobre el valor final ya presente en el DOM.

**Nota:** el bloque de cobertura actual ("0km") sufre exactamente este problema.

---

# 7. SISTEMA DE CONVERSIÓN

## 7.1 Diagnóstico del cotizador actual

El cotizador de seis pasos (carga → ruta → cuándo → modalidad → requisitos → datos) es **bueno**: califica bien, pide el equipo, deja los datos personales al final y ofrece la salida "no estoy seguro, necesito asesoría". Es superior al de Nazar, el único competidor chileno con cotizador.

**Su problema no es el diseño. Es que es la única puerta.** Un visitante en frío no completa seis pasos, y hoy no hay alternativa: no hay WhatsApp visible, no hay teléfono publicado, no hay ejecutivo identificable.

## 7.2 Tres puertas según temperatura del visitante

### Puerta 1 — Fría: cotizador express [FASE 1]

**Ubicación:** hero de home y de cada página de ruta.
**Campos:** origen · destino · tipo de carga. Nada más.
**Tiempo objetivo:** menos de 20 segundos.
**Comportamiento:** al enviar, ofrece continuar con los detalles (pasa al flujo de seis pasos precargado) o recibir contacto directo.
**En páginas de ruta:** origen y destino vienen precargados.

### Puerta 2 — Tibia: cotizador completo [YA EXISTE]

El flujo actual de seis pasos, movido a `/cotizar` con URL propia.

**Mejoras requeridas:**
- Barra de progreso con porcentaje real
- Guardado de estado en `localStorage` para recuperar el formulario si el usuario abandona
- Confirmación con expectativa concreta: *"Recibirá respuesta antes de [fecha y hora calculadas: +24 h hábiles]"*, no un genérico "pronto"
- Correo de confirmación automático con resumen de lo solicitado

### Puerta 3 — Caliente: contacto humano directo [BLOQUEANTE]

**En Chile, WhatsApp es el canal B2B por defecto.** Está presente en Sotraser, Nazar, Loginsa, Blue Express y Rabie. Hoy Main no lo tiene.

**Especificación:**
- Botón flotante persistente, visible en todas las páginas
- Mensaje precargado con contexto de la página: *"Hola, estoy viendo la ruta Santiago–Antofagasta y necesito cotizar una carga"*
- Teléfono fijo publicado en el header
- **Ejecutivo comercial identificado con nombre, cargo y foto real.** El sitio ya promete "alguien con nombre del otro lado" — hay que hacerlo literal. Hay un asset `asesora.webp` sin uso aparente en el sitio actual.

## 7.3 Filtro de calificación

Siguiendo el patrón de Rabie (que exige RUT y giro para filtrar consultas domiciliarias): **el formulario debe pedir RUT de empresa**. Cumple dos funciones: filtra B2C y señaliza que Main es un proveedor B2B serio.

## 7.4 Embudo de transportistas [FASE 1]

Requiere su propio tratamiento completo, no un formulario de contacto.

**Página `/transportistas` — estructura:**

1. **Hero con el gancho financiero, no tecnológico.** El plazo de pago va en el titular. Ejemplo de estructura: *"Le pagamos en X días desde el POD. Sin esperar a que el cliente nos pague."*
2. **Qué ofrece Main al transportista:** carga recurrente en rutas definidas, pago en plazo publicado, sin costo de registro, documentación gestionada.
3. **Qué exige Main** — la lista completa y visible, porque la transparencia filtra:
   - Certificado de vigencia de la sociedad y RUT
   - Situación tributaria con giro coherente con transporte de carga
   - F30-1 mensual (obligaciones laborales y previsionales)
   - Póliza de responsabilidad civil y seguro de carga vigentes
   - Padrón vehicular, permiso de circulación y revisión técnica
   - SOAP vigente
   - Licencia clase A del conductor
   - GPS activo con acceso compartido
4. **Formulario de registro** con carga de documentos.
5. **Contador de la red en texto plano:** transportistas registrados, equipos disponibles, rutas cubiertas.

> ⚠️ **Nota legal para el equipo:** el flujo de registro y la relación con el transportista deben revisarse con abogado laboral antes de publicarse. El artículo 183-A inciso 2 de la Ley 20.123 establece que si el servicio se limita a intermediación de trabajadores, el empleador pasa a ser el dueño de la faena. El lenguaje del sitio **no debe sugerir que Main dirige el trabajo del conductor**. Ver documento general, sección de riesgos legales.

---

# 8. HERRAMIENTAS DIFERENCIADORAS

Ninguna de estas existe en el mercado chileno. Son imanes de leads calificados y, simultáneamente, prueba de competencia técnica.

## 8.1 Verificador de Resolución 154 del SII ★ MÁXIMA PRIORIDAD [FASE 1]

**El contexto que hace esto urgente:** desde el **1 de noviembre de 2026** —confirmado por la Resolución Exenta SII N°52 de abril de 2026, que postergó la vigencia de la Resolución 154 de noviembre de 2025— toda guía de despacho o factura que ampare traslado de bienes debe incluir:

- Origen y destino **efectivos**, con dirección y comuna
- **RUT del transportista**
- **Nombre completo y cédula de identidad del chofer**
- **Patente del vehículo y del carro** (remolque o semirremolque)
- Descripción precisa: cantidad, peso y/o volumen, precio unitario

Y una regla operacional dura: **una guía única por cada traslado y por cada vehículo**.

**Por qué es una oportunidad:** miles de operadores que hoy coordinan transporte por WhatsApp y planilla quedan fuera de norma en cuestión de semanas. Sanciones aplicables: artículos 97 N°10, 97 N°17 y 109 del Código Tributario.

**Especificación de la herramienta:**
- Formulario que replica los campos exigidos del DTE
- Validación de formato de RUT, patente y comuna
- Resultado: cumple / no cumple, con el detalle de qué falta y la referencia normativa
- Descarga de checklist en PDF
- CTA contextual: *"Main emite guías conformes desde el primer viaje"*

**Campos XML del DTE para referencia del equipo técnico:** `FchEmis`, `FchSalida`, `HraSalida`, `FchLlegada`, `IndTraslado`, `DirOrigen`, `CmnaOrigen`, `DirDest`, `CmnaDest`, `RUTTrans`, `RUTChofer`, `NombreChofer`, `Patente`, `PatenteCarro`, `NmbItem`, `DscItem`, `QtyItem`, `UnmdItem`, `PrcItem`.

**Valores de `IndTraslado`:** 1 venta · 2 ventas por efectuar · 3 consignaciones · 4 entrega gratuita · 5 traslados internos · 6 otros traslados no venta · 7 venta para exportación · 8 traslado para exportación.

> ⚠️ Antes de publicar, **validar el texto normativo con las fuentes oficiales**: `sii.cl/normativa_legislacion/resoluciones/2025/reso154.pdf` y `.../2026/reso52.pdf`. La herramienta orienta; no constituye asesoría tributaria, y debe llevar ese descargo.

## 8.2 Autoevaluación de riesgo de subcontratación [FASE 2]

**Concepto:** un cuestionario breve dirigido al dador de carga sobre su exposición bajo la Ley 20.123.

Preguntas del tipo: *¿Su transportista le entrega el F30-1 cada mes antes de que usted pague la factura? ¿Tiene registro escrito de haberlo requerido? ¿Su contrato contempla retención de pago si no acredita?*

**Por qué funciona:** educar sobre la responsabilidad solidaria **crea la necesidad que Main resuelve**. Es venta consultiva pura y en Chile nadie la está haciendo. Quien completa el cuestionario es, por definición, alguien que contrata transporte.

**Base normativa a citar:** artículos 183-B (responsabilidad solidaria), 183-C (derechos de información y retención) y 183-D (degradación a subsidiaria) de la Ley 20.123.

## 8.3 Calculadora de volumen y equipo [FASE 2]

Convierte dimensiones y peso en recomendación de equipo (rampla plana, sider, cama baja, batea, silo, portacontenedor) y estimación de unidades necesarias.

Resuelve una duda real y frecuente, y alimenta el cotizador con datos ya estructurados.

## 8.4 Lo que NO se debe construir todavía

- **Cotizador con precio automático.** Sin Price Book propio, cualquier precio publicado es inventado. Cuando exista el histórico, la versión correcta devuelve un **rango honesto**, no un valor cerrado.
- **Portal de cliente con tracking en vivo.** El sitio hoy lo anuncia como "en desarrollo". Anunciar producto inexistente resta. **Retirar el anuncio** hasta que exista, y mientras tanto mostrar una demo navegable con un embarque de ejemplo — nadie en el benchmark chileno muestra su plataforma, todos la describen en prosa.

---

# 9. SEO Y DESCUBRIMIENTO

## 9.1 Lo que realmente busca el mercado chileno

Evidencia directa del autocompletado de Google con localización chilena:

**El término genérico está saturado por resultados no chilenos.** `empresa de transporte de carga` devuelve sugerencias de Perú y Colombia. **No pelear ese head term.**

**Donde sí vive la intención chilena:**

| Patrón | Ejemplos reales de autocompletado |
|---|---|
| Origen–destino | `transporte de carga santiago a punta arenas`, `santiago arica`, `santiago a antofagasta`, `santiago a puerto montt`, `santiago a coyhaique`, `santiago a iquique`, `santiago a concepcion`, `santiago temuco` |
| Nacionalizado | `empresas de transporte de carga terrestre en chile`, `principales empresas de transporte de carga en chile` |
| Transaccional | `cotizar flete online`, `flete de carga precio` |
| Por equipo | `camión cama baja arriendo`, `camión cama baja dimensiones` |
| Por carga | **`transporte de carga peligrosa chile`** — el nicho con mejor relación intención/competencia detectado |

## 9.2 Arquitectura de contenido

**Páginas de ruta** — la oportunidad más clara. Cada una debe contener:
- Distancia y tiempo de tránsito realista
- Equipos disponibles para esa ruta
- Restricciones conocidas (pasos, horarios, pesaje)
- Cotizador precargado con ese origen–destino
- Preguntas frecuentes específicas de la ruta

**Páginas de equipo:** cama baja (incluir la variante `arriendo`), rampla plana, sider, batea, silo, portacontenedor.

**Contenido de utilidad que ningún competidor produce.** Todos publican solo noticias corporativas de aniversarios e inauguraciones. Temas con demanda real:
- Qué exige la Resolución 154 del SII y cómo prepararse
- Cómo calcular m³ contra tonelaje
- Permisos de circulación para carga sobredimensionada: el proceso SPSI del MOP paso a paso
- Qué documentos exige el DS 298 para carga peligrosa
- Checklist de documentos para acreditación en faena minera
- Responsabilidad solidaria: qué debe exigirle a su transportista

## 9.3 Requisitos técnicos de indexación

- **SSR o SSG obligatorio** en todo el contenido comercial. Next.js lo permite; hoy hay contenido crítico que no llega al HTML servido.
- Metadatos únicos por página (`title`, `description`, canonical, Open Graph)
- Schema.org: `Organization`, `LocalBusiness`, `Service`, `FAQPage`, `BreadcrumbList`
- `sitemap.xml` generado dinámicamente
- Core Web Vitals: el video hero `.webm` debe cargar diferido y no bloquear el LCP
- Estructura `/es` ya presente: mantener `hreflang` correcto si se agrega inglés

## 9.4 Corrección de un error de indexación actual

Los logos de clientes y certificaciones tienen atributos `alt` genéricos o vacíos. En el benchmark, Nazar tiene los suyos como *"Propiedad 1=Variante2"* — ilegibles para buscadores y para asistentes de IA.

**Regla:** todo `alt` debe describir el contenido real. En certificaciones, incluir norma, alcance y organismo certificador.

## 9.5 `llms.txt` en la raíz

Archivo de texto en `/llms.txt` que describe la empresa, servicios, cobertura y datos de contacto en formato legible por modelos de lenguaje.

**Por qué importa:** determina si un asistente de IA cita a Main cuando alguien pregunta quién transporta carga peligrosa o insumos mineros en Chile. KLog.co ya lo publica; **ningún transportista chileno lo hace**. Costo de implementación: prácticamente cero.

---

# 10. REQUISITOS TÉCNICOS Y DE MEDICIÓN

## 10.1 Analítica mínima

| Evento | Qué mide |
|---|---|
| `quote_express_start` / `quote_express_submit` | Puerta fría |
| `quote_full_step_1..6` | Abandono por paso del cotizador |
| `quote_full_submit` | Conversión completa |
| `whatsapp_click` | Puerta caliente, con página de origen |
| `carrier_register_start` / `submit` | Embudo de capacidad |
| `tool_res154_complete` | Uso del verificador |
| `phone_click` | Contacto directo |

**Dashboard semanal:** cotizaciones calificadas, transportistas registrados, abandono por paso, fuente de tráfico por conversión.

## 10.2 Rendimiento y accesibilidad

- LCP < 2,5 s en 4G móvil
- El sitio se consulta desde faena y desde cabina: **probar en conexión lenta y pantalla pequeña**
- Contraste AA mínimo; el tema oscuro actual debe validarse
- Formularios operables con teclado y compatibles con lector de pantalla

## 10.3 Legal y privacidad [BLOQUEANTE]

- Política de privacidad **funcional** citando la Ley 19.628 y sus modificaciones por la **Ley 21.719**. En el benchmark, Agunsa y Loginsa tienen estos enlaces muertos en producción.
- Términos y condiciones de uso
- Banner de cookies con opción de rechazo real
- Consentimiento explícito en formularios sobre tratamiento de datos
- Canal de denuncias con mención a la **Ley 20.393** — Nazar lo hace bien y es un diferenciador de compliance

---

# 11. SECUENCIA DE EJECUCIÓN

## Fase 0 — Esta semana [BLOQUEANTE]

1. Eliminar testimonios placeholder
2. Eliminar logo wall de clientes no facturados
3. Eliminar o reemplazar los bloques "Foto pendiente"
4. Completar datos legales en el footer
5. Retirar el anuncio del portal "en desarrollo"
6. Publicar WhatsApp y teléfono
7. Corregir el bloque de cobertura que muestra "0km"

**Criterio de salida:** el sitio no contiene ninguna afirmación que no sea verdadera y verificable.

## Fase 1 — Semanas 2 a 6

1. Migración de una página a arquitectura multipágina con SSR
2. Reducción de la oferta a tres servicios ancla más BESS
3. Páginas de servicio (4) y de industria (3)
4. Portal de transportistas completo con formulario de registro
5. Cotizador express en el hero
6. Cotizador completo migrado a `/cotizar` con guardado de estado
7. Bloque de compromisos en reemplazo de los testimonios
8. Alianza operacional declarada, con autorización previa
9. Política de privacidad y términos funcionales
10. `llms.txt` y `sitemap.xml`

## Fase 2 — Semanas 7 a 14

1. Verificador de Resolución 154 — **adelantar si es posible: la vigencia es el 1 de noviembre**
2. Páginas de ruta (6 corredores prioritarios)
3. Autoevaluación de riesgo de subcontratación
4. Calculadora de volumen y equipo
5. Primeros contenidos de utilidad (4 artículos)
6. Página de certificaciones, a medida que se obtengan
7. Demo navegable de trazabilidad

## Fase 3 — Mes 4 en adelante

1. Casos de éxito reales con métricas — **uno solo supera a todo el benchmark chileno**
2. Cotizador con rango de precio, una vez que exista Price Book
3. Portal de cliente con tracking real
4. Páginas de ruta adicionales según corredores validados
5. Versión en inglés, si el comercio exterior lo justifica

---

# 12. CRITERIOS DE ACEPTACIÓN

El sitio está listo para recibir inversión en tráfico cuando:

- [ ] No existe una sola afirmación no verificable en producción
- [ ] RUT y razón social son visibles y copiables en el footer de todas las páginas
- [ ] Existen al menos tres puertas de contacto de distinta profundidad
- [ ] WhatsApp responde en horario hábil con una persona identificada
- [ ] El embudo de transportistas está operativo y con plazo de pago publicado
- [ ] Todas las cifras publicadas están en el HTML como texto plano
- [ ] Cada servicio y cada industria tiene URL propia indexable
- [ ] Política de privacidad y términos son funcionales y citan la Ley 21.719
- [ ] La analítica registra los eventos de la sección 10.1
- [ ] Un abogado revisó el lenguaje del portal de transportistas

---

# ANEXO A — TONO Y VOZ

**Mantener del sitio actual:**
- Tratamiento de usted
- Frases cortas y afirmativas
- Especificidad operacional ("la documentación se emite antes de que el camión salga")
- La honestidad de "si su ruta no nos calza, se lo decimos" — es la línea más creíble del sitio

**Evitar:**
- Superlativos sin respaldo ("líderes", "los mejores", "excelencia")
- Cobertura total sin capacidad demostrable
- Jerga logística en inglés hacia el cliente (el equipo la usa internamente; el cliente chileno no)
- Cualquier afirmación que no se pueda auditar

**Regla editorial:** antes de publicar cualquier frase, preguntar *"si un cliente me pide que demuestre esto mañana, ¿puedo?"*. Si la respuesta es no, no se publica.

---

# ANEXO B — REFERENCIAS DE BENCHMARK

| Sitio | Qué copiar |
|---|---|
| transportesnazar.com | Cotizador estructurado; bloque de compliance con Manual de Prevención de Delitos y canal de denuncias Ley 20.393 |
| loginsa.com | Transparencia operativa: cifras por centro, en texto plano |
| bsf.cl | Cotizadores segmentados que educan mientras capturan |
| blue.cl | Embudo B2B escalonado por volumen; buscador en el hero |
| rabie.cl | Formulario que exige RUT y giro para filtrar B2C |
| uberfreight.com | Cotizador público e indexable |
| loadsmart.com | Gancho financiero al transportista: factoring y plazo publicados |
| shippeo.com | SLA publicados como sustituto de prueba social |
| klog.co | `llms.txt` |

**Qué NO copiar de los competidores chilenos:** contadores animados que devuelven `0` en el HTML, menús organizados por organigrama interno, logos de certificación con `alt` genérico, y la ausencia total de casos de éxito.

---

**FIN — BRIEF DE DESARROLLO WEB v1.0**
