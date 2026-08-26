import { execFileSync } from 'node:child_process';
import ff from 'ffmpeg-static';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Convierte las fotos de marca a WebP.
 *
 * SIN recortes, SIN viñeta, SIN reescalado, SIN corrección de color.
 * Solo cambio de formato a calidad alta. Antes recortaba la del GPS a
 * vertical para meterla en una tarjeta muy alta, y eso obligaba a
 * reescalarla — la foto terminaba sirviendo al layout en vez de al revés.
 * Ahora las tarjetas usan la proporción nativa de cada foto y no hace falta
 * tocar nada.
 *
 * `quality 92` sobre estas fotos oscuras con degradados: por debajo de ~85
 * aparecen bandas. Y `next.config.ts` declara `qualities: [75, 90]` porque
 * Next 16 coacciona en silencio cualquier valor no declarado.
 */

const FOTOS = [
  'tecnologia-gps',
  'tecnologia-equipo',
  'seguridad-amarre',
  'cobertura-chile',
  'monitoreo-reloj',
  'equipo-conductor',
  'flota-puerta',
  'portal-tablet',
  'equipo-bodega',
];

fs.mkdirSync('public/fotos', { recursive: true });

for (const nombre of FOTOS) {
  const origen = `brand/fotos-origen/${nombre}.png`;
  if (!fs.existsSync(origen)) {
    console.log(`${nombre}`.padEnd(26), 'sin original, se omite');
    continue;
  }

  execFileSync(ff, [
    '-y', '-v', 'error',
    '-i', origen,
    '-c:v', 'libwebp', '-quality', '92', '-compression_level', '6',
    `public/fotos/${nombre}.webp`,
  ], { stdio: ['ignore', 'ignore', 'inherit'] });

  let dim = '';
  try {
    execFileSync(ff, ['-hide_banner', '-i', `public/fotos/${nombre}.webp`], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    dim = (e.stderr?.toString() ?? '').match(/(\d{3,5}x\d{3,5})/)?.[1] ?? '';
  }

  const kb = (fs.statSync(`public/fotos/${nombre}.webp`).size / 1024).toFixed(0);
  console.log(`${nombre}.webp`.padEnd(28), dim.padEnd(12), `${kb} KB`);
}

/**
 * Invalida la caché de imágenes de Next.
 *
 * El optimizador cachea por URL (`?url=...&w=...&q=...`), NO por contenido.
 * Sin esto sigue sirviendo la versión anterior indefinidamente y parece que
 * el cambio no se aplicó.
 */
const cache = path.join('.next', 'cache', 'images');
if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true, force: true });
  console.log('\ncache de imagenes de Next invalidada');
}
