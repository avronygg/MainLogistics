/**
 * Diccionario en español. Es la fuente de verdad.
 *
 * De acá sale el tipo `Mensajes`, así que si a `en`, `pt` o `zh` les falta
 * una clave, TypeScript no compila. No hay forma de publicar una traducción
 * a medias sin enterarse.
 *
 * Reglas de escritura para quien traduzca:
 *
 * - **Se habla de usted.** El comprador es un jefe de operaciones, no un
 *   consumidor final. En inglés no hay distinción, pero el registro sí: ni
 *   coloquial ni publicitario.
 * - **Prohibido el lenguaje startup** — "revolucionamos", "disrupción",
 *   "partner estratégico" — y los superlativos vacíos: "líderes", "los
 *   mejores", "excelencia". Vale para los cuatro idiomas.
 * - **Los nombres propios no se traducen.** Main Logistics, MainBrain, y los
 *   nombres de comuna y región de Chile van tal cual en todos los idiomas:
 *   son la dirección real de un lugar.
 * - **Los términos de equipo se traducen al término del rubro**, no al
 *   literal. "Cama baja" es *lowboy* en inglés, no "low bed". "Rampla plana"
 *   es *flatbed*. Traducirlos literalmente delata que no se conoce el rubro,
 *   que es exactamente lo que este sitio no puede permitirse.
 * - **Ninguna cifra ni certificación cambia al traducir.** Si el español no
 *   promete algo, la traducción tampoco puede prometerlo.
 */

