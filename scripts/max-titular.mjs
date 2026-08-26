import { chromium } from 'playwright';

/**
 * Busca el tamaño de fuente más grande que mantiene el titular del hero en
 * dos líneas, midiendo de verdad en el navegador en vez de estimar el ancho
 * de los caracteres.
 */
const b = await chromium.launch();
const anchos = [320, 360, 375, 390, 412, 430];
const resultados = [];

for (const w of anchos) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);

  const max = await p.evaluate(() => {
    const h1 = document.querySelector('h1');
    const linea1 = h1.children[0];   // "CON MAIN, TU CARGA."
    const linea2 = h1.children[1];   // "SIEMPRE" + cápsula
    const previo = h1.style.fontSize;

    const cabe = (px) => {
      h1.style.fontSize = px + 'px';
      const uno = linea1.getBoundingClientRect().height /
        (px * parseFloat(getComputedStyle(linea1).lineHeight) / px);
      // Dos líneas = cada bloque en una sola fila.
      const filas = (el) => Math.round(el.getBoundingClientRect().height / (px * 1.04));
      return filas(linea1) === 1 && filas(linea2) === 1 && void uno === undefined;
    };

    let lo = 12, hi = 90;
    while (hi - lo > 0.25) {
      const mid = (lo + hi) / 2;
      if (cabe(mid)) lo = mid; else hi = mid;
    }
    h1.style.fontSize = previo;
    return Math.floor(lo * 10) / 10;
  });

  resultados.push([w, max]);
  await ctx.close();
}

await b.close();
console.log('ancho   máximo en 2 líneas');
for (const [w, m] of resultados) console.log(`${String(w).padStart(5)}   ${m}px`);

// Recta que pasa por el más restrictivo, con 6% de margen por si la fuente
// de respaldo mide distinto antes de que cargue Geist.
const [wA, mA] = resultados[0];
const [wB, mB] = resultados[resultados.length - 1];
const pend = (mB - mA) / (wB - wA);
const base = mA - pend * wA;
console.log(`\nsin margen:  clamp(?, ${(pend * 100).toFixed(2)}vw + ${base.toFixed(2)}px, 64px)`);
console.log(`con 6%:      ${(pend * 100 * 0.94).toFixed(2)}vw + ${(base * 0.94 / 16).toFixed(3)}rem`);
