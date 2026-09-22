import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Saca el monograma LT del lockup de Logística Trade.
 *
 * El logo que entregó el cliente es cuadrado: el símbolo arriba y
 * "LOGÍSTICA TRADE" abajo. La barra de navegación lo muestra a 22px de alto,
 * y a esa altura el nombre queda en cuatro píxeles, ilegible. Un isotipo a
 * 22px sí se lee.
 *
 * Esto NO rediseña el logo: recorta una pieza que ya existe en el archivo,
 * separándola por la franja transparente que el propio diseño dejó entre el
 * símbolo y el texto. Cuando llegue el lockup horizontal de verdad, este
 * recorte se reemplaza y el script se borra.
 *
 *   node scripts/logo-trade.mjs
 */

const ENTRADA = path.resolve('public/logo-logistica-trade.png');
const SALIDA = path.resolve('public/logo-isotipo-trade.png');

const b = await chromium.launch();
const p = await b.newPage();

const datos = await p.evaluate(async (dataURL) => {
  const img = new Image();
  img.src = dataURL;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);

  /* Alfa por fila. Un píxel cuenta como contenido sobre 24 de 255: por
     debajo es el halo del PNG, no dibujo, y tomarlo como contenido pegaría
     el símbolo con el texto. */
  const filaTieneContenido = (y) => {
    for (let x = 0; x < c.width; x++) {
      if (data[(y * c.width + x) * 4 + 3] > 24) return true;
    }
    return false;
  };

  const filas = [];
  for (let y = 0; y < c.height; y++) filas.push(filaTieneContenido(y));

  // Bloques verticales de contenido, separados por franjas vacías.
  const bloques = [];
  let inicio = null;
  for (let y = 0; y < c.height; y++) {
    if (filas[y] && inicio === null) inicio = y;
    if (!filas[y] && inicio !== null) {
      bloques.push([inicio, y - 1]);
      inicio = null;
    }
  }
  if (inicio !== null) bloques.push([inicio, c.height - 1]);

  // El primero es el símbolo: el diseño lo pone arriba del nombre.
  const [arriba, abajo] = bloques[0];

  // Y sus límites horizontales, para que no quede aire a los costados.
  let izq = c.width;
  let der = 0;
  for (let y = arriba; y <= abajo; y++) {
    for (let x = 0; x < c.width; x++) {
      if (data[(y * c.width + x) * 4 + 3] > 24) {
        if (x < izq) izq = x;
        if (x > der) der = x;
      }
    }
  }

  const ancho = der - izq + 1;
  const alto = abajo - arriba + 1;

  const salida = document.createElement('canvas');
  salida.width = ancho;
  salida.height = alto;
  salida.getContext('2d').drawImage(c, izq, arriba, ancho, alto, 0, 0, ancho, alto);

  return {
    png: salida.toDataURL('image/png'),
    ancho,
    alto,
    bloques: bloques.length,
    original: `${c.width}x${c.height}`,
  };
}, 'data:image/png;base64,' + fs.readFileSync(ENTRADA).toString('base64'));

await b.close();

fs.writeFileSync(SALIDA, Buffer.from(datos.png.split(',')[1], 'base64'));

console.log(`original   ${datos.original}`);
console.log(`bloques    ${datos.bloques} (símbolo + nombre)`);
console.log(`isotipo    ${datos.ancho}x${datos.alto}  ${(datos.ancho / datos.alto).toFixed(2)}:1`);
console.log(`escrito    ${path.relative(process.cwd(), SALIDA)}`);
