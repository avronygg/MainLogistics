import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Extrae el logo en blanco sobre transparencia desde el PNG de marca,
 * que viene blanco sobre morado solido.
 *
 * Formula de des-matting: el alfa sale de que tan cerca esta el pixel del
 * blanco a lo largo de la recta morado -> blanco. Usa el canal minimo,
 * porque en el morado (#4A1FC9) el minimo es 0x1F y en el blanco es 0xFF.
 * Asi los bordes con antialias quedan con alfa parcial y no dentados.
 *
 * Genera dos recortes: el isotipo (la M-carretera) y el lockup completo.
 */

const b = await chromium.launch();
const p = await b.newPage();
// Se pasa como data URL: una pagina about:blank no puede cargar file:// por CORS.
const origen =
  'data:image/png;base64,' +
  fs.readFileSync(path.resolve('brand/Main Logistics Logo.png')).toString('base64');

const salida = await p.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0, 0, c.width, c.height);
  const px = d.data;

  const PISO = 31; // canal minimo del morado de marca
  for (let i = 0; i < px.length; i += 4) {
    const min = Math.min(px[i], px[i + 1], px[i + 2]);
    const a = Math.max(0, Math.min(1, (min - PISO) / (255 - PISO)));
    px[i] = px[i + 1] = px[i + 2] = 255;
    px[i + 3] = Math.round(a * 255);
  }
  cx.putImageData(d, 0, 0);

  // Filas con contenido, para separar el isotipo del logotipo.
  const filaTiene = [];
  for (let y = 0; y < c.height; y++) {
    let hay = false;
    for (let x = 0; x < c.width; x++) {
      if (px[(y * c.width + x) * 4 + 3] > 24) { hay = true; break; }
    }
    filaTiene.push(hay);
  }
  const primera = filaTiene.indexOf(true);
  let finIsotipo = primera;
  while (finIsotipo < c.height && filaTiene[finIsotipo]) finIsotipo++;
  let ultima = c.height - 1;
  while (ultima > 0 && !filaTiene[ultima]) ultima--;

  const columnasDe = (y0, y1) => {
    let x0 = c.width, x1 = 0;
    for (let y = y0; y < y1; y++)
      for (let x = 0; x < c.width; x++)
        if (px[(y * c.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    return [x0, x1];
  };

  const recortar = (y0, y1, margen) => {
    const [x0, x1] = columnasDe(y0, y1);
    const w = x1 - x0 + 1, h = y1 - y0;
    const o = document.createElement('canvas');
    o.width = w + margen * 2;
    o.height = h + margen * 2;
    o.getContext('2d').drawImage(c, x0, y0, w, h, margen, margen, w, h);
    return { dataURL: o.toDataURL('image/png'), w: o.width, h: o.height };
  };

  return {
    isotipo: recortar(primera, finIsotipo, 2),
    lockup: recortar(primera, ultima + 1, 4),
  };
}, origen);

await b.close();

for (const [nombre, r] of Object.entries(salida)) {
  const archivo = `public/logo-${nombre}-blanco.png`;
  fs.writeFileSync(archivo, Buffer.from(r.dataURL.split(',')[1], 'base64'));
  console.log(`${archivo}  ${r.w}x${r.h}`);
}