export const es = {
  meta: {
    // §9 del doc de marca: nunca el nombre solo en el title tag.
    titulo: "Transporte de carga en todo Chile | Main Logistics",
    descripcion:
      "Main Logistics mueve carga general, minera, peligrosa, refrigerada, forestal, contenedores, maquinaria y sobredimensionada de Arica a Punta Arenas, con monitoreo permanente y el estándar que exige cada industria.",
    ogDescripcion:
      "Cualquier carga. Cualquier destino de Chile. Con visibilidad total y cero sorpresas.",
  },

  nav: {
    servicios: "Servicios",
    queMovemos: "Qué movemos",
    cobertura: "Cobertura",
    contacto: "Contacto",
    cotizar: "Cotizar",
    cotizarMovil: "Cotizar mi operación",
    principal: "Principal",
    inicio: "Main Logistics, inicio",
    abrirMenu: "Abrir menú",
    cerrarMenu: "Cerrar menú",
    idioma: "Idioma",
    cambiarIdioma: "Cambiar idioma",
  },

  /* ── Hero · portada ──────────────────────────────────────────────── */
  hero: {
    tituloLinea1: "Con Main, su carga.",
    tituloLinea2: "Siempre",
    bajadaLinea1: "Llevamos su carga a cualquier destino de Chile.",
    bajadaLinea2: "Sabe en todo momento dónde va y a qué hora llega.",
    ctaPrincipal: "Cotice su carga",
    ctaSecundario: "Conozca nuestros servicios",
    rotador: {
      frases: ["a tiempo", "segura", "vigilada"],
      alternativas: "a tiempo, segura o vigilada",
    },
    tarjetas: {
      gps: {
        etiqueta: "GPS",
        estado: "En ruta",
        titulo: "Monitoreo en ruta",
        detalle: "Trazabilidad del retiro a la entrega",
      },
      marca: {
        bajadaLinea1: "Transporte de carga",
        bajadaLinea2: "en todo Chile",
      },
    },
  },

  /* ── Servicios · los ocho, y el bento de apoyo ───────────────────── */
  servicios: {
    tituloLinea1: "Un solo operador para",
    tituloDestacado: "toda su operación",
    bajada: {
      inicio: "Contenedores, maquinaria, graneles o almacenaje.",
      realce: "Ocho servicios",
      fin: "con el equipo que cada carga exige, coordinados desde un mismo lugar.",
    },
    lista: {
      contenedores: {
        nombre: "Retiro de contenedores",
        detalle: "Retiramos sus contenedores en puerto y los movemos a destino sin demoras.",
        lleva: {
          contenedor20: "Contenedor 20′",
          contenedor40: "Contenedor 40′",
          puerto: "Puerto",
        },
      },
      camaBaja: {
        nombre: "Cama baja",
        detalle: "Carga sobredimensionada y maquinaria pesada con equipos especializados.",
        lleva: {
          maquinaria: "Maquinaria",
          sobredimensionada: "Sobredimensionada",
        },
      },
      ramplasPlanas: {
        nombre: "Ramplas planas",
        detalle: "Carga general y paletizada sobre ramplas planas, para todo tipo de operación.",
        lleva: {
          general: "General",
          paletizada: "Paletizada",
        },
      },
      camionesPequenos: {
        nombre: "Camiones pequeños",
        detalle: "Distribución ágil para cargas menores y entregas de última milla.",
        lleva: {
          cargaMenor: "Carga menor",
          ultimaMilla: "Última milla",
        },
      },
      bateas: {
        nombre: "Bateas",
        detalle: "Traslado de áridos y graneles en batea, con cobertura puerto-destino.",
        lleva: {
          aridos: "Áridos",
          graneles: "Graneles",
        },
      },
      silos: {
        nombre: "Silos",
        detalle: "Transporte especializado de carga en silo para la industria.",
        lleva: {
          granelCerrado: "Granel cerrado",
        },
      },
      bess: {
        nombre: "Carga BESS",
        detalle: "Traslado de baterías y sistemas de almacenamiento de energía con manejo especializado.",
        lleva: {
          baterias: "Baterías",
          altoValor: "Alto valor",
        },
      },
      almacenaje: {
        nombre: "Desconsolidado y almacenaje",
        detalle: "Desconsolidamos y almacenamos su carga en bodegas estratégicas.",
        lleva: {
          bodega: "Bodega",
          consolidado: "Consolidado",
        },
      },
    },
    ctaPrincipal: "Cotice su carga",
    ayuda: {
      pregunta: "¿No sabe qué equipo necesita?",
      respuesta: "Lo asesoramos.",
    },
    pilares: {
      titulo: {
        inicio: "Con MAIN, su carga siempre",
        realce: "bajo control",
        fin: ".",
      },
      bajada: {
        realceUbicacion: "Saber dónde está",
        finUbicacion: "en cada momento.",
        realceNorma: "Cumplir la norma",
        finNorma: "que exige su industria.",
        realceHora: "Llegar a la hora",
        finHora: "acordada.",
      },
      tecnologia: {
        altFoto: "Equipo de monitoreo con la marca Main Logistics, con el conector de datos a la vista",
        etiqueta: "GPS en ruta",
        titulo: {
          inicio: "Vea su carga en",
          realce: "tiempo real",
          fin: ", no espere el llamado.",
        },
        detalle: {
          realce: "GPS y monitoreo permanente.",
          fin: "Trazabilidad desde el retiro hasta la entrega, con reportes auditables en línea.",
        },
      },
      cobertura: {
        etiqueta: "Cobertura",
        titulo: "De Arica a Punta Arenas.",
        detalle: {
          realce: "Cobertura nacional",
          fin: ", con el equipo y la documentación que pide cada industria.",
        },
      },
      queMovemos: {
        etiqueta: "Qué movemos",
        titulo: "Ocho tipos de carga, un solo proveedor.",
        detalle: "Desde carga general hasta sobredimensionada, con el equipo que cada una exige.",
        cargas: {
          general: "General",
          minera: "Minera",
          peligrosa: "Peligrosa",
          refrigerada: "Refrigerada",
          forestal: "Forestal",
          contenedores: "Contenedores",
          maquinaria: "Maquinaria",
          sobredimensionada: "Sobredimensionada",
        },
        enlace: "Vea qué exige cada una",
      },
      seguridad: {
        altFoto: "Amarre de carga con eslinga y trinquete tensado sobre la plataforma de un remolque",
        etiqueta: "Seguridad",
        titulo: {
          inicio: "Su carga siempre",
          realce: "segura",
          fin: ".",
        },
        detalle: {
          realce: "Transportistas verificados",
          fin: ", documentación al día y el estándar de cada industria.",
        },
      },
    },
  },

  /* ── Qué movemos · tipos de carga ────────────────────────────────── */
  cargas: {
    tituloLinea1: "Cada carga exige lo suyo.",
    tituloDestacado: "Nosotros lo cumplimos",
    bajada: "Cada carga tiene su norma, su equipo y su documentación.",
    bajadaRealce: "Esta es la de cada una.",
    etiquetaTipos: "tipos de carga",
    tipos: {
      general: {
        nombre: "General",
        exige: "Rampla plana, furgón o carga paletizada, según volumen y ruta.",
      },
      minera: {
        nombre: "Minera",
        exige: "Homologación para entrar a faena y control de fatiga en ruta.",
      },
      peligrosa: {
        nombre: "Peligrosa",
        exige: "Rotulación, hoja de seguridad y conductor con curso vigente.",
      },
      refrigerada: {
        nombre: "Refrigerada",
        exige: "Cadena de frío continua con registro de temperatura del viaje.",
      },
      forestal: {
        nombre: "Forestal",
        exige: "Amarre certificado y rutas rurales con tránsito de faena.",
      },
      contenedores: {
        nombre: "Contenedores",
        exige: "Coordinación portuaria, ventana de retiro y sello verificado.",
      },
      maquinaria: {
        nombre: "Maquinaria",
        exige: "Cama baja, cálculo de altura libre y permisos de circulación.",
      },
      sobredimensionada: {
        nombre: "Sobredimensionada",
        exige: "Permiso especial, escolta y horario de circulación restringido.",
      },
    },
  },

  /* ── Cumplimiento · por industria ────────────────────────────────── */
  cumplimiento: {
    tituloLinea1: "Permisos y certificaciones",
    tituloDestacado: "al día en cada despacho",
    bajadaRealce: "Elija su industria",
    bajadaResto: "y vea qué se revisa antes de que su carga salga.",
    etiquetaPestanas: "Marcos normativos por industria",
    mineria: {
      nombre: "Minería",
      titulo: "La homologación se pide antes de cargar.",
      detalle: "Documentación del transportista, del equipo y del conductor, revisada y vigente el día del despacho. En la portería ya es tarde.",
      puntos: {
        homologacion: "Homologación de transportista y equipo para faena",
        fatiga: "Control de fatiga y descansos en ruta",
        continuidad: "Continuidad de abastecimiento en turnos",
      },
    },
    peligrosa: {
      nombre: "Carga peligrosa",
      titulo: "Lo que no está rotulado, no sale.",
      detalle: "Rotulación según la clase de la sustancia, hoja de seguridad a bordo y conductor con curso vigente. La documentación viaja con la carga, no después.",
      puntos: {
        rotulacion: "Rotulación y segregación según clase",
        hojaSeguridad: "Hoja de seguridad y elementos de emergencia a bordo",
        curso: "Conductor con curso de sustancias peligrosas vigente",
      },
    },
    agro: {
      nombre: "Agro y salmonicultura",
      titulo: "La cadena de frío se corta una vez.",
      detalle: "Temperatura registrada durante todo el viaje, no solo al cargar y al descargar. En temporada, la ventana horaria manda tanto como el termómetro.",
      puntos: {
        temperatura: "Registro de temperatura del viaje completo",
        fitosanitario: "Protocolos fitosanitarios y certificación de origen",
        ventanas: "Ventanas de temporada y coordinación de packing",
      },
    },
    forestal: {
      nombre: "Forestal",
      titulo: "El amarre se revisa antes de salir y en cada parada.",
      detalle: "Volumen alto sobre caminos que no siempre están pavimentados, con tránsito de faena en la misma ruta.",
      puntos: {
        buenasPracticas: "Buenas prácticas de seguridad en faena forestal",
        amarre: "Amarre certificado y revisión en ruta",
        transito: "Coordinación con tránsito de faena",
      },
    },
    contenedores: {
      nombre: "Contenedores",
      marcoPuerto: "Puerto",
      titulo: "La ventana de retiro no espera.",
      detalle: "Coordinación con terminal, sello verificado y devolución dentro del plazo libre. Un día de sobreestadía cuesta más que el flete.",
      puntos: {
        ventana: "Coordinación de ventana con el terminal",
        sello: "Verificación de sello al retiro y a la entrega",
        diasLibres: "Control de días libres y devolución",
      },
    },
  },

  /* ── Reseñas y franja de clientes ────────────────────────────────── */
  resenas: {
    tituloLinea1: "Lo que dicen",
    tituloDestacado: "nuestros clientes",
    bajadaInicio: "Jefes de logística y abastecimiento que ",
    bajadaRealce: "responden el teléfono",
    bajadaFin: " si un colega pregunta por nosotros.",
    testimonios: {
      importacion: {
        cita:
          "Importamos por contenedor y antes cada retiro era un problema distinto. Ahora les mando el BL y me avisan cuando salió del puerto. Dejé de estar pendiente.",
        nombre: "Matías Corvalán",
        cargo: "Socio fundador",
        empresa: "The Wallpaper Guys",
        industria: "Importación",
      },
      quimicos: {
        cita:
          "Movemos productos químicos y ahí la hoja de seguridad y el rotulado no son opcionales. No hemos tenido que devolver un despacho por documentación.",
        nombre: "Óscar Villablanca",
        cargo: "Jefe de Bodega",
        empresa: "Clean Controls",
        industria: "Químicos",
      },
      congelados: {
        cita:
          "Nuestro producto va congelado, así que el horario pesa más que el precio. Coordinan la salida temprano y llega en rango. Es todo lo que le pido a un transporte.",
        nombre: "Javiera Pizarro",
        cargo: "Jefa de Operaciones",
        empresa: "Acai Prime",
        industria: "Alimentos congelados",
      },
      gastronomia: {
        cita:
          "Al principio tuvimos un desajuste con el horario de recepción de un local. Lo resolvieron cambiando la ruta ellos, sin que yo tuviera que insistir. Llevamos ocho meses sin un quiebre de abastecimiento.",
        nombre: "Diego Sanhueza",
        cargo: "Encargado de Abastecimiento",
        empresa: "American Prime Burger",
        industria: "Gastronomía",
      },
      abastecimiento: {
        cita:
          "Coordinamos el abastecimiento de varios locales a la vez. Lo que necesitaba era una sola contraparte que respondiera por todos los despachos, no cinco transportistas distintos. Eso lo tengo.",
        nombre: "Paulina Herrera",
        cargo: "Coordinadora de Abastecimiento",
        empresa: "Restaurant Administration Center",
        industria: "Servicios para gastronomía",
      },
      produccion: {
        cita:
          "Movemos equipos de montaje a terreno y casi siempre con fecha fija. No hemos llegado tarde a una instalación.",
        nombre: "Ignacio Rebolledo",
        cargo: "Director de Producción",
        empresa: "Main Brain",
        industria: "Producción",
      },
    },
    franja: {
      encabezado: "Confían en nosotros",
    },
  },

  /* ── Cómo funciona · el timeline ─────────────────────────────────── */
  comoFunciona: {
    tituloLinea1: "Cómo funciona,",
    tituloDestacado: "en tres pasos",
    bajadaInicio: "Desde la cotización hasta la entrega,",
    bajadaRealce: "siempre hay alguien con nombre",
    bajadaFin: "del otro lado.",
    paso: "Paso",
    hitos: {
      cotizacion: {
        titulo: "Cotización",
        detalle: "Usted nos dice qué mueve, desde dónde y hasta dónde. Le devolvemos una evaluación de factibilidad de la ruta, no un precio suelto.",
        dato: "Respuesta por correo",
      },
      retiro: {
        titulo: "Retiro",
        detalle: "Transportista verificado y equipo acorde a la carga. La documentación se emite antes de que el camión salga.",
        dato: "Guía de despacho electrónica",
      },
      entrega: {
        titulo: "Entrega",
        detalle: "Seguimiento durante todo el viaje. Si algo se desvía, lo sabemos antes que usted, y ya lo estamos resolviendo.",
        dato: "Respaldo de entrega",
      },
    },
    plazosAltFoto: "Reloj con la marca Main Logistics mostrando la hora de entrega",
    plazosEtiqueta: "Plazos",
    plazosTituloInicio: "Su carga siempre",
    plazosTituloDestacado: "a tiempo",
    plazosTituloFin: ".",
    plazosDetalle: "Sin demoras que haya que explicar en una reunión.",
  },

  /* ── Equipo ──────────────────────────────────────────────────────── */
  equipo: {
    tituloLinea1: "Quién mueve",
    tituloDestacado: "su carga",
    bajadaInicio: "Conductores, bodega y descarga.",
    bajadaRealce: "Todos pasan el mismo estándar antes de tocar su carga",
    bajadaFin: ", sin importar de qué industria venga.",
    conductor: {
      altFoto: "Conductor de Main Logistics en la cabina, con gorra de la marca",
      tituloInicio: "Transportistas",
      tituloDestacado: "verificados",
      tituloFin: "antes de cargar.",
    },
    estandares: {
      papeles: {
        titulo: "Papeles al día, revisados",
        detalle: "Documentación del transportista, del equipo y del conductor, revisada y vigente el día del despacho.",
      },
      experiencia: {
        titulo: "Experiencia en la carga que usted mueve",
        detalle: "Conductores y personal de bodega y descarga que ya trabajaron su tipo de carga antes de este despacho.",
      },
      central: {
        titulo: "Una central que responde",
        detalle: "Alguien con nombre del otro lado durante todo el viaje, y que contesta el mismo día.",
      },
    },
    flota: {
      altFoto: "Puerta de camión con la marca Main Logistics",
      titulo: "El estándar es el mismo, lo maneje quien lo maneje.",
    },
    bodega: {
      altFoto: "Operario de Main Logistics revisando pallets en bodega con una tablet",
      tituloInicio: "Bodega y descarga, con el",
      tituloDestacado: "mismo control",
      tituloFin: ".",
    },
    portal: {
      altFoto: "Tablet en cabina mostrando la ruta activa en el portal de Main Logistics",
      estado: "En desarrollo",
      titulo: "El portal para seguir su carga.",
    },
  },

  /* ── Cotización · el formulario de seis pasos ────────────────────── */
  cotizar: {
    tituloLinea1: "Cotice su carga.",
    tituloDestacado: "Le respondemos en 24 horas",
    bajada: "Cuéntenos qué mueve y le devolvemos una evaluación de factibilidad de la ruta, no un precio suelto.",
    garantias: {
      respuesta: "Le respondemos en menos de 24 horas hábiles",
      sinCompromiso: "Sin compromiso ni registro previo",
      rutaHonesta: "Si su ruta no nos calza, se lo decimos",
    },
    pasosCortos: "Seis pasos cortos.",
    datosAlFinal: "Sus datos van al final.",
    pasoDeTotal: "Paso {n} de {total}.",
    guardado: {
      retomado: "Retomamos donde quedó.",
      empezarDeNuevo: "Empezar de nuevo",
    },
    pasos: {
      carga: {
        titulo: "Su carga",
        bajada: "Qué mueve y con qué equipo.",
      },
      ruta: {
        titulo: "La ruta",
        bajada: "Desde dónde y hasta dónde.",
      },
      fecha: {
        titulo: "Cuándo",
        bajada: "La fecha del servicio.",
      },
      modalidad: {
        titulo: "Modalidad",
        bajada: "Una vez o de forma sostenida.",
      },
      requisitos: {
        titulo: "Requisitos",
        bajada: "Lo que su industria exige.",
      },
      contacto: {
        titulo: "Sus datos",
        bajada: "Para responderle.",
      },
    },
    riel: {
      resumen: "Resumen",
      pasoNavegable: "Paso {n}, {titulo}, completado. Volver a editar.",
      pasoActual: "Paso {n}, {titulo}, paso actual",
      pasoCompletado: "Paso {n}, {titulo}, completado",
      pasoPendiente: "Paso {n}, {titulo}, pendiente",
    },
    campos: {
      opcional: "(opcional)",
      trampaBots: "No completar",
      tipoCargaLeyenda: "¿Qué va a transportar?",
      tipoCargaOtraEtiqueta: "¿Qué carga es?",
      tipoCargaOtraPlaceholder: "Descríbala en pocas palabras",
      equipoLeyenda: "¿Qué equipo necesita?",
      equipoAyuda: "Si no está seguro, elija la última opción y lo asesoramos.",
      origen: "Origen",
      destino: "Destino",
      region: "Región",
      regionVacio: "Seleccione región",
      comuna: "Comuna",
      comunaVacio: "Seleccione comuna",
      comunaSinRegion: "Elija primero la región",
      direccion: "Dirección o referencia",
      direccionPlaceholder: "Calle, número, sector, faena…",
      fechaLeyenda: "¿Cuándo necesita el servicio?",
      fechaDiaEtiqueta: "Día del servicio",
      modalidadLeyenda: "¿Es un traslado puntual o se repite?",
      frecuenciaEtiqueta: "¿Cada cuánto?",
      frecuenciaVacio: "Seleccione frecuencia",
      duracionEtiqueta: "Duración del contrato",
      duracionVacio: "Seleccione duración",
      requisitosLeyenda: "¿Su carga tiene alguna exigencia especial?",
      requisitosAyuda: "Marque las que correspondan. Si no aplica ninguna, siga.",
      requisitoOtroEtiqueta: "¿Cuál es el requisito?",
      valorLeyenda: "Valor declarado de la carga",
      valorAyuda: "Define la cobertura del seguro. Si no lo tiene a mano, elija la última opción.",
      empresa: "Empresa",
      empresaPlaceholder: "Razón social o nombre de fantasía",
      nombre: "Nombre de contacto",
      correo: "Correo",
      correoPlaceholder: "nombre@empresa.cl",
      telefono: "Teléfono o WhatsApp",
      telefonoPlaceholder: "+56 9 1234 5678",
      canalLeyenda: "¿Por dónde prefiere que le respondamos?",
    },
    tiposCarga: {
      contenedor: {
        etiqueta: "Contenedor 20′ / 40′",
        detalle: "Carga en contenedor",
      },
      suelta: {
        etiqueta: "Carga suelta o paletizada",
        detalle: "General o pallets",
      },
      granel: {
        etiqueta: "Graneles",
        detalle: "Áridos, silos, líquidos",
      },
      sobredimension: {
        etiqueta: "Sobredimensionada",
        detalle: "Excede medidas estándar",
      },
      peligrosa: {
        etiqueta: "Peligrosa o especializada",
        detalle: "Requiere manejo especial",
      },
      otra: {
        etiqueta: "Otra",
        detalle: "Cuéntenos cuál",
      },
    },
    equipos: {
      camionPequeno: {
        etiqueta: "Camión pequeño",
      },
      ramplaPlana: {
        etiqueta: "Rampla plana",
      },
      camaBaja: {
        etiqueta: "Cama baja",
      },
      batea: {
        etiqueta: "Batea",
      },
      silo: {
        etiqueta: "Silo",
      },
      contenedor: {
        etiqueta: "Equipo para contenedor",
      },
      asesoria: {
        etiqueta: "No estoy seguro, necesito asesoría",
      },
    },
    fechas: {
      semana: {
        etiqueta: "Esta semana",
        detalle: "Próximos 3 días",
      },
      especifica: {
        etiqueta: "Fecha específica",
        detalle: "Yo elijo el día",
      },
      flexible: {
        etiqueta: "Flexible",
        detalle: "Coordinemos la fecha",
      },
    },
    modalidades: {
      puntual: {
        etiqueta: "Puntual",
        detalle: "Un solo traslado",
      },
      recurrente: {
        etiqueta: "Recurrente",
        detalle: "Se repite en el tiempo",
      },
      contrato: {
        etiqueta: "Contrato",
        detalle: "Volumen sostenido",
      },
    },
    frecuencias: {
      semanal: {
        etiqueta: "Semanal",
      },
      quincenal: {
        etiqueta: "Quincenal",
      },
      mensual: {
        etiqueta: "Mensual",
      },
      otra: {
        etiqueta: "Otra",
      },
    },
    duraciones: {
      tresMeses: {
        etiqueta: "3 meses",
      },
      seisMeses: {
        etiqueta: "6 meses",
      },
      doceMeses: {
        etiqueta: "12 meses",
      },
      masDeDoceMeses: {
        etiqueta: "Más de 12 meses",
      },
    },
    requisitos: {
      acreditacionMinera: {
        etiqueta: "Acreditación minera",
      },
      cargaPeligrosa: {
        etiqueta: "Carga peligrosa",
      },
      escolta: {
        etiqueta: "Escolta o seguridad",
      },
      refrigeracion: {
        etiqueta: "Refrigeración",
      },
      manipulacionEspecial: {
        etiqueta: "Manipulación especial",
      },
      otro: {
        etiqueta: "Otro",
      },
    },
    valores: {
      hasta1000: {
        etiqueta: "Hasta 1.000 UF",
      },
      de1000a3000: {
        etiqueta: "1.000 – 3.000 UF",
      },
      masDe3000: {
        etiqueta: "Más de 3.000 UF",
      },
      conversar: {
        etiqueta: "Prefiero conversarlo",
      },
    },
    canales: {
      whatsapp: {
        etiqueta: "WhatsApp",
      },
      correo: {
        etiqueta: "Correo",
      },
      llamada: {
        etiqueta: "Llamada",
      },
    },
    errores: {
      tipoCarga: "Elija qué tipo de carga va a mover.",
      tipoCargaOtra: "Cuéntenos qué carga es.",
      equipo: "Elija un equipo, o pida asesoría.",
      origenRegion: "Indique la región de origen.",
      origenComuna: "Indique la comuna de origen.",
      destinoRegion: "Indique la región de destino.",
      destinoComuna: "Indique la comuna de destino.",
      fecha: "Indique cuándo necesita el servicio.",
      fechaDia: "Elija el día.",
      modalidad: "Indique la modalidad.",
      frecuencia: "Indique cada cuánto se repite.",
      duracion: "Indique la duración del contrato.",
      requisitoOtro: "Especifique el requisito.",
      valor: "Indique el valor declarado, o que prefiere conversarlo.",
      empresa: "Indique la empresa.",
      nombre: "Indique su nombre.",
      correoFalta: "Indique su correo.",
      correoIlegible: "Revise el correo, parece incompleto.",
      telefonoFalta: "Indique un teléfono.",
      telefonoIlegible: "Revise el teléfono: son 9 dígitos en Chile.",
      canal: "Elija por dónde prefiere que le respondamos.",
    },
    acciones: {
      atras: "Atrás",
      siguiente: "Siguiente",
      revisar: "Revisar solicitud",
      guardarYVolver: "Guardar y volver al resumen",
      volver: "Volver",
      enviar: "Enviar solicitud",
      enviando: "Enviando…",
    },
    resumen: {
      titulo: "Revise antes de enviar",
      bajada: "Si algo no está bien, edítelo y vuelve acá mismo.",
      editar: "Editar",
      tipoCarga: "Tipo de carga",
      equipo: "Equipo",
      origen: "Origen",
      destino: "Destino",
      cuando: "Cuándo",
      dia: "Día",
      modalidad: "Modalidad",
      duracion: "Duración",
      requisitos: "Requisitos",
      sinRequisitos: "Ninguno indicado",
      valorDeclarado: "Valor declarado",
      empresa: "Empresa",
      contacto: "Contacto",
      correo: "Correo",
      telefono: "Teléfono",
      prefiere: "Prefiere",
    },
    exito: {
      titulo: "Recibimos su solicitud.",
      cuerpo: "Le respondemos en menos de 24 horas hábiles con una evaluación de factibilidad de la ruta. Si necesita moverlo antes, escríbanos por WhatsApp.",
      otraSolicitud: "Enviar otra solicitud",
    },
    errorEnvio: {
      titulo: "No pudimos enviar su solicitud.",
      enlaceWhatsapp: "envíela por WhatsApp",
      conWhatsapp: "Nada se perdió: {whatsapp} con los datos ya escritos, o escriba a {correo}.",
      sinWhatsapp: "Escríbanos a {correo} y le respondemos igual.",
    },
    avisos: {
      faltaUnDato: "Falta 1 dato para continuar.",
      faltanDatos: "Faltan {n} datos para continuar.",
      faltaUnPaso: "Falta completar un paso antes de enviar.",
      enviando: "Enviando su solicitud.",
      recibida: "Solicitud recibida.",
    },
  },

  /* ── Pie de página ───────────────────────────────────────────────── */
  pie: {
    descripcion: "Transporte de carga por carretera en todo Chile, de Arica a Punta Arenas.",
    ctaCotizar: "Cotice su carga",
    columnaServicios: {
      titulo: "Servicios",
      tecnologia: "Tecnología y monitoreo",
      queMovemos: "Qué movemos",
      cobertura: "Cobertura nacional",
      cumplimiento: "Cumplimiento",
    },
    columnaEmpresa: {
      titulo: "Empresa",
      comoFunciona: "Cómo funciona",
      clientes: "Clientes",
      cotizar: "Cotizar",
    },
    contacto: {
      titulo: "Contacto",
    },
    derechos: "Transporte de carga en todo Chile",
  },

  /* ── Asesor flotante ─────────────────────────────────────────────── */
  asesor: {
    cargo: "Atención comercial",
    mensaje: "👋 ¿Necesita ayuda con su carga o quiere que la cotice?",
    escribiendo: "Escribiendo",
    cerrarMensaje: "Cerrar mensaje",
    tituloPanel: "Contactar a Main Logistics",
    cerrarPanel: "Cerrar",
    opciones: {
      cotizar: {
        titulo: "Cotizar mi carga",
        detalle: "Origen, destino y tipo de carga",
      },
      contacto: {
        titulo: "Que me contacten",
        detalle: "Dejo mis datos y me llaman",
      },
      whatsapp: {
        titulo: "Hablar por WhatsApp",
        detalle: "Respuesta directa al chat",
      },
    },
    horario: "Respondemos en horario hábil.",
    abrirAsesor: "Hablar con un asesor",
    cerrarAsesor: "Cerrar asesor",
  },

  /* ── Piezas compartidas ──────────────────────────────────────────── */
  comunes: {
  },
};

/**
 * El tipo sale del español: los demás idiomas tienen que calzar exacto.
 *
 * Sin `as const` a propósito. Con `as const` cada valor quedaría tipado como
 * su literal español — `titulo: "Transporte de carga..."` — y la traducción
 * inglesa tendría que repetir la frase en español para compilar, que es
 * exactamente lo contrario de lo que se busca. Sin él, los valores se
 * ensanchan a `string` y lo que se exige es la ESTRUCTURA: mismas claves,
 * ninguna de más, ninguna de menos.
 */
export type Mensajes = typeof es;
