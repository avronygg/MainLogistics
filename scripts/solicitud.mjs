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
const manana = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
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
await p.locator('#sol-fechaEstimada').fill(manana);
await p.locator('#sol-linea-0-equipo').selectOption('Rampla plana');
await p.waitForTimeout(700);

// El RUT se ordena solo: sin importar cómo lo escriban, sale igual.
const rutEscrito = await p.locator('#sol-rut').inputValue();
if (rutEscrito === '76.123.456-0') ok('el RUT escrito sin puntos queda 76.123.456-0');
else mal(`el RUT quedó "${rutEscrito}"`);

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
  razonSocial: 'Prueba', rut: '76123456-0', contacto: 'Prueba', correo: 'a@b.cl',
  telefono: '+56911112222', tipoCarga: 'Carga dimensionada',
  equipo: 'Rampla plana', modalidad: 'Viaje completo · ida', fechaEstimada: manana,
  origen: 'Santiago', destino: 'Calama',
  lineas: [{ descripcion: 'Flete', equipo: 'Rampla plana', cantidad: '1' }], web: '',
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

  // Lo importante para cotizar no es opcional: sin esto, 400.
  for (const [campo, vacio] of [
    ['rut', { rut: '' }], ['rut con dígito malo', { rut: '76123456-1' }],
    ['equipo', { equipo: '' }], ['modalidad', { modalidad: '' }],
    ['fecha', { fechaEstimada: '' }], ['teléfono corto', { telefono: '123' }],
    ['detalle', { lineas: [] }], ['cantidad', { lineas: [{ descripcion: 'x', cantidad: '0' }] }],
  ]) {
    const r = await enviar(vacio);
    if (r.status() === 400) ok(`rechaza sin ${campo}`);
    else mal(`aceptó una solicitud sin ${campo} (${r.status()})`);
  }
} else {
  mal(`una solicitud completa respondió ${completa.status()}`);
}

// En el formulario: enviar vacío marca lo que falta, lleva el foco al primero
// y el RUT se formatea mientras se escribe.
console.log('\nobligatorios en pantalla');
await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(400);
await p.getByRole('button', { name: 'Enviar solicitud' }).click();
await p.waitForTimeout(700);
const invalidos = await p.locator('#solicitud-form [aria-invalid="true"]').evaluateAll(
  (els) => els.map((e) => e.id),
);
const esperados = ['sol-razonSocial', 'sol-rut', 'sol-contacto', 'sol-correo', 'sol-telefono',
  'sol-tipoCarga', 'sol-equipo', 'sol-modalidad', 'sol-fechaEstimada', 'sol-origen',
  'sol-destino', 'sol-linea-0-descripcion', 'sol-linea-0-cantidad'];
const sinMarcar = esperados.filter((id) => !invalidos.includes(id));
if (sinMarcar.length === 0) ok('un formulario vacío marca los 13 datos que hacen falta');
else mal(`no marcó como obligatorios: ${sinMarcar.join(', ')}`);
if (invalidos.includes('sol-cargo') || invalidos.includes('sol-observaciones'))
  mal('marcó como obligatorio el cargo o las observaciones');
else ok('el cargo y las observaciones siguen siendo opcionales');
const foco = await p.evaluate(() => document.activeElement?.id);
if (foco === 'sol-razonSocial') ok('el foco va al primer dato que falta');
else mal(`el foco quedó en "${foco}"`);

for (const [escrito, esperado] of [
  ['761234560', '76.123.456-0'], ['76.123.456-0', '76.123.456-0'],
  ['12345678k', '12.345.678-K'], ['9876543-2', '9.876.543-2'],
  ['12 345 678 - 5', '12.345.678-5'],
]) {
  await p.locator('#sol-rut').fill('');
  await p.locator('#sol-rut').pressSequentially(escrito);
  const v = await p.locator('#sol-rut').inputValue();
  if (v === esperado) ok(`RUT "${escrito}" → ${v}`);
  else mal(`RUT "${escrito}" quedó "${v}", esperaba ${esperado}`);
}
await p.locator('#sol-rut').fill('');
await p.locator('#sol-rut').pressSequentially('761234561');
const errRut = (await p.locator('#sol-rut-error').textContent().catch(() => '')) ?? '';
if (/verificador/.test(errRut)) ok('un dígito verificador malo se explica');
else mal(`sin mensaje de dígito verificador: "${errRut}"`);

// Sin RUT chileno: la casilla lo vuelve opcional y no molesta con validaciones.
await p.getByLabel('No tengo RUT chileno').check();
await p.getByRole('button', { name: 'Enviar solicitud' }).click();
await p.waitForTimeout(500);
const rutMarcado = await p.locator('#sol-rut').getAttribute('aria-invalid');
const rutRestos = await p.locator('#sol-rut').inputValue();
if (rutMarcado === null && rutRestos === '') ok('marcando "No tengo RUT chileno" el RUT deja de ser obligatorio');
else mal(`con la casilla marcada el RUT sigue exigido (aria-invalid=${rutMarcado}, valor "${rutRestos}")`);
await p.locator('#sol-rut').pressSequentially('DE 123456789');
const libre = await p.locator('#sol-rut').inputValue();
if (libre === 'DE 123456789') ok('como extranjero el campo es libre, sin formato chileno');
else mal(`el campo extranjero se reformateó: "${libre}"`);
await p.getByLabel('No tengo RUT chileno').uncheck();

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
