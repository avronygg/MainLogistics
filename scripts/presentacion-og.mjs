import { chromium } from 'playwright';

/**
 * Genera las vistas previas de /presentacion para WhatsApp y redes, una por
 * idioma, fotografiando la portada real. Si cambia el titular, se vuelve a
 * correr. Con el sitio en localhost:3000:
 *   node scripts/presentacion-og.mjs
 */

const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1200, height: 630 } })).newPage();

for (const idioma of ['es', 'en', 'pt', 'zh']) {
  await p.goto(`http://localhost:3000/${idioma}/presentacion`, { waitUntil: 'networkidle' });
  // Una vista previa no necesita barra, mando ni botones: no se pueden tocar.
  await p.addStyleTag({
    content: `header, nav, nextjs-portal, #portada a { display: none !important; }
              #portada { padding-top: 0; padding-bottom: 0; }`,
  });
  // `complete` no basta: la primera vez que el optimizador sirve la foto, la
  // captura salía sin el camión. `decode()` espera a que se pueda pintar.
  await p.evaluate(() => Promise.all(
    [...document.images].filter((i) => i.closest('#portada')).map((i) => i.decode()),
  ));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `public/presentacion/og-${idioma}.jpg`, type: 'jpeg', quality: 82 });
  console.log(`og-${idioma}.jpg`);
}

await b.close();
