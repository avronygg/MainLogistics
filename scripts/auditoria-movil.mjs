import { chromium } from 'playwright';
import fs from 'node:fs';
fs.mkdirSync('shots', { recursive: true });

/**
 * Auditoría del hero en móvil: encuadre del video, alto real del contenido
 * frente al viewport, visibilidad de las tarjetas y solapes.
 */
const EQUIPOS = [
  ['iphone-se', 375, 667, 2],
  ['iphone-14', 390, 844, 3],
  ['iphone-max', 430, 932, 3],
  ['android-alto', 412, 915, 3],
];

const b = await chromium.launch();
const filas = [];
const problemas = [];

for (const [nombre, w, h, dpr] of EQUIPOS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);
  await p.evaluate(() => {
    const v = document.querySelector('video[data-hero]');
    if (v) { v.pause(); v.currentTime = 0.55; }
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/movil-${nombre}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 900) } });

  const m = await p.evaluate(() => {
    const hero = document.querySelector('#inicio');
    const h1 = document.querySelector('h1');
    const sub = h1.parentElement.querySelector('p');
    const botones = document.querySelectorAll('#inicio a[href="#cotizar"], #inicio a[href="#cargas"]');
    const tarjetas = document.querySelector('[data-tarjetas-hero]');
    const cinta = document.querySelector('#inicio ul');
    const v = document.querySelector('video[data-hero]');

    const alto = hero.getBoundingClientRect().height;
    const vp = window.innerHeight;

    // Cuánto del ancho del video se ve, con object-fit: cover.
    let visible = null, pos = null;
    if (v) {
      const r = v.getBoundingClientRect();
      const escala = Math.max(r.width / v.videoWidth, r.height / v.videoHeight);
      visible = Math.round((r.width / (v.videoWidth * escala)) * 100);
      pos = getComputedStyle(v).objectPosition;
    }

    const lineas = Math.round(h1.getBoundingClientRect().height /
      (parseFloat(getComputedStyle(h1).fontSize) * 1.04));

    return {
      heroAlto: Math.round(alto),
      viewport: vp,
      excede: Math.round(alto - vp),
      lineasTitular: lineas,
      subLineas: Math.round(sub.getBoundingClientRect().height / parseFloat(getComputedStyle(sub).lineHeight)),
      botones: botones.length,
      tarjetasVisibles: tarjetas ? getComputedStyle(tarjetas).display !== 'none' : false,
      tarjetasDesbordan: tarjetas
        ? [...tarjetas.children].some((c) => {
            const r = c.getBoundingClientRect();
            return r.left < -1 || r.right > window.innerWidth + 1;
          })
        : false,
      // Cualquier solape con TEXTO, no solo con los botones.
      tarjetasTapanTexto: (() => {
        if (!tarjetas) return null;
        const textos = [h1, sub];
        for (const c of tarjetas.children) {
          const r = c.getBoundingClientRect();
          for (const t of textos) {
            const b = t.getBoundingClientRect();
            if (r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top)
              return `${t.tagName} vs tarjeta en top ${Math.round(r.top)}`;
          }
        }
        return null;
      })(),
      tarjetasTapanBotones: (() => {
        if (!tarjetas) return false;
        const cajas = [...botones].map((b) => b.getBoundingClientRect());
        return [...tarjetas.children].some((c) => {
          const r = c.getBoundingClientRect();
          return cajas.some(
            (b) => r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top,
          );
        });
      })(),
      videoVisiblePct: visible,
      objectPosition: pos,
      cintaVisible: !!cinta,
    };
  });

  filas.push([nombre, m]);
  if (m.lineasTitular > 2) problemas.push(`${nombre}: titular en ${m.lineasTitular} líneas`);
  if (!m.tarjetasVisibles) problemas.push(`${nombre}: faltan las tarjetas flotantes`);
  if (m.tarjetasDesbordan) problemas.push(`${nombre}: una tarjeta se sale de pantalla`);
  if (m.tarjetasTapanBotones) problemas.push(`${nombre}: una tarjeta tapa los botones`);
  if (m.tarjetasTapanTexto) problemas.push(`${nombre}: una tarjeta tapa texto — ${m.tarjetasTapanTexto}`);
  if (m.excede > 40) problemas.push(`${nombre}: el hero excede el viewport en ${m.excede}px`);
  await ctx.close();
}

await b.close();
console.log('equipo         hero/vp        titular  sub  video    object-position');
console.log('─'.repeat(78));
for (const [n, m] of filas) {
  console.log(
    n.padEnd(14),
    `${m.heroAlto}/${m.viewport}`.padEnd(14),
    String(m.lineasTitular).padEnd(8),
    String(m.subLineas).padEnd(4),
    `${m.videoVisiblePct}%`.padEnd(8),
    m.objectPosition,
  );
}
console.log('\ntarjetas flotantes visibles en móvil:', filas.some(([, m]) => m.tarjetasVisibles));
console.log(problemas.length ? '\nPROBLEMAS:\n' + problemas.join('\n') : '\nSin problemas estructurales.');
