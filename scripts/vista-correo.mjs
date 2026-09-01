import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Se transpila la plantilla a JS con esbuild, que ya viene con Next.
const salida = 'C:/Users/aaron/AppData/Local/Temp/claude/correo-plantilla.mjs';
execFileSync('npx', ['--yes', 'esbuild', 'app/api/cotizar/correo.ts',
  '--format=esm', '--platform=node', `--outfile=${salida}`], { stdio: 'inherit', shell: true });

const { construirCorreo } = await import('file://' + salida);

const { html, texto, asunto } = construirCorreo({
  empresa: 'Minera Los Pelambres',
  carga: 'Sobredimensionada',
  origen: 'San Antonio, Valparaíso',
  destino: 'Calama, Antofagasta',
  nombre: 'Aarón Tardón',
  correo: 'aaron@ejemplo.cl',
  telefono: '+56 9 9277 8013',
  canal: 'WhatsApp',
  bloques: [
    { titulo: 'La carga', filas: [
      { k: 'Tipo de carga', v: 'Sobredimensionada' },
      { k: 'Equipo requerido', v: 'Cama baja' } ] },
    { titulo: 'La ruta', filas: [
      { k: 'Origen', v: 'San Antonio, Valparaíso — Puerto, sitio 3' },
      { k: 'Destino', v: 'Calama, Antofagasta — Faena' } ] },
    { titulo: 'Cuándo y cómo', filas: [
      { k: 'Fecha', v: 'Fecha específica — 2026-09-15', dato: true },
      { k: 'Modalidad', v: 'Contrato · por 6 meses' } ] },
    { titulo: 'Requisitos y valor', filas: [
      { k: 'Exigencias especiales', v: 'Acreditación minera · Escolta o seguridad' },
      { k: 'Valor declarado', v: 'Más de 3.000 UF', dato: true } ] },
  ],
});

mkdirSync('shots', { recursive: true });
writeFileSync('shots/correo.txt', `ASUNTO: ${asunto}\n\n${texto}`, 'utf8');

const b = await chromium.launch();
// Dos anchos: el telefono de la captura y el panel de lectura de escritorio.
for (const [nombre, ancho] of [['correo-movil', 360], ['correo', 700]]) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: 1200 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.screenshot({ path: `shots/${nombre}.png`, fullPage: true });
  await ctx.close();
}
await b.close();

console.log(`\nASUNTO: ${asunto}`);
console.log('\nshots/correo.png y shots/correo.txt');
