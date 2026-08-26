import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import ff from 'ffmpeg-static';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * ¿Se amplía alguna foto?
 *
 * Se capturan los BYTES que el navegador descarga y se miden con ffmpeg.
 * `naturalWidth` no sirve acá: devuelve el ancho de layout, no el real.
 * Factor > 1 = el navegador la estira y se ve blanda por más calidad que
 * se le ponga.
 */
const b = await chromium.launch();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nitidez-'));

for (const dpr of [1, 2]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: dpr });
  const p = await ctx.newPage();
  const bytes = new Map();

  p.on('response', async (r) => {
    if (!r.url().includes('/_next/image')) return;
    try { bytes.set(r.url(), await r.body()); } catch {}
  });

  await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await p.locator('#servicios').scrollIntoViewIfNeeded();
  await p.waitForTimeout(2000);

  const imgs = await p.evaluate((dpr) =>
    [...document.querySelectorAll('#servicios img')].map((i) => {
      const r = i.getBoundingClientRect();
      return {
        url: i.currentSrc,
        nombre: (i.currentSrc.match(/fotos%2F([^&]+)/) ?? [, i.currentSrc.slice(-24)])[1],
        fisicoW: Math.round(r.width * dpr),
        fisicoH: Math.round(r.height * dpr),
      };
    }), dpr);

  console.log(`\n── DPR ${dpr} ──`);
  for (const im of imgs) {
    const buf = bytes.get(im.url);
    if (!buf) { console.log(`  ${im.nombre}: no se capturó`); continue; }
    const f = path.join(tmp, 'x.webp');
    fs.writeFileSync(f, buf);
    // ffmpeg sale con código 1 cuando no se le da archivo de salida, pero
    // la info del stream ya viene en stderr. Por eso el try/catch.
    let salida = '';
    try {
      execFileSync(ff, ['-hide_banner', '-i', f], { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      salida = e.stderr?.toString() ?? '';
    }
    const m = salida.match(/(\d{2,5})x(\d{2,5})/);
    if (!m) { console.log(`  ${im.nombre}: no se pudo medir`); continue; }
    const [w, h] = [+m[1], +m[2]];
    const factor = Math.max(im.fisicoW / w, im.fisicoH / h);
    const veredicto = factor > 1.05 ? `AMPLÍA ${factor.toFixed(2)}x` : 'nítida';
    console.log(`  ${im.nombre.padEnd(26)} recibe ${`${w}x${h}`.padEnd(12)} muestra ${`${im.fisicoW}x${im.fisicoH}`.padEnd(12)} ${veredicto}`);
  }
  await ctx.close();
}

fs.rmSync(tmp, { recursive: true, force: true });
await b.close();
