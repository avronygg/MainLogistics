import { chromium } from 'playwright';

/**
 * Verifica los cuatro idiomas.
 *
 * Lo que más importa acá no es que las rutas respondan: es que no quede
 * español colado en las otras tres. Una sección sin migrar al diccionario se
 * ve perfecta en /es y aparece en castellano en medio del inglés, y eso a
 * este comprador le dice que el sitio está a medio hacer.
 */

const IDIOMAS = ['es', 'en', 'pt', 'zh'];
const HTML_LANG = { es: 'es-CL', en: 'en', pt: 'pt-BR', zh: 'zh-Hans' };

/* Palabras que solo existen en español y que ningún otro idioma debería
   mostrar. Se eligen por ser inequívocas: "Contacto" es igual en portugués
   sin tilde, así que no sirve; "Cotizar" o "Qué movemos" sí. */
const DELATORES = [
  'Qué movemos',
  'Cotizar su carga',
  'Cotice su carga',
  'Su carga siempre',
  'Siguiente paso',
  'Enviar solicitud',
  'Cuéntenos',
  'Le respondemos',
  'Nuestro equipo',
  'Cómo funciona',
  'Solicite',
];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });

for (const idioma of IDIOMAS) {
  console.log(`\n/${idioma}`);
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(e.message));

  const r = await p.goto(`http://localhost:3000/${idioma}`, { waitUntil: 'networkidle' });
  if (r?.status() === 200) ok('responde 200');
  else mal(`responde ${r?.status()}`);

  const lang = await p.getAttribute('html', 'lang');
  if (lang === HTML_LANG[idioma]) ok(`html lang="${lang}"`);
  else mal(`html lang es "${lang}", se esperaba "${HTML_LANG[idioma]}"`);

  // hreflang de los cuatro: sin esto un buscador trata las versiones como
  // páginas distintas que compiten entre sí.
  const alternos = await p.$$eval('link[rel="alternate"]', (ls) =>
    ls.map((l) => l.getAttribute('hreflang')),
  );
  const faltantes = Object.values(HTML_LANG).filter((h) => !alternos.includes(h));
  if (!faltantes.length) ok('declara hreflang de los cuatro idiomas');
  else mal(`sin hreflang para: ${faltantes.join(', ')}`);

  const titulo = await p.title();
  if (titulo && titulo.length > 10) ok(`título propio: "${titulo.slice(0, 46)}…"`);
  else mal('sin título');

  // Español colado en los otros idiomas.
  if (idioma !== 'es') {
    const texto = await p.locator('body').innerText();
    const colados = DELATORES.filter((d) => texto.includes(d));
    if (!colados.length) ok('sin español sin traducir');
    else mal(`español sin traducir: ${colados.slice(0, 4).join(' · ')}`);
  }

  // El chino necesita la pila CJK del sistema: Geist no trae ideogramas.
  if (idioma === 'zh') {
    const marcado = await p.getAttribute('html', 'data-cjk');
    if (marcado !== null) ok('marca data-cjk para la tipografía del sistema');
    else mal('sin data-cjk: los ideogramas caen en la fuente de respaldo');
  }

  // Desbordes: el alemán no está, pero el portugués es más largo que el
  // español y el chino más corto, y las dos cosas rompen cajas ajustadas.
  const d = await p.evaluate(() => ({
    s: document.documentElement.scrollWidth,
    c: document.documentElement.clientWidth,
  }));
  if (d.s <= d.c + 1) ok('sin desborde horizontal');
  else mal(`desborde horizontal: ${d.s} > ${d.c}`);

  if (errores.length) mal(`errores de página: ${errores[0]}`);

  await p.close();
}

// El selector lleva de un idioma a otro.
console.log('\nselector');
const p = await ctx.newPage();
await p.goto('http://localhost:3000/es', { waitUntil: 'networkidle' });
await p.getByRole('button', { name: /Cambiar idioma/ }).click();
await p.getByRole('option', { name: /English/ }).click();
await p.waitForURL('**/en', { timeout: 5000 }).catch(() => {});
if (p.url().endsWith('/en')) ok('cambiar a English navega a /en');
else mal(`el selector no navegó: quedó en ${p.url()}`);

const cookie = (await ctx.cookies()).find((c) => c.name === 'ml-idioma');
if (cookie?.value === 'en') ok('deja la cookie de preferencia');
else mal('no dejó cookie de preferencia');

await b.close();

console.log(
  fallos.length
    ? `\n${fallos.length} falla(s).`
    : '\nLos cuatro idiomas responden, se declaran entre sí y no arrastran español.',
);
process.exit(fallos.length ? 1 : 0);
