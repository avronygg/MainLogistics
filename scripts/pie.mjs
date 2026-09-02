import { chromium } from 'playwright';

/**
 * El pie, ancho por ancho.
 *
 * Existe por una regresión que ninguna prueba vio: al sumar la cuarta
 * columna, la celda de la derecha quedó en `auto` (max-content), pidió más
 * ancho del disponible, la columna izquierda colapsó a una palabra por
 * línea y el resto se recortó.
 *
 * No lo detectó `pruebas.mjs` porque ese script mide el desborde del
 * DOCUMENTO, y el pie tiene `overflow-hidden`: no desbordaba, recortaba.
 * Por eso acá se mide otra cosa —lo que se sale de la caja del pie y lo
 * angosto que quedó el texto— y no el scroll de la página.
 */

const BASE = 'http://localhost:3000';
const RUTAS = ['/es', '/es/transporte-de-carga', '/es/cotizar', '/en'];
const ANCHOS = [320, 390, 640, 768, 855, 1024, 1280, 1440];

const fallos = [];
const ok = (m) => console.log(`  ok    ${m}`);
const mal = (m) => { fallos.push(m); console.log(`  FALLA ${m}`); };

const b = await chromium.launch();
const p = await (await b.newContext()).newPage();

for (const ruta of RUTAS) {
  console.log(`\n${ruta}`);
  for (const ancho of ANCHOS) {
    await p.setViewportSize({ width: ancho, height: 900 });
    await p.goto(BASE + ruta, { waitUntil: 'domcontentloaded' });
    await p.locator('footer').scrollIntoViewIfNeeded();
    await p.waitForTimeout(200);

    const medida = await p.evaluate(() => {
      const pie = document.querySelector('footer');
      const caja = pie.getBoundingClientRect();

      // Nada del pie puede salirse de la caja del pie. Con overflow-hidden
      // esto no produce scroll: produce texto cortado, que se ve peor.
      let sobresale = 0;
      for (const el of pie.querySelectorAll('a, h2, p, li')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        sobresale = Math.max(sobresale, Math.round(r.right - caja.right));
      }

      // Y el párrafo de la descripción no puede quedar de una palabra por
      // línea: es la señal de que su columna colapsó a min-content.
      const desc = pie.querySelector('p');
      const alto = desc ? desc.getBoundingClientRect().height : 0;
      const linea = parseFloat(getComputedStyle(desc).lineHeight) || 24;

      return { sobresale, lineas: Math.round(alto / linea) };
    });

    if (medida.sobresale > 1) {
      mal(`${ancho}px: hay contenido ${medida.sobresale}px fuera del pie`);
    } else if (medida.lineas > 6) {
      mal(`${ancho}px: la descripción cae en ${medida.lineas} líneas, la columna colapsó`);
    } else {
      ok(`${ancho}px  (descripción en ${medida.lineas} líneas)`);
    }
  }
}

await b.close();

console.log(
  fallos.length
    ? `\n${fallos.length} falla(s).`
    : '\nEl pie entra completo en todos los anchos y ninguna columna colapsa.',
);
process.exit(fallos.length ? 1 : 0);
