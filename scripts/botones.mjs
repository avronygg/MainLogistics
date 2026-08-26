import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
const p = await ctx.newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);

const zona = p.locator('a[href="#cotizar"]').last().locator('xpath=..');

await zona.screenshot({ path: 'shots/boton-reposo.png' });

const primario = p.locator('a[href="#cotizar"]').last();
await primario.hover();
await p.waitForTimeout(700);
await zona.screenshot({ path: 'shots/boton-hover.png' });

// Estado intermedio del recorrido, para ver que el disco cruce la etiqueta.
await p.mouse.move(0, 0);
await p.waitForTimeout(800);
await primario.hover();
await p.waitForTimeout(160);
await zona.screenshot({ path: 'shots/boton-medio.png' });

const caja = await primario.boundingBox();
const vars = await primario.evaluate((el) => ({
  ancho: el.offsetWidth,
  recorrido: getComputedStyle(el).getPropertyValue('--recorrido'),
  padRight: getComputedStyle(el).paddingRight,
}));
console.log('boton primario:', JSON.stringify({ ...vars, alto: caja.height }));
await b.close();
