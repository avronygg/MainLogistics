import fs from 'node:fs';
import path from 'node:path';

/**
 * Lector minimo de cajas MP4. Chromium de Playwright no trae codecs
 * propietarios, asi que no puede decodificar H.264 y no sirve para
 * inspeccionar el archivo. El contenedor se lee directo.
 */
const buf = fs.readFileSync(path.resolve(process.argv[2]));

function* cajas(inicio, fin) {
  let o = inicio;
  while (o + 8 <= fin) {
    let tam = buf.readUInt32BE(o);
    const tipo = buf.toString('latin1', o + 4, o + 8);
    let cuerpo = o + 8;
    if (tam === 1) { tam = Number(buf.readBigUInt64BE(o + 8)); cuerpo = o + 16; }
    if (tam === 0) tam = fin - o;
    if (tam < 8) break;
    yield { tipo, cuerpo, fin: o + tam };
    o += tam;
  }
}

function buscar(ruta, inicio = 0, fin = buf.length) {
  const [primero, ...resto] = ruta;
  for (const c of cajas(inicio, fin))
    if (c.tipo === primero)
      return resto.length ? buscar(resto, c.cuerpo, c.fin) : c;
  return null;
}

const mvhd = buscar(['moov', 'mvhd']);
const ver = buf.readUInt8(mvhd.cuerpo);
const off = mvhd.cuerpo + 4;
const escala = ver === 1 ? buf.readUInt32BE(off + 16) : buf.readUInt32BE(off + 8);
const dur = ver === 1 ? Number(buf.readBigUInt64BE(off + 20)) : buf.readUInt32BE(off + 12);
const segundos = dur / escala;

const tkhd = buscar(['moov', 'trak', 'tkhd']);
const tv = buf.readUInt8(tkhd.cuerpo);
const tf = tkhd.fin - 8;
const w = buf.readUInt32BE(tf) / 65536;
const h = buf.readUInt32BE(tf + 4) / 65536;

const stsd = buscar(['moov', 'trak', 'mdia', 'minf', 'stbl', 'stsd']);
let codec = '?';
if (stsd) for (const c of cajas(stsd.cuerpo + 8, stsd.fin)) { codec = c.tipo; break; }

const mb = buf.length / 1048576;
console.log(`resolucion : ${w}x${h}  (${(w / h).toFixed(2)}:1)`);
console.log(`duracion   : ${segundos.toFixed(2)} s`);
console.log(`codec      : ${codec}`);
console.log(`peso       : ${mb.toFixed(1)} MB   (${(mb * 8 / segundos).toFixed(1)} Mbps)`);
