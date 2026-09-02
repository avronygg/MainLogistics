import { chromium } from 'playwright';

/**
 * Verificador de Resolución 154.
 *
 * Lo que importa acá no es que la página cargue: es que el veredicto sea
 * correcto. Una herramienta de cumplimiento que dice "cumple" sobre una guía
 * incompleta es peor que no existir, porque alguien va a confiar en ella y
 * se va a comer la multa.
 *
 * Por eso las pruebas centrales son tres casos límite del texto oficial:
 *
 *   - Declarar que no se conocen las patentes SÍ cumple (resolutivo 1 c).
 *     Dejar el campo vacío, no.
 *   - Un traslado de un día no puede contar como falta por no declarar que
 *     es prolongado: la norma no le pide eso a ese viaje (resolutivo 3 b).
 *   - Un RUT con dígito verificador equivocado no pasa, aunque tenga la
 *     forma correcta.
 */

const BASE = 'http://localhost:3000';
const RUTA = '/es/verificador-resolucion-154';

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();

const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });

// ── 1. Los cuatro idiomas responden ────────────────────────────────────
console.log('\nla página');
for (const idioma of ['es', 'en', 'pt', 'zh']) {
  const r = await p.goto(`${BASE}/${idioma}/verificador-resolucion-154`, {
    waitUntil: 'domcontentloaded',
  });
  const bloques = await p.locator('form fieldset').count();
  if (r.status() === 200 && bloques === 10) ok(`${idioma}: los diez requisitos`);
  else mal(`${idioma}: estado ${r.status()}, ${bloques} bloques`);
}

// El descargo tiene que estar visible SIN interactuar: una herramienta que
// orienta sobre cumplimiento tributario y esconde que no es asesoría está
// pidiendo que le crean de más.
await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
if (await p.getByText(/no es asesoría tributaria/i).isVisible())
  ok('el descargo se ve de entrada');
else mal('el descargo no está visible');

// Y la fuente oficial enlazada, para poder verificar lo que la página afirma.
const fuentes = await p.locator('a[href*="sii.cl"]').count();
if (fuentes >= 2) ok(`${fuentes} enlaces al texto oficial del SII`);
else mal(`solo ${fuentes} enlaces a la fuente`);

// ── 2. Nada se envía a ninguna parte ───────────────────────────────────
console.log('\nprivacidad');
let salio = false;
await p.route('**/*', (r) => {
  const pedido = r.request();
  if (pedido.method() === 'POST' && !/_next|__next/.test(pedido.url())) salio = true;
  return r.continue();
});

// ── 3. Guía vacía: no puede cumplir ────────────────────────────────────
console.log('\nveredicto');
const revisar = () => p.getByRole('button', { name: 'Revisar mi guía' }).click();
const limpiar = () => p.getByRole('button', { name: 'Empezar de nuevo' }).click();
const resultado = p.locator('[role="status"]');

await revisar();
await p.waitForTimeout(300);
const vacia = await resultado.innerText();
// Nueve y no diez: el requisito de traslado prolongado no aplica a un
// viaje que nadie declaró de más de un día, y sale como "no aplica".
if (/9 de 9 sin cumplir/.test(vacia)) ok('guía vacía: faltan los nueve que aplican');
else mal(`guía vacía dio: "${vacia.split('\n')[0]}"`);

// ── 4. RUT con dígito verificador malo ─────────────────────────────────
await limpiar();
await p.locator('#choferRut').fill('12345678-1'); // el dv correcto es 5
await p.waitForTimeout(250);
if (await p.getByText(/dígito verificador no corresponde/i).isVisible())
  ok('rechaza un RUT con dígito verificador equivocado');
else mal('aceptó un RUT con dígito verificador equivocado');

await p.locator('#choferRut').fill('12345678-5');
await p.waitForTimeout(250);
if (!(await p.getByText(/dígito verificador no corresponde/i).isVisible().catch(() => false)))
  ok('acepta el RUT válido');
else mal('rechazó un RUT válido');

