import { chromium } from 'playwright';

/**
 * Solicitud de cotización.
 *
 * Lo que importa no es que la página cargue: es que lo escrito aparezca en
 * la hoja, que NUNCA aparezca un precio, y que la API no acepte valores que
 * el formulario no ofrece.
 *
 * El precio es la prueba central. Esta página es pública y el documento
 * lleva el membrete de Logística Trade: si algún día se colara una columna
 * de valores, cualquiera podría generar algo que parece una cotización
 * emitida.
 */

const BASE = 'http://localhost:3000';
const RUTA = '/es/solicitud-de-cotizacion';

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1200 } })).newPage();

const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
p.on('console', (m) => {
  // El 503 de la API lo provocamos nosotros: sin clave de Resend en local.
  if (m.type() === 'error' && !/api\/solicitud|503/.test(m.text())) errores.push(m.text());
});

// ── 1. Los cuatro idiomas ──────────────────────────────────────────────
console.log('\nla página');
for (const idioma of ['es', 'en', 'pt', 'zh']) {
  const r = await p.goto(`${BASE}/${idioma}/solicitud-de-cotizacion`, {
    waitUntil: 'domcontentloaded',
  });
  const hoja = await p.locator('article[aria-label]').count();
  const h1 = await p.locator('main h1').count();
  if (r.status() === 200 && hoja === 1 && h1 === 1) ok(`${idioma}: página y hoja`);
  else mal(`${idioma}: estado ${r.status()}, ${hoja} hoja(s), ${h1} h1`);
}

// Ningún id repetido: el campo "contacto" chocaba con el ancla del pie, y
// dos elementos con el mismo id rompen la asociación de <label for>.
await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);
const repetidos = await p.evaluate(() => {
  const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
  return [...new Set(ids.filter((v, i, a) => a.indexOf(v) !== i))];
});
if (repetidos.length === 0) ok('ningún id repetido en la página');
else mal(`ids repetidos: ${repetidos.join(', ')}`);

// ── 2. Lo escrito aparece en la hoja ───────────────────────────────────
console.log('\nla hoja se arma');
const texto = {
  'sol-razonSocial': 'Minera Los Andes SpA',
  'sol-rut': '76123456-0',
  'sol-contacto': 'Rodrigo Sepúlveda',
  'sol-cargo': 'Jefe de abastecimiento',
  'sol-correo': 'rsepulveda@ejemplo.cl',
  'sol-telefono': '+56 9 1234 5678',
  'sol-origen': 'Santiago',
  'sol-destino': 'Antofagasta',
  'sol-linea-0-descripcion': 'Flete Santiago – Antofagasta, carga paletizada',
  'sol-linea-0-cantidad': '2',
  'sol-observaciones': 'Ingreso a faena con homologación vigente.',
};
for (const [id, v] of Object.entries(texto)) await p.locator('#' + id).fill(v);
await p.locator('#sol-tipoCarga').selectOption('Carga dimensionada');
await p.locator('#sol-equipo').selectOption('Rampla plana');
await p.locator('#sol-modalidad').selectOption('Viaje completo · ida');
await p.locator('#sol-linea-0-equipo').selectOption('Rampla plana');
await p.waitForTimeout(700);

const hoja = (await p.locator('article[aria-label]').innerText()).toLowerCase();
const faltantes = [
  'minera los andes spa', 'rodrigo sepúlveda', 'jefe de abastecimiento',
  'rsepulveda@ejemplo.cl', 'carga dimensionada', 'rampla plana',
  'santiago', 'antofagasta', 'flete santiago',
].filter((t) => !hoja.includes(t));
if (faltantes.length === 0) ok('todo lo escrito aparece en el documento');
else mal(`no llegó a la hoja: ${faltantes.join(', ')}`);

// ── 3. LA PRUEBA QUE IMPORTA: ni un precio ─────────────────────────────
console.log('\nsin precios');
const conPrecio = /\$|neto|iva|total clp|valor unit/.test(hoja);
if (!conPrecio) ok('la hoja no muestra ningún valor');
else mal('!! APARECE ALGO DE PRECIO EN LA HOJA');

if (hoja.includes('sin valores')) ok('el documento declara que no lleva valores');
else mal('el documento no dice que va sin valores');

// Y que se llame solicitud, no cotización a secas: no es un documento
// emitido y no puede parecerlo.
if (/solicitud de cotización/.test(hoja)) ok('el título dice "solicitud", no "cotización"');
else mal('el título de la hoja no dice que es una solicitud');

// ── 4. Validación ──────────────────────────────────────────────────────
console.log('\nvalidación');
const base = {
  razonSocial: 'Prueba', contacto: 'Prueba', correo: 'a@b.cl',
  telefono: '+56911112222', tipoCarga: 'Carga dimensionada',
  origen: 'Santiago', destino: 'Calama', lineas: [], web: '',
};
const enviar = (extra) =>
  p.request.post(`${BASE}/api/solicitud`, { data: { ...base, ...extra } });

// Sin clave de Resend en local, la ruta corta en 503 ANTES de validar: eso
// es correcto y significa que no se puede probar la validación acá.
const completa = await enviar({});
if (completa.status() === 503) {
  ok('sin configuración responde 503 y no finge haber enviado');
  ok('(la validación se prueba con credenciales de prueba, ver el commit)');
} else if (completa.status() === 200) {
  ok('la API aceptó una solicitud completa');
  const inventado = await enviar({ tipoCarga: '<script>alert(1)</script>' });
  if (inventado.status() === 400) ok('rechaza un tipo de carga inventado');
  else mal(`aceptó un tipo de carga inventado (${inventado.status()})`);
} else {
  mal(`una solicitud completa respondió ${completa.status()}`);
}

// La trampa de robots se descarta en silencio, nunca con un error.
const bot = await enviar({ web: 'soy-un-bot' });
if ([200, 503].includes(bot.status())) ok('la trampa de robots no delata que existe');
else mal(`la trampa respondió ${bot.status()}`);

// ── 5. Móvil ───────────────────────────────────────────────────────────
console.log('\nmóvil y anchos');
for (const ancho of [320, 390, 768, 1024, 1440]) {
  await p.setViewportSize({ width: ancho, height: 900 });
  await p.goto(BASE + RUTA, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(500);
  if (ancho < 1024) {
    await p.getByRole('tab', { name: 'Vista previa' }).click();
    await p.waitForTimeout(700);
  }
  const m = await p.evaluate(() => {
    const marco = document.querySelector('[style*="transform: scale"]');
    const e = marco && marco.getAttribute('style').match(/scale\(([\d.]+)\)/);
    return {
      desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      escala: e ? Number(e[1]) : null,
    };
  });
  if (m.desborde > 1) mal(`${ancho}px desborda ${m.desborde}px`);
  else if (m.escala === null || m.escala > 1.01) mal(`${ancho}px: la hoja no se escaló (${m.escala})`);
  else ok(`${ancho}px sin desborde, hoja al ${(m.escala * 100).toFixed(0)}%`);
}

// ── 6. Consola limpia ──────────────────────────────────────────────────
console.log('\nconsola');
if (errores.length === 0) ok('sin errores de consola');
else errores.slice(0, 3).forEach((e) => mal(`consola: ${e}`));

await b.close();

console.log(
  fallos.length
    ? `\n${fallos.length} falla(s).`
    : '\nLa solicitud se arma a la vista en los cuatro idiomas, no muestra ni un precio, y la hoja se escala sin desbordar en ningún ancho.',
);
process.exit(fallos.length ? 1 : 0);
