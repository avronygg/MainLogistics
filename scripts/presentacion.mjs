import { chromium } from 'playwright';

/**
 * Verifica /presentacion. Con el sitio corriendo en localhost:3000:
 *   node scripts/presentacion.mjs
 *
 * Lo que más se puede romper sin que nadie lo note:
 *   · que un capítulo deje de calzar en la pantalla al cambiar un texto;
 *   · que quede español colado en otro idioma;
 *   · que el mando tape contenido o el pie;
 *   · que un enlace del cotizador apunte a una página que ya no existe.
 *
 * Contra el build de producción (`npm run build && npm start`) además prueba la
 * política de seguridad real: en desarrollo está más abierta.
 */

const BASE = 'http://localhost:3000';
const IDIOMAS = ['es', 'en', 'pt', 'zh'];
const CAPITULOS = ['portada', 'servicios', 'cumplimiento', 'monitoreo', 'cobertura', 'seguridad', 'proceso', 'equipo', 'clientes', 'cierre'];
/* Solo existen en español. "Cobertura" o "Contacto" no sirven: son iguales en portugués. */
const DELATORES = ['Cotiza tu carga', 'Cómo funciona', 'Quién mueve', 'Te asesoramos', 'Descargar PDF', 'Monitoreo en ruta', 'Te respondemos'];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };
const probar = (cond, m) => (cond ? ok(m) : mal(m));

