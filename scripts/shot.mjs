import { chromium } from 'playwright';
const out = process.argv[2] || 'shots';
const fs = await import('node:fs');
fs.mkdirSync(out, { recursive: true });

const b = await chromium.launch();
const errores = [];

async function cap(nombre, { w, h, scroll = 0, espera = 4500, dpr = 2 }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  p.on('console', m => { if (m.type() === 'error') errores.push(`[${nombre}] ${m.text()}`); });
  p.on('pageerror', e => errores.push(`[${nombre}] PAGEERROR ${e.message}`));
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  if (scroll) { await p.evaluate(y => window.scrollTo(0, y), scroll); }
  await p.waitForTimeout(espera);
  // Captura determinista: se congela el video para que la palabra del
  // titular quede en reposo y no a mitad de transicion. Hay que disparar
  // dentro de 1,5s, antes de que el rotador vuelva al intervalo.
  await p.evaluate(() => {
    const v = document.querySelector('video[data-hero]');
    if (v) { v.pause(); v.currentTime = 0.55; }
  });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${out}/${nombre}.png` });

  // Diagnóstico de desborde horizontal
  const desborde = await p.evaluate(() => {
    const d = document.documentElement;
    return { scrollW: d.scrollWidth, clientW: d.clientWidth };
  });
  if (desborde.scrollW > desborde.clientW + 1) errores.push(`[${nombre}] DESBORDE X: ${desborde.scrollW} > ${desborde.clientW}`);
  await ctx.close();
}

await cap('01-desktop-hero', { w: 1440, h: 900 });
await cap('02-desktop-scroll', { w: 1440, h: 900, scroll: 400, espera: 1200 });
await cap('03-desktop-ancho', { w: 1920, h: 1000 });
await cap('04-mobile', { w: 390, h: 844, dpr: 3 });
await cap('05-tablet', { w: 834, h: 1112 });

await b.close();
if (errores.length) { console.log('PROBLEMAS:'); errores.forEach(e => console.log(' -', e)); }
else console.log('Sin errores de consola ni desbordes.');
