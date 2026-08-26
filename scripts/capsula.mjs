import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [nombre, w] of [['movil', 390], ['escritorio', 1440]]) {
  // reducedMotion: la frase queda fija, asi se ve la posicion de reposo real.
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 3 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.locator('h1').screenshot({ path: `shots/capsula-${nombre}.png` });

  const m = await p.evaluate(() => {
    const cap = document.querySelector('.capsula-frase');
    const pal = cap.querySelector('span');
    const c = cap.getBoundingClientRect(), t = pal.getBoundingClientRect();
    return {
      capsula: +c.height.toFixed(1),
      palabra: +t.height.toFixed(1),
      sobraArriba: +(t.top - c.top).toFixed(1),
      sobraAbajo: +(c.bottom - t.bottom).toFixed(1),
    };
  });
  console.log(nombre.padEnd(11), JSON.stringify(m));
  await ctx.close();
}
await b.close();