/* ── Contraste de la paleta de la página ───────────────────────── */
function luminancia(hex) {
  const c = hex.match(/[0-9a-f]{2}/gi).map((h) => parseInt(h, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
console.log('\nContraste (AA, 4.5:1)');
for (const [texto, fondo, nombre] of [
  ['#ffffff', '#0b0914', 'texto / fondo'],
  ['#ffffff', '#14111f', 'texto / sup-1'],
  ['#b4adc8', '#0b0914', 'secundario / fondo'],
  ['#b4adc8', '#14111f', 'secundario / sup-1'],
  ['#b4adc8', '#1e1a2e', 'secundario / sup-2'],
  ['#af97ff', '#0b0914', 'lila / fondo'],
  ['#af97ff', '#14111f', 'lila / sup-1'],
  ['#af97ff', '#1e1a2e', 'lila / sup-2'],
  ['#ffffff', '#6835e1', 'blanco / morado'],
  ['#ede6ff', '#6835e1', 'secundario / morado'],
  ['#2c1578', '#ffffff', 'botón blanco'],
]) {
  const r = contraste(texto, fondo);
  probar(r >= 4.5, `${nombre}: ${r.toFixed(2)}:1`);
}

const b = await chromium.launch();

/* ── Idiomas ───────────────────────────────────────────────────── */
for (const idioma of IDIOMAS) {
  console.log(`\n/${idioma}/presentacion`);
  const p = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });

  const r = await p.goto(`${BASE}/${idioma}/presentacion`, { waitUntil: 'networkidle' });
  probar(r?.status() === 200, `responde ${r?.status()}`);
  probar((await p.locator('h1').count()) === 1, 'un solo h1');
  for (const id of CAPITULOS) {
    if ((await p.locator(`#${id}`).count()) !== 1) mal(`falta #${id}`);
  }
  ok('los 10 capítulos existen');

  const texto = await p.locator('main').innerText();
  if (idioma !== 'es') {
    const colados = DELATORES.filter((d) => texto.includes(d));
    probar(colados.length === 0, colados.length ? `español colado: ${colados.join(', ')}` : 'sin español colado');
  }
  const og = await p.getAttribute('meta[property="og:image"]', 'content');
  probar(og?.includes(`/presentacion/og-${idioma}.jpg`), 'imagen para compartir propia');

  /* Cada capítulo calza con la pantalla y nada queda bajo el mando. */
  for (const [ancho, alto] of [[1280, 720], [1366, 768], [1536, 864], [1920, 1080]]) {
    await p.setViewportSize({ width: ancho, height: alto });
    await p.waitForTimeout(150);
    const problemas = await p.evaluate((ids) => ids.flatMap((id) => {
      const c = document.getElementById(id);
      const salida = [];
      if (c.offsetHeight > innerHeight + 1) salida.push(`#${id} mide ${c.offsetHeight}`);
      if (c.scrollWidth > innerWidth) salida.push(`#${id} desborda a lo ancho`);
      return salida;
    }), CAPITULOS);
    probar(problemas.length === 0, problemas.length ? `${ancho}×${alto}: ${problemas.join(', ')}` : `calza en ${ancho}×${alto}`);
  }

  /* Sin desborde lateral, del teléfono más chico a la tablet. */
  for (const ancho of [320, 360, 390, 768, 1024]) {
    await p.setViewportSize({ width: ancho, height: 800 });
    await p.waitForTimeout(150);
    const sobra = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    probar(sobra <= 0, sobra > 0 ? `${ancho}px: desborda ${sobra}px` : `${ancho}px sin desborde`);
  }
  probar(errores.length === 0, errores.length ? `errores: ${errores.slice(0, 3).join(' | ')}` : 'sin errores de consola ni de CSP');
  await p.close();
}

/* ── Enlaces y descargas ───────────────────────────────────────── */
console.log('\nEnlaces');
{
  const p = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
  await p.goto(`${BASE}/es/presentacion`, { waitUntil: 'networkidle' });
  const internos = await p.evaluate(() => [...new Set(
    [...document.querySelectorAll('main a[href^="/"]')].map((a) => a.getAttribute('href')),
  )]);
  for (const href of internos) {
    const r = await p.request.get(`${BASE}${href}`);
    probar(r.status() === 200, `${href} → ${r.status()}`);
  }
  for (const i of IDIOMAS) {
    const r = await p.request.get(`${BASE}/presentacion/og-${i}.jpg`);
    const peso = (await r.body()).length;
    // Bajo 40 KB es que salió sin la foto: el fondo oscuro comprime a casi nada.
    probar(r.status() === 200 && peso > 40000 && peso < 300000, `og-${i}.jpg: ${r.status()}, ${Math.round(peso / 1000)} KB`);
  }
  const redir = await p.request.get(`${BASE}/presentacion`, {
    maxRedirects: 0,
    headers: { 'accept-language': 'es-CL' },
  });
  probar(redir.headers().location?.endsWith('/es/presentacion'), '/presentacion lleva a /es/presentacion');
  await p.close();
}

/* ── Mando ─────────────────────────────────────────────────────── */
console.log('\nMando');
{
  const p = await (await b.newContext({ viewport: { width: 1366, height: 768 } })).newPage();
  await p.goto(`${BASE}/es/presentacion`, { waitUntil: 'networkidle' });
  const esperar = (id) => p.waitForFunction(
    (h) => document.querySelector('[aria-current="step"]')?.getAttribute('href') === h,
    `#${id}`,
    { timeout: 5000 },
  );

  await p.keyboard.press('ArrowRight');
  await esperar('servicios');
  ok('flecha derecha pasa al capítulo siguiente');
  await p.keyboard.press('ArrowLeft');
  await esperar('portada');
  ok('flecha izquierda vuelve');

  await p.locator('a[href="#cobertura"]').first().click();
  await esperar('cobertura');
  ok('un tramo lleva a su capítulo');
  /* Encuadrado el capítulo, la ruta tiene que verse completa. */
  await p.waitForFunction(() => {
    const a = document.querySelector('[class*="rutaAvance"]');
    return a && a.getBoundingClientRect().height >= a.parentElement.getBoundingClientRect().height - 2;
  }, null, { timeout: 5000 });
  ok('la ruta queda completa al encuadrar Cobertura');

  await p.locator('button[title="Presentar en pantalla completa"]').click();
  await p.waitForFunction(() => document.documentElement.classList.contains('presentando'), null, { timeout: 5000 });
  probar((await p.locator('header').first().isVisible()) === false, 'al presentar se oculta la barra');
  await p.waitForTimeout(600);
  await p.keyboard.press('ArrowDown');
  await esperar('seguridad');
  ok('al presentar, flecha abajo pasa de capítulo');
  await p.keyboard.press('Space');
  await esperar('proceso');
  probar(await p.evaluate(() => Boolean(document.fullscreenElement)), 'Espacio avanza y no cierra la presentación');
  await p.waitForTimeout(1500); // el scroll suave sigue después de cruzar la mitad
  const encuadre = await p.evaluate(() => document.getElementById('proceso').getBoundingClientRect().top);
  probar(Math.abs(encuadre) < 2, `capítulo encuadrado (top ${encuadre.toFixed(0)}px)`);
  await p.evaluate(() => document.exitFullscreen());
  await p.waitForFunction(() => !document.documentElement.classList.contains('presentando'), null, { timeout: 5000 });
  ok('al salir vuelve a ser página');

  /* Tres toques rápidos tienen que avanzar tres capítulos. */
  await p.locator('a[href="#portada"]').first().click();
  await esperar('portada');
  await p.waitForTimeout(1500);
  for (let i = 0; i < 3; i++) {
    await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(120);
  }
  await esperar('monitoreo');
  ok('tres flechas rápidas avanzan tres capítulos');

  /* En el último capítulo el mando sigue ahí: es la única forma de volver. */
  await p.locator('a[href="#cierre"]').first().click();
  await esperar('cierre');
  await p.waitForTimeout(1500);
  for (const [ancho, alto] of [[1440, 900], [1920, 1080], [412, 915]]) {
    await p.setViewportSize({ width: ancho, height: alto });
    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.getElementById('cierre').scrollIntoView();
    });
    await p.waitForTimeout(400);
    probar((await p.locator('[data-oculto]').count()) === 0, `mando visible en el cierre a ${ancho}×${alto}`);
  }
  await p.setViewportSize({ width: 1366, height: 768 });

  await p.locator('footer').scrollIntoViewIfNeeded();
  await p.waitForFunction(() => document.querySelector('[data-oculto]'), null, { timeout: 5000 });
  ok('sobre el pie el mando se oculta');
  await p.close();
}

