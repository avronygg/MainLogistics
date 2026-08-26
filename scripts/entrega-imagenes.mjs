import { chromium } from 'playwright';

/**
 * Mide lo que REALMENTE llega al navegador para cada foto: URL servida,
 * bytes, y bytes por pixel. Menos de ~0,5 bpp en fotos oscuras con
 * degradados es zona de bandas.
 */
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const respuestas = [];
p.on('response', async (r) => {
  const u = r.url();
  if (!/\.webp|_next\/image/.test(u)) return;
  try {
    const buf = await r.body();
    respuestas.push({ url: u, bytes: buf.length, tipo: r.headers()['content-type'], cache: r.headers()['x-nextjs-cache'] ?? '' });
  } catch {}
});

await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.locator('#servicios').scrollIntoViewIfNeeded();
await p.waitForTimeout(2500);

const dims = await p.evaluate(() =>
  [...document.querySelectorAll('#servicios img')].map(i => ({
    src: i.currentSrc || i.src,
    natural: `${i.naturalWidth}x${i.naturalHeight}`,
    css: `${Math.round(i.getBoundingClientRect().width)}x${Math.round(i.getBoundingClientRect().height)}`,
  })));

await b.close();

console.log('SERVIDO POR LA RED');
for (const r of respuestas) {
  const corto = r.url.replace(/^https?:\/\/[^/]+/, '').slice(0, 78);
  console.log(`  ${(r.bytes / 1024).toFixed(0).padStart(5)} KB  ${r.tipo}  ${r.cache}  ${corto}`);
}
console.log('\nEN EL DOM');
for (const d of dims) {
  const enc = respuestas.find(r => decodeURIComponent(r.url).includes(decodeURIComponent(d.src).split('?')[0].split('/').pop() ?? '#'))
    ?? respuestas.find(r => r.url.endsWith(d.src));
  const px = d.natural.split('x').reduce((a, n) => a * +n, 1);
  const bpp = enc ? ((enc.bytes * 8) / px).toFixed(2) : '?';
  console.log(`  natural ${d.natural.padEnd(11)} css ${d.css.padEnd(11)} bpp ${bpp}   ${d.src.slice(0, 60)}`);
}
