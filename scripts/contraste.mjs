import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });

const r = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const tok = n => cs.getPropertyValue(n).trim();
  const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgb = v => { c.fillStyle = v; c.fillRect(0,0,1,1);
    const d = c.getImageData(0,0,1,1).data; return [d[0],d[1],d[2]]; };
  const lin = x => (x/=255) <= 0.04045 ? x/12.92 : ((x+0.055)/1.055)**2.4;
  const lum = ([r,g,bb]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(bb);
  const cr = (a,bq) => { const [x,y] = [lum(rgb(a)),lum(rgb(bq))].sort((m,n)=>n-m);
    return +(((x+0.05)/(y+0.05)).toFixed(2)); };

  const sup = { fondo: tok('--fondo'), 'sup-1': tok('--sup-1'), 'sup-2': tok('--sup-2') };
  const fg = { texto: tok('--texto'), 'texto-sec': tok('--texto-sec'),
               'morado-ui': tok('--morado-ui'), 'morado-texto': tok('--morado-texto'),
               amarillo: tok('--amarillo') };
  const filas = [];
  for (const [sn,sv] of Object.entries(sup))
    for (const [fn,fv] of Object.entries(fg))
      filas.push({ fondo: sn, texto: fn, ratio: cr(sv,fv), hex: rgb(fv).map(x=>x.toString(16).padStart(2,'0')).join('') });
  filas.push({ fondo: 'morado-solido', texto: 'blanco', ratio: cr(tok('--morado-solido'), '#ffffff'), hex: 'ffffff' });
  return filas;
});
await b.close();

const min = { texto: 4.5, 'texto-sec': 4.5, 'morado-texto': 4.5, 'morado-ui': 3, amarillo: 4.5, blanco: 4.5 };
// Combinaciones que el sistema prohíbe de entrada (ver DESIGN.md, sección Color).
// No son fallos: son reglas. Si aparece una nueva, o se corrige el token o se
// documenta acá con su razón.
const prohibidas = new Set(["morado-ui|sup-2"]);

let fallos = 0;
for (const f of r) {
  if (prohibidas.has(`${f.texto}|${f.fondo}`)) {
    console.log(
      `REGLA ${f.texto.padEnd(13)} sobre ${f.fondo.padEnd(14)} ${String(f.ratio).padStart(5)}:1  prohibido por sistema, usar morado-texto`,
    );
    continue;
  }
  const req = min[f.texto];
  const ok = f.ratio >= req;
  if (!ok) fallos++;
  console.log(
    `${ok ? "OK   " : "FALLA"} ${f.texto.padEnd(13)} sobre ${f.fondo.padEnd(14)} ${String(f.ratio).padStart(5)}:1  (min ${req})  #${f.hex}`,
  );
}
console.log(
  fallos
    ? `\n${fallos} combinacion(es) bajo el minimo`
    : "\nTodas las combinaciones permitidas pasan AA.",
);
process.exit(fallos ? 1 : 0);