/* ── Enlaces directos a un capítulo ─────────────────────────────── */
console.log('\nEnlace directo');
for (const [ancho, alto] of [[1440, 900], [390, 844]]) {
  for (const id of ['cobertura', 'seguridad', 'cierre']) {
    const p = await (await b.newContext({ viewport: { width: ancho, height: alto } })).newPage();
    await p.goto(`${BASE}/es/presentacion#${id}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    const actual = await p.locator('[aria-current="step"]').getAttribute('href');
    probar(actual === `#${id}`, `${ancho}px: #${id} abre en su capítulo (${actual})`);
    await p.close();
  }
}

/* ── Sin JavaScript ─────────────────────────────────────────────── */
console.log('\nSin JavaScript');
{
  const p = await (await b.newContext({ viewport: { width: 1366, height: 768 }, javaScriptEnabled: false })).newPage();
  await p.goto(`${BASE}/es/presentacion`, { waitUntil: 'load' });
  await p.locator('#servicios').scrollIntoViewIfNeeded();
  const opacidad = await p.locator('#servicios a').first().evaluate((e) => getComputedStyle(e.parentElement).opacity).catch(() => null);
  /* Con JS apagado `evaluate` igual corre: lo que se apaga es el de la página. */
  probar(opacidad === '1', `los servicios se ven (opacidad ${opacidad})`);
  await p.close();
}

/* ── Móvil: objetivos táctiles ─────────────────────────────────── */
console.log('\nMóvil');
{
  const p = await (await b.newContext({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true })).newPage();
  await p.goto(`${BASE}/es/presentacion`, { waitUntil: 'networkidle' });
  const chicos = await p.evaluate(() => [...document.querySelectorAll('main a, main button')]
    .map((e) => ({ r: e.getBoundingClientRect(), t: e.textContent || e.getAttribute('aria-label') || e.title, tramo: e.hasAttribute('data-estado') }))
    .filter(({ r, tramo }) => r.width > 0 && (tramo ? r.height < 24 || r.width < 24 : r.height < 44))
    .map(({ t, r }) => `${t} (${r.width.toFixed(0)}×${r.height.toFixed(0)})`));
  probar(chicos.length === 0, chicos.length ? `muy chicos: ${chicos.join(', ')}` : 'objetivos táctiles suficientes en 320px');
  await p.close();
}

/* ── Menos movimiento ──────────────────────────────────────────── */
console.log('\nprefers-reduced-motion');
{
  const p = await (await b.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' })).newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));
  await p.goto(`${BASE}/es/presentacion`, { waitUntil: 'networkidle' });
  probar(errores.length === 0, errores.length ? `error de hidratación: ${errores[0].slice(0, 80)}` : 'sin error de hidratación');
  const r = await p.evaluate(() => {
    const a = document.querySelector('[class*="rutaAvance"]');
    return {
      completa: a.getBoundingClientRect().height >= a.parentElement.getBoundingClientRect().height - 2,
      marca: getComputedStyle(document.querySelector('[class*="rutaMarca"]')).display,
    };
  });
  probar(r.completa && r.marca === 'none', 'la ruta aparece completa y sin marcador');
  await p.close();
}

await b.close();
console.log(fallos.length ? `\n${fallos.length} FALLAS` : '\nTodo bien.');
process.exit(fallos.length ? 1 : 0);
