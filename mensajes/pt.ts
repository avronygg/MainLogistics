import type { Mensajes } from "./es";

/** Português do Brasil. Ver las reglas de escritura en `es.ts`. */
export const pt: Mensajes = {
  meta: {
    // §9 del doc de marca: nunca el nombre solo en el title tag.
    titulo: "Transporte de cargas em todo o Chile | Main Logistics",
    descripcion:
      "A Main Logistics move carga geral, de mineração, perigosa, refrigerada, florestal, contêineres, maquinário e superdimensionada de Arica a Punta Arenas, com monitoramento permanente e o padrão que cada setor exige.",
    ogDescripcion:
      "Qualquer carga. Qualquer destino do Chile. Com visibilidade total e zero surpresas.",
  },

  nav: {
    servicios: "Serviços",
    queMovemos: "O que movemos",
    cobertura: "Cobertura",
    contacto: "Contato",
    cotizar: "Cotação",
    cotizarMovil: "Cotar minha operação",
    principal: "Principal",
    inicio: "Main Logistics, início",
    abrirMenu: "Abrir menu",
    cerrarMenu: "Fechar menu",
    idioma: "Idioma",
    cambiarIdioma: "Mudar idioma",
  },

  /* ── Hero · portada ──────────────────────────────────────────────── */
  hero: {
    tituloLinea1: "Com a Main, a carga",
    tituloLinea2: "Sempre",
    bajadaLinea1: "Levamos sua carga a qualquer destino do Chile.",
    bajadaLinea2: "Você sabe a todo momento onde ela está e quando chega.",
    ctaPrincipal: "Cote sua carga",
    ctaSecundario: "Conheça nossos serviços",
    rotador: {
      frases: ["no prazo", "segura", "rastreada"],
      alternativas: "no prazo, segura ou rastreada",
    },
    tarjetas: {
      gps: {
        etiqueta: "GPS",
        estado: "Em rota",
        titulo: "Rastreamento em rota",
        detalle: "Rastreabilidade da coleta à entrega",
      },
      marca: {
        bajadaLinea1: "Transporte de cargas",
        bajadaLinea2: "em todo o Chile",
      },
    },
  },

  /* ── Servicios · los ocho, y el bento de apoyo ───────────────────── */
  servicios: {
    tituloLinea1: "Um só operador para",
    tituloDestacado: "toda a sua operação",
    bajada: {
      inicio: "Contêineres, maquinário, granéis ou armazenagem.",
      realce: "Oito serviços",
      fin: "com o equipamento que cada carga exige, coordenados de um só lugar.",
    },
    lista: {
      contenedores: {
        nombre: "Retirada de contêineres",
        detalle: "Retiramos seus contêineres no porto e levamos ao destino sem atrasos.",
        lleva: {
          contenedor20: "Contêiner 20′",
          contenedor40: "Contêiner 40′",
          puerto: "Porto",
        },
      },
      camaBaja: {
        nombre: "Prancha baixa",
        detalle: "Carga superdimensionada e máquinas pesadas com equipamentos especializados.",
        lleva: {
          maquinaria: "Maquinário",
          sobredimensionada: "Superdimensionada",
        },
      },
      ramplasPlanas: {
        nombre: "Carretas plataforma",
        detalle: "Carga geral e paletizada em carreta plataforma, para todo tipo de operação.",
        lleva: {
          general: "Geral",
          paletizada: "Paletizada",
        },
      },
      camionesPequenos: {
        nombre: "Caminhões leves",
        detalle: "Distribuição ágil para cargas menores e entregas de última milha.",
        lleva: {
          cargaMenor: "Carga menor",
          ultimaMilla: "Última milha",
        },
      },
      bateas: {
        nombre: "Caçambas",
        detalle: "Transporte de agregados e granéis em caçamba, com cobertura porto-destino.",
        lleva: {
          aridos: "Agregados",
          graneles: "Granéis",
        },
      },
      silos: {
        nombre: "Silos",
        detalle: "Transporte especializado de carga em silo para a indústria.",
        lleva: {
          granelCerrado: "Granel fechado",
        },
      },
      bess: {
        nombre: "Carga BESS",
        detalle: "Transporte de baterias e sistemas de armazenamento de energia com manuseio especializado.",
        lleva: {
          baterias: "Baterias",
          altoValor: "Alto valor",
        },
      },
      almacenaje: {
        nombre: "Desconsolidação e armazenagem",
        detalle: "Desconsolidamos e armazenamos sua carga em armazéns estratégicos.",
        lleva: {
          bodega: "Armazém",
          consolidado: "Consolidado",
        },
      },
    },
    ctaPrincipal: "Cote sua carga",
    ayuda: {
      pregunta: "Não sabe qual equipamento precisa?",
      respuesta: "Nós orientamos.",
    },
    pilares: {
      titulo: {
        inicio: "Com a MAIN, sua carga sempre",
        realce: "sob controle",
        fin: ".",
      },
      bajada: {
        realceUbicacion: "Saber onde está",
        finUbicacion: "a cada momento.",
        realceNorma: "Cumprir a norma",
        finNorma: "que seu setor exige.",
        realceHora: "Chegar na hora",
        finHora: "combinada.",
      },
      tecnologia: {
        altFoto: "Equipamento de monitoramento com a marca Main Logistics, com o conector de dados à vista",
        etiqueta: "GPS em rota",
        titulo: {
          inicio: "Veja sua carga em",
          realce: "tempo real",
          fin: ", sem esperar a ligação.",
        },
        detalle: {
          realce: "GPS e monitoramento permanente.",
          fin: "Rastreabilidade da coleta até a entrega, com relatórios auditáveis online.",
        },
      },
      cobertura: {
        etiqueta: "Cobertura",
        titulo: "De Arica a Punta Arenas.",
        detalle: {
          realce: "Cobertura nacional",
          fin: ", com o equipamento e a documentação que cada setor pede.",
        },
      },
      queMovemos: {
        etiqueta: "O que movemos",
        titulo: "Oito tipos de carga, um só fornecedor.",
        detalle: "De carga geral a superdimensionada, com o equipamento que cada uma exige.",
        cargas: {
          general: "Geral",
          minera: "Mineração",
          peligrosa: "Perigosa",
          refrigerada: "Refrigerada",
          forestal: "Florestal",
          contenedores: "Contêineres",
          maquinaria: "Maquinário",
          sobredimensionada: "Superdimensionada",
        },
        enlace: "Veja o que cada uma exige",
      },
      seguridad: {
        altFoto: "Amarração de carga com cinta e catraca tensionada sobre a plataforma de um semirreboque",
        etiqueta: "Segurança",
        titulo: {
          inicio: "Sua carga sempre",
          realce: "segura",
          fin: ".",
        },
        detalle: {
          realce: "Transportadores verificados",
          fin: ", documentação em dia e o padrão de cada setor.",
        },
      },
    },
  },

  /* ── Qué movemos · tipos de carga ────────────────────────────────── */
  cargas: {
    tituloLinea1: "Cada carga tem suas exigências.",
    tituloDestacado: "Nós cumprimos",
    bajada: "Cada carga tem sua norma, seu equipamento e sua documentação.",
    bajadaRealce: "Esta é a de cada uma.",
    briefFoto: "Plano aberto da carreta carregada com mistura de carga: pallets, um contêiner e maquinário no mesmo pátio. É a foto que prova a versatilidade.",
    etiquetaTipos: "tipos de carga",
    tipos: {
      general: {
        nombre: "Geral",
        exige: "Carreta plataforma, baú ou carga paletizada, conforme volume e rota.",
      },
      minera: {
        nombre: "Mineração",
        exige: "Homologação para entrar na mina e controle de fadiga em rota.",
      },
      peligrosa: {
        nombre: "Perigosa",
        exige: "Rotulagem, ficha de segurança e motorista com curso vigente.",
      },
      refrigerada: {
        nombre: "Refrigerada",
        exige: "Cadeia de frio contínua com registro de temperatura da viagem.",
      },
      forestal: {
        nombre: "Florestal",
        exige: "Amarração certificada e rotas rurais com tráfego de operação.",
      },
      contenedores: {
        nombre: "Contêineres",
        exige: "Coordenação portuária, janela de retirada e lacre verificado.",
      },
      maquinaria: {
        nombre: "Maquinário",
        exige: "Prancha baixa, cálculo de gabarito e autorizações de trânsito.",
      },
      sobredimensionada: {
        nombre: "Superdimensionada",
        exige: "Autorização especial, escolta e horário de circulação restrito.",
      },
    },
  },

  /* ── Cumplimiento · por industria ────────────────────────────────── */
  cumplimiento: {
    tituloLinea1: "Licenças e certificações",
    tituloDestacado: "em dia em cada despacho",
    bajadaRealce: "Escolha seu setor",
    bajadaResto: "e veja o que é conferido antes de sua carga sair.",
    etiquetaPestanas: "Marcos normativos por setor",
    mineria: {
      nombre: "Mineração",
      briefFoto: "Caminhão da Main entrando na mina: portaria, poeira, colete refletivo e o equipamento homologado à vista.",
      titulo: "A homologação é exigida antes de carregar.",
      detalle: "Documentação do transportador, do equipamento e do motorista, conferida e vigente no dia do despacho. Na portaria já é tarde.",
      puntos: {
        homologacion: "Homologação de transportador e equipamento para a mina",
        fatiga: "Controle de fadiga e descansos em rota",
        continuidad: "Continuidade de abastecimento em turnos",
      },
    },
    peligrosa: {
      nombre: "Carga perigosa",
      briefFoto: "Detalhe do rótulo de substância perigosa na carreta, com a ficha de segurança em primeiro plano.",
      titulo: "O que não está rotulado não sai.",
      detalle: "Rotulagem conforme a classe da substância, ficha de segurança a bordo e motorista com curso vigente. A documentação viaja com a carga, não depois.",
      puntos: {
        rotulacion: "Rotulagem e segregação conforme a classe",
        hojaSeguridad: "Ficha de segurança e equipamentos de emergência a bordo",
        curso: "Motorista com curso de produtos perigosos vigente",
      },
    },
    agro: {
      nombre: "Agro e salmonicultura",
      briefFoto: "Interior de um baú refrigerado com o registrador de temperatura na tela e a carga estivada.",
      titulo: "A cadeia de frio se rompe uma vez.",
      detalle: "Temperatura registrada durante toda a viagem, não só no carregamento e na descarga. Na safra, a janela de horário manda tanto quanto o termômetro.",
      puntos: {
        temperatura: "Registro de temperatura da viagem completa",
        fitosanitario: "Protocolos fitossanitários e certificação de origem",
        ventanas: "Janelas de safra e coordenação do packing",
      },
    },
    forestal: {
      nombre: "Florestal",
      briefFoto: "Toras amarradas sobre a carreta em estrada de terra, com a cinta tensionada em primeiro plano.",
      titulo: "A amarração é conferida antes de sair e em cada parada.",
      detalle: "Volume alto em estradas nem sempre pavimentadas, com trânsito de operação na mesma rota.",
      puntos: {
        buenasPracticas: "Boas práticas de segurança em operação florestal",
        amarre: "Amarração certificada e conferência em rota",
        transito: "Coordenação com o trânsito da operação",
      },
    },
    contenedores: {
      nombre: "Contêineres",
      marcoPuerto: "Porto",
      briefFoto: "Contêiner saindo do terminal portuário com o lacre visível na porta.",
      titulo: "A janela de retirada não espera.",
      detalle: "Coordenação com o terminal, lacre verificado e devolução dentro do prazo livre. Um dia de sobrestadia custa mais que o frete.",
      puntos: {
        ventana: "Coordenação da janela com o terminal",
        sello: "Verificação do lacre na retirada e na entrega",
        diasLibres: "Controle de dias livres e devolução",
      },
    },
  },

  /* ── Reseñas y franja de clientes ────────────────────────────────── */
  resenas: {
    tituloLinea1: "O que dizem",
    tituloDestacado: "nossos clientes",
    bajadaInicio: "Chefes de logística e suprimentos que ",
    bajadaRealce: "atendem o telefone",
    bajadaFin: " quando um colega pergunta sobre nós.",
    testimonios: {
      mineria: {
        cita: "Aqui vai uma citação concreta: um prazo que foi cumprido com a planta parada, não uma frase sobre qualidade de serviço.",
        nombre: "Nome Sobrenome",
        cargo: "Coordenador de Logística",
        empresa: "Empresa",
        industria: "Mineração",
      },
      agroexportacion: {
        cita: "A segunda convém que fale da visibilidade. O que mudou quando deixaram de ter que ligar para saber onde estava a carga.",
        nombre: "Nome Sobrenome",
        cargo: "Gerente de Operações",
        empresa: "Empresa",
        industria: "Agroexportação",
      },
      retail: {
        cita: "Uma sobre conformidade documental: a auditoria que passou sem observações.",
        nombre: "Nome Sobrenome",
        cargo: "Coordenador de Suprimentos",
        empresa: "Empresa",
        industria: "Varejo",
      },
      cargaPeligrosa: {
        cita: "Uma que mostre que o padrão não muda conforme o que se move. De preferência de quem move carga perigosa.",
        nombre: "Nome Sobrenome",
        cargo: "Gerente de Planta",
        empresa: "Empresa",
        industria: "Indústria",
      },
      forestal: {
        cita: "Outra sobre o que aconteceu quando algo saiu da rota e como souberam antes de ter que perguntar.",
        nombre: "Nome Sobrenome",
        cargo: "Coordenadora de Transporte",
        empresa: "Empresa",
        industria: "Florestal",
      },
      farmaceutica: {
        cita: "A última pode ser curta. O que diria a um colega que está avaliando fornecedor.",
        nombre: "Nome Sobrenome",
        cargo: "Gerente de Supply Chain",
        empresa: "Empresa",
        industria: "Farmacêutica",
      },
    },
    franja: {
      encabezado: "Confiam em nós",
    },
  },

  /* ── Cómo funciona · el timeline ─────────────────────────────────── */
  comoFunciona: {
    tituloLinea1: "Como funciona,",
    tituloDestacado: "em três passos",
    bajadaInicio: "Da cotação até a entrega,",
    bajadaRealce: "sempre há alguém com nome",
    bajadaFin: "do outro lado.",
    paso: "Passo",
    hitos: {
      cotizacion: {
        titulo: "Cotação",
        detalle: "Você diz o que move, de onde e para onde. Devolvemos uma avaliação de viabilidade da rota, não um preço solto.",
        dato: "Resposta por e-mail",
      },
      retiro: {
        titulo: "Coleta",
        detalle: "Transportador verificado e equipamento adequado à carga. A documentação é emitida antes de o caminhão sair.",
        dato: "Guia de despacho eletrônica",
      },
      entrega: {
        titulo: "Entrega",
        detalle: "Acompanhamento durante toda a viagem. Se algo sai da rota, sabemos antes de você, e já estamos resolvendo.",
        dato: "Comprovante de entrega",
      },
    },
    plazosAltFoto: "Relógio com a marca Main Logistics mostrando o horário de entrega",
    plazosEtiqueta: "Prazos",
    plazosTituloInicio: "Sua carga sempre",
    plazosTituloDestacado: "no prazo",
    plazosTituloFin: ".",
    plazosDetalle: "Sem atrasos que você tenha que explicar em uma reunião.",
  },

  /* ── Equipo ──────────────────────────────────────────────────────── */
  equipo: {
    tituloLinea1: "Quem move",
    tituloDestacado: "sua carga",
    bajadaInicio: "Motoristas, armazém e descarga.",
    bajadaRealce: "Todos passam pelo mesmo padrão antes de tocar sua carga",
    bajadaFin: ", não importa de que setor ela venha.",
    conductor: {
      altFoto: "Motorista da Main Logistics na cabine, com boné da marca",
      tituloInicio: "Transportadores",
      tituloDestacado: "verificados",
      tituloFin: "antes de carregar.",
    },
    estandares: {
      papeles: {
        titulo: "Documentos em dia, conferidos",
        detalle: "Documentação do transportador, do equipamento e do motorista, conferida e vigente no dia do despacho.",
      },
      experiencia: {
        titulo: "Experiência na carga que você move",
        detalle: "Motoristas e equipe de armazém e descarga que já trabalharam com seu tipo de carga antes deste despacho.",
      },
      central: {
        titulo: "Uma central que responde",
        detalle: "Alguém com nome do outro lado durante toda a viagem, e que responde no mesmo dia.",
      },
    },
    flota: {
      altFoto: "Porta de caminhão com a marca Main Logistics",
      titulo: "O padrão é o mesmo, quem quer que dirija.",
    },
    bodega: {
      altFoto: "Operador da Main Logistics conferindo pallets no armazém com um tablet",
      tituloInicio: "Armazém e descarga, com o",
      tituloDestacado: "mesmo controle",
      tituloFin: ".",
    },
    portal: {
      altFoto: "Tablet na cabine mostrando a rota ativa no portal da Main Logistics",
      estado: "Em desenvolvimento",
      titulo: "O portal para acompanhar sua carga.",
    },
  },

  /* ── Cotización · el formulario de seis pasos ────────────────────── */
  cotizar: {
    tituloLinea1: "Cote sua carga.",
    tituloDestacado: "Respondemos em 24 horas",
    bajada: "Conte o que você move e devolvemos uma avaliação de viabilidade da rota, não um preço solto.",
    garantias: {
      respuesta: "Respondemos em menos de 24 horas úteis",
      sinCompromiso: "Sem compromisso nem cadastro prévio",
      rutaHonesta: "Se sua rota não encaixa, nós dizemos",
    },
    pasosCortos: "Seis passos curtos.",
    datosAlFinal: "Seus dados ficam no final.",
    pasoDeTotal: "Passo {n} de {total}.",
    guardado: {
      retomado: "Retomamos de onde você parou.",
      empezarDeNuevo: "Começar de novo",
    },
    pasos: {
      carga: {
        titulo: "Sua carga",
        bajada: "O que move e com qual equipamento.",
      },
      ruta: {
        titulo: "A rota",
        bajada: "De onde e para onde.",
      },
      fecha: {
        titulo: "Quando",
        bajada: "A data do serviço.",
      },
      modalidad: {
        titulo: "Modalidade",
        bajada: "Uma vez ou de forma contínua.",
      },
      requisitos: {
        titulo: "Requisitos",
        bajada: "O que o seu setor exige.",
      },
      contacto: {
        titulo: "Seus dados",
        bajada: "Para responder a você.",
      },
    },
    riel: {
      resumen: "Resumo",
      pasoNavegable: "Passo {n}, {titulo}, concluído. Voltar para editar.",
      pasoActual: "Passo {n}, {titulo}, passo atual",
      pasoCompletado: "Passo {n}, {titulo}, concluído",
      pasoPendiente: "Passo {n}, {titulo}, pendente",
    },
    campos: {
      opcional: "(opcional)",
      trampaBots: "Não preencher",
      tipoCargaLeyenda: "O que você vai transportar?",
      tipoCargaOtraEtiqueta: "Qual é a carga?",
      tipoCargaOtraPlaceholder: "Descreva em poucas palavras",
      equipoLeyenda: "De qual equipamento você precisa?",
      equipoAyuda: "Se não tiver certeza, escolha a última opção e nós orientamos.",
      origen: "Origem",
      destino: "Destino",
      region: "Região",
      regionVacio: "Selecione a região",
      comuna: "Comuna",
      comunaVacio: "Selecione a comuna",
      comunaSinRegion: "Escolha primeiro a região",
      direccion: "Endereço ou referência",
      direccionPlaceholder: "Rua, número, bairro, mina…",
      fechaLeyenda: "Quando você precisa do serviço?",
      fechaDiaEtiqueta: "Dia do serviço",
      modalidadLeyenda: "É um transporte pontual ou se repete?",
      frecuenciaEtiqueta: "Com que frequência?",
      frecuenciaVacio: "Selecione a frequência",
      duracionEtiqueta: "Duração do contrato",
      duracionVacio: "Selecione a duração",
      requisitosLeyenda: "Sua carga tem alguma exigência especial?",
      requisitosAyuda: "Marque as que se aplicam. Se nenhuma se aplica, siga.",
      requisitoOtroEtiqueta: "Qual é o requisito?",
      valorLeyenda: "Valor declarado da carga",
      valorAyuda: "Define a cobertura do seguro. UF é a unidade indexada chilena. Se não tiver em mãos, escolha a última opção.",
      empresa: "Empresa",
      empresaPlaceholder: "Razão social ou nome fantasia",
      nombre: "Nome do contato",
      correo: "E-mail",
      correoPlaceholder: "nome@empresa.cl",
      telefono: "Telefone ou WhatsApp",
      telefonoPlaceholder: "+56 9 1234 5678",
      canalLeyenda: "Por onde você prefere a resposta?",
    },
    tiposCarga: {
      contenedor: {
        etiqueta: "Contêiner 20′ / 40′",
        detalle: "Carga em contêiner",
      },
      suelta: {
        etiqueta: "Carga solta ou paletizada",
        detalle: "Geral ou pallets",
      },
      granel: {
        etiqueta: "Granéis",
        detalle: "Agregados, silos, líquidos",
      },
      sobredimension: {
        etiqueta: "Superdimensionada",
        detalle: "Excede medidas padrão",
      },
      peligrosa: {
        etiqueta: "Perigosa ou especializada",
        detalle: "Exige manuseio especial",
      },
      otra: {
        etiqueta: "Outra",
        detalle: "Conte qual",
      },
    },
    equipos: {
      camionPequeno: {
        etiqueta: "Caminhão leve",
      },
      ramplaPlana: {
        etiqueta: "Carreta plataforma",
      },
      camaBaja: {
        etiqueta: "Prancha baixa",
      },
      batea: {
        etiqueta: "Caçamba",
      },
      silo: {
        etiqueta: "Silo",
      },
      contenedor: {
        etiqueta: "Equipamento para contêiner",
      },
      asesoria: {
        etiqueta: "Não tenho certeza, preciso de orientação",
      },
    },
    fechas: {
      semana: {
        etiqueta: "Esta semana",
        detalle: "Próximos 3 dias",
      },
      especifica: {
        etiqueta: "Data específica",
        detalle: "Eu escolho o dia",
      },
      flexible: {
        etiqueta: "Flexível",
        detalle: "Vamos combinar a data",
      },
    },
    modalidades: {
      puntual: {
        etiqueta: "Pontual",
        detalle: "Um único transporte",
      },
      recurrente: {
        etiqueta: "Recorrente",
        detalle: "Se repete no tempo",
      },
      contrato: {
        etiqueta: "Contrato",
        detalle: "Volume contínuo",
      },
    },
    frecuencias: {
      semanal: {
        etiqueta: "Semanal",
      },
      quincenal: {
        etiqueta: "Quinzenal",
      },
      mensual: {
        etiqueta: "Mensal",
      },
      otra: {
        etiqueta: "Outra",
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
        etiqueta: "Mais de 12 meses",
      },
    },
    requisitos: {
      acreditacionMinera: {
        etiqueta: "Credenciamento em mina",
      },
      cargaPeligrosa: {
        etiqueta: "Carga perigosa",
      },
      escolta: {
        etiqueta: "Escolta ou segurança",
      },
      refrigeracion: {
        etiqueta: "Refrigeração",
      },
      manipulacionEspecial: {
        etiqueta: "Manuseio especial",
      },
      otro: {
        etiqueta: "Outro",
      },
    },
    valores: {
      hasta1000: {
        etiqueta: "Até 1.000 UF",
      },
      de1000a3000: {
        etiqueta: "1.000 – 3.000 UF",
      },
      masDe3000: {
        etiqueta: "Mais de 3.000 UF",
      },
      conversar: {
        etiqueta: "Prefiro conversar",
      },
    },
    canales: {
      whatsapp: {
        etiqueta: "WhatsApp",
      },
      correo: {
        etiqueta: "E-mail",
      },
      llamada: {
        etiqueta: "Ligação",
      },
    },
    errores: {
      tipoCarga: "Escolha que tipo de carga vai mover.",
      tipoCargaOtra: "Conte qual é a carga.",
      equipo: "Escolha um equipamento, ou peça orientação.",
      origenRegion: "Informe a região de origem.",
      origenComuna: "Informe a comuna de origem.",
      destinoRegion: "Informe a região de destino.",
      destinoComuna: "Informe a comuna de destino.",
      fecha: "Informe quando precisa do serviço.",
      fechaDia: "Escolha o dia.",
      modalidad: "Informe a modalidade.",
      frecuencia: "Informe com que frequência se repete.",
      duracion: "Informe a duração do contrato.",
      requisitoOtro: "Especifique o requisito.",
      valor: "Informe o valor declarado, ou que prefere conversar.",
      empresa: "Informe a empresa.",
      nombre: "Informe seu nome.",
      correoFalta: "Informe seu e-mail.",
      correoIlegible: "Confira o e-mail, parece incompleto.",
      telefonoFalta: "Informe um telefone.",
      telefonoIlegible: "Confira o telefone: no Chile são 9 dígitos.",
      canal: "Escolha por onde prefere que respondamos.",
    },
    acciones: {
      atras: "Anterior",
      siguiente: "Próximo",
      revisar: "Revisar solicitação",
      guardarYVolver: "Salvar e voltar ao resumo",
      volver: "Voltar",
      enviar: "Enviar solicitação",
      enviando: "Enviando…",
    },
    resumen: {
      titulo: "Revise antes de enviar",
      bajada: "Se algo não estiver certo, edite e você volta para cá.",
      editar: "Editar",
      tipoCarga: "Tipo de carga",
      equipo: "Equipamento",
      origen: "Origem",
      destino: "Destino",
      cuando: "Quando",
      dia: "Dia",
      modalidad: "Modalidade",
      duracion: "Duração",
      requisitos: "Requisitos",
      sinRequisitos: "Nenhum informado",
      valorDeclarado: "Valor declarado",
      empresa: "Empresa",
      contacto: "Contato",
      correo: "E-mail",
      telefono: "Telefone",
      prefiere: "Prefere",
    },
    exito: {
      titulo: "Recebemos sua solicitação.",
      cuerpo: "Respondemos em menos de 24 horas úteis com uma avaliação de viabilidade da rota. Se precisar mover antes, escreva para nós pelo WhatsApp.",
      otraSolicitud: "Enviar outra solicitação",
    },
    errorEnvio: {
      titulo: "Não conseguimos enviar sua solicitação.",
      enlaceWhatsapp: "envie pelo WhatsApp",
      conWhatsapp: "Nada se perdeu: {whatsapp} com os dados já preenchidos, ou escreva para {correo}.",
      sinWhatsapp: "Escreva para {correo} e respondemos assim mesmo.",
    },
    avisos: {
      faltaUnDato: "Falta 1 dado para continuar.",
      faltanDatos: "Faltam {n} dados para continuar.",
      faltaUnPaso: "Falta concluir um passo antes de enviar.",
      enviando: "Enviando sua solicitação.",
      recibida: "Solicitação recebida.",
    },
  },

  /* ── Pie de página ───────────────────────────────────────────────── */
  pie: {
    descripcion: "Transporte rodoviário de cargas em todo o Chile, de Arica a Punta Arenas. Respaldo do grupo MainBrain.",
    ctaCotizar: "Cote sua carga",
    columnaServicios: {
      titulo: "Serviços",
      tecnologia: "Tecnologia e monitoramento",
      queMovemos: "O que movemos",
      cobertura: "Cobertura nacional",
      cumplimiento: "Conformidade",
    },
    columnaEmpresa: {
      titulo: "Empresa",
      comoFunciona: "Como funciona",
      clientes: "Clientes",
      cotizar: "Cotação",
    },
    contacto: {
      titulo: "Contato",
    },
    derechos: "Transporte de cargas em todo o Chile",
  },

  /* ── Asesor flotante ─────────────────────────────────────────────── */
  asesor: {
    cargo: "Atendimento comercial",
    mensaje: "👋 Precisa de ajuda com sua carga ou quer uma cotação?",
    escribiendo: "Escrevendo",
    cerrarMensaje: "Fechar mensagem",
    tituloPanel: "Falar com a Main Logistics",
    cerrarPanel: "Fechar",
    opciones: {
      cotizar: {
        titulo: "Cotar minha carga",
        detalle: "Origem, destino e tipo de carga",
      },
      contacto: {
        titulo: "Que entrem em contato",
        detalle: "Deixo meus dados e me ligam",
      },
      whatsapp: {
        titulo: "Falar pelo WhatsApp",
        detalle: "Resposta direta no chat",
      },
    },
    horario: "Respondemos em horário comercial.",
    abrirAsesor: "Falar com um consultor",
    cerrarAsesor: "Fechar atendimento",
  },

  /* ── Piezas compartidas ──────────────────────────────────────────── */
  comunes: {
    fotoPendiente: "Foto pendente",
  },
};
