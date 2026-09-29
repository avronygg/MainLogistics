import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

/**
 * Los dos correos que llegan a comercial@, para verlos antes de mandarlos.
 *
 * El del cotizador del sitio y el de la solicitud de cotización. El segundo
 * lleva abajo el botón que abre el cotizador interno con los datos cargados:
 * eso hay que mirarlo, porque un botón que en Outlook se ve como un enlace
 * suelto no lo va a apretar nadie.
 */

// Se transpila la plantilla a JS con esbuild, que ya viene con Next.
const salida = 'C:/Users/aaron/AppData/Local/Temp/claude/correo-plantilla.mjs';
execFileSync('npx', ['--yes', 'esbuild', 'app/api/cotizar/correo.ts',
  '--format=esm', '--platform=node', `--outfile=${salida}`], { stdio: 'inherit', shell: true });

const { construirCorreo } = await import('file://' + salida);

const COTIZADOR = 'https://cotizador-logistica-trade.vercel.app';

const CASOS = {
  correo: construirCorreo({
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
  }),

  'correo-solicitud': construirCorreo({
    empresa: 'Minera Los Pelambres SpA',
    carga: 'Carga dimensionada',
    origen: 'Puerto de Coquimbo',
    destino: 'Faena Los Pelambres, Salamanca',
    nombre: 'Aarón Tardón',
    correo: 'aaron@ejemplo.cl',
    telefono: '+56 9 9277 8013',
    bloques: [
      { titulo: 'El cliente', filas: [
        { k: 'Razón social', v: 'Minera Los Pelambres SpA' },
        { k: 'RUT', v: '76.123.456-0', dato: true },
        { k: 'Cargo', v: 'Jefatura de Logística' } ] },
      { titulo: 'El servicio', filas: [
        { k: 'Tipo de carga', v: 'Carga dimensionada' },
        { k: 'Equipo', v: 'Rampla cama baja' },
        { k: 'Modalidad', v: 'Viaje completo · ida y vuelta' },
        { k: 'Fecha estimada', v: '2026-10-15', dato: true } ] },
      { titulo: 'La ruta', filas: [
        { k: 'Origen', v: 'Puerto de Coquimbo' },
        { k: 'Destino', v: 'Faena Los Pelambres, Salamanca' } ] },
      { titulo: 'Detalle del servicio', filas: [
        { k: 'Línea 1', v: 'Traslado de molino SAG, pieza única · Rampla cama baja · × 1' },
        { k: 'Línea 2', v: 'Repuestos paletizados · Rampla plana · × 3' } ] },
      { titulo: 'Observaciones', filas: [
        { k: 'Del cliente', v: 'Ingreso a faena con homologación vigente. Dos equipos en paralelo si hay disponibilidad.' } ] },
    ],
    accion: {
      titulo: '¿Le ponemos precio?',
      texto: 'Abre el cotizador con estos datos y estos servicios ya cargados. Solo falta escribir los valores y emitir.',
      etiqueta: 'Armar la cotización con precios',
      url: `${COTIZADOR}/?d=eyJyYXpvblNvY2lhbCI6Ik1pbmVyYSBMb3MgUGVsYW1icmVzIFNwQSJ9`,
    },
  }),
};

mkdirSync('shots', { recursive: true });

const b = await chromium.launch();
for (const [nombre, { html, texto, asunto }] of Object.entries(CASOS)) {
  writeFileSync(`shots/${nombre}.txt`, `ASUNTO: ${asunto}\n\n${texto}`, 'utf8');

  // Dos anchos: el teléfono y el panel de lectura de escritorio.
  for (const [sufijo, ancho] of [['-movil', 360], ['', 700]]) {
    const ctx = await b.newContext({ viewport: { width: ancho, height: 1200 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    await p.setContent(html, { waitUntil: 'load' });
    await p.screenshot({ path: `shots/${nombre}${sufijo}.png`, fullPage: true });
    await ctx.close();
  }

  console.log(`\n${nombre}\n  ASUNTO: ${asunto}`);
}
await b.close();

console.log('\nshots/correo*.png y shots/correo*.txt');
