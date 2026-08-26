/**
 * Cuanto del video se ve en cada pantalla y a que escala.
 * El video es 16:9 con object-fit: cover sobre un hero de alto completo,
 * asi que en pantallas mas verticales se recorta a lo ancho.
 */
const FUENTE = { w: 1920, h: 1080 };
const MOVIL = { w: 1280, h: 720 };

const casos = [
  ['iPhone 14',        390,  844, 3],
  ['iPhone 14 Pro Max',430,  932, 3],
  ['iPad vertical',    834, 1112, 2],
  ['Laptop 1440',     1440,  900, 2],
  ['Full HD',         1920, 1080, 1],
  ['Full HD retina',  1920, 1080, 2],
  ['2K',              2560, 1440, 1],
  ['4K',              3840, 2160, 1],
];

console.log('pantalla            fuente      se ve   escala   nitidez');
console.log('─'.repeat(66));
for (const [nombre, w, h, dpr] of casos) {
  const src = w < 768 ? MOVIL : FUENTE;
  const escala = Math.max(w / src.w, h / src.h);
  const render = { w: src.w * escala, h: src.h * escala };
  const visibleW = Math.min(1, w / render.w) * 100;
  const escalaFisica = escala * dpr;
  const nitidez =
    escalaFisica <= 1.02 ? 'nativa o mejor'
    : escalaFisica <= 1.5 ? 'leve ampliacion'
    : 'se amplia ' + escalaFisica.toFixed(2) + 'x';
  console.log(
    nombre.padEnd(19),
    `${src.w}x${src.h}`.padEnd(11),
    `${visibleW.toFixed(0)}%`.padStart(5),
    `${escala.toFixed(2)}x`.padStart(8),
    ' ',
    nitidez,
  );
}
