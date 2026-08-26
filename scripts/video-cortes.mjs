/**
 * Mide los cortes de escena del video del hero. El resultado se copia en
 * la constante CORTES de components/RotadorFrase.tsx, que es lo que hace
 * que la palabra del titular cambie en el mismo golpe que la imagen.
 */
import { execFileSync } from 'node:child_process';
import ff from 'ffmpeg-static';

const archivo = process.argv[2] ?? 'brand/hero-original-hevc.mp4';
const salida = execFileSync(
  ff,
  ['-hide_banner', '-i', archivo, '-filter:v', "select='gt(scene,0.2)',metadata=print:file=-", '-an', '-f', 'null', '-'],
  { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
);

const cortes = [...salida.matchAll(/pts_time:([0-9.]+)/g)].map(m => +(+m[1]).toFixed(3));
console.log('const CORTES = [0, ' + cortes.join(', ') + '];');
console.log(`\n${cortes.length + 1} escenas`);
