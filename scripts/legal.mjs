import { chromium } from 'playwright';

/**
 * Las dos páginas legales.
 *
 * Lo que se prueba no es que existan, sino que sirvan: que el índice lleve
 * de verdad a cada sección, que quien no lee español sepa cuál versión rige,
 * que el enlace esté donde se busca (el pie) y que el consentimiento aparezca
 * pegado al botón de enviar y no escondido a dos pantallas.
 *
 * El brief §10.3 anota que en el benchmark chileno estos enlaces suelen estar
 * muertos en producción. Un 404 acá es peor que no tener la página.
 */

const BASE = 'http://localhost:3000';
const IDIOMAS = ['es', 'en', 'pt', 'zh'];
const DOCS = ['privacidad', 'terminos'];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();

// ── 1. Las ocho páginas responden y tienen cuerpo ──────────────────────
console.log('\nlas ocho páginas');
for (const idioma of IDIOMAS) {
  for (const doc of DOCS) {
    const ruta = `/${idioma}/legal/${doc}`;
    const r = await p.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });

    if (r.status() !== 200) {
      mal(`${ruta} responde ${r.status()}`);
      continue;
    }

    const h1 = await p.locator('main h1').count();
    const secciones = await p.locator('main section[id]').count();
    if (h1 === 1 && secciones >= 8) ok(`${ruta}  (${secciones} secciones)`);
    else mal(`${ruta}: ${h1} h1 y ${secciones} secciones`);
  }
}

// ── 2. El índice lleva a alguna parte ──────────────────────────────────
// Un índice cuyos anclas no existen se ve igual de bien y no funciona.
console.log('\nel índice resuelve');
// A 1440 y no a 390: en el teléfono el índice no se muestra a propósito, así
// que probarlo en móvil mediría una columna que ahí no existe.
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto(`${BASE}/es/legal/privacidad`, { waitUntil: 'domcontentloaded' });

const anclas = await p.locator('nav[aria-label] a[href^="#"]').evaluateAll((as) =>
  as.map((a) => a.getAttribute('href').slice(1)),
);
const ids = await p.locator('main section[id]').evaluateAll((ss) => ss.map((s) => s.id));

const huerfanas = anclas.filter((a) => !ids.includes(a));
if (anclas.length === 0) mal('el índice no tiene enlaces');
else if (huerfanas.length === 0) ok(`las ${anclas.length} entradas del índice resuelven`);
else mal(`anclas sin destino: ${huerfanas.join(', ')}`);

// Y que el ancla no lleve tildes ni espacios: un id con acento sobrevive en
// el navegador pero se rompe al copiar el enlace y pegarlo en otra parte.
const sucias = ids.filter((i) => !/^[a-z0-9-]+$/.test(i));
if (sucias.length === 0) ok('los id son limpios');
else mal(`id con caracteres raros: ${sucias.join(', ')}`);

// Y dónde se muestra. En un teléfono este índice son once enlaces y una
// pantalla entera entre el título y la primera frase: ahí estorba.
const indiceVisible = async (ancho) => {
  await p.setViewportSize({ width: ancho, height: 900 });
  await p.goto(`${BASE}/es/legal/privacidad`, { waitUntil: 'domcontentloaded' });
  return p.locator('main nav a[href^="#"]').first().isVisible();
};

if (await indiceVisible(1440)) ok('se ve en escritorio, al costado');
else mal('el índice no se ve en escritorio');

if (!(await indiceVisible(390))) ok('en móvil no se interpone antes del texto');
else mal('el índice ocupa la primera pantalla en móvil');

// ── 3. Quién ve el aviso de idioma ─────────────────────────────────────
console.log('\naviso de versión que rige');
const avisoEn = async (idioma) => {
  await p.goto(`${BASE}/${idioma}/legal/privacidad`, { waitUntil: 'domcontentloaded' });
  const texto = await p.locator('main header').innerText();
  return /espa|Spanish|西班牙/i.test(texto.split('\n').slice(3).join(' '));
};

if (!(await avisoEn('es'))) ok('en español no aparece (no habría nada que avisar)');
else mal('el aviso de idioma aparece en la versión española');

for (const idioma of ['en', 'pt', 'zh']) {
  if (await avisoEn(idioma)) ok(`${idioma}: avisa que la versión que rige es la española`);
  else mal(`${idioma}: no avisa cuál versión rige`);
}

