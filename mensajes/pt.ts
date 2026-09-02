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
    transportistas: "Transportadores",
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
          fin: ", sem precisar ligar para saber.",
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
      importacion: {
        cita:
          "Importamos por contêiner e antes cada retirada era um problema diferente. Agora mando o BL e me avisam quando saiu do porto. Deixei de ficar em cima.",
        nombre: "Matías Corvalán",
        cargo: "Sócio fundador",
        empresa: "The Wallpaper Guys",
        industria: "Importação",
      },
      quimicos: {
        cita:
          "Movimentamos produtos químicos e aí a FISPQ e a rotulagem não são opcionais. Não tivemos nenhuma remessa devolvida por documentação.",
        nombre: "Óscar Villablanca",
        cargo: "Encarregado de Almoxarifado",
        empresa: "Clean Controls",
        industria: "Químicos",
      },
      congelados: {
        cita:
          "Nosso produto vai congelado, então o horário pesa mais que o preço. Coordenam a saída cedo e chega na faixa. É tudo o que peço de um transporte.",
        nombre: "Javiera Pizarro",
        cargo: "Gerente de Operações",
        empresa: "Acai Prime",
        industria: "Alimentos congelados",
      },
      gastronomia: {
        cita:
          "No começo tivemos um desencontro com o horário de recebimento de uma loja. Resolveram mudando a rota por conta própria, sem eu ter que insistir. São oito meses sem ruptura de abastecimento.",
        nombre: "Diego Sanhueza",
        cargo: "Responsável de Suprimentos",
        empresa: "American Prime Burger",
        industria: "Gastronomia",
      },
      abastecimiento: {
        cita:
          "Coordenamos o abastecimento de várias lojas ao mesmo tempo. O que eu precisava era de um único interlocutor respondendo por todas as entregas, não cinco transportadores diferentes. É o que tenho.",
        nombre: "Paulina Herrera",
        cargo: "Coordenadora de Suprimentos",
        empresa: "Restaurant Administration Center",
        industria: "Serviços para gastronomia",
      },
      produccion: {
        cita:
          "Movimentamos equipamentos de montagem para campo e quase sempre com data fixa. Não chegamos atrasados a nenhuma instalação.",
        nombre: "Ignacio Rebolledo",
        cargo: "Diretor de Produção",
        empresa: "Main Brain",
        industria: "Produção",
      },
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
        detalle: "Você diz o que move, de onde e para onde. Respondemos se podemos assumir e com qual equipamento.",
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
        detalle: "Os documentos são conferidos na manhã do despacho, não na assinatura do contrato. Uma licença vencida naquela semana para o caminhão do mesmo jeito.",
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
    bajada: "Conte o que você move e dizemos se a rota se encaixa, com qual equipamento e em que prazo.",
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
        etiqueta: "1.000 a 3.000 UF",
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
      bajada: "Se algo não estiver certo, edite. Você volta para esta tela.",
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
    descripcion: "Transporte rodoviário de cargas em todo o Chile, de Arica a Punta Arenas.",
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

  /* ── Legal ───────────────────────────────────────────────────────────
     Só os rótulos. O corpo dos dois documentos fica em
     `components/datos/legal.ts` e é publicado apenas em espanhol. */
  legal: {
    columna: "Jurídico",
    indice: "Nesta página",
    actualizado: "Atualizado em",
    volver: "Voltar ao início",
    avisoIdioma:
      "Este documento é publicado em espanhol, e a versão em espanhol é a que vale. Se alguma parte não ficar clara, escreva para nós e explicamos em português.",
    privacidad: "Política de privacidade",
    terminos: "Termos de uso",
    consentimiento:
      "Ao enviar, você aceita que tratemos seus dados para responder a esta solicitação. Nada além disso.",
    consentimientoEnlace: "O que fazemos com seus dados",
  },

  /* ── Páginas de servicio ─────────────────────────────────────────────
     Os termos de equipamento vão para o termo do setor: cama baja é
     prancha baixa, rampla plana é carreta plataforma. Ver `es.ts`. */
  paginasServicio: {
    hub: {
      titulo: "O detalhe de",
      destacado: "cada serviço",
      bajada:
        "Cada carga pede um equipamento, uma documentação e um jeito de amarrar. Aqui está o que cada uma exige e com o que a movemos.",
    },
    volver: "Todos os serviços",
    queExige: "O que esta carga exige",
    equipoHabitual: "Equipamento habitual",
    preguntas: "Perguntas frequentes",
    ctaTitulo: "Conte o que você move",
    ctaTexto:
      "Respondemos em 24 horas. Se a sua rota não se encaixa, dizemos na hora: isso poupa uma semana esperando uma cotação que não viria.",
    ctaBoton: "Cotar esta carga",
    paginas: {
      contenedores: {
        titulo: "Retirada e devolução",
        destacado: "de contêineres no porto",
        bajada:
          "Movemos seu contêiner entre o porto e o seu armazém, com o equipamento e os prazos que o terminal exige.",
        intro:
          "Contêiner não espera. O terminal cobra armazenagem a partir do dia em que vence o período livre, e o armador cobra demurrage enquanto o contêiner estiver fora. Os dois relógios correm ao mesmo tempo e por motivos diferentes. Por isso este serviço é coordenado contra a data de vencimento, e não contra a data de retirada.",
        exigencias: [
          {
            titulo: "Agendamento no terminal",
            detalle:
              "Os portos operam com janela atribuída. Chegar fora dela significa voltar outro dia, e esse dia alguém paga.",
          },
          {
            titulo: "Equipamento com travas de contêiner",
            detalle:
              "Chassi porta-contêiner ou carreta com twist locks. Um contêiner preso só com cintas sobre plataforma plana não atende.",
          },
          {
            titulo: "Uma guia de despacho por transporte",
            detalle:
              "A partir de 1º de novembro de 2026 a guia precisa trazer origem e destino efetivos, placa, motorista e hora real de saída. Retirada e devolução são dois transportes, portanto duas guias.",
          },
        ],
        faq: [
          {
            p: "Vocês fazem retirada e devolução, ou só uma ponta?",
            r: "As duas. Dá para contratar só a retirada, só a devolução ou o ciclo completo. No ciclo completo coordenamos os dois agendamentos com o terminal para o contêiner não ficar esperando no meio.",
          },
          {
            p: "E se o contêiner não estiver pronto no dia do agendamento?",
            r: "Você avisa e reprogramamos com o terminal. O que não fazemos é mandar o caminhão esperar: caminhão parado no portão do porto não serve a ninguém e é cobrado do mesmo jeito.",
          },
          {
            p: "Trabalham com contêineres de 20 e 40 pés?",
            r: "Com os dois. Na cotação você diz qual é e quanto pesa a carga: um 20 pés carregado de material denso pode exigir mais equipamento que um 40 pés leve.",
          },
        ],
      },
      cargaGeneral: {
        titulo: "Carga geral",
        destacado: "e paletizada",
        bajada:
          "O que anda em carreta plataforma ou caminhão leve: volumes, paletes, insumos, material de obra.",
        intro:
          "É o serviço mais pedido e onde mais se subestima o detalhe. O que define o equipamento não é o peso total, e sim a relação entre peso e volume: mil quilos de material denso cabem num caminhão leve, mil quilos de material volumoso não. Por isso perguntamos as duas coisas antes de cotar.",
        exigencias: [
          {
            titulo: "Peso e volume declarados",
            detalle:
              "Uma tonelagem mal declarada muda o equipamento e o preço, e numa balança muda também quem responde pela multa.",
          },
          {
            titulo: "Amarração conforme a carga",
            detalle:
              "Paletes, volumes soltos e material empilhável não se amarram do mesmo jeito. Carga mal presa é a primeira causa de avaria em trânsito, e acontece no pátio de origem, não na estrada.",
          },
          {
            titulo: "Documentação do transporte",
            detalle:
              "Guia de despacho com a descrição precisa do que vai em cima: quantidade, unidade, peso ou volume e preço unitário, salvo se não for venda, e aí vai o motivo.",
          },
        ],
        faq: [
          {
            p: "Existe carga mínima?",
            r: "Não há mínimo rígido. O que muda é o equipamento: abaixo de certo volume compensa um caminhão leve, e acima de certo ponto compensa uma carreta inteira. Você diz o que move e propomos o que corresponde.",
          },
          {
            p: "Vocês consolidam carga de clientes diferentes?",
            r: "Depende da rota e da carga. Quando dá, baixa o custo. Quando a carga exige exclusividade, dizemos na cotação em vez de você descobrir no caminho.",
          },
          {
            p: "Como sei qual equipamento preciso?",
            r: "Você não precisa saber. No formulário de cotação existe uma opção para isso e resolvemos com os dados da carga.",
          },
        ],
      },
      insumosMineros: {
        titulo: "Insumos e materiais",
        destacado: "para mineração",
        bajada:
          "Material de operação, peças e consumíveis até a mina, com a credencial que cada uma exige na portaria.",
        intro:
          "Na mineração o transporte não termina na estrada: termina na portaria da mina, e ali a carga entra ou não conforme os documentos do caminhão e do motorista. Cada companhia mantém o seu padrão de credenciamento, e não basta cumprir a lei: é preciso cumprir o que aquela mina em particular pede.",
        exigencias: [
          {
            titulo: "Credenciamento do motorista e do veículo",
            detalle:
              "Cada mina mantém o seu próprio registro. Um caminhão que entrou mês passado pode não entrar hoje se um documento venceu.",
          },
          {
            titulo: "Controle de fadiga em rota",
            detalle:
              "As rotas de mineração são longas e em altitude. Os tempos de condução e descanso não são recomendação: são condição de entrada.",
          },
          {
            titulo: "Janela de descarga coordenada",
            detalle:
              "A mina opera por turnos. Chegar fora da janela significa esperar o turno seguinte, com caminhão e motorista parados.",
          },
        ],
        faq: [
          {
            p: "Vocês já estão credenciados na minha mina?",
            r: "Depende de qual. Diga onde você descarrega e falamos com franqueza se a rede já opera ali ou se é preciso fazer o credenciamento antes, com o prazo que isso leva.",
          },
          {
            p: "Sobem a minas em altitude?",
            r: "Sim, com o equipamento e o motorista que a rota exige. A altitude muda o rendimento do caminhão e os tempos, e isso já entra na cotação, não como surpresa depois.",
          },
          {
            p: "Podem coordenar direto com a área de suprimentos?",
            r: "Sim. Em operações recorrentes o normal é coordenarmos a janela direto com a mina, e você receber o aviso quando a carga entrou.",
          },
        ],
      },
      bessEnergia: {
        titulo: "Baterias BESS",
        destacado: "e equipamentos de energia",
        bajada:
          "Contêineres de armazenamento, transformadores e estrutura para projetos de geração, com o manuseio que exige um equipamento que não pode levar pancada.",
        intro:
          "Um sistema de armazenamento em baterias chega ao Chile em contêineres que pesam dezenas de toneladas, não podem ser inclinados, não podem levar pancada e muitas vezes excedem as medidas padrão. O equipamento custa várias vezes o frete, então aqui o critério não é mover rápido: é não danificar nada e chegar quando o local estiver pronto para receber.",
        exigencias: [
          {
            titulo: "Equipamento para superdimensionado",
            detalle:
              "Prancha baixa ou extensível conforme a altura e a largura do volume. A altura total define a rota, porque define por baixo de que estruturas dá para passar.",
          },
          {
            titulo: "Autorização especial de trânsito",
            detalle:
              "Quando o volume excede as medidas máximas, o transporte precisa de autorização e rota aprovada. Se protocola antes, e o prazo do trâmite faz parte do prazo de entrega.",
          },
          {
            titulo: "Amarração e controle de impacto",
            detalle:
              "Bateria não se amarra como máquina. A amarração distribui a força sobre os pontos que o fabricante define, e não sobre a estrutura do contêiner.",
          },
          {
            titulo: "Coordenação com a obra",
            detalle:
              "Num parque em construção o acesso muda de semana para semana. A data de entrega é fixada contra o estado real da estrada e do ponto de descarga.",
          },
        ],
        faq: [
          {
            p: "Quanto pesa o que vocês conseguem mover?",
            r: "Diga o peso, as medidas e a altura do volume e respondemos com o equipamento que corresponde e se precisa de autorização. Sem esses três dados, qualquer resposta seria inventada.",
          },
          {
            p: "A autorização de superdimensionado é vocês que providenciam?",
            r: "Sim, quando a carga exige. Vai na cotação como item à parte e com o seu prazo, porque o trâmite tem um tempo próprio que não depende de nós.",
          },
          {
            p: "Podem mover o projeto inteiro, e não só as baterias?",
            r: "Sim. Num parque há contêineres de baterias, transformadores, estrutura e material de obra, e cada um pede equipamento diferente. Coordenar isso com um só interlocutor é justamente o ponto.",
          },
        ],
      },
    },
  },

  /* ── Verificador de Resolución 154 ───────────────────────────────────
     Só a interface. Os dez requisitos ficam em espanhol, em
     `components/datos/resolucion154.ts`. */
  verificador: {
    enlace: "Verificador de guias",
    titulo: "A partir de 1º de novembro",
    destacado: "sua guia precisa de mais dados",
    bajada:
      "Dez exigências novas para toda guia de despacho ou nota fiscal que ampare um transporte no Chile. Confira a sua aqui antes que comecem as multas.",
    intro:
      "A Resolução 154 do SII chileno entra em vigor em 1º de novembro de 2026. Ela muda o que o documento que viaja com a carga precisa dizer: origem e destino efetivos, quem dirige, qual placa o caminhão leva e a que horas saiu de verdade. Preencha o que a sua guia traz e dizemos o que falta, com a referência ao dispositivo que exige.",
    descargo:
      "Isto orienta, não é assessoria tributária. Confere se o seu documento traz os dados que a norma pede. Não consulta o SII, não lê o XML emitido e não substitui o seu contador.",
    fuentes: "Texto oficial",
    avisoIdioma:
      "Os requisitos ficam em espanhol: são de uma norma tributária chilena e seus campos são etiquetas do formato de documento eletrônico do SII, que não se traduzem.",
    formulario: {
      direccion: "Endereço",
      nombreChofer: "Nome completo do motorista",
      rutChofer: "Documento de identidade do motorista",
      rutTransportista: "CNPJ ou RUT da transportadora",
      patente: "Placa do veículo",
      patenteCarro: "Placa da carreta",
      sinCarro: "O transporte vai sem carreta",
      sinPatente: "Não sei as placas, e declaro isso no documento",
      bienNombre: "Nome e descrição dos bens",
      bienCantidad: "Quantidade",
      bienUnidad: "Unidade de medida",
      bienPeso: "Peso ou volume",
      bienPrecio: "Preço unitário",
      sinPrecio: "Não é venda, e informo o motivo do transporte",
      tipoTraslado: "Tipo de transporte",
      elijaTipo: "Escolha o tipo",
      fechaSalida: "Data de início do transporte",
      horaSalida: "Hora de início",
      unaPorVehiculo: "Emito uma guia por transporte e por veículo",
      prolongado: "Este transporte dura mais de um dia",
      fechaLlegada: "Data estimada de entrega",
      declaraProlongado: "Declaro no detalhe da guia, com o motivo",
      si: "Sim",
      no: "Não",
    },
    errores: {
      requerido: "Falta este dado",
      rutFormato: "Não parece um RUT chileno. Escreve-se 12345678-9",
      rutDigito: "O dígito verificador não corresponde a esse número",
      patenteFormato: "Não parece uma placa chilena. AB1234 ou BBCC12",
    },
    acciones: {
      revisar: "Conferir minha guia",
      limpiar: "Começar de novo",
      imprimir: "Imprimir ou salvar em PDF",
    },
    resultado: {
      titulo: "Resultado",
      cumple: "Sua guia traz tudo o que a norma exige",
      cumpleTexto:
        "Com o que você informou, o documento cumpre o que a Resolução 154 exige. Guarde esta conferência e repita se o seu processo mudar.",
      noCumple: "{n} de {total} sem cumprir",
      noCumpleTexto:
        "Cada ponto marcado abaixo é um dado que a guia precisa trazer a partir de 1º de novembro. Ao lado vai o dispositivo que exige, para você verificar na fonte.",
      listo: "Tem",
      pendiente: "Falta",
      noAplica: "Não se aplica",
      revisadoEl: "Conferido em",
      ctaTitulo: "A Main emite guias conformes desde a primeira viagem",
      ctaTexto:
        "Se preferir não resolver isso internamente, nós já emitimos com esses campos. Conte o que você move e respondemos em 24 horas.",
      ctaBoton: "Cotar minha carga",
    },
  },

  /* ── Asesor flotante ─────────────────────────────────────────────── */
  asesor: {
    whatsappMensaje: "Olá, quero cotar um transporte de carga.",
    whatsappDirecto: "Falar pelo WhatsApp",
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
  },

  /* ── Transportistas · el segundo embudo ──────────────────────────── */
  transportistas: {
    meta: {
      titulo: "Transportadores: some seu equipamento à rede | Main Logistics",
      descripcion:
        "A Main Logistics trabalha com transportadores que têm equipamento próprio, em carga recorrente por rotas definidas dentro do Chile. Sem custo de cadastro. Veja os documentos exigidos antes de se cadastrar.",
    },
    tituloLinea1: "Carga recorrente para",
    tituloDestacado: "o seu equipamento",
    bajada:
      "Trabalhamos com transportadores que têm equipamento próprio e buscam volume estável em rotas definidas. O cadastro não custa nada.",
    ctaPrincipal: "Quero participar",
    ctaSecundario: "Ver o que é exigido",
    pagoEtiqueta: "Prazo de pagamento",
    pagoTitulo: "Pagamos em {dias} dias a partir do POD.",
    pagoDetalle: "Sem esperar que o cliente nos pague primeiro.",
    ofreceTitulo: "O que nós colocamos",
    ofreceRecurrenteTitulo: "Carga que se repete",
    ofreceRecurrenteDetalle:
      "Rotas definidas com volume sustentado, não uma viagem avulsa de vez em quando.",
    ofreceSinCostoTitulo: "Sem custo de cadastro",
    ofreceSinCostoDetalle:
      "Entrar na rede não é cobrado e não obriga a aceitar nenhuma carga.",
    ofrecePapelesTitulo: "A papelada da viagem, coordenada",
    ofrecePapelesDetalle:
      "O documento de transporte e a documentação do deslocamento ficam por nossa conta.",
    ofreceContraparteTitulo: "Um interlocutor, não uma central",
    ofreceContraparteDetalle:
      "Alguém com nome que responde no mesmo dia quando algo muda na estrada.",
    exigeTitulo: "O que pedimos",
    exigeBajada:
      "A lista completa, antes do cadastro. Se faltar alguma coisa, é melhor saber agora do que depois de enviar os dados.",
    exigeVigencia: "Certidão de regularidade da sociedade e CNPJ ou RUT",
    exigeTributaria: "Situação tributária com atividade de transporte de carga",
    exigeF30: "F30-1 mensal, de obrigações trabalhistas e previdenciárias",
    exigePolizas: "Apólice de responsabilidade civil e seguro de carga vigentes",
    exigePadron: "Documento do veículo, licenciamento e inspeção técnica",
    exigeSoap: "SOAP vigente (seguro obrigatório de acidentes)",
    exigeLicencia: "Motorista com habilitação classe A vigente",
    exigeGps: "GPS ativo, com acesso compartilhado durante a viagem",
    relacionTitulo: "Como é a relação",
    relacionDetalle:
      "Você opera seu equipamento e dirige a sua equipe. A Main Logistics coordena a carga e responde ao cliente pelo serviço. Não somos seu empregador nem intermediamos sua relação de trabalho.",
    contactoTitulo: "Para participar",
    contactoDetalle:
      "Escreva com o nome da sua empresa, quantos equipamentos tem e em quais rotas opera. Respondemos com os passos e a lista de documentos.",
    volver: "Voltar ao início",
  },

  /* ── Cotizador express · la puerta fría ─────────────────────────── */
  express: {
    titulo: "Comece pelo básico",
    bajada:
      "Três campos, e seguimos com o resto na página seguinte. Seus dados de contato ficam para o final, como sempre.",
    origen: "De",
    destino: "Para",
    carga: "O que você movimenta",
    vacioRegion: "Selecione a região",
    vacioCarga: "Selecione o tipo de carga",
    continuar: "Continuar",
    completo: "Ou abra o formulário completo",
  },
};
