import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Convierte el lockup horizontal (blanco sobre negro) en blanco sobre
 * transparencia, recortado a su contenido.
 *
 * Al ser blanco sobre negro, el alfa sale directo del canal: negro puro
 * es 0 y blanco puro es 1, y los bordes con antialias quedan con alfa
 * intermedio, sin dentado.
 */
const b = await chromium.launch();
const p = await b.newPage();
const src =
  'data:image/png;base64,' +
  fs.readFileSync(path.resolve('brand/logo-horizontal-negro.png')).toString('base64');

const out = await p.evaluate(async (dataURL) => {
  const img = new Image();
  img.src = dataURL;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0, 0, c.width, c.height);
  const px = d.data;

  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const i = (y * c.width + x) * 4;
      const a = Math.max(px[i], px[i + 1], px[i + 2]);
      px[i] = px[i + 1] = px[i + 2] = 255;
      px[i + 3] = a;
      if (a > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  cx.putImageData(d, 0, 0);

  const m = 2;
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  const o = document.createElement('canvas');
  o.width = w + m * 2;
  o.height = h + m * 2;
  o.getContext('2d').drawImage(c, x0, y0, w, h, m, m, w, h);
  return { dataURL: o.toDataURL('image/png'), w: o.width, h: o.height };
}, src);

await b.close();
fs.writeFileSync('public/logo-horizontal-blanco.png', Buffer.from(out.dataURL.split(',')[1], 'base64'));
console.log(`public/logo-horizontal-blanco.png  ${out.w}x${out.h}  (relacion ${(out.w / out.h).toFixed(2)}:1)`);
