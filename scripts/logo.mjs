import { chromium } from 'playwright';

/**
 * El logo no se deforma.
 *
 * Existe por un caso real: al pasar el menú de cuatro enlaces a cinco, la
 * columna del logo cedió y la imagen quedó en 59x25 sobre un natural de
 * 112x25. Un 47% de deformación.
 *
 * Y era difícil de ver: solo aparecía con la barra COMPACTA, es decir después
 * de hacer scroll, y solo desde 1024px. Una captura del hero sin scrollear lo
 * mostraba perfecto.
 *
 * Por eso acá se cruzan las tres variables que lo escondían: idioma (las
 * etiquetas del menú miden distinto), ancho, y los dos estados de la barra.
 */

const NATURAL = 1541 / 343; // logo-horizontal-blanco.png
const TOLERANCIA = 0.02;
const IDIOMAS = ['es', 'en', 'pt', 'zh'];
const ANCHOS = [320, 390, 768, 1024, 1280, 1440, 1920];

const fallos = [];
const b = await chromium.launch();

for (const idioma of IDIOMAS) {
  for (const ancho of ANCHOS) {
    for (const scroll of [0, 400]) {
      const ctx = await b.newContext({ viewport: { width: ancho, height: 800 } });
      const p = await ctx.newPage();
      await p.goto(`http://localhost:3000/${idioma}`, { waitUntil: 'networkidle' });
      await p.evaluate((y) => window.scrollTo(0, y), scroll);
      await p.waitForTimeout(400);

      const d = await p.evaluate(() => {
        const img = document.querySelector('header nav img');
        const nav = document.querySelector('header nav');
        if (!img || !nav) return null;
        const r = img.getBoundingClientRect();
        return {
          ratio: r.width / r.height,
          ancho: Math.round(r.width),
          desborda: nav.scrollWidth > nav.clientWidth + 1,
        };
      });

      const donde = `/${idioma} ${ancho}px ${scroll ? 'compacta' : 'normal'}`;
      if (!d) {
        fallos.push(`${donde}: no encontré el logo del nav`);
      } else {
        const desvio = Math.abs(d.ratio - NATURAL) / NATURAL;
        if (desvio > TOLERANCIA) {
          fallos.push(
            `${donde}: logo deformado ${(desvio * 100).toFixed(0)}% ` +
              `(${d.ancho}px de ancho, ratio ${d.ratio.toFixed(2)} vs ${NATURAL.toFixed(2)})`,
          );
        }
        if (d.desborda) fallos.push(`${donde}: la barra desborda`);
      }
      await ctx.close();
    }
  }
  console.log(`  ok    /${idioma}: ${ANCHOS.length} anchos, barra normal y compacta`);
}

await b.close();

if (fallos.length) {
  console.log('');
  fallos.forEach((f) => console.log(`  FALLA ${f}`));
  console.log(`\n${fallos.length} falla(s).`);
  process.exit(1);
}
console.log(
  `\nEl logo mantiene su proporción en ${IDIOMAS.length * ANCHOS.length * 2} combinaciones.`,
);
