import { execFileSync } from 'node:child_process';
import ff from 'ffmpeg-static';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Prepara los logos de clientes para la cinta.
 *
 * Los originales vienen del sitio del socio (logisticayireh.cl), donde la
 * misma empresa ya los publica. Once de ellos traen FONDO BLANCO, no
 * transparencia: puestos tal cual sobre nuestra banda oscura se verían como
 * cajas blancas.
 *
 * Se pasan a blanco monocromo sobre transparencia, que es el tratamiento
 * estándar para logos de clientes sobre fondo oscuro y además unifica trece
 * identidades muy distintas en una sola cinta.
 *
 * La fórmula: el color se fuerza a blanco y el alfa sale de invertir la
 * luminancia — lo claro (el fondo) se vuelve transparente y lo oscuro (la
 * marca) se vuelve blanco opaco. Para los que YA vienen con transparencia se
 * conserva su alfa y solo se recolorea.
 */

const LUMA = '(0.299*r(X,Y)+0.587*g(X,Y)+0.114*b(X,Y))';

const CLIENTES = [
  { archivo: 'cliente-01', nombre: 'Reinvent' },
  { archivo: 'cliente-02', nombre: 'Ultraport' },
  { archivo: 'cliente-03', nombre: 'Guanaco Compañía Minera' },
  { archivo: 'cliente-05', nombre: 'Yamana Gold' },
  { archivo: 'cliente-06', nombre: 'Caemin' },
  { archivo: 'cliente-07', nombre: 'Caleras San Juan' },
  { archivo: 'cliente-08', nombre: 'Scan Global Logistics' },
  { archivo: 'cliente-09', nombre: 'Antucoya · Antofagasta Minerals' },
  { archivo: 'cliente-10', nombre: 'Unacem' },
  { archivo: 'cliente-11', nombre: 'TGL Chile' },
  { archivo: 'cliente-12', nombre: 'Lhoist' },
  // Estos dos ya vienen con transparencia: solo se recolorean.
  { archivo: 'cargo-services', nombre: 'Cargo Services', transparente: true },
  { archivo: 'proquimin', nombre: 'Proquimin', transparente: true },
];

const salida = [];

for (const { archivo, nombre, transparente } of CLIENTES) {
  const origen = `brand/logos-origen/${archivo}.png`;
  if (!fs.existsSync(origen)) { console.log(`${archivo}: falta el original`); continue; }

  // Curva sobre el alfa: con la inversión lineal, un logo de tono medio
  // (Guanaco, Lhoist, Yamana) quedaba al 50% y casi no se veía. El exponente
  // 0,55 levanta los medios sin tocar los extremos.
  const alfa = transparente
    ? 'alpha(X,Y)'
    : `min(alpha(X,Y),255*pow(1-${LUMA}/255\,0.55))`;

  execFileSync(ff, [
    '-y', '-v', 'error', '-i', origen,
    '-vf', `format=rgba,geq=r=255:g=255:b=255:a='${alfa}'`,
    '-c:v', 'libwebp', '-lossless', '1',
    `public/clientes/${archivo}.webp`,
  ], { stdio: ['ignore', 'ignore', 'inherit'] });

  let dim = '';
  try { execFileSync(ff, ['-hide_banner', '-i', `public/clientes/${archivo}.webp`], { stdio: ['ignore','pipe','pipe'] }); }
  catch (e) { dim = (e.stderr?.toString() ?? '').match(/(\d{2,5}x\d{2,5})/)?.[1] ?? ''; }

  const kb = (fs.statSync(`public/clientes/${archivo}.webp`).size / 1024).toFixed(0);
  console.log(`${archivo}.webp`.padEnd(24), dim.padEnd(10), `${kb} KB`, ' ', nombre);
  salida.push({ archivo, nombre, dim });
}

const cache = path.join('.next', 'cache', 'images');
if (fs.existsSync(cache)) {
  fs.rmSync(cache, { recursive: true, force: true });
  console.log('\ncache de imagenes de Next invalidada');
}
