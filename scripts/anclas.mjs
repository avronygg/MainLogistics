import { chromium } from 'playwright';

/** Verifica que cada enlace interno apunte a un id que exista. */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

const r = await p.evaluate(() => {
  const ids = new Set([...document.querySelectorAll('[id]')].map((e) => e.id));
  const enlaces = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href'));
  const unicos = [...new Set(enlaces)];
  return unicos.map((h) => ({ href: h, existe: ids.has(h.slice(1)) }));
});
await b.close();

let rotos = 0;
for (const e of r) {
  if (!e.existe) rotos++;
  console.log(`  ${e.existe ? 'ok   ' : 'ROTO '} ${e.href}`);
}
console.log(rotos ? `\n${rotos} ancla(s) rota(s)` : '\nTodas las anclas resuelven.');
process.exit(rotos ? 1 : 0);
