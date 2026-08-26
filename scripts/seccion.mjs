import { chromium } from 'playwright';
const b = await chromium.launch();
const errores = [];
for (const [nombre, w, h] of [['pilares-desktop', 1440, 1000], ['pilares-tablet', 834, 1100], ['pilares-movil', 390, 900]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') errores.push(`[${nombre}] ${m.text()}`); });
  p.on('pageerror', e => errores.push(`[${nombre}] ${e.message}`));
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.locator('#servicios').scrollIntoViewIfNeeded();
  await p.waitForTimeout(1200);
  await p.locator('#servicios').screenshot({ path: `shots/${nombre}.png` });
  const d = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  if (d.s > d.c + 1) errores.push(`[${nombre}] DESBORDE X ${d.s} > ${d.c}`);
  await ctx.close();
}
await b.close();
console.log(errores.length ? 'PROBLEMAS:\n' + errores.join('\n') : 'Sin errores ni desbordes.');
