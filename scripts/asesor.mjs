import { chromium } from 'playwright';

/**
 * Prueba la secuencia del asesor: aparece a los 2s en "escribiendo",
 * cambia a mensaje a los 5s, abre el panel al clic y cierra con Escape.
 */
const b = await chromium.launch();
const problemas = [];

for (const [nombre, w, h] of [['asesor-esc', 1440, 900], ['asesor-mov', 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('pageerror', e => problemas.push(`[${nombre}] ${e.message}`));
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // A 1s todavia no deberia haber globo.
  await p.waitForTimeout(1000);
  if (await p.getByLabel('Escribiendo').count()) problemas.push(`[${nombre}] el globo aparece antes de los 2s`);

  // A 3s: escribiendo.
  await p.waitForTimeout(2200);
  if (!(await p.getByLabel('Escribiendo').count())) problemas.push(`[${nombre}] falta el estado "escribiendo"`);
  await p.screenshot({ path: `shots/${nombre}-escribiendo.png`, clip: { x: Math.max(0, w - 420), y: Math.max(0, h - 320), width: Math.min(420, w), height: Math.min(320, h) } });

  // A 6s: mensaje.
  await p.waitForTimeout(3000);
  if (await p.getByLabel('Escribiendo').count()) problemas.push(`[${nombre}] sigue en "escribiendo" pasados los 5s`);
  await p.screenshot({ path: `shots/${nombre}-mensaje.png`, clip: { x: Math.max(0, w - 420), y: Math.max(0, h - 320), width: Math.min(420, w), height: Math.min(320, h) } });

  // Abre el panel.
  await p.getByRole('button', { name: /Hablar con un asesor/ }).click();
  await p.waitForTimeout(600);
  if (!(await p.getByRole('dialog').count())) problemas.push(`[${nombre}] el panel no abre`);
  await p.screenshot({ path: `shots/${nombre}-panel.png`, clip: { x: Math.max(0, w - 420), y: Math.max(0, h - 480), width: Math.min(420, w), height: Math.min(480, h) } });

  // Escape cierra.
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  if (await p.getByRole('dialog').count()) problemas.push(`[${nombre}] Escape no cierra el panel`);

  const d = await p.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  if (d.s > d.c + 1) problemas.push(`[${nombre}] DESBORDE ${d.s}>${d.c}`);
  await ctx.close();
}

await b.close();
console.log(problemas.length ? 'PROBLEMAS:\n' + problemas.join('\n') : 'Asesor correcto: secuencia, apertura, Escape y sin desbordes.');
