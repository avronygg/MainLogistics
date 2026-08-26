import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
const r = await p.evaluate(async () => {
  const out = [];
  // Cinta de logos del hero.
  const cinta = document.querySelector('#inicio [class*="cinta"]');
  if (cinta) {
    const copias = [...cinta.children];
    await Promise.all([...cinta.querySelectorAll('img')].map(i => i.decode().catch(() => {})));
    out.push({
      quien: 'logos',
      track: Math.round(cinta.getBoundingClientRect().width),
      copias: copias.map(c => Math.round(c.getBoundingClientRect().width)),
      gap: getComputedStyle(cinta).gap,
      padRight: getComputedStyle(cinta).paddingRight,
    });
  }
  // Hileras de reseñas.
  document.querySelectorAll('#clientes [class*="hilera"]').forEach((h, i) => {
    if (h.parentElement.className.includes('hilera')) return;
    out.push({
      quien: `resenas-${i}`,
      track: Math.round(h.getBoundingClientRect().width),
      copias: [...h.children].map(c => Math.round(c.getBoundingClientRect().width)),
      gap: getComputedStyle(h).gap,
      padRight: getComputedStyle(h).paddingRight,
    });
  });
  return out;
});
await b.close();
for (const x of r) {
  const suma = x.copias.reduce((a, b) => a + b, 0);
  const mitad = x.track / 2;
  const ok = Math.abs(mitad - x.copias[0]) < 2;
  console.log(`${x.quien.padEnd(11)} track=${x.track} copias=[${x.copias}] gap=${x.gap} padR=${x.padRight}`);
  console.log(`             50% del track = ${mitad.toFixed(1)} | ancho de una copia = ${x.copias[0]} -> ${ok ? 'BUCLE OK' : 'DESFASE de ' + (mitad - x.copias[0]).toFixed(1) + 'px'}`);
}
