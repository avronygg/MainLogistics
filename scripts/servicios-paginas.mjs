import { chromium } from 'playwright';

/**
 * Las páginas de servicio y su hub.
 *
 * Existen por una razón de buscador (brief §5.1: sin URL por servicio, todo
 * el long tail queda fuera de alcance), así que las pruebas van a lo que un
 * buscador y un lector ven: que cada una tenga un `title` y una descripción
 * PROPIOS, que el `hreflang` apunte a las cuatro, que el structured data
 * declare lo mismo que está escrito, y que el hub no enlace a ningún 404.
 */

const BASE = 'http://localhost:3000';
const IDIOMAS = ['es', 'en', 'pt', 'zh'];
const SLUGS = ['contenedores', 'carga-general', 'insumos-mineros', 'bess-y-energia'];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

// ── 1. El hub no enlaza a nada roto ────────────────────────────────────
console.log('\nel hub');
for (const idioma of IDIOMAS) {
  const r = await p.goto(`${BASE}/${idioma}/transporte-de-carga`, {
    waitUntil: 'domcontentloaded',
  });
  const hrefs = await p.locator('main a[href*="/transporte-de-carga/"]').evaluateAll((as) =>
    as.map((a) => new URL(a.href).pathname),
  );
  const esperadas = SLUGS.map((s) => `/${idioma}/transporte-de-carga/${s}`);
  const faltan = esperadas.filter((e) => !hrefs.includes(e));
  if (r.status() === 200 && faltan.length === 0) ok(`${idioma}: enlaza las cuatro`);
  else mal(`${idioma}: estado ${r.status()}, falta ${faltan.join(', ')}`);
}

// Y ninguno de esos enlaces puede ser un 404. El brief §10.3 usa los
// enlaces muertos de Agunsa y Loginsa como ejemplo de lo que no hacer.
// De a uno y no en paralelo: contra `next dev` las cuatro peticiones
// simultáneas llegan mientras la ruta todavía se compila y una vuelve con
// error. Eso es del servidor de desarrollo, no de la página, y una prueba
// que falla por eso deja de creerse a las pocas semanas.
const rotos = [];
for (const s of SLUGS) {
  const r = await p.request.get(`${BASE}/es/transporte-de-carga/${s}`);
  if (r.status() !== 200) rotos.push(`${s} (${r.status()})`);
}
if (rotos.length === 0) ok('ningún enlace del hub responde 404');
else mal(`enlaces muertos: ${rotos.join(', ')}`);

// Un slug inventado sí tiene que ser 404, no una página en blanco.
const inventado = await p.request.get(`${BASE}/es/transporte-de-carga/no-existe`);
if (inventado.status() === 404) ok('un slug inexistente responde 404');
else mal(`un slug inexistente responde ${inventado.status()}`);

// ── 2. Metadatos propios por página ────────────────────────────────────
// Cuatro páginas con el mismo title compiten entre sí y el buscador elige
// una por su cuenta. Es el error que este trabajo viene a corregir.
console.log('\nmetadatos');
const titulos = new Map();
for (const idioma of IDIOMAS) {
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/${idioma}/transporte-de-carga/${slug}`, {
      waitUntil: 'domcontentloaded',
    });
    const titulo = await p.title();
    const desc = await p
      .locator('meta[name="description"]')
      .getAttribute('content')
      .catch(() => null);
    const clave = `${idioma}/${slug}`;

    if (!titulo || !desc) { mal(`${clave}: sin title o sin description`); continue; }
    if (titulos.has(titulo)) { mal(`${clave}: repite el title de ${titulos.get(titulo)}`); continue; }
    titulos.set(titulo, clave);

    const alternos = await p.locator('link[rel="alternate"][hreflang]').count();
    if (alternos < 4) { mal(`${clave}: ${alternos} hreflang, deberían ser 4`); continue; }

    const h1 = await p.locator('main h1').count();
    if (h1 !== 1) { mal(`${clave}: ${h1} h1`); continue; }
  }
}
if (titulos.size === 16) ok('las 16 páginas tienen title propio, description y cuatro hreflang');

// ── 3. El structured data dice lo mismo que la página ──────────────────
console.log('\nstructured data');
await p.goto(`${BASE}/es/transporte-de-carga/bess-y-energia`, { waitUntil: 'domcontentloaded' });

const json = JSON.parse(
  await p.locator('script[type="application/ld+json"]').first().textContent(),
);
const preguntasJson = json.mainEntity.map((q) => q.name);
const preguntasVisibles = await p
  .locator('main dl dt')
  .evaluateAll((ds) => ds.map((d) => d.textContent.trim()));

const inventadas = preguntasJson.filter((q) => !preguntasVisibles.includes(q));
if (json['@type'] === 'FAQPage' && preguntasJson.length > 0 && inventadas.length === 0)
  ok(`FAQPage con ${preguntasJson.length} preguntas, todas visibles en la página`);
else mal(`structured data declara preguntas que no están escritas: ${inventadas.join(' | ')}`);

// ── 4. El CTA precarga el cotizador ────────────────────────────────────
console.log('\ncontinuidad al cotizador');
const cta = await p.locator('main a[href*="/cotizar?"]').first().getAttribute('href');
if (/carga=sobredimension/.test(cta || '')) ok(`el CTA de BESS lleva ${cta}`);
else mal(`el CTA no precarga el tipo de carga: ${cta}`);

await p.goto(BASE + cta, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
const marcado = await p
  .locator('input[name="tipoCarga"][value="sobredimension"]')
  .isChecked()
  .catch(() => false);
if (marcado) ok('y el formulario llega con esa carga ya elegida');
else mal('el formulario no recogió el tipo de carga del enlace');

// ── 5. Sin desbordes ───────────────────────────────────────────────────
console.log('\nancho');
for (const ancho of [320, 390, 768, 1440]) {
  await p.setViewportSize({ width: ancho, height: 900 });
  await p.goto(`${BASE}/es/transporte-de-carga/insumos-mineros`, {
    waitUntil: 'domcontentloaded',
  });
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
    : '\nLas cuatro páginas de servicio existen en los cuatro idiomas, con metadatos propios, structured data que no inventa nada y continuidad al cotizador.',
);
process.exit(fallos.length ? 1 : 0);
