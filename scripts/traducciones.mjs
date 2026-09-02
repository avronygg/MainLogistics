/**
 * Revisa las traducciones contra el español, sin abrir el navegador.
 *
 * TypeScript ya garantiza que la ESTRUCTURA esté completa: si falta una
 * clave, no compila. Lo que no puede ver el compilador es el contenido, y
 * ahí están los errores que de verdad hacen daño:
 *
 *   - Promesas que el español no hace. Es el peor. Con este comprador, una
 *     afirmación que no se sostiene no genera un reclamo: genera que saquen
 *     a la empresa de la lista de proveedores.
 *   - Cifras y normativas cambiadas.
 *   - Nombres propios traducidos.
 *   - Textos que rompen cajas por largo.
 */

import { readFileSync } from 'node:fs';

const IDIOMAS = ['en', 'pt', 'zh'];
const fallos = [];
const avisos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };
const ojo = (m) => { avisos.push(m); console.log(`  aviso ${m}`); };

/** Aplana el diccionario a rutas → texto, leyendo el .ts como texto plano. */
function leer(id) {
  const fuente = readFileSync(`mensajes/${id}.ts`, 'utf8');
  const cuerpo = fuente.slice(fuente.indexOf('= {') + 2);
  const pares = new Map();
  const pila = [];
  /* Arreglos abiertos, con su contador de elementos. Sin esto, un arreglo
     de objetos en varias líneas —como las exigencias y las preguntas de
     cada página de servicio— rompe el recorrido entero: el `}` de cada
     elemento desapila un nivel que nadie apiló, y de ahí en adelante TODAS
     las rutas quedan mal. No es que fallen las comprobaciones: es que se
     aplican a la clave equivocada, que es peor porque no se nota. */
  const arreglos = [];
  let pendiente = null;
  for (const linea of cuerpo.split('\n')) {
    const t = linea.trim();
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) continue;

    const abre = t.match(/^([a-zA-Z0-9_]+):\s*\{$/);
    if (abre) { pila.push(abre[1]); continue; }

    const abreArreglo = t.match(/^([a-zA-Z0-9_]+):\s*\[$/);
    if (abreArreglo) {
      pila.push(abreArreglo[1]);
      arreglos.push({ profundidad: pila.length, n: 0 });
      continue;
    }
    if (t === '{') {
      const actual = arreglos[arreglos.length - 1];
      if (actual && actual.profundidad === pila.length) pila.push(String(actual.n++));
      continue;
    }
    if (t === '],' || t === ']') { arreglos.pop(); pila.pop(); continue; }

    if (t === '},' || t === '}' || t === '};') { pila.pop(); continue; }

    const par = t.match(/^([a-zA-Z0-9_]+):\s*"(.*)",?$/);
    if (par) { pares.set([...pila, par[1]].join('.'), par[2]); pendiente = null; continue; }

    // Clave sola: el valor viene en la línea siguiente. Prettier parte así las
    // cadenas largas, y sin contemplarlo se pierden del conteo — fue lo que
    // hizo aparecer 450 textos en chino donde hay 460.
    const suelta = t.match(/^([a-zA-Z0-9_]+):$/);
    if (suelta) { pendiente = [...pila, suelta[1]].join('.'); continue; }
    if (pendiente) {
      const trozo = t.match(/^"(.*)",?$/);
      if (trozo) { pares.set(pendiente, trozo[1]); pendiente = null; continue; }
    }

    const arr = t.match(/^([a-zA-Z0-9_]+):\s*\[(.*)\],?$/);
    if (arr) {
      const items = [...arr[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]);
      items.forEach((v, i) => pares.set([...pila, arr[1], i].join('.'), v));
    }
  }
  return pares;
}

const es = leer('es');
console.log(`español: ${es.size} textos\n`);

/* ── 1 · Lo que no se traduce ─────────────────────────────────────────── */

const INTACTOS = [
  { que: 'Main Logistics', re: /Main Logistics/ },
  { que: 'MainBrain', re: /MainBrain/ },
  { que: 'DS 298', re: /DS ?298/ },
  { que: 'SICEP', re: /SICEP/ },
  { que: 'UF', re: /\bUF\b/ },
];

/* Cifras: se comparan los números de cada texto. Un número que aparece en
   español y desaparece —o cambia— en la traducción es un dato alterado. */
function numeros(s) {
  return (s.match(/\d[\d.,]*/g) ?? []).map((n) =>
    // Se comparan los DÍGITOS, no la puntuación: el separador de miles es "."
    // en español y portugués y "," en inglés y chino, así que "1.000" y
    // "1,000" son la misma cifra bien escrita en cada idioma.
    n.replace(/[.,](?=\d{3}(\D|$))/g, '').replace(/[.,]$/, ''),
  );
}

/* Palabras que este sitio no usa en ningún idioma. */
/**
 * Las tres claves donde el chino escribe la fecha con el mes en número.
 *
 * "1 de noviembre de 2026" se escribe 2026年11月1日: aparece un 11 que en
 * español es una palabra, y el año va primero. La comparación de cifras lo
 * lee como una cifra alterada, y no lo es: es la misma fecha.
 *
 * La lista va enumerada a mano y no como una regla general de "en chino no
 * se revisan las cifras". Esa regla apagaría la única prueba que impide que
 * una traducción prometa un tonelaje o un plazo distinto del español, que es
 * justamente para lo que existe.
 */
const FECHA_EN_CHINO = new Set([
  'verificador.titulo',
  'verificador.intro',
  'verificador.resultado.noCumpleTexto',
  'paginasServicio.paginas.contenedores.exigencias.2.detalle',
]);

const PROHIBIDAS = {
  en: /\b(world-class|best-in-class|cutting-edge|seamless|unlock|empower\w*|revolutioniz\w+|disrupt\w*|leading provider|industry leader|state-of-the-art)\b/i,
  pt: /\b(líder de mercado|excelência|solu[çc][ãa]o inovadora|revolucion\w+|disrup\w+|classe mundial|parceiro estratégico)\b/i,
  zh: /(世界一流|行业领先|颠覆|赋能|一站式解决方案)/,
};

/* ── 2 · Largos que rompen el diseño ──────────────────────────────────── */

const LARGOS = [
  { ruta: 'meta.titulo', max: 60, donde: 'se corta en buscadores' },
  // El titular entra en dos líneas con ~19 caracteres por línea EN TODOS LOS
  // ANCHOS: la tipografía escala con el viewport, así que el cupo de
  // caracteres es constante y bajar el tamaño no arregla nada. El inglés
  // llegó a 24 y el portugués a 22, y los dos se partían en tres líneas en
  // teléfono. No subir de 19.
  { ruta: 'hero.tituloLinea1', max: 19, donde: 'parte el titular en tres líneas' },
  { ruta: 'hero.rotador.frases.0', max: 10, donde: 'infla la cápsula del titular' },
  { ruta: 'hero.rotador.frases.1', max: 10, donde: 'infla la cápsula del titular' },
  { ruta: 'hero.rotador.frases.2', max: 10, donde: 'infla la cápsula del titular' },
];

for (const id of IDIOMAS) {
  console.log(`\n── ${id.toUpperCase()} ${'─'.repeat(52)}`);
  const t = leer(id);

  // Estructura: TypeScript ya la valida, pero si el parseo difiere hay algo raro.
  if (t.size === es.size) ok(`${t.size} textos, misma cantidad que el español`);
  else ojo(`${t.size} textos vs ${es.size} en español (revisar parseo o arreglos)`);

  // Nombres propios y códigos.
  for (const { que, re } of INTACTOS) {
    const enEs = [...es.entries()].filter(([, v]) => re.test(v)).map(([k]) => k);
    const perdidos = enEs.filter((k) => t.has(k) && !re.test(t.get(k)));
    if (!enEs.length) continue;
    if (!perdidos.length) ok(`"${que}" intacto en los ${enEs.length} textos donde aparece`);
    else mal(`"${que}" se perdió en: ${perdidos.slice(0, 3).join(', ')}`);
  }

  // Cifras.
  const cifrasMal = [];
  for (const [k, v] of es) {
    if (!t.has(k)) continue;
    if (id === 'zh' && FECHA_EN_CHINO.has(k)) continue;
    const a = numeros(v).join('|');
    const b = numeros(t.get(k)).join('|');
    if (a !== b) cifrasMal.push(`${k}: "${a}" → "${b}"`);
  }
  if (!cifrasMal.length) ok('ninguna cifra cambió');
  else cifrasMal.slice(0, 4).forEach((c) => mal(`cifra alterada — ${c}`));

  // Lenguaje prohibido.
  const sucias = [...t.entries()].filter(([, v]) => PROHIBIDAS[id].test(v));
  if (!sucias.length) ok('sin lenguaje de startup ni superlativos vacíos');
  else sucias.slice(0, 4).forEach(([k, v]) => mal(`lenguaje prohibido en ${k}: "${v.slice(0, 60)}"`));

  // Largos.
  for (const { ruta, max, donde } of LARGOS) {
    const v = t.get(ruta);
    if (v === undefined) continue;
    // El chino ocupa cerca del doble por carácter: su presupuesto es la mitad.
    const tope = id === 'zh' ? Math.ceil(max * 0.6) : max;
    if (v.length <= tope) ok(`${ruta}: ${v.length} car. ("${v}")`);
    else mal(`${ruta}: ${v.length} car. supera ${tope} — ${donde}: "${v}"`);
  }

  // Los seis pasos entran en el riel.
  const pasos = [...t.entries()].filter(([k]) => /^cotizar\.pasos\.\w+\.titulo$/.test(k));
  const largos = pasos.filter(([, v]) => v.length > (id === 'zh' ? 8 : 16));
  if (!pasos.length) ojo('no encontré los títulos de los pasos para medirlos');
  else if (!largos.length) ok(`los ${pasos.length} títulos de paso entran en el riel`);
  else largos.forEach(([k, v]) => mal(`título de paso largo — ${k}: "${v}" (${v.length})`));

  // Textos que quedaron idénticos al español: o no se tradujeron, o son
  // nombres propios. Se avisa, no se falla.
  const iguales = [...t.entries()].filter(
    ([k, v]) => es.get(k) === v && v.length > 12 && !/Main Logistics|MainBrain|WhatsApp|BESS|GPS/.test(v),
  );
  if (!iguales.length) ok('sin textos largos idénticos al español');
  else {
    ojo(`${iguales.length} texto(s) idénticos al español, revisar a mano:`);
    iguales.slice(0, 5).forEach(([k, v]) => console.log(`          ${k}: "${v.slice(0, 54)}"`));
  }
}

console.log('');
if (fallos.length) console.log(`${fallos.length} falla(s), ${avisos.length} aviso(s).`);
else console.log(`Traducciones correctas. ${avisos.length} aviso(s) para mirar a ojo.`);
process.exit(fallos.length ? 1 : 0);
