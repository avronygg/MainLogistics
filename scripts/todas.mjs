import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('shots', { recursive: true });

const SECCIONES = ['#servicios', '#cargas', '#cumplimiento', '#clientes', '#como-funciona', '#cotizar', '#contacto'];
const b = await chromium.launch();
const problemas = [];

for (const [nombre, w, h] of [['esc', 1440, 1000], ['mov', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => problemas.push(`[${nombre}] ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') problemas.push(`[${nombre}] consola: ${m.text()}`); });
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  for (const sel of SECCIONES) {
    const el = p.locator(sel);
    if (!(await el.count())) { problemas.push(`falta ${sel}`); continue; }
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(900);
    await el.screenshot({ path: `shots/${nombre}${sel.replace('#', '-')}.png` });
  }

  const d = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  if (d.s > d.c + 1) problemas.push(`[${nombre}] DESBORDE X ${d.s} > ${d.c}`);
  await ctx.close();
}

await b.close();
console.log(problemas.length ? 'PROBLEMAS:\n' + problemas.join('\n') : 'Todas las secciones renderizan, sin errores ni desbordes.');
