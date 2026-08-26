import { chromium } from 'playwright';

/**
 * Verifica que las bandas alternen claro/oscuro sin dos iguales seguidas.
 */
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

const bandas = await p.evaluate(() => {
  const secciones = [...document.querySelectorAll('main > section, main > section > div, footer')]
    .filter(e => e.tagName === 'SECTION' || e.tagName === 'FOOTER');
  return secciones.map(e => ({
    id: e.id || e.tagName.toLowerCase(),
    claro: e.classList.contains('tema-claro'),
  }));
});

await b.close();
console.log('orden de bandas:');
let previo = null, fallos = 0;
for (const s of bandas) {
  const t = s.claro ? 'CLARA ' : 'oscura';
  const choca = previo !== null && previo === s.claro;
  if (choca) fallos++;
  console.log(`  ${t}  ${s.id}${choca ? '   <-- dos seguidas iguales' : ''}`);
  previo = s.claro;
}
console.log(fallos ? `\n${fallos} choque(s) de banda` : '\nAlternancia correcta.');