// ── 5. La guía completa ────────────────────────────────────────────────
async function completar({ conPatentes = true } = {}) {
  await limpiar();
  await p.locator('#origenDireccion').fill('Camino a Melipilla 1234');
  await p.locator('#origenRegion').selectOption('Valparaíso');
  await p.waitForTimeout(150);
  await p.locator('#origenComuna').selectOption('San Antonio');
  await p.locator('#destinoDireccion').fill('Ruta 5 Norte km 1370');
  await p.locator('#destinoRegion').selectOption('Antofagasta');
  await p.waitForTimeout(150);
  await p.locator('#destinoComuna').selectOption('Calama');
  await p.locator('#choferNombre').fill('Rodrigo Sepúlveda');
  await p.locator('#choferRut').fill('12345678-5');
  await p.locator('#transportistaRut').fill('76123456-0');

  if (conPatentes) {
    await p.locator('#patente').fill('BBCC12');
    await p.locator('#patenteCarro').fill('AB1234');
  } else {
    await p.locator('#sinPatente').check();
  }

  await p.locator('#bienNombre').fill('Bombas centrífugas');
  await p.locator('#bienCantidad').fill('12');
  await p.locator('#bienUnidad').fill('Unidad');
  await p.locator('#bienPeso').fill('4.200 kg');
  await p.locator('#bienPrecio').fill('890000');
  await p.locator('#tipoTraslado').selectOption('1');
  await p.locator('#unaPorVehiculo').check();
  await p.locator('#fechaSalida').fill('2026-11-03');
  await p.locator('#horaSalida').fill('06:30');
  await revisar();
  await p.waitForTimeout(300);
  return resultado.innerText();
}

const completa = await completar();
if (/trae todo lo que la norma exige/.test(completa)) ok('guía completa: cumple');
else mal(`guía completa dio: "${completa.split('\n')[0]}"`);

// Un traslado de UN día no puede contar como falta por no declararse
// prolongado: la norma no le exige eso a ese viaje (resolutivo 3 b).
const filaProlongado = p.locator('[role="status"] li', { hasText: 'más de un día' });
if (/No aplica/i.test(await filaProlongado.innerText()))
  ok('un viaje de un día marca el prolongado como no aplica, ni cumple ni falta');
else mal('el traslado prolongado no quedó como no aplica en un viaje de un día');

// ── 6. El caso límite del resolutivo 1 c) ──────────────────────────────
const sinPatentes = await completar({ conPatentes: false });
if (/trae todo lo que la norma exige/.test(sinPatentes))
  ok('declarar que no se conocen las patentes cumple, según 1 c)');
else mal('declarar que no se conocen las patentes no fue aceptado');

// Pero dejarlas vacías SIN declararlo, no.
await limpiar();
await p.locator('#unaPorVehiculo').check();
await revisar();
await p.waitForTimeout(300);
const filaPatentes = p.locator('[role="status"] li', { hasText: 'Patentes' });
if (/falta/i.test(await filaPatentes.innerText()))
  ok('dejar las patentes en blanco sin declararlo no cumple');
else mal('aceptó las patentes en blanco sin declaración');

// ── 7. Traslado prolongado sin fecha estimada ──────────────────────────
await completar();
await p.locator('#prolongado').check();
await p.waitForTimeout(200);
await revisar();
await p.waitForTimeout(300);
const conProlongado = await resultado.innerText();
if (/1 de 10 sin cumplir/.test(conProlongado))
  ok('traslado de más de un día sin declarar: falta uno');
else mal(`prolongado sin declarar dio: "${conProlongado.split('\n')[0]}"`);

// ── 8. Cada falta cita su resolutivo ───────────────────────────────────
console.log('\nreferencias');
await limpiar();
await revisar();
await p.waitForTimeout(300);
const referencias = await p.locator('[role="status"] li').evaluateAll((lis) =>
  lis.map((li) => li.textContent),
);
const sinCita = referencias.filter((t) => !/Resolutivo/.test(t));
if (sinCita.length === 0) ok('los diez citan el resolutivo que los exige');
else mal(`${sinCita.length} requisito(s) sin referencia normativa`);

// ── 9. Nada salió del navegador ────────────────────────────────────────
if (!salio) ok('no se envió ningún dato a ninguna parte');
else mal('!! el formulario hizo un POST con los datos');

// ── 10. Sin errores de consola y sin desbordes ─────────────────────────
console.log('\nrender');
if (errores.length === 0) ok('sin errores de consola');
else errores.slice(0, 3).forEach((e) => mal(`consola: ${e}`));

for (const ancho of [320, 390, 768, 1440]) {
  await p.setViewportSize({ width: ancho, height: 900 });
  await p.goto(BASE + RUTA, { waitUntil: 'domcontentloaded' });
  const desborde = await p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (desborde <= 1) ok(`${ancho}px sin desborde`);
  else mal(`${ancho}px desborda ${desborde}px`);
}

await b.close();

console.log(
  fallos.length
    ? `\n${fallos.length} falla(s).`
    : '\nEl verificador acierta el veredicto, incluidos los casos límite de los resolutivos 1 c) y 3 b), cita la norma en cada punto y no manda los datos a ninguna parte.',
);
process.exit(fallos.length ? 1 : 0);
