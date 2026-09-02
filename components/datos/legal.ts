import { CORREO, TELEFONO } from "./contacto";

/**
 * Los dos documentos legales del sitio.
 *
 * ── Por qué viven acá y no en `mensajes/` ────────────────────────────────
 *
 * Todo el texto visible del sitio pasa por el diccionario y existe en los
 * cuatro idiomas. Estos dos documentos no, a propósito.
 *
 * Un texto legal traducido cuatro veces son cuatro textos que pueden
 * divergir, y la divergencia acá no es un matiz de estilo: es una promesa
 * distinta en cada idioma sobre qué se hace con los datos de una persona.
 * La práctica corriente es publicar la versión que rige y decir cuál es.
 * Esta rige en español, y cada página lo dice arriba en el idioma del
 * lector, con esa línea sí traducida.
 *
 * Además, meter dos documentos largos al diccionario los mandaría enteros
 * al RSC payload de cualquier página que cargue `Mensajes`, incluida la
 * home. Ya pasó dos veces en este proyecto: con los encargos de foto y con
 * la franja de reseñas.
 *
 * ── Lo que falta ─────────────────────────────────────────────────────────
 *
 * El responsable del tratamiento se identifica hoy por nombre de fantasía y
 * canal de contacto. Faltan razón social, RUT y domicilio, que el cliente
 * dejó fuera por ahora. Sin esos tres datos el documento es honesto pero no
 * está legalmente completo: la ley pide identificar al responsable. Es lo
 * primero que hay que agregar cuando lleguen.
 *
 * Tampoco hay canal de denuncias de Ley 20.393, que el brief §10.3 pide.
 * Un canal de denuncias que desemboca en la casilla comercial es peor que
 * no tenerlo: quien denuncia necesita saber que no lo lee el área
 * involucrada. Requiere que Main designe quién lo recibe.
 */

export type Bloque =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "lista"; puntos: string[] }
  | { tipo: "definiciones"; filas: [string, string][] };

export type Seccion = { titulo: string; bloques: Bloque[] };

export type DocumentoLegal = {
  titulo: string;
  bajada: string;
  /** ISO, para el `<time>`. Se muestra formateado en el idioma del lector. */
  actualizado: string;
  secciones: Seccion[];
};

/**
 * La Ley 21.719 se publicó el 13 de diciembre de 2024 y entra en vigencia el
 * 1 de diciembre de 2026. Hasta esa fecha rige la Ley 19.628. El documento se
 * escribió ya con la ley nueva porque falta menos de un trimestre y
 * reescribirlo después sería trabajo repetido. Las dos se citan.
 */
export const VIGENCIA_21719 = "1 de diciembre de 2026";

