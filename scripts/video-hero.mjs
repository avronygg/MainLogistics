import { execFileSync } from 'node:child_process';
import ff from 'ffmpeg-static';
import fs from 'node:fs';

/**
 * Prepara el video del hero.
 *
 * El original viene en HEVC (hvc1), que Firefox no reproduce y Chrome solo
 * con decodificacion por hardware en algunas plataformas. Para un fondo de
 * hero eso significa pantalla en negro para una parte grande del publico,
 * asi que se transcodifica a H.264 (universal) y VP9 (mas liviano donde hay
 * soporte). Sin audio: el video va muteado y el audio solo suma peso.
 */

const ORIGEN = 'brand/hero-original-hevc.mp4';
const correr = (args) => execFileSync(ff, args, { stdio: ['ignore', 'ignore', 'inherit'] });

const trabajos = [
  ['hero.mp4', ['-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-profile:v', 'high',
                '-pix_fmt', 'yuv420p', '-movflags', '+faststart']],
  ['hero-movil.mp4', ['-vf', 'scale=1280:-2', '-c:v', 'libx264', '-crf', '23', '-preset', 'slow',
                      '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart']],
  ['hero.webm', ['-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-row-mt', '1',
                 '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p']],
];

for (const [nombre, opts] of trabajos) {
  process.stdout.write(`codificando ${nombre} ... `);
  correr(['-y', '-v', 'error', '-i', ORIGEN, '-an', ...opts, `public/${nombre}`]);
  console.log(`${(fs.statSync(`public/${nombre}`).size / 1048576).toFixed(2)} MB`);
}

// Cartel: primer fotograma. Es lo que se ve antes de que cargue el video,
// asi que tiene que pesar poco y coincidir con el primer frame.
correr(['-y', '-v', 'error', '-i', ORIGEN, '-frames:v', '1', '-q:v', '4', 'public/hero-poster.jpg']);
console.log(`hero-poster.jpg  ${(fs.statSync('public/hero-poster.jpg').size / 1024).toFixed(0)} KB`);
