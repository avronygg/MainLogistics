const srgbToLin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = h => { const f = i => srgbToLin(parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * f(1) + 0.7152 * f(3) + 0.0722 * f(5); };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +(((x + 0.05) / (y + 0.05)).toFixed(2)); };

const sup = { fondo: '#EEF1F4', 'sup-1': '#FFFFFF', 'sup-2': '#E2E8EE' };
const fg = {
  texto: '#16212A', 'texto-sec': '#55636F',
  'morado-solido': '#6735E1', 'morado-ui': '#5A2BD0', 'morado-texto': '#5426C4',
};
const min = { texto: 4.5, 'texto-sec': 4.5, 'morado-solido': 4.5, 'morado-ui': 3, 'morado-texto': 4.5 };
let fallos = 0;
for (const [sn, sv] of Object.entries(sup))
  for (const [fn, fv] of Object.entries(fg)) {
    const r = cr(sv, fv), ok = r >= min[fn];
    if (!ok) fallos++;
    console.log(`${ok ? 'OK   ' : 'FALLA'} ${fn.padEnd(14)} sobre ${sn.padEnd(6)} ${String(r).padStart(5)}:1  (min ${min[fn]})`);
  }
console.log('\nblanco sobre morado-solido =', cr('#6735E1', '#FFFFFF') + ':1');
console.log(fallos ? `\n${fallos} fallo(s)` : '\nTodas pasan.');
