import { chromium } from 'playwright';

/**
 * Extrae TODO el texto visible del sitio, sección por sección, para poder
 * auditarlo junto en vez de archivo por archivo. La redacción solo se puede
 * juzgar leyéndola seguida, como la lee un visitante.
 */
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);

const texto = await p.evaluate(() => {
  const limpio = (t) => t.replace(/\s+/g, ' ').trim();
  const salida = [];
  const secciones = document.querySelectorAll('main > section, footer');
  for (const s of secciones) {
    const bloque = [`\n### ${s.id || s.tagName}`];
    for (const e of s.querySelectorAll('h1,h2,h3,p,li,a,button,label,figcaption,blockquote,span.dato')) {
      if (e.closest('.sr-only, .invisible')) continue;
      // Solo hojas de texto, para no repetir el contenido de los padres.
      if (e.querySelector('h1,h2,h3,p,li,a,button,blockquote')) continue;
      const t = limpio(e.textContent || '');
      if (t && t.length > 1) bloque.push(`${e.tagName.padEnd(11)} ${t}`);
    }
    if (bloque.length > 1) salida.push(bloque.join('\n'));
  }
  return salida.join('\n');
});

await b.close();
console.log(texto);
