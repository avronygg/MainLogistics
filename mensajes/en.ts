import type { Mensajes } from "./es";

/** English. Ver las reglas de escritura en `es.ts`. */
export const en: Mensajes = {
  meta: {
    // §9 del doc de marca: nunca el nombre solo en el title tag.
    titulo: "Road freight across Chile | Main Logistics",
    descripcion:
      "Main Logistics moves general, mining, hazardous, refrigerated, forestry, container, machinery and oversized freight from Arica to Punta Arenas, with permanent monitoring and the standard each industry requires.",
    ogDescripcion:
      "Any freight. Any destination in Chile. Full visibility and no surprises.",
  },

  nav: {
    servicios: "Services",
    queMovemos: "What we move",
    cobertura: "Coverage",
    contacto: "Contact",
    cotizar: "Get a quote",
    cotizarMovil: "Quote my operation",
    principal: "Main content",
    inicio: "Main Logistics, home",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
    idioma: "Language",
    cambiarIdioma: "Change language",
  },

  /* ── Hero · portada ──────────────────────────────────────────────── */
  hero: {
    tituloLinea1: "With Main, cargo is",
    tituloLinea2: "Always",
    bajadaLinea1: "We move your freight to any destination in Chile.",
    bajadaLinea2: "You know where it is and what time it arrives, at all times.",
    ctaPrincipal: "Request a quote",
    ctaSecundario: "See our services",
    rotador: {
      frases: ["on time", "secure", "tracked"],
      alternativas: "on time, secure or tracked",
    },
    tarjetas: {
      gps: {
        etiqueta: "GPS",
        estado: "En route",
        titulo: "Monitoring en route",
        detalle: "Traceability from pickup to delivery",
      },
      marca: {
        bajadaLinea1: "Road freight transport",
        bajadaLinea2: "across Chile",
      },
    },
  },

  /* ── Servicios · los ocho, y el bento de apoyo ───────────────────── */
  servicios: {
    tituloLinea1: "One operator for",
    tituloDestacado: "your whole operation",
    bajada: {
      inicio: "Containers, machinery, bulk or warehousing.",
      realce: "Eight services",
      fin: "with the equipment each load requires, coordinated from one place.",
    },
    lista: {
      contenedores: {
        nombre: "Container haulage",
        detalle: "We pick up your containers at the port and move them to destination without delays.",
        lleva: {
          contenedor20: "20′ container",
          contenedor40: "40′ container",
          puerto: "Port",
        },
      },
      camaBaja: {
        nombre: "Lowboy",
        detalle: "Oversized freight and heavy machinery with specialized equipment.",
        lleva: {
          maquinaria: "Machinery",
          sobredimensionada: "Oversized",
        },
      },
      ramplasPlanas: {
        nombre: "Flatbeds",
        detalle: "General and palletized freight on flatbed trailers, for any kind of operation.",
        lleva: {
          general: "General",
          paletizada: "Palletized",
        },
      },
      camionesPequenos: {
        nombre: "Light trucks",
        detalle: "Fast distribution for smaller loads and last-mile deliveries.",
        lleva: {
          cargaMenor: "Small loads",
          ultimaMilla: "Last mile",
        },
      },
      bateas: {
        nombre: "Tippers",
        detalle: "Aggregates and dry bulk in tipper trailers, with port-to-destination coverage.",
        lleva: {
          aridos: "Aggregates",
          graneles: "Dry bulk",
        },
      },
      silos: {
        nombre: "Silo tankers",
        detalle: "Specialized transport of bulk freight in silo tankers for industry.",
        lleva: {
          granelCerrado: "Enclosed bulk",
        },
      },
      bess: {
        nombre: "BESS freight",
        detalle: "Transport of batteries and energy storage systems with specialized handling.",
        lleva: {
          baterias: "Batteries",
          altoValor: "High value",
        },
      },
      almacenaje: {
        nombre: "Deconsolidation and warehousing",
        detalle: "We deconsolidate and store your freight in strategically located warehouses.",
        lleva: {
          bodega: "Warehouse",
          consolidado: "Consolidated",
        },
      },
    },
    ctaPrincipal: "Request a quote",
    ayuda: {
      pregunta: "Not sure which equipment you need?",
      respuesta: "We will advise you.",
    },
    pilares: {
      titulo: {
        inicio: "With MAIN, your freight is always",
        realce: "under control",
        fin: ".",
      },
      bajada: {
        realceUbicacion: "Know where it is",
        finUbicacion: "at every moment.",
        realceNorma: "Meet the standard",
        finNorma: "your industry requires.",
        realceHora: "Arrive at the time",
        finHora: "agreed.",
      },
      tecnologia: {
        altFoto: "Monitoring unit branded Main Logistics, with the data connector in view",
        etiqueta: "GPS en route",
        titulo: {
          inicio: "See your freight in",
          realce: "real time",
          fin: ", do not wait for the call.",
        },
        detalle: {
          realce: "GPS and permanent monitoring.",
          fin: "Traceability from pickup to delivery, with auditable reports online.",
        },
      },
      cobertura: {
        etiqueta: "Coverage",
        titulo: "From Arica to Punta Arenas.",
        detalle: {
          realce: "Nationwide coverage",
          fin: ", with the equipment and the documentation each industry asks for.",
        },
      },
      queMovemos: {
        etiqueta: "What we move",
        titulo: "Eight types of freight, a single provider.",
        detalle: "From general to oversized freight, with the equipment each one requires.",
        cargas: {
          general: "General",
          minera: "Mining",
          peligrosa: "Hazardous",
          refrigerada: "Refrigerated",
          forestal: "Forestry",
          contenedores: "Containers",
          maquinaria: "Machinery",
          sobredimensionada: "Oversized",
        },
        enlace: "See what each one requires",
      },
      seguridad: {
        altFoto: "Load securing with a webbing sling and ratchet tensioned over a trailer deck",
        etiqueta: "Safety",
        titulo: {
          inicio: "Your freight, always",
          realce: "secure",
          fin: ".",
        },
        detalle: {
          realce: "Verified carriers",
          fin: ", documentation up to date and the standard of each industry.",
        },
      },
    },
  },

  /* ── Qué movemos · tipos de carga ────────────────────────────────── */
  cargas: {
    tituloLinea1: "Every load has its own demands.",
    tituloDestacado: "We meet them",
    bajada: "Every load has its regulation, its equipment and its documentation.",
    bajadaRealce: "Here is what each one takes.",
    etiquetaTipos: "types of freight",
    tipos: {
      general: {
        nombre: "General",
        exige: "Flatbed, box trailer or palletized freight, depending on volume and route.",
      },
      minera: {
        nombre: "Mining",
        exige: "Approval to enter the mine site and fatigue control en route.",
      },
      peligrosa: {
        nombre: "Hazardous",
        exige: "Placarding, safety data sheet and driver with current certification.",
      },
      refrigerada: {
        nombre: "Refrigerated",
        exige: "Unbroken cold chain with a temperature record for the trip.",
      },
      forestal: {
        nombre: "Forestry",
        exige: "Certified load securing and rural roads with site traffic.",
      },
      contenedores: {
        nombre: "Containers",
        exige: "Port coordination, pickup window and verified seal.",
      },
      maquinaria: {
        nombre: "Machinery",
        exige: "Lowboy, clearance height calculation and circulation permits.",
      },
      sobredimensionada: {
        nombre: "Oversized",
        exige: "Special permit, escort and restricted travel hours.",
      },
    },
  },

  /* ── Cumplimiento · por industria ────────────────────────────────── */
  cumplimiento: {
    tituloLinea1: "Permits and certifications",
    tituloDestacado: "current for every dispatch",
    bajadaRealce: "Choose your industry",
    bajadaResto: "and see what is checked before your freight leaves.",
    etiquetaPestanas: "Regulatory frameworks by industry",
    mineria: {
      nombre: "Mining",
      titulo: "Approval is requested before loading.",
      detalle: "Carrier, equipment and driver documentation, checked and current on the day of dispatch. At the gatehouse it is already too late.",
      puntos: {
        homologacion: "Carrier and equipment approval for the mine site",
        fatiga: "Fatigue control and rest periods en route",
        continuidad: "Continuity of supply across shifts",
      },
    },
    peligrosa: {
      nombre: "Hazardous freight",
      titulo: "What is not placarded does not leave.",
      detalle: "Placarding according to the class of the substance, safety data sheet on board and driver with current certification. The documentation travels with the freight, not afterwards.",
      puntos: {
        rotulacion: "Placarding and segregation by class",
        hojaSeguridad: "Safety data sheet and emergency equipment on board",
        curso: "Driver with current hazardous substances certification",
      },
    },
    agro: {
      nombre: "Agriculture and salmon farming",
      titulo: "The cold chain only breaks once.",
      detalle: "Temperature recorded throughout the trip, not only at loading and unloading. In season, the time window counts as much as the thermometer.",
      puntos: {
        temperatura: "Temperature record for the entire trip",
        fitosanitario: "Phytosanitary protocols and certificate of origin",
        ventanas: "Season windows and packing coordination",
      },
    },
    forestal: {
      nombre: "Forestry",
      titulo: "Load securing is checked before departure and at every stop.",
      detalle: "High volume on roads that are not always paved, with site traffic on the same route.",
      puntos: {
        buenasPracticas: "Safety good practice on forestry sites",
        amarre: "Certified load securing and checks en route",
        transito: "Coordination with site traffic",
      },
    },
    contenedores: {
      nombre: "Containers",
      marcoPuerto: "Port",
      titulo: "The pickup window does not wait.",
      detalle: "Coordination with the terminal, verified seal and return within the free time. One day of detention costs more than the freight rate.",
      puntos: {
        ventana: "Window coordination with the terminal",
        sello: "Seal verification at pickup and at delivery",
        diasLibres: "Free-day control and container return",
      },
    },
  },

  /* ── Reseñas y franja de clientes ────────────────────────────────── */
  resenas: {
    tituloLinea1: "In the words of",
    tituloDestacado: "our clients",
    bajadaInicio: "Logistics and procurement managers who ",
    bajadaRealce: "answer the phone",
    bajadaFin: " when a colleague asks about us.",
    testimonios: {
      importacion: {
        cita:
          "We import by container, and every pickup used to be a different problem. Now I send them the BL and they tell me when it has left the port. I stopped having to chase it.",
        nombre: "Matías Corvalán",
        cargo: "Founding Partner",
        empresa: "The Wallpaper Guys",
        industria: "Import",
      },
      quimicos: {
        cita:
          "We move chemical products, and there the safety data sheet and the labelling are not optional. We have not had a shipment turned back over paperwork.",
        nombre: "Óscar Villablanca",
        cargo: "Warehouse Manager",
        empresa: "Clean Controls",
        industria: "Chemicals",
      },
      congelados: {
        cita:
          "Our product travels frozen, so the schedule matters more than the price. They coordinate an early departure and it arrives within range. That is all I ask of a carrier.",
        nombre: "Javiera Pizarro",
        cargo: "Operations Manager",
        empresa: "Acai Prime",
        industria: "Frozen food",
      },
      gastronomia: {
        cita:
          "Early on we had a mismatch with one location's receiving hours. They fixed it by rerouting on their own, without me having to push. Eight months now without a supply gap.",
        nombre: "Diego Sanhueza",
        cargo: "Procurement Lead",
        empresa: "American Prime Burger",
        industria: "Food service",
      },
      abastecimiento: {
        cita:
          "We coordinate supply for several locations at once. What I needed was a single counterpart answering for every delivery, not five different carriers. That is what I have.",
        nombre: "Paulina Herrera",
        cargo: "Supply Coordinator",
        empresa: "Restaurant Administration Center",
        industria: "Food service support",
      },
      produccion: {
        cita:
          "We move rigging and production gear to site, almost always on a fixed date. We have not been late to an install.",
        nombre: "Ignacio Rebolledo",
        cargo: "Production Director",
        empresa: "Main Brain",
        industria: "Production",
      },
    },
    franja: {
      encabezado: "Trusted by",
    },
  },

  /* ── Cómo funciona · el timeline ─────────────────────────────────── */
  comoFunciona: {
    tituloLinea1: "How it works,",
    tituloDestacado: "in three steps",
    bajadaInicio: "From the quote to the delivery,",
    bajadaRealce: "there is always someone with a name",
    bajadaFin: "on the other end.",
    paso: "Step",
    hitos: {
      cotizacion: {
        titulo: "Quote",
        detalle: "You tell us what you are moving, from where and to where. We come back with a feasibility assessment of the route, not a bare price.",
        dato: "Reply by email",
      },
      retiro: {
        titulo: "Pickup",
        detalle: "Verified carrier and equipment matched to the freight. The documentation is issued before the truck leaves.",
        dato: "Electronic dispatch note",
      },
      entrega: {
        titulo: "Delivery",
        detalle: "Tracking for the whole trip. If something goes off plan, we know before you do, and we are already resolving it.",
        dato: "Proof of delivery",
      },
    },
    plazosAltFoto: "Clock branded Main Logistics showing the delivery time",
    plazosEtiqueta: "Transit times",
    plazosTituloInicio: "Your freight, always",
    plazosTituloDestacado: "on time",
    plazosTituloFin: ".",
    plazosDetalle: "No delays to explain in a meeting.",
  },

  /* ── Equipo ──────────────────────────────────────────────────────── */
  equipo: {
    tituloLinea1: "Who moves",
    tituloDestacado: "your freight",
    bajadaInicio: "Drivers, warehouse and unloading crews.",
    bajadaRealce: "Everyone meets the same standard before touching your freight",
    bajadaFin: ", whatever industry it comes from.",
    conductor: {
      altFoto: "Main Logistics driver in the cab, wearing a branded cap",
      tituloInicio: "Carriers",
      tituloDestacado: "verified",
      tituloFin: "before loading.",
    },
    estandares: {
      papeles: {
        titulo: "Paperwork current, and checked",
        detalle: "Carrier, equipment and driver documentation, checked and current on the day of dispatch.",
      },
      experiencia: {
        titulo: "Experience with the freight you move",
        detalle: "Drivers, warehouse and unloading crews who have handled your type of freight before this dispatch.",
      },
      central: {
        titulo: "A control desk that answers",
        detalle: "Someone with a name on the other end for the whole trip, replying the same day.",
      },
    },
    flota: {
      altFoto: "Truck door with the Main Logistics brand",
      titulo: "The standard is the same, whoever is driving.",
    },
    bodega: {
      altFoto: "Main Logistics operator checking pallets in the warehouse with a tablet",
      tituloInicio: "Warehousing and unloading, under the",
      tituloDestacado: "same control",
      tituloFin: ".",
    },
    portal: {
      altFoto: "Tablet in the cab showing the active route on the Main Logistics portal",
      estado: "In development",
      titulo: "The portal to follow your freight.",
    },
  },

  /* ── Cotización · el formulario de seis pasos ────────────────────── */
  cotizar: {
    tituloLinea1: "Request a quote.",
    tituloDestacado: "We reply in 24 hours",
    bajada: "Tell us what you are moving and we come back with a feasibility assessment of the route, not a bare price.",
    garantias: {
      respuesta: "We reply in less than 24 business hours",
      sinCompromiso: "No commitment, no prior registration",
      rutaHonesta: "If your route is not a fit for us, we will say so",
    },
    pasosCortos: "Six short steps.",
    datosAlFinal: "Your details come at the end.",
    pasoDeTotal: "Step {n} of {total}.",
    guardado: {
      retomado: "We picked up where you left off.",
      empezarDeNuevo: "Start over",
    },
    pasos: {
      carga: {
        titulo: "Your freight",
        bajada: "What you move and with what equipment.",
      },
      ruta: {
        titulo: "The route",
        bajada: "From where and to where.",
      },
      fecha: {
        titulo: "When",
        bajada: "The date of the service.",
      },
      modalidad: {
        titulo: "Service type",
        bajada: "One-off or ongoing.",
      },
      requisitos: {
        titulo: "Requirements",
        bajada: "What your industry demands.",
      },
      contacto: {
        titulo: "Your details",
        bajada: "So we can reply.",
      },
    },
    riel: {
      resumen: "Summary",
      pasoNavegable: "Step {n}, {titulo}, completed. Go back to edit.",
      pasoActual: "Step {n}, {titulo}, current step",
      pasoCompletado: "Step {n}, {titulo}, completed",
      pasoPendiente: "Step {n}, {titulo}, pending",
    },
    campos: {
      opcional: "(optional)",
      trampaBots: "Do not fill in",
      tipoCargaLeyenda: "What are you going to transport?",
      tipoCargaOtraEtiqueta: "What freight is it?",
      tipoCargaOtraPlaceholder: "Describe it in a few words",
      equipoLeyenda: "What equipment do you need?",
      equipoAyuda: "If you are not sure, choose the last option and we will advise you.",
      origen: "Origin",
      destino: "Destination",
      region: "Region",
      regionVacio: "Select region",
      comuna: "Comuna",
      comunaVacio: "Select comuna",
      comunaSinRegion: "Choose the region first",
      direccion: "Address or reference",
      direccionPlaceholder: "Street, number, area, site…",
      fechaLeyenda: "When do you need the service?",
      fechaDiaEtiqueta: "Day of the service",
      modalidadLeyenda: "Is this a one-off move or does it repeat?",
      frecuenciaEtiqueta: "How often?",
      frecuenciaVacio: "Select frequency",
      duracionEtiqueta: "Contract duration",
      duracionVacio: "Select duration",
      requisitosLeyenda: "Does your freight have any special requirement?",
      requisitosAyuda: "Tick the ones that apply. If none apply, continue.",
      requisitoOtroEtiqueta: "What is the requirement?",
      valorLeyenda: "Declared value of the freight",
      valorAyuda: "It sets the insurance cover. Values are in UF, the Chilean indexed unit. If you do not have it to hand, choose the last option.",
      empresa: "Company",
      empresaPlaceholder: "Registered or trading name",
      nombre: "Contact name",
      correo: "Email",
      correoPlaceholder: "name@company.cl",
      telefono: "Phone or WhatsApp",
      telefonoPlaceholder: "+56 9 1234 5678",
      canalLeyenda: "How would you prefer us to reply?",
    },
    tiposCarga: {
      contenedor: {
        etiqueta: "20′ / 40′ container",
        detalle: "Containerized freight",
      },
      suelta: {
        etiqueta: "Loose or palletized freight",
        detalle: "General or pallets",
      },
      granel: {
        etiqueta: "Bulk",
        detalle: "Aggregates, silo, liquids",
      },
      sobredimension: {
        etiqueta: "Oversized",
        detalle: "Exceeds standard dimensions",
      },
      peligrosa: {
        etiqueta: "Hazardous or specialized",
        detalle: "Requires special handling",
      },
      otra: {
        etiqueta: "Other",
        detalle: "Tell us which",
      },
    },
    equipos: {
      camionPequeno: {
        etiqueta: "Light truck",
      },
      ramplaPlana: {
        etiqueta: "Flatbed",
      },
      camaBaja: {
        etiqueta: "Lowboy",
      },
      batea: {
        etiqueta: "Tipper",
      },
      silo: {
        etiqueta: "Silo tanker",
      },
      contenedor: {
        etiqueta: "Container chassis",
      },
      asesoria: {
        etiqueta: "I am not sure, I need advice",
      },
    },
    fechas: {
      semana: {
        etiqueta: "This week",
        detalle: "Next 3 days",
      },
      especifica: {
        etiqueta: "Specific date",
        detalle: "I choose the day",
      },
      flexible: {
        etiqueta: "Flexible",
        detalle: "Let us agree the date",
      },
    },
    modalidades: {
      puntual: {
        etiqueta: "One-off",
        detalle: "A single move",
      },
      recurrente: {
        etiqueta: "Recurring",
        detalle: "Repeats over time",
      },
      contrato: {
        etiqueta: "Contract",
        detalle: "Sustained volume",
      },
    },
    frecuencias: {
      semanal: {
        etiqueta: "Weekly",
      },
      quincenal: {
        etiqueta: "Fortnightly",
      },
      mensual: {
        etiqueta: "Monthly",
      },
      otra: {
        etiqueta: "Other",
      },
    },
    duraciones: {
      tresMeses: {
        etiqueta: "3 months",
      },
      seisMeses: {
        etiqueta: "6 months",
      },
      doceMeses: {
        etiqueta: "12 months",
      },
      masDeDoceMeses: {
        etiqueta: "More than 12 months",
      },
    },
    requisitos: {
      acreditacionMinera: {
        etiqueta: "Mining accreditation",
      },
      cargaPeligrosa: {
        etiqueta: "Hazardous freight",
      },
      escolta: {
        etiqueta: "Escort or security",
      },
      refrigeracion: {
        etiqueta: "Refrigeration",
      },
      manipulacionEspecial: {
        etiqueta: "Special handling",
      },
      otro: {
        etiqueta: "Other",
      },
    },
    valores: {
      hasta1000: {
        etiqueta: "Up to 1,000 UF",
      },
      de1000a3000: {
        etiqueta: "1,000 – 3,000 UF",
      },
      masDe3000: {
        etiqueta: "More than 3,000 UF",
      },
      conversar: {
        etiqueta: "I would rather discuss it",
      },
    },
    canales: {
      whatsapp: {
        etiqueta: "WhatsApp",
      },
      correo: {
        etiqueta: "Email",
      },
      llamada: {
        etiqueta: "Phone call",
      },
    },
    errores: {
      tipoCarga: "Choose the type of freight you are going to move.",
      tipoCargaOtra: "Tell us what freight it is.",
      equipo: "Choose an equipment type, or ask for advice.",
      origenRegion: "Enter the region of origin.",
      origenComuna: "Enter the comuna of origin.",
      destinoRegion: "Enter the destination region.",
      destinoComuna: "Enter the destination comuna.",
      fecha: "Tell us when you need the service.",
      fechaDia: "Choose the day.",
      modalidad: "Enter the service type.",
      frecuencia: "Enter how often it repeats.",
      duracion: "Enter the contract duration.",
      requisitoOtro: "Specify the requirement.",
      valor: "Enter the declared value, or that you would rather discuss it.",
      empresa: "Enter the company.",
      nombre: "Enter your name.",
      correoFalta: "Enter your email.",
      correoIlegible: "Check the email, it looks incomplete.",
      telefonoFalta: "Enter a phone number.",
      telefonoIlegible: "Check the phone number: in Chile it is 9 digits.",
      canal: "Choose how you would prefer us to reply.",
    },
    acciones: {
      atras: "Back",
      siguiente: "Next",
      revisar: "Review request",
      guardarYVolver: "Save and return to the summary",
      volver: "Back",
      enviar: "Send request",
      enviando: "Sending…",
    },
    resumen: {
      titulo: "Review before sending",
      bajada: "If something is not right, edit it and you come straight back here.",
      editar: "Edit",
      tipoCarga: "Type of freight",
      equipo: "Equipment",
      origen: "Origin",
      destino: "Destination",
      cuando: "When",
      dia: "Day",
      modalidad: "Service type",
      duracion: "Duration",
      requisitos: "Requirements",
      sinRequisitos: "None indicated",
      valorDeclarado: "Declared value",
      empresa: "Company",
      contacto: "Contact",
      correo: "Email",
      telefono: "Phone",
      prefiere: "Prefers",
    },
    exito: {
      titulo: "We have your request.",
      cuerpo: "We reply in less than 24 business hours with a feasibility assessment of the route. If you need to move it sooner, write to us on WhatsApp.",
      otraSolicitud: "Send another request",
    },
    errorEnvio: {
      titulo: "We could not send your request.",
      enlaceWhatsapp: "send it on WhatsApp",
      conWhatsapp: "Nothing was lost: {whatsapp} with your details already filled in, or write to {correo}.",
      sinWhatsapp: "Write to us at {correo} and we will reply just the same.",
    },
    avisos: {
      faltaUnDato: "1 detail is missing before you can continue.",
      faltanDatos: "{n} details are missing before you can continue.",
      faltaUnPaso: "One step is still to be completed before sending.",
      enviando: "Sending your request.",
      recibida: "Request received.",
    },
  },

  /* ── Pie de página ───────────────────────────────────────────────── */
  pie: {
    descripcion: "Road freight transport across Chile, from Arica to Punta Arenas.",
    ctaCotizar: "Request a quote",
    columnaServicios: {
      titulo: "Services",
      tecnologia: "Technology and monitoring",
      queMovemos: "What we move",
      cobertura: "Nationwide coverage",
      cumplimiento: "Compliance",
    },
    columnaEmpresa: {
      titulo: "Company",
      comoFunciona: "How it works",
      clientes: "Clients",
      cotizar: "Get a quote",
    },
    contacto: {
      titulo: "Contact",
    },
    derechos: "Road freight transport across Chile",
  },

  /* ── Asesor flotante ─────────────────────────────────────────────── */
  asesor: {
    cargo: "Sales desk",
    mensaje: "👋 Do you need help with your freight, or would you like it quoted?",
    escribiendo: "Typing",
    cerrarMensaje: "Close message",
    tituloPanel: "Contact Main Logistics",
    cerrarPanel: "Close",
    opciones: {
      cotizar: {
        titulo: "Quote my freight",
        detalle: "Origin, destination and type of freight",
      },
      contacto: {
        titulo: "Have someone contact me",
        detalle: "I leave my details and they call me",
      },
      whatsapp: {
        titulo: "Talk on WhatsApp",
        detalle: "Direct reply in the chat",
      },
    },
    horario: "We reply during business hours.",
    abrirAsesor: "Talk to an advisor",
    cerrarAsesor: "Close advisor",
  },

  /* ── Piezas compartidas ──────────────────────────────────────────── */
  comunes: {
  },
};
