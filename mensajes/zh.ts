import type { Mensajes } from "./es";

/**
 * 简体中文. Ver las reglas de escritura en `es.ts`.
 *
 * Notas propias del chino:
 *
 * - Puntuación china (、。，？：……), nunca la latina. Los nombres que quedan en
 *   alfabeto latino —Main Logistics, MainBrain, GPS, WhatsApp, BESS, UF, RUT—
 *   se separan del texto chino con un espacio, que es la convención corriente.
 * - Varios pares `inicio`/`realce`/`fin` se unen en el JSX con un `{" "}`
 *   fijo. En chino ese espacio se ve, así que el tramo que precede a una
 *   unión cierra con signo chino (、。，) y el espacio cae después del signo,
 *   donde no molesta. Por eso algunas comas viven al final de un valor y no
 *   al principio del siguiente.
 * - Topónimos chilenos en su transcripción comercial de uso: 阿里卡 (Arica),
 *   蓬塔阿雷纳斯 (Punta Arenas). "Región" y "comuna" son las divisiones
 *   administrativas chilenas: 大区 y 市镇.
 * - Separador de miles con coma (1,000) y no con punto: en chino "1.000" se
 *   lee como uno coma cero. La cifra no cambia, solo el signo que la agrupa.
 */
export const zh: Mensajes = {
  meta: {
    // §9 del doc de marca: nunca el nombre solo en el title tag.
    titulo: "智利全境公路货物运输 | Main Logistics",
    descripcion:
      "Main Logistics 承运普通货物、矿业物资、危险品、冷藏货物、林业物资、集装箱、机械设备与超限货物，覆盖从阿里卡到蓬塔阿雷纳斯的智利全境，全程持续监控，满足各行业要求的标准。",
    ogDescripcion: "任何货物。智利任何目的地。全程可视，没有意外。",
  },

  nav: {
    servicios: "服务",
    queMovemos: "承运货类",
    cobertura: "覆盖范围",
    contacto: "联系我们",
    transportistas: "承运商加盟",
    cotizar: "报价",
    cotizarMovil: "索取运输报价",
    principal: "主导航",
    inicio: "Main Logistics，首页",
    abrirMenu: "打开菜单",
    cerrarMenu: "关闭菜单",
    idioma: "语言",
    cambiarIdioma: "切换语言",
  },

  /* ── Hero · portada ──────────────────────────────────────────────── */
  hero: {
    tituloLinea1: "选择 Main，您的货物",
    tituloLinea2: "始终",
    bajadaLinea1: "我们把您的货物送到智利的任何目的地。",
    bajadaLinea2: "您随时知道它在哪里、几点到达。",
    ctaPrincipal: "索取运输报价",
    ctaSecundario: "了解我们的服务",
    rotador: {
      // Tres palabras de dos caracteres: la cápsula mide igual con cualquiera.
      frases: ["准时", "安全", "可视"],
      alternativas: "准时、安全或可视",
    },
    tarjetas: {
      gps: {
        etiqueta: "GPS",
        estado: "在途",
        titulo: "在途监控",
        detalle: "从提货到交付全程可追溯",
      },
      marca: {
        bajadaLinea1: "公路货物运输",
        bajadaLinea2: "覆盖智利全境",
      },
    },
  },

  /* ── Servicios · los ocho, y el bento de apoyo ───────────────────── */
  servicios: {
    tituloLinea1: "一家承运商，",
    tituloDestacado: "覆盖您的全部运输",
    bajada: {
      inicio: "集装箱、机械设备、散装货物或仓储。",
      realce: "八项服务，",
      fin: "配备每类货物所需的车型，由同一处统一调度。",
    },
    lista: {
      contenedores: {
        nombre: "集装箱提柜",
        detalle: "我们在港口提取您的集装箱，运至目的地，不产生延误。",
        lleva: {
          contenedor20: "20′ 集装箱",
          contenedor40: "40′ 集装箱",
          puerto: "港口",
        },
      },
      camaBaja: {
        nombre: "低平板挂车",
        detalle: "超限货物与重型机械，配备专用运输设备。",
        lleva: {
          maquinaria: "机械设备",
          sobredimensionada: "超限货物",
        },
      },
      ramplasPlanas: {
        nombre: "平板挂车",
        detalle: "普通货物与托盘货物采用平板挂车运输，适用于各类作业。",
        lleva: {
          general: "普通货物",
          paletizada: "托盘货物",
        },
      },
      camionesPequenos: {
        nombre: "小型货车",
        detalle: "面向零担货物的快速配送与最后一公里交付。",
        lleva: {
          cargaMenor: "零担货物",
          ultimaMilla: "最后一公里",
        },
      },
      bateas: {
        nombre: "自卸车",
        detalle: "以自卸车运输砂石与散装货物，覆盖港口至目的地。",
        lleva: {
          aridos: "砂石骨料",
          graneles: "散装货物",
        },
      },
      silos: {
        nombre: "散装罐车",
        detalle: "为工业客户提供密闭散装货物的专业运输。",
        lleva: {
          granelCerrado: "密闭散装",
        },
      },
      bess: {
        nombre: "BESS 储能货物",
        detalle: "采用专门的操作方式运输电池与储能系统。",
        lleva: {
          baterias: "电池",
          altoValor: "高价值",
        },
      },
      almacenaje: {
        nombre: "拆箱分拨与仓储",
        detalle: "我们在关键节点的仓库为您的货物拆箱分拨并存储。",
        lleva: {
          bodega: "仓储",
          consolidado: "拼箱",
        },
      },
    },
    ctaPrincipal: "索取运输报价",
    ayuda: {
      pregunta: "不确定需要哪种车型？",
      respuesta: "我们为您提供建议。",
    },
    pilares: {
      titulo: {
        inicio: "有 MAIN，您的货物",
        realce: "始终尽在掌控",
        fin: "。",
      },
      bajada: {
        realceUbicacion: "知道货物在哪里，",
        finUbicacion: "每时每刻。",
        realceNorma: "符合规范，",
        finNorma: "满足您所在行业的要求。",
        realceHora: "按约定时间，",
        finHora: "准时抵达。",
      },
      tecnologia: {
        altFoto: "带 Main Logistics 标识的监控设备，数据接口清晰可见",
        etiqueta: "在途 GPS",
        titulo: {
          inicio: "您的货物",
          realce: "实时可见",
          fin: "，不用打电话去问。",
        },
        detalle: {
          realce: "GPS 全程持续监控。",
          fin: "从提货到交付全程可追溯，在线报告可供审核。",
        },
      },
      cobertura: {
        etiqueta: "覆盖范围",
        titulo: "从阿里卡到蓬塔阿雷纳斯。",
        detalle: {
          realce: "覆盖智利全境",
          fin: "，配备各行业所要求的车辆与单证。",
        },
      },
      queMovemos: {
        etiqueta: "承运货类",
        titulo: "八类货物，一家承运商。",
        detalle: "从普通货物到超限货物，均配备相应的运输设备。",
        cargas: {
          general: "普通货物",
          minera: "矿业物资",
          peligrosa: "危险品",
          refrigerada: "冷藏货物",
          forestal: "林业物资",
          contenedores: "集装箱",
          maquinaria: "机械设备",
          sobredimensionada: "超限货物",
        },
        enlace: "查看每一类的要求",
      },
      seguridad: {
        altFoto: "挂车平板上的货物，用吊装带和张紧的棘轮绑扎器固定",
        etiqueta: "安全",
        titulo: {
          inicio: "您的货物始终",
          realce: "安全",
          fin: "。",
        },
        detalle: {
          realce: "经过核验的承运人",
          fin: "，单证齐全有效，符合各行业标准。",
        },
      },
    },
  },

  /* ── Qué movemos · tipos de carga ────────────────────────────────── */
  cargas: {
    tituloLinea1: "每类货物各有要求，",
    tituloDestacado: "我们逐项满足",
    bajada: "每类货物都有对应的规范、车型和单证。",
    bajadaRealce: "以下是每一类的要求。",
    etiquetaTipos: "类货物",
    tipos: {
      general: {
        nombre: "普通货物",
        exige: "根据货量和路线，采用平板挂车、厢式货车或托盘运输。",
      },
      minera: {
        nombre: "矿业物资",
        exige: "进入矿区所需的准入认证，以及在途疲劳驾驶管理。",
      },
      peligrosa: {
        nombre: "危险品",
        exige: "危险品标识、安全数据表，以及持有效资格证的驾驶员。",
      },
      refrigerada: {
        nombre: "冷藏货物",
        exige: "全程不间断冷链，并记录运输途中的温度。",
      },
      forestal: {
        nombre: "林业物资",
        exige: "经认证的绑扎固定，以及有作业车辆通行的乡村道路。",
      },
      contenedores: {
        nombre: "集装箱",
        exige: "港口协调、提柜时间窗，以及核验过的铅封。",
      },
      maquinaria: {
        nombre: "机械设备",
        exige: "低平板挂车、限高净空测算与通行许可。",
      },
      sobredimensionada: {
        nombre: "超限货物",
        exige: "特殊通行许可、护送车辆与限定的通行时段。",
      },
    },
  },

  /* ── Cumplimiento · por industria ────────────────────────────────── */
  cumplimiento: {
    tituloLinea1: "许可与认证，",
    tituloDestacado: "每次发运都齐全有效",
    bajadaRealce: "选择您所在的行业，",
    bajadaResto: "查看货物发运前需要核查的内容。",
    etiquetaPestanas: "各行业的规范框架",
    mineria: {
      nombre: "矿业",
      titulo: "准入认证要在装货之前完成。",
      detalle: "承运人、车辆和驾驶员的单证，在发运当天经过核查且处于有效期内。到了矿区门口再查就晚了。",
      puntos: {
        homologacion: "承运人与车辆的矿区准入认证",
        fatiga: "在途疲劳驾驶管理与休息安排",
        continuidad: "按班次保障供应连续性",
      },
    },
    peligrosa: {
      nombre: "危险品",
      titulo: "没有标识的货物，不予发运。",
      detalle:
        "按物质类别张贴标识，车上随带安全数据表，驾驶员持有效资格证。单证随货同行，而不是事后补。",
      puntos: {
        rotulacion: "按类别张贴标识与隔离配载",
        hojaSeguridad: "车上随带安全数据表与应急器材",
        curso: "驾驶员持有效的危险品运输资格证",
      },
    },
    agro: {
      nombre: "农业与三文鱼养殖",
      titulo: "冷链一旦中断，就无法挽回。",
      detalle:
        "全程记录温度，而不只是在装货和卸货时记录。在旺季，时间窗与温度计同样重要。",
      puntos: {
        temperatura: "全程温度记录",
        fitosanitario: "植物检疫规程与原产地证明",
        ventanas: "旺季时间窗与包装厂协调",
      },
    },
    forestal: {
      nombre: "林业",
      titulo: "绑扎在出发前和每次停车时都要检查。",
      detalle: "货量大，道路未必都是铺装路面，同一条路线上还有作业车辆通行。",
      puntos: {
        buenasPracticas: "林区作业安全操作规范",
        amarre: "经认证的绑扎固定与在途检查",
        transito: "与作业车辆通行的协调",
      },
    },
    contenedores: {
      nombre: "集装箱",
      marcoPuerto: "港口",
      titulo: "提柜时间窗不等人。",
      detalle: "与码头协调、核验铅封，并在免箱期内还箱。滞箱一天的费用高于运费。",
      puntos: {
        ventana: "与码头协调提柜时间窗",
        sello: "提柜与交付时核验铅封",
        diasLibres: "免箱期与还箱管理",
      },
    },
  },

  /* ── Reseñas y franja de clientes ────────────────────────────────── */
  resenas: {
    tituloLinea1: "我们的客户",
    tituloDestacado: "怎么说",
    bajadaInicio: "同行来打听时，",
    bajadaRealce: "愿意为我们接电话",
    bajadaFin: "的物流与采购负责人。",
    testimonios: {
      importacion: {
        cita:
          "我们整柜进口，以前每次提柜都是新的麻烦。现在把提单发给他们，柜子出港就会通知我。不用再一直盯着了。",
        nombre: "Matías Corvalán",
        cargo: "创始合伙人",
        empresa: "The Wallpaper Guys",
        industria: "进口",
      },
      quimicos: {
        cita:
          "我们运化工产品，安全数据表和标签这两样没有商量余地。到现在没有一票货因为单证被退回。",
        nombre: "Óscar Villablanca",
        cargo: "仓储主管",
        empresa: "Clean Controls",
        industria: "化工",
      },
      congelados: {
        cita:
          "我们的产品是冷冻的，时间比价格更重要。他们安排一早发车，到货温度在范围内。对承运商我就这一个要求。",
        nombre: "Javiera Pizarro",
        cargo: "运营经理",
        empresa: "Acai Prime",
        industria: "冷冻食品",
      },
      gastronomia: {
        cita:
          "刚开始有一家门店的收货时间对不上。他们主动改了路线解决，不用我催。到现在八个月没有断过货。",
        nombre: "Diego Sanhueza",
        cargo: "采购负责人",
        empresa: "American Prime Burger",
        industria: "餐饮",
      },
      abastecimiento: {
        cita:
          "我们同时为多家门店做补货。我需要的是一个对接方对所有配送负责，而不是五家不同的承运商。现在有了。",
        nombre: "Paulina Herrera",
        cargo: "采购协调员",
        empresa: "Restaurant Administration Center",
        industria: "餐饮配套服务",
      },
      produccion: {
        cita:
          "我们把搭建设备运到现场，基本都是固定日期。没有一次误了安装。",
        nombre: "Ignacio Rebolledo",
        cargo: "制作总监",
        empresa: "Main Brain",
        industria: "制作",
      },
    },
  },

  /* ── Cómo funciona · el timeline ─────────────────────────────────── */
  comoFunciona: {
    tituloLinea1: "如何运作，",
    tituloDestacado: "三个步骤",
    bajadaInicio: "从报价到交付，",
    bajadaRealce: "始终有一位具名的负责人，",
    bajadaFin: "在另一端对接。",
    paso: "步骤",
    hitos: {
      cotizacion: {
        titulo: "报价",
        detalle:
          "您告诉我们运什么、从哪里到哪里。我们答复能不能接这一票，以及用什么车。",
        dato: "邮件回复",
      },
      retiro: {
        titulo: "提货",
        detalle: "经过核验的承运人，以及与货物相匹配的车辆。单证在卡车出发之前开具。",
        dato: "电子发运单",
      },
      entrega: {
        titulo: "交付",
        detalle: "全程跟踪。一旦出现偏差，我们会比您更早知道，并已着手处理。",
        dato: "交付凭证",
      },
    },
    plazosAltFoto: "带 Main Logistics 标识的时钟，显示交付时间",
    plazosEtiqueta: "时效",
    plazosTituloInicio: "您的货物，",
    plazosTituloDestacado: "始终准时",
    plazosTituloFin: "。",
    plazosDetalle: "不会出现需要在会议上解释的延误。",
  },

  /* ── Equipo ──────────────────────────────────────────────────────── */
  equipo: {
    tituloLinea1: "谁在运送",
    tituloDestacado: "您的货物",
    bajadaInicio: "驾驶员、仓库与卸货人员。",
    bajadaRealce: "在接触您的货物之前，所有人都要通过同一套标准",
    bajadaFin: "，无论货物来自哪个行业。",
    conductor: {
      altFoto: "Main Logistics 的驾驶员坐在驾驶室内，戴着品牌帽子",
      tituloInicio: "承运人",
      tituloDestacado: "经过核验",
      tituloFin: "才装货。",
    },
    estandares: {
      papeles: {
        titulo: "单证有效，逐项核查",
        detalle: "单证在发运当天上午核查，而不是签合同的时候。哪怕是那一周才过期的许可，车照样出不去。",
      },
      experiencia: {
        titulo: "熟悉您所运输的货物",
        detalle: "驾驶员以及仓库和卸货人员，在这次发运之前已经处理过同类货物。",
      },
      central: {
        titulo: "有人应答的调度中心",
        detalle: "全程有一位具名的负责人对接，并在当天回复。",
      },
    },
    flota: {
      altFoto: "带 Main Logistics 标识的卡车车门",
      titulo: "无论由谁驾驶，标准都是同一套。",
    },
    bodega: {
      altFoto: "Main Logistics 的作业人员用平板电脑在仓库核对托盘货物",
      tituloInicio: "仓储与卸货，采用",
      tituloDestacado: "同样的管控",
      tituloFin: "。",
    },
    portal: {
      altFoto: "驾驶室内的平板电脑，显示 Main Logistics 门户中的在途路线",
      estado: "开发中",
      titulo: "用于跟踪货物的客户门户。",
    },
  },

  /* ── Cotización · el formulario de seis pasos ────────────────────── */
  cotizar: {
    tituloLinea1: "为您的货物索取报价。",
    tituloDestacado: "24 小时内回复",
    bajada:
      "告诉我们您要运什么，我们会答复这条线路能不能接、用什么车、多久能走。",
    garantias: {
      respuesta: "我们在 24 个工作小时内回复",
      sinCompromiso: "无需承诺，也无需事先注册",
      rutaHonesta: "如果这条路线不适合我们，我们会直说",
    },
    pasosCortos: "六个简短步骤。",
    datosAlFinal: "您的联系方式放在最后。",
    pasoDeTotal: "第 {n} 步，共 {total} 步。",
    guardado: {
      retomado: "已回到您上次中断的地方。",
      empezarDeNuevo: "重新开始",
    },
    pasos: {
      carga: {
        titulo: "货物",
        bajada: "运什么，用什么车型。",
      },
      ruta: {
        titulo: "路线",
        bajada: "从哪里到哪里。",
      },
      fecha: {
        titulo: "时间",
        bajada: "服务日期。",
      },
      modalidad: {
        titulo: "方式",
        bajada: "一次性还是持续进行。",
      },
      requisitos: {
        titulo: "要求",
        bajada: "您所在行业的要求。",
      },
      contacto: {
        titulo: "联系方式",
        bajada: "以便回复您。",
      },
    },
    riel: {
      resumen: "汇总",
      pasoNavegable: "第 {n} 步，{titulo}，已完成。返回编辑。",
      pasoActual: "第 {n} 步，{titulo}，当前步骤",
      pasoCompletado: "第 {n} 步，{titulo}，已完成",
      pasoPendiente: "第 {n} 步，{titulo}，待完成",
    },
    campos: {
      opcional: "（选填）",
      trampaBots: "请勿填写",
      tipoCargaLeyenda: "您要运输什么？",
      tipoCargaOtraEtiqueta: "是什么货物？",
      tipoCargaOtraPlaceholder: "用几句话描述",
      equipoLeyenda: "您需要哪种车型？",
      equipoAyuda: "如果不确定，请选择最后一项，我们为您提供建议。",
      origen: "起运地",
      destino: "目的地",
      region: "大区",
      regionVacio: "请选择大区",
      comuna: "市镇",
      comunaVacio: "请选择市镇",
      comunaSinRegion: "请先选择大区",
      direccion: "地址或参照点",
      direccionPlaceholder: "街道、门牌号、区域、作业点……",
      fechaLeyenda: "您什么时候需要这项服务？",
      fechaDiaEtiqueta: "服务日期",
      modalidadLeyenda: "是一次性运输还是重复进行？",
      frecuenciaEtiqueta: "多久一次？",
      frecuenciaVacio: "请选择频率",
      duracionEtiqueta: "合同期限",
      duracionVacio: "请选择期限",
      requisitosLeyenda: "您的货物有特殊要求吗？",
      requisitosAyuda: "请勾选适用项。如果都不适用，请继续。",
      requisitoOtroEtiqueta: "具体是什么要求？",
      valorLeyenda: "货物申报价值",
      valorAyuda:
        "该数值决定保险的承保范围。UF 为智利的计价单位。如果手头没有，请选择最后一项。",
      empresa: "公司",
      empresaPlaceholder: "公司注册名称或商号",
      nombre: "联系人姓名",
      correo: "邮箱",
      correoPlaceholder: "name@company.cl",
      telefono: "电话或 WhatsApp",
      telefonoPlaceholder: "+56 9 1234 5678",
      canalLeyenda: "您希望我们通过哪种方式回复？",
    },
    tiposCarga: {
      contenedor: {
        etiqueta: "20′ / 40′ 集装箱",
        detalle: "集装箱货物",
      },
      suelta: {
        etiqueta: "散件或托盘货物",
        detalle: "普通货物或托盘",
      },
      granel: {
        etiqueta: "散装货物",
        detalle: "砂石、罐装、液体",
      },
      sobredimension: {
        etiqueta: "超限货物",
        detalle: "超出标准尺寸",
      },
      peligrosa: {
        etiqueta: "危险品或特种货物",
        detalle: "需要特殊操作",
      },
      otra: {
        etiqueta: "其他",
        detalle: "请告诉我们",
      },
    },
    equipos: {
      camionPequeno: {
        etiqueta: "小型货车",
      },
      ramplaPlana: {
        etiqueta: "平板挂车",
      },
      camaBaja: {
        etiqueta: "低平板挂车",
      },
      batea: {
        etiqueta: "自卸车",
      },
      silo: {
        etiqueta: "散装罐车",
      },
      contenedor: {
        etiqueta: "集装箱运输车",
      },
      asesoria: {
        etiqueta: "不确定，需要咨询",
      },
    },
    fechas: {
      semana: {
        etiqueta: "本周",
        detalle: "未来 3 天",
      },
      especifica: {
        etiqueta: "指定日期",
        detalle: "我自己选日期",
      },
      flexible: {
        etiqueta: "时间灵活",
        detalle: "日期可协商",
      },
    },
    modalidades: {
      puntual: {
        etiqueta: "单次",
        detalle: "仅一次运输",
      },
      recurrente: {
        etiqueta: "定期",
        detalle: "会重复进行",
      },
      contrato: {
        etiqueta: "合同",
        detalle: "持续的货量",
      },
    },
    frecuencias: {
      semanal: {
        etiqueta: "每周",
      },
      quincenal: {
        etiqueta: "每两周",
      },
      mensual: {
        etiqueta: "每月",
      },
      otra: {
        etiqueta: "其他",
      },
    },
    duraciones: {
      tresMeses: {
        etiqueta: "3 个月",
      },
      seisMeses: {
        etiqueta: "6 个月",
      },
      doceMeses: {
        etiqueta: "12 个月",
      },
      masDeDoceMeses: {
        etiqueta: "12 个月以上",
      },
    },
    requisitos: {
      acreditacionMinera: {
        etiqueta: "矿区准入认证",
      },
      cargaPeligrosa: {
        etiqueta: "危险品",
      },
      escolta: {
        etiqueta: "护送或安保",
      },
      refrigeracion: {
        etiqueta: "冷藏",
      },
      manipulacionEspecial: {
        etiqueta: "特殊操作",
      },
      otro: {
        etiqueta: "其他",
      },
    },
    valores: {
      hasta1000: {
        etiqueta: "1,000 UF 以内",
      },
      de1000a3000: {
        etiqueta: "1,000 至 3,000 UF",
      },
      masDe3000: {
        etiqueta: "3,000 UF 以上",
      },
      conversar: {
        etiqueta: "希望另行沟通",
      },
    },
    canales: {
      whatsapp: {
        etiqueta: "WhatsApp",
      },
      correo: {
        etiqueta: "邮箱",
      },
      llamada: {
        etiqueta: "电话",
      },
    },
    errores: {
      tipoCarga: "请选择您要运输的货物类型。",
      tipoCargaOtra: "请告诉我们是什么货物。",
      equipo: "请选择车型，或选择需要咨询。",
      origenRegion: "请填写起运地大区。",
      origenComuna: "请填写起运地市镇。",
      destinoRegion: "请填写目的地大区。",
      destinoComuna: "请填写目的地市镇。",
      fecha: "请说明您什么时候需要这项服务。",
      fechaDia: "请选择日期。",
      modalidad: "请说明运输方式。",
      frecuencia: "请说明重复的频率。",
      duracion: "请说明合同期限。",
      requisitoOtro: "请具体说明该要求。",
      valor: "请填写申报价值，或选择希望另行沟通。",
      empresa: "请填写公司名称。",
      nombre: "请填写您的姓名。",
      correoFalta: "请填写您的邮箱。",
      correoIlegible: "请检查邮箱地址，似乎不完整。",
      telefonoFalta: "请填写电话号码。",
      telefonoIlegible: "请检查电话号码：智利为 9 位数字。",
      canal: "请选择您希望我们回复的方式。",
    },
    acciones: {
      atras: "上一步",
      siguiente: "下一步",
      revisar: "核对申请",
      guardarYVolver: "保存并返回汇总",
      volver: "返回",
      enviar: "提交申请",
      enviando: "提交中……",
    },
    resumen: {
      titulo: "提交前请核对",
      bajada: "如有不对，可以修改。改完会回到这一页。",
      editar: "修改",
      tipoCarga: "货物类型",
      equipo: "车型",
      origen: "起运地",
      destino: "目的地",
      cuando: "时间",
      dia: "日期",
      modalidad: "方式",
      duracion: "期限",
      requisitos: "要求",
      sinRequisitos: "未填写",
      valorDeclarado: "申报价值",
      empresa: "公司",
      contacto: "联系人",
      correo: "邮箱",
      telefono: "电话",
      prefiere: "希望通过",
    },
    exito: {
      titulo: "我们已收到您的申请。",
      cuerpo:
        "我们将在 24 个工作小时内回复这条路线的可行性评估。如果需要更早发运，请通过 WhatsApp 联系我们。",
      otraSolicitud: "再提交一份申请",
    },
    errorEnvio: {
      titulo: "申请未能提交。",
      enlaceWhatsapp: "通过 WhatsApp 发送",
      conWhatsapp: "内容没有丢失：{whatsapp}，已填写的信息会一并带上；也可以写信到 {correo}。",
      sinWhatsapp: "请写信到 {correo}，我们同样会回复您。",
    },
    avisos: {
      faltaUnDato: "还差 1 项信息才能继续。",
      faltanDatos: "还差 {n} 项信息才能继续。",
      faltaUnPaso: "提交前还有一个步骤没有完成。",
      enviando: "正在提交您的申请。",
      recibida: "申请已收到。",
    },
  },

  /* ── Pie de página ───────────────────────────────────────────────── */
  pie: {
    descripcion:
      "智利全境公路货物运输，覆盖自阿里卡至蓬塔阿雷纳斯。",
    ctaCotizar: "索取运输报价",
    columnaServicios: {
      titulo: "服务",
      tecnologia: "技术与监控",
      queMovemos: "承运货类",
      cobertura: "覆盖智利全境",
      cumplimiento: "合规",
    },
    columnaEmpresa: {
      titulo: "公司",
      comoFunciona: "如何运作",
      clientes: "客户",
      cotizar: "报价",
    },
    contacto: {
      titulo: "联系方式",
    },
    derechos: "覆盖智利全境的货物运输",
  },

  /* ── Legal ───────────────────────────────────────────────────────────
     仅为标签。两份文件的正文位于 `components/datos/legal.ts`，
     只以西班牙语发布。 */
  legal: {
    columna: "法律条款",
    indice: "本页内容",
    actualizado: "更新于",
    volver: "返回首页",
    avisoIdioma:
      "本文件以西班牙语发布，并以西班牙语版本为准。如有任何不清楚之处，请与我们联系，我们会用中文向您说明。",
    privacidad: "隐私政策",
    terminos: "使用条款",
    consentimiento:
      "提交即表示您同意我们处理您的资料，仅用于回复本次询价，不作其他用途。",
    consentimientoEnlace: "我们如何处理您的资料",
  },

  /* ── Asesor flotante ─────────────────────────────────────────────── */
  asesor: {
    whatsappMensaje: "您好，我想咨询货运报价。",
    whatsappDirecto: "通过 WhatsApp 联系",
    cargo: "商务咨询",
    mensaje: "👋 需要协助安排货物运输，还是想让我们报价？",
    escribiendo: "正在输入",
    cerrarMensaje: "关闭消息",
    tituloPanel: "联系 Main Logistics",
    cerrarPanel: "关闭",
    opciones: {
      cotizar: {
        titulo: "为我的货物报价",
        detalle: "起运地、目的地和货物类型",
      },
      contacto: {
        titulo: "请联系我",
        detalle: "留下联系方式，等待来电",
      },
      whatsapp: {
        titulo: "通过 WhatsApp 沟通",
        detalle: "在聊天中直接回复",
      },
    },
    horario: "我们在工作时间内回复。",
    abrirAsesor: "与顾问沟通",
    cerrarAsesor: "关闭顾问窗口",
  },

  /* ── Piezas compartidas ──────────────────────────────────────────── */
  comunes: {
  },

  /* ── Transportistas · el segundo embudo ──────────────────────────── */
  transportistas: {
    meta: {
      titulo: "承运商加盟：把您的车辆加入网络 | Main Logistics",
      descripcion:
        "Main Logistics 与拥有自有车辆的承运商合作，在智利境内的固定线路上提供稳定回头货。加盟不收费。注册前请先查看所需证件清单。",
    },
    tituloLinea1: "稳定回头货，",
    tituloDestacado: "给您的车",
    bajada: "我们与拥有自有车辆、希望在固定线路上获得稳定货量的承运商合作。加盟不收取任何费用。",
    ctaPrincipal: "我要加盟",
    ctaSecundario: "查看要求",
    pagoEtiqueta: "付款账期",
    pagoTitulo: "签收凭证后 {dias} 天付款。",
    pagoDetalle: "不必等客户先付给我们。",
    ofreceTitulo: "我们提供什么",
    ofreceRecurrenteTitulo: "可重复的货量",
    ofreceRecurrenteDetalle: "固定线路、持续货量，而不是偶尔一票散货。",
    ofreceSinCostoTitulo: "加盟不收费",
    ofreceSinCostoDetalle: "进入网络不收取费用，也不强制接受任何一票货。",
    ofrecePapelesTitulo: "单证由我们协调",
    ofrecePapelesDetalle: "运输单据和此次运输的相关单证由我们负责协调。",
    ofreceContraparteTitulo: "一个对接人，不是客服中心",
    ofreceContraparteDetalle: "路上有变动时，有一个具名的人当天回复您。",
    exigeTitulo: "我们要求什么",
    exigeBajada: "完整清单，在您注册之前就公开。如果缺少某项，早知道比提交资料之后才知道要好。",
    exigeVigencia: "公司存续证明及纳税识别号",
    exigeTributaria: "税务登记的经营范围须包含货物运输",
    exigeF30: "每月 F30-1，劳工与社保义务证明",
    exigePolizas: "有效的第三者责任险与货物运输险保单",
    exigePadron: "车辆登记证、行驶许可与技术年检",
    exigeSoap: "有效的 SOAP（强制事故险）",
    exigeLicencia: "驾驶员持有效 A 类驾照",
    exigeGps: "GPS 处于启用状态，运输期间共享查看权限",
    relacionTitulo: "合作关系说明",
    relacionDetalle:
      "您自行运营车辆并管理自己的人员。Main Logistics 负责协调货源，并就服务向客户负责。我们不是您的雇主，也不介入您的劳动关系。",
    contactoTitulo: "如何加盟",
    contactoDetalle: "请告知公司名称、车辆数量以及您经营的线路。我们会回复具体步骤和所需证件清单。",
    volver: "返回首页",
  },

  /* ── Cotizador express · la puerta fría ─────────────────────────── */
  express: {
    titulo: "先填三项",
    bajada: "填这三项，其余在下一页继续。您的联系方式一如既往放在最后。",
    origen: "起运地",
    destino: "目的地",
    carga: "运什么",
    vacioRegion: "请选择大区",
    vacioCarga: "请选择货物类型",
    continuar: "继续",
    completo: "或直接打开完整表单",
  },
};