export const PRIVACIDAD: DocumentoLegal = {
  titulo: "Política de privacidad",
  bajada:
    "Qué datos suyos recogemos en este sitio, para qué los usamos y cómo pedirnos que los borremos.",
  actualizado: "2026-09-02",
  secciones: [
    {
      titulo: "Quién trata sus datos",
      bloques: [
        {
          tipo: "parrafo",
          texto: `Main Logistics, empresa de transporte terrestre de carga con operación en Chile, es responsable del tratamiento de los datos personales que usted entregue en este sitio. Para cualquier asunto relacionado con esta política puede escribir a ${CORREO} o llamar al ${TELEFONO}.`,
        },
        {
          tipo: "parrafo",
          texto: `Esta política se rige por la Ley 19.628 sobre protección de la vida privada y por la Ley 21.719, que la reemplaza y entra en vigencia el ${VIGENCIA_21719}. El documento ya está escrito según la ley nueva.`,
        },
      ],
    },
    {
      titulo: "Qué datos recogemos",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Solo los que usted escribe en el formulario de cotización o en el de transportistas. No hay ningún otro punto del sitio que recoja datos suyos.",
        },
        {
          tipo: "definiciones",
          filas: [
            [
              "Formulario de cotización",
              "Empresa, nombre, correo y teléfono, más los datos de la carga: tipo, ruta, fecha, modalidad, requisitos y rango de valor.",
            ],
            [
              "Formulario de transportistas",
              "Los mismos datos de contacto, más la información de su flota y de sus documentos vigentes.",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "No pedimos RUT, ni datos bancarios, ni datos de tarjeta. No pedimos datos sensibles en el sentido de la ley: nada de salud, origen étnico, afiliación política o sindical, creencias, vida sexual ni datos biométricos. Si usted los escribe por su cuenta en el campo de comentarios, los borramos.",
        },
      ],
    },
    {
      titulo: "Para qué los usamos",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Para responderle. Un formulario de cotización llega a nuestra casilla comercial y se usa para preparar la respuesta, hacerle las preguntas que falten y, si el servicio se concreta, ejecutarlo.",
        },
        {
          tipo: "parrafo",
          texto:
            "No lo usamos para nada más. No enviamos publicidad ni boletines. No vendemos, arrendamos ni cedemos sus datos a terceros con fines comerciales. Si alguna vez quisiéramos escribirle por algo distinto de su consulta, se lo pediríamos aparte, y usted podría decir que no sin perder el servicio.",
        },
      ],
    },
    {
      titulo: "Con qué permiso",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Con dos bases legales, según el caso. Enviar el formulario es un acto suyo, voluntario y específico, y ese es su consentimiento para que le respondamos. Y cuando lo que usted pide es una cotización, el tratamiento también es necesario para tomar medidas precontractuales a solicitud del titular.",
        },
        {
          tipo: "parrafo",
          texto:
            "Puede retirar el consentimiento cuando quiera, escribiéndonos. Retirarlo no afecta lo que hicimos antes de que lo retirara.",
        },
      ],
    },
    {
      titulo: "Quién más los ve",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Dos proveedores, y ninguno de los dos los usa para lo suyo. Ambos están fuera de Chile, así que hay transferencia internacional de datos y usted tiene derecho a saberlo.",
        },
        {
          tipo: "definiciones",
          filas: [
            [
              "Vercel",
              "Aloja el sitio. Servidores en Estados Unidos. Procesa el formulario en tránsito, sin guardar su contenido.",
            ],
            [
              "Resend",
              "Entrega a nuestra casilla el correo con su solicitud. Servidores en Estados Unidos.",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Fuera de eso, sus datos los ve el equipo comercial de Main Logistics y nadie más. Los entregaríamos a una autoridad solo si una ley o una resolución judicial nos obliga.",
        },
      ],
    },
    {
      titulo: "Cuánto tiempo los guardamos",
      bloques: [
        {
          tipo: "definiciones",
          filas: [
            [
              "Consulta que no llegó a contrato",
              "Doce meses desde el último contacto. Después se elimina.",
            ],
            [
              "Consulta que sí llegó a contrato",
              "Lo que dure la relación comercial, más los plazos tributarios y de prescripción que la ley chilena nos obliga a cubrir.",
            ],
            [
              "Borrador del formulario",
              "Vive en su navegador, no en nuestros servidores. Ver la sección de cookies.",
            ],
          ],
        },
      ],
    },
    {
      titulo: "Sus derechos",
      bloques: [
        { tipo: "parrafo", texto: "Sobre sus datos usted puede pedirnos:" },
        {
          tipo: "definiciones",
          filas: [
            ["Acceso", "Que le digamos qué datos suyos tenemos y de dónde salieron."],
            ["Rectificación", "Que corrijamos lo que esté equivocado o incompleto."],
            ["Supresión", "Que los borremos."],
            ["Oposición", "Que dejemos de tratarlos, en los casos que la ley permite."],
            [
              "Portabilidad",
              "Que se los entreguemos en un formato que pueda llevarse a otra parte.",
            ],
            ["Bloqueo", "Que los suspendamos mientras se resuelve una discrepancia."],
          ],
        },
        {
          tipo: "parrafo",
          texto: `Se ejercen escribiendo a ${CORREO} desde la misma dirección con la que nos contactó, o adjuntando algo que acredite que es usted. Respondemos dentro de treinta días corridos. Es gratis, y no le pedimos que explique para qué.`,
        },
        {
          tipo: "parrafo",
          texto:
            "Si no le respondemos, o la respuesta no le parece, puede reclamar ante la Agencia de Protección de Datos Personales, el organismo que crea la Ley 21.719.",
        },
      ],
    },
    {
      titulo: "Cookies y datos en su navegador",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Este sitio no tiene analítica, ni píxeles de publicidad, ni cookies de terceros. Nadie lo sigue desde acá hacia otro sitio. Por eso tampoco hay banner de cookies: no habría nada que consentir.",
        },
        { tipo: "parrafo", texto: "Lo único que se guarda en su navegador es esto:" },
        {
          tipo: "definiciones",
          filas: [
            [
              "ml-idioma",
              "Una cookie con el idioma que usted eligió, para no volver a preguntárselo. Dura un año y se crea solo si usa el selector.",
            ],
            [
              "Borrador de cotización",
              "Si empieza el formulario y se va, lo escrito queda en el almacenamiento local de su navegador para que pueda retomarlo. No sale de su equipo hasta que usted aprieta enviar, y el botón de descartar lo borra.",
            ],
          ],
        },
        {
          tipo: "parrafo",
          texto:
            "Ambos los puede borrar desde la configuración de su navegador. El sitio funciona igual sin ellos.",
        },
      ],
    },
    {
      titulo: "Seguridad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "El sitio viaja cifrado con HTTPS y el correo con su solicitud sale por un canal autenticado. El acceso a la casilla que los recibe está limitado al equipo comercial.",
        },
        {
          tipo: "parrafo",
          texto:
            "Ningún sistema es infalible. Si ocurriera una vulneración que afecte sus datos, se lo informamos a usted y a la autoridad, como manda la ley.",
        },
      ],
    },
    {
      titulo: "Menores de edad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Este sitio se dirige a empresas y no está pensado para menores de catorce años. No recogemos sus datos a sabiendas. Si detectamos que llegaron, los borramos.",
        },
      ],
    },
    {
      titulo: "Cambios a esta política",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Si cambia, cambia la fecha de arriba. Cuando el cambio afecte para qué usamos sus datos, se lo avisamos por correo antes de aplicarlo, no después.",
        },
      ],
    },
  ],
};

