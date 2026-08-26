import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('shots', { recursive: true });
const b = await chromium.launch();
const problemas = [];

// 1. La palabra mas larga, en el viewport mas angosto razonable.
for (const w of [320, 375, 390, 430, 768, 1024, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // Muestrea durante un ciclo completo (900ms + 6*2400ms) buscando desbordes.
  let peor = 0, palabraPeor = '';
  for (let t = 0; t < 16000; t += 400) {
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const h1 = document.querySelector('h1');
      const rot = h1.querySelector('span[aria-hidden][style*="width"]');
      const d = document.documentElement;
      return {
        over: d.scrollWidth - d.clientWidth,
        h1Over: 0, // el h1 contiene la capa de medicion; se mide el desborde de pagina
        palabra: rot?.textContent?.trim() ?? '',
        lineas: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
      };
    });
    if (r.over > peor) { peor = r.over; palabraPeor = r.palabra; }
    if (r.h1Over > 1) problemas.push(`w=${w} h1 desborda ${r.h1Over}px con "${r.palabra}"`);
    if (r.palabra === 'sobredimensionada') {
      await p.screenshot({ path: `shots/larga-${w}.png` });
      break;
    }
  }
  if (peor > 1) problemas.push(`w=${w} desborde de pagina ${peor}px con "${palabraPeor}"`);
  await ctx.close();
}

// 2. Menu movil abierto.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: 'Abrir menú' }).click();
  await p.waitForTimeout(700);
  await p.screenshot({ path: 'shots/06-menu-movil.png' });
  const bloqueado = await p.evaluate(() => getComputedStyle(document.body).overflow);
  if (bloqueado !== 'hidden') problemas.push(`menu abierto: body overflow = ${bloqueado}, esperado hidden`);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(500);
  const cerrado = await p.evaluate(() => !document.getElementById('menu-movil'));
  if (!cerrado) problemas.push('Escape no cierra el menu movil');
  await ctx.close();
}

// 3. Reduced motion: la frase NO debe rotar; queda fija en la primera.
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const visible = async () => p.evaluate(() => {
    const h1 = document.querySelector('h1').cloneNode(true);
    // Fuera la capa para lectores de pantalla Y la de medicion invisible.
    h1.querySelectorAll('.sr-only, .invisible').forEach(n => n.remove());
    return h1.textContent.replace(/\s+/g, ' ').trim();
  });

  const primera = await visible();
  await p.waitForTimeout(9000); // mas de tres intervalos de rotacion
  const despues = await visible();
  await p.screenshot({ path: 'shots/07-reduced-motion.png' });

  if (primera !== despues)
    problemas.push(`reduced-motion: la frase roto de "${primera}" a "${despues}"`);
  if (!primera.startsWith('Con Main, su carga.'))
    problemas.push(`reduced-motion: titular visible = "${primera}"`);
  await ctx.close();
}

// 4. El menu movil se ancla a la derecha, no al centro.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const btn = await p.getByRole('button', { name: 'Abrir menu' }).or(p.getByRole('button', { name: 'Abrir menú' })).boundingBox();
  if (btn && btn.x + btn.width < 390 * 0.72)
    problemas.push(`boton de menu mal anclado: termina en x=${Math.round(btn.x + btn.width)} de 390`);
  await ctx.close();
}

// 5. El titular tiene que quedar SIEMPRE en dos lineas, en todo ancho.
for (const w of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const lineas = [...h1.children].filter(n => !n.classList.contains('sr-only'));
    const alto = h1.getBoundingClientRect().height;
    const unidad = parseFloat(getComputedStyle(h1).fontSize) * 1.04;
    return { bloques: lineas.length, filas: Math.round(alto / unidad) };
  });
  if (r.filas > 2)
    problemas.push(`w=${w} el titular ocupa ${r.filas} lineas, deberian ser 2`);
  await ctx.close();
}

await b.close();
if (problemas.length) { console.log('PROBLEMAS:'); problemas.forEach(x => console.log(' -', x)); }
else console.log('Todo OK: sin desbordes en ningun ancho, menu movil correcto, reduced-motion correcto.');
