import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

/**
 * El enlace del correo → el cotizador interno.
 *
 * Cuando llega una solicitud, el correo trae un botón que abre el cotizador
 * con los datos del cliente ya cargados. Lo que se verifica acá es el viaje
 * completo del parámetro `?d=`: que los campos lleguen donde corresponde,
 * que el folio se asigne solo y avance, y sobre todo que NO se cuelen los
 * precios de ejemplo. Un valor heredado del ejemplo es peor que un campo
 * vacío: nadie lo revisa, porque parece puesto a propósito.
 *
 * El cotizador vive en otro repositorio. Si no está al lado, esta prueba se
 * salta con un aviso, y por eso no entra en `todas.mjs`: desde acá no se
 * puede garantizar que exista.
 *
 *   node scripts/enlace-cotizador.mjs
 *   COTIZADOR_DIR="<carpeta>" node scripts/enlace-cotizador.mjs
 */

const DIR = process.env.COTIZADOR_DIR
  ?? path.resolve('..', 'cotizaciones logistica trade');

if (!fs.existsSync(path.join(DIR, 'index.html'))) {
  console.log(`\n  se salta: no está el cotizador en ${DIR}`);
  console.log('  (COTIZADOR_DIR=<carpeta> para apuntarlo a otra parte)\n');
  process.exit(0);
}

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

/* ── La solicitud, codificada igual que en app/api/solicitud/route.ts ─── */
const SOLICITUD = {
  razonSocial: 'Minera Los Pelambres SpA',
  rut: '76.123.456-0',
  contacto: 'Aaron Tardón',
  cargo: 'Jefatura de Logística',
  correo: 'aaron@ejemplo.cl',
  telefono: '+56 9 1234 5678',
  tipoCarga: 'Carga dimensionada',
  equipo: 'Rampla cama baja',
  modalidad: 'Viaje completo · ida y vuelta',
  fechaEstimada: '2026-10-15',
  origen: 'Puerto de Coquimbo',
  destino: 'Faena Los Pelambres, Salamanca',
  requisitos: 'Ingreso a faena con homologación vigente.',
  items: [
    { desc: 'Traslado de molino SAG, pieza única', equipo: 'Rampla cama baja', cant: '1', unit: '', incl: false },
    { desc: 'Repuestos paletizados', equipo: 'Rampla plana', cant: '3', unit: '', incl: false },
  ],
};

const d = Buffer.from(JSON.stringify(SOLICITUD), 'utf8').toString('base64url');

/* ── Un servidor estático: en file:// el navegador niega localStorage y el
      folio no se podría probar ──────────────────────────────────────────── */
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const servidor = http.createServer((pet, res) => {
  const rel = decodeURIComponent(new URL(pet.url, 'http://x').pathname);
  const archivo = path.join(DIR, rel === '/' ? 'index.html' : rel);
  if (!archivo.startsWith(DIR) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
    res.writeHead(404).end('no');
    return;
  }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(archivo));
});
await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 } });
const p = await ctx.newPage();

const errores = [];
p.on('pageerror', (e) => errores.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });

const valor = (nombre) => p.locator(`[name="${nombre}"]`).inputValue();
const asentar = () => p.waitForTimeout(300);

// ── 1. Llega la solicitud ───────────────────────────────────────────────
console.log('\nel enlace del correo');
await p.goto(`${BASE}/?d=${d}`, { waitUntil: 'load' });
await asentar();

for (const [campo, esperado] of Object.entries(SOLICITUD)) {
  if (campo === 'items') continue;
  const puesto = await valor(campo).catch(() => null);
  if (puesto === null) mal(`el cotizador no tiene campo "${campo}"`);
  else if (puesto.trim() !== esperado.trim()) mal(`${campo}: llegó ${JSON.stringify(puesto)}`);
  else ok(campo);
}

// ── 2. Las líneas, con equipo y cantidad, sin precio ────────────────────
console.log('\nlas líneas del servicio');
const lineas = await p.locator('#items .item').count();
if (lineas !== SOLICITUD.items.length) mal(`son ${lineas} líneas y deberían ser ${SOLICITUD.items.length}`);
else ok(`${lineas} líneas`);

