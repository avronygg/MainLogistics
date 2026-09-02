import { chromium } from 'playwright';

/**
 * Recorrido completo del formulario de cotización por pasos.
 *
 * La prueba que importa es la última: con la API respondiendo error, el
 * formulario NUNCA puede decir que se envió. Una consulta perdida en
 * silencio es lo peor que puede hacer esta sección.
 */

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();

const errores = [];
// El 503 de /api/cotizar lo provocamos nosotros más abajo para probar que el
// formulario no miente: no cuenta como error de la página.
const esperado = (t) => /api\/cotizar/.test(t) || /503|Service Unavailable/.test(t);
p.on('pageerror', (e) => errores.push(e.message));
p.on('console', (m) => {
  if (m.type() === 'error' && !esperado(m.text())) errores.push(m.text());
});

await p.goto('http://localhost:3000/es/cotizar', { waitUntil: 'networkidle' });
await p.locator('#cotizar').scrollIntoViewIfNeeded();
await p.waitForTimeout(400);

const panel = p.locator('#cotizar');
const principal = panel.getByRole('button', { name: /Siguiente|Revisar solicitud/ });

// ── 1. No avanza con el paso vacío, y dice qué falta ──────────────────
console.log('\nvalidación al avanzar');
await principal.click();
await p.waitForTimeout(300);

if (await panel.getByText('1/6').isVisible()) ok('no avanzó con el paso 1 vacío');
else mal('avanzó con campos obligatorios vacíos');

const conError = await panel.locator('[aria-invalid="true"], fieldset:has(svg)').count();
if (conError > 0) ok('marcó los campos que faltan');
else mal('no marcó ningún campo faltante');

// El botón principal NUNCA se deshabilita: a pleno sol, un botón que no
// responde no se distingue de uno roto.
if (await principal.isEnabled()) ok('el botón Siguiente sigue habilitado');
else mal('el botón Siguiente se deshabilitó');

// ── 2. Recorrido de los seis pasos ────────────────────────────────────
console.log('\nrecorrido');

async function elegir(nombre, valor) {
  await panel.locator(`input[name="${nombre}"][value="${valor}"]`).check({ force: true });
}
async function avanzar(esperado) {
  await panel.getByRole('button', { name: /Siguiente|Revisar solicitud/ }).click();
  await p.waitForTimeout(350);
  if (esperado && !(await panel.getByText(esperado).first().isVisible())) {
    mal(`no llegó a ${esperado}`);
    return false;
  }
  return true;
}

await elegir('tipoCarga', 'sobredimension');
await elegir('equipo', 'cama_baja');
if (await avanzar('2/6')) ok('paso 1 → 2  (carga y equipo)');

await panel.locator('#origenRegion').selectOption('Valparaíso');
await p.waitForTimeout(150);
await panel.locator('#origenComuna').selectOption('San Antonio');
await panel.locator('#destinoRegion').selectOption('Antofagasta');
await p.waitForTimeout(150);
await panel.locator('#destinoComuna').selectOption('Calama');
if (await avanzar('3/6')) ok('paso 2 → 3  (región y comuna, con comuna filtrada)');

await elegir('fecha', 'semana');
if (await avanzar('4/6')) ok('paso 3 → 4  (fecha)');

await elegir('modalidad', 'contrato');
await p.waitForTimeout(200);
await panel.locator('#duracion').selectOption('6_meses');
if (await avanzar('5/6')) ok('paso 4 → 5  (modalidad + condicional duración)');

await elegir('valor', 'mas_3000');
if (await avanzar('6/6')) ok('paso 5 → 6  (requisitos opcionales, valor)');

await panel.locator('#empresa').fill('Minera Ejemplo');
await panel.locator('#nombre').fill('Aaron Tardón');
await panel.locator('#correo').fill('aaron@ejemplo.cl');
await panel.locator('#telefono').fill('+56 9 1234 5678');
await avanzar();
await p.waitForTimeout(400);

// ── 3. Resumen ────────────────────────────────────────────────────────
console.log('\nresumen');
if (await panel.getByRole('heading', { name: 'Revise antes de enviar' }).isVisible()) ok('llegó al resumen');
else mal('no llegó al resumen');

for (const esperado of ['Sobredimensionada', 'San Antonio', 'Calama', 'Minera Ejemplo']) {
  if (await panel.getByText(esperado, { exact: false }).first().isVisible())
    ok(`el resumen muestra "${esperado}"`);
  else mal(`el resumen no muestra "${esperado}"`);
}

// El resumen NO es el paso 7: el riel se muestra lleno.
if (await panel.getByText('6/6').isVisible()) ok('el riel marca 6/6, el resumen no es un paso más');
else mal('el resumen se cuenta como paso extra');

// ── 4. Editar desde el resumen vuelve AL RESUMEN ──────────────────────
console.log('\neditar desde el resumen');
await panel.getByRole('button', { name: /Editar La ruta/ }).click();
await p.waitForTimeout(350);
if (await panel.getByText('2/6').isVisible()) ok('el "Editar" lleva al paso correcto');
else mal('el "Editar" no lleva al paso correcto');

await panel.getByRole('button', { name: 'Guardar y volver al resumen' }).click();
await p.waitForTimeout(350);
if (await panel.getByRole('heading', { name: 'Revise antes de enviar' }).isVisible())
  ok('vuelve al resumen y no al paso siguiente');
else mal('no volvió al resumen tras editar');

// ── 5. LA PRUEBA QUE IMPORTA ──────────────────────────────────────────
console.log('\nenvío con la API caída');
await p.route('**/api/cotizar', (r) =>
  r.fulfill({ status: 503, contentType: 'application/json', body: '{"ok":false}' }),
);

await panel.getByRole('button', { name: 'Enviar solicitud' }).click();
await p.waitForTimeout(700);

if (await panel.getByText('Recibimos su solicitud.').isVisible().catch(() => false))
  mal('!! DIJO QUE SE ENVIÓ CON LA API CAÍDA');
else ok('no reportó éxito falso');

if (await panel.getByRole('alert').isVisible()) ok('mostró el error');
else mal('no mostró ningún error');

if (await panel.getByText(/contacto@mainlogistics\.cl|WhatsApp/).first().isVisible())
  ok('ofreció una salida alternativa');
else mal('no ofreció salida alternativa');

// Nada se pierde: los datos siguen en pantalla para reenviar o copiar.
if (await panel.getByText('Minera Ejemplo').first().isVisible())
  ok('los datos siguen en pantalla tras el error');
else mal('se perdieron los datos al fallar');

// ── 6. Sin errores de consola ─────────────────────────────────────────
console.log('\nconsola');
if (errores.length === 0) ok('sin errores de consola');
else errores.slice(0, 5).forEach((e) => mal(`consola: ${e}`));

await b.close();

console.log(
  fallos.length
    ? `\n${fallos.length} falla(s).`
    : '\nFormulario por pasos correcto: valida al avanzar, edita y vuelve al resumen, y nunca reporta un envío que no ocurrió.',
);
process.exit(fallos.length ? 1 : 0);
