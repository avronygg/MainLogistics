import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.locator('#servicios').scrollIntoViewIfNeeded();
await p.waitForTimeout(1500);
const d = await p.evaluate(async () => {
  const i = document.querySelector('#servicios img');
  await i.decode().catch(() => {});
  return {
    sizes: i.sizes,
    srcset: i.srcset,
    currentSrc: i.currentSrc,
    natural: `${i.naturalWidth}x${i.naturalHeight}`,
    loading: i.loading,
    attrW: i.getAttribute('width'),
    attrH: i.getAttribute('height'),
  };
});
await b.close();
console.log('sizes      :', d.sizes);
console.log('atributos  :', d.attrW + 'x' + d.attrH, '| loading:', d.loading);
console.log('natural    :', d.natural);
console.log('currentSrc :', decodeURIComponent(d.currentSrc.replace(/^https?:\/\/[^/]+/, '')));
console.log('srcset     :');
for (const c of d.srcset.split(',')) console.log('   ', decodeURIComponent(c.trim()).replace(/^https?:\/\/[^/]+/, ''));