for (const [i, it] of SOLICITUD.items.entries()) {
  const fila = p.locator('#items .item').nth(i);
  const desc = await fila.locator('[data-k="desc"]').inputValue();
  const equipo = await fila.locator('[data-k="equipo"]').inputValue();
  const cant = await fila.locator('[data-k="cant"]').inputValue();
  const unit = await fila.locator('[data-k="unit"]').inputValue();
  if (desc !== it.desc) mal(`línea ${i + 1}: descripción ${JSON.stringify(desc)}`);
  else if (equipo !== it.equipo) mal(`línea ${i + 1}: equipo ${JSON.stringify(equipo)}`);
  else if (cant !== it.cant) mal(`línea ${i + 1}: cantidad ${JSON.stringify(cant)}`);
  else if (unit !== '') mal(`línea ${i + 1}: trae un precio puesto (${JSON.stringify(unit)})`);
  else ok(`línea ${i + 1}, sin precio`);
}

// ── 3. Nada del ejemplo ─────────────────────────────────────────────────
console.log('\nsin restos del ejemplo');
const texto = await p.locator('body').innerText();
for (const rastro of ['Empresa Cliente SpA', '1.850.000', '95.000', 'Antofagasta', 'Nombre Apellido']) {
  if (texto.includes(rastro)) mal(`quedó "${rastro}" del ejemplo`);
  else ok(`sin "${rastro}"`);
}
const ejecutivo = await valor('ejecutivo');
if (ejecutivo !== '') mal(`el ejecutivo viene puesto: ${JSON.stringify(ejecutivo)}`);
else ok('el ejecutivo lo escribe quien emite');

// ── 4. El folio: alto, automático y creciente ───────────────────────────
console.log('\nel folio');
const anio = new Date().getFullYear();
const folio = await valor('numero');
if (folio !== `COT-${anio}-1543`) mal(`el primero debería ser COT-${anio}-1543 y es ${JSON.stringify(folio)}`);
else ok(folio);

if (new URL(p.url()).search !== '') mal(`el parámetro quedó en la barra: ${p.url().slice(0, 60)}`);
else ok('el parámetro sale de la barra de direcciones');

await p.reload({ waitUntil: 'load' });
await asentar();
const trasRefresco = await valor('numero');
const empresaTrasRefresco = await valor('razonSocial');
if (trasRefresco !== folio) mal(`un refresco cambió el folio a ${JSON.stringify(trasRefresco)}`);
else ok('un refresco no gasta otro folio');
if (empresaTrasRefresco !== SOLICITUD.razonSocial) mal('un refresco perdió los datos del cliente');
else ok('un refresco conserva la solicitud');

await p.goto(`${BASE}/?d=${d}`, { waitUntil: 'load' });
await asentar();
const segundo = await valor('numero');
if (segundo !== `COT-${anio}-1544`) mal(`la segunda solicitud debería ser COT-${anio}-1544 y es ${JSON.stringify(segundo)}`);
else ok(segundo);

// ── 5. Un enlace roto no rompe la herramienta ───────────────────────────
console.log('\nun enlace roto');
await p.goto(`${BASE}/?d=no-es-base64-ni-json`, { waitUntil: 'load' });
await asentar();
const tras = await valor('numero').catch(() => null);
if (!tras) mal('el cotizador quedó inutilizable');
else ok(`sigue abriendo (${tras})`);

// ── 6. Un enlace armado a mano no decide lo que decide Trade ────────────
console.log('\nun enlace armado a mano');
const forzado = Buffer.from(JSON.stringify({
  razonSocial: 'Empresa X',
  numero: 'COT-2026-0001',
  iva: '0',
  condiciones: 'Sin condiciones',
  items: [{ desc: 'Flete', equipo: '', cant: '1', unit: '999.999', incl: false }],
}), 'utf8').toString('base64url');
await p.goto(`${BASE}/?d=${forzado}`, { waitUntil: 'load' });
await asentar();
const numeroForzado = await valor('numero');
const precioForzado = await p.locator('#items .item').first().locator('[data-k="unit"]').inputValue();
const ivaForzado = await valor('iva');
const condicionesForzadas = await valor('condiciones');
if (numeroForzado === 'COT-2026-0001') mal('el enlace pudo fijar el folio');
else ok('el folio no se puede fijar desde el enlace');
if (precioForzado !== '') mal(`el enlace pudo poner un precio: ${JSON.stringify(precioForzado)}`);
else ok('el enlace no puede poner precios');
if (ivaForzado !== '19' || condicionesForzadas === 'Sin condiciones') mal('el enlace pudo cambiar IVA o condiciones');
else ok('el enlace no puede cambiar el IVA ni las condiciones');

// ── 7. Sin errores de consola ───────────────────────────────────────────
console.log('\nla consola');
if (errores.length) errores.slice(0, 5).forEach((e) => mal(`consola: ${e}`));
else ok('sin errores');

await b.close();
servidor.close();

console.log(fallos.length ? `\n${fallos.length} fallas\n` : '\ntodo en orden\n');
process.exit(fallos.length ? 1 : 0);