export const TERMINOS: DocumentoLegal = {
  titulo: "Términos de uso",
  bajada:
    "Las reglas de este sitio web. No son las condiciones del servicio de transporte: esas van en el contrato.",
  actualizado: "2026-09-02",
  secciones: [
    {
      titulo: "Qué es este sitio",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Un sitio informativo de Main Logistics. Describe lo que hacemos y ofrece dos formularios: uno para pedir una cotización y otro para transportistas que quieran trabajar con nosotros. Usarlo implica aceptar estos términos.",
        },
      ],
    },
    {
      titulo: "Lo que dice el sitio no es una oferta",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Los servicios, coberturas, tipos de carga y equipos que aparecen acá son información comercial, no una oferta vinculante. Que una ruta figure en el mapa no significa que tengamos capacidad para ella la semana que usted la necesita.",
        },
        {
          tipo: "parrafo",
          texto:
            "Enviar el formulario tampoco cierra nada. Es una solicitud: nosotros respondemos con una cotización, y esa cotización tiene su propia vigencia y sus propias condiciones. El servicio se rige por el contrato de transporte y la carta de porte que se firmen después, y esos documentos mandan por sobre cualquier cosa escrita en esta página.",
        },
      ],
    },
    {
      titulo: "Cómo se usa",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Con la información completa y verdadera, que es lo que permite cotizar bien. Un tonelaje o una dimensión mal declarados cambian el equipo, el permiso y el precio.",
        },
        { tipo: "parrafo", texto: "Y sin hacer esto:" },
        {
          tipo: "lista",
          puntos: [
            "Enviar formularios automatizados, masivos o falsos.",
            "Intentar acceder a partes del sitio que no son públicas.",
            "Extraer el contenido de forma automatizada para republicarlo.",
            "Usar el sitio para algo ilegal, o de una forma que interrumpa su funcionamiento.",
          ],
        },
      ],
    },
    {
      titulo: "Contenido y marca",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Los textos, el diseño, las fotografías y la marca Main Logistics son de la empresa o se usan con licencia. Puede citar y enlazar el contenido indicando la fuente. No puede copiarlo para un sitio competidor, ni usar la marca de un modo que sugiera una relación comercial que no existe.",
        },
      ],
    },
    {
      titulo: "Enlaces a otros sitios",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Cuando enlazamos a un sitio de un tercero, por ejemplo a una norma o a un organismo público, es para que usted pueda verificar lo que decimos. Ese sitio no lo controlamos nosotros y no respondemos por su contenido.",
        },
      ],
    },
    {
      titulo: "Disponibilidad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Procuramos que el sitio esté siempre arriba, pero puede caerse o estar en mantención. Si el formulario falla justo cuando usted lo necesita, escríbanos directamente: el correo y el teléfono están en el pie de esta página, y también aparecen dentro del formulario cuando el envío no sale.",
        },
      ],
    },
    {
      titulo: "Responsabilidad",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Respondemos por el servicio de transporte que contratemos con usted, en los términos de ese contrato y de la ley chilena. Lo que no podemos garantizar es que la información general de este sitio esté vigente al minuto para su caso: las tarifas, los plazos y la disponibilidad se confirman en la cotización.",
        },
        {
          tipo: "parrafo",
          texto:
            "Nada de lo escrito acá limita los derechos que la ley le da como consumidor o como contratante.",
        },
      ],
    },
    {
      titulo: "Ley aplicable",
      bloques: [
        {
          tipo: "parrafo",
          texto:
            "Estos términos se rigen por la ley chilena, y cualquier diferencia sobre ellos la ven los tribunales ordinarios de justicia de la República de Chile.",
        },
      ],
    },
    {
      titulo: "Contacto",
      bloques: [
        {
          tipo: "parrafo",
          texto: `Dudas sobre estos términos: ${CORREO}, o al ${TELEFONO}.`,
        },
      ],
    },
  ],
};