// ── 4. Se llega desde el pie, y con el idioma puesto ───────────────────
console.log('\nenlaces del pie');
for (const idioma of IDIOMAS) {
  await p.goto(`${BASE}/${idioma}`, { waitUntil: 'domcontentloaded' });
  const hrefs = await p.locator('footer a[href*="/legal/"]').evaluateAll((as) =>
    as.map((a) => new URL(a.href).pathname),
  );

  const esperadas = DOCS.map((d) => `/${idioma}/legal/${d}`);
  const faltan = esperadas.filter((e) => !hrefs.includes(e));
  if (faltan.length === 0) ok(`${idioma}: el pie enlaza las dos, con el idioma delante`);
  else mal(`${idioma}: falta en el pie ${faltan.join(' y ')}`);
}

// Los anclas del pie tampoco pueden ir sueltos: desde una página que no es
// la home, `#servicios` no lleva a ninguna parte. Es el bug que ya se
// arregló en el nav y que el pie seguía teniendo.
await p.goto(`${BASE}/es/legal/terminos`, { waitUntil: 'domcontentloaded' });
const sueltos = await p.locator('footer a[href^="#"]').evaluateAll((as) =>
  as.map((a) => a.getAttribute('href')),
);
if (sueltos.length === 0) ok('ningún ancla suelta en el pie fuera de la home');
else mal(`anclas sueltas en el pie: ${sueltos.join(', ')}`);

// ── 5. El consentimiento va pegado al botón ────────────────────────────
console.log('\nconsentimiento en el formulario');
await p.goto(`${BASE}/es/cotizar`, { waitUntil: 'networkidle' });

const enlaceConsentimiento = p.locator('#cotizar a[href="/es/legal/privacidad"]');
// Está en el resumen, que es el último paso. Se llega saltando la validación
// no se puede, así que se recorre igual que en prueba-formulario.mjs.
const panel = p.locator('#cotizar');
const elegir = (n, v) => panel.locator(`input[name="${n}"][value="${v}"]`).check({ force: true });
const avanzar = async () => {
  await panel.getByRole('button', { name: /Siguiente|Revisar solicitud/ }).click();
  await p.waitForTimeout(300);
};

await elegir('tipoCarga', 'suelta');
await elegir('equipo', 'rampla_plana');
await avanzar();
await panel.locator('#origenRegion').selectOption('Valparaíso');
await p.waitForTimeout(150);
await panel.locator('#origenComuna').selectOption('San Antonio');
await panel.locator('#destinoRegion').selectOption('Antofagasta');
await p.waitForTimeout(150);
await panel.locator('#destinoComuna').selectOption('Calama');
await avanzar();
await elegir('fecha', 'semana');
await avanzar();
await elegir('modalidad', 'puntual');
await avanzar();
await elegir('valor', 'mas_3000');
await avanzar();
await panel.locator('#empresa').fill('Minera Ejemplo');
await panel.locator('#nombre').fill('Aaron Tardón');
await panel.locator('#correo').fill('aaron@ejemplo.cl');
await panel.locator('#telefono').fill('+56 9 1234 5678');
await avanzar();
await p.waitForTimeout(400);

if (await enlaceConsentimiento.isVisible().catch(() => false)) {
  ok('el consentimiento se ve en el resumen');

  // Y encima del botón, no debajo: leerlo después de apretar no es consentir.
  const yTexto = await enlaceConsentimiento.boundingBox();
  const yBoton = await panel.getByRole('button', { name: 'Enviar solicitud' }).boundingBox();
  if (yTexto && yBoton && yTexto.y < yBoton.y) ok('va encima del botón de enviar');
  else mal('el consentimiento quedó debajo del botón');
} else {
  mal('no hay línea de consentimiento en el resumen');
}

// ── 6. En el sitemap ───────────────────────────────────────────────────
console.log('\nsitemap');
const xml = await (await p.request.get(`${BASE}/sitemap.xml`)).text();
const enSitemap = IDIOMAS.flatMap((i) => DOCS.map((d) => `/${i}/legal/${d}`)).filter(
  (r) => !xml.includes(r),
);
if (enSitemap.length === 0) ok('las ocho URLs están en el sitemap');
else mal(`fuera del sitemap: ${enSitemap.join(', ')}`);

// ── 7. Sin desborde horizontal ─────────────────────────────────────────
console.log('\nancho');
for (const ancho of [320, 390, 768, 1440]) {
  await p.setViewportSize({ width: ancho, height: 900 });
  await p.goto(`${BASE}/es/legal/privacidad`, { waitUntil: 'domcontentloaded' });
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
    : '\nLas dos páginas legales responden en los cuatro idiomas, el índice resuelve, se llega desde el pie y el consentimiento está antes de enviar.',
);
process.exit(fallos.length ? 1 : 0);
