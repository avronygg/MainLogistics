import { chromium } from 'playwright';

/**
 * Prueba del formulario de extremo a extremo.
 * Sin RESEND_API_KEY, la ruta debe devolver 503 y el formulario debe
 * MOSTRAR EL ERROR, nunca decir que se envió.
 */
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await ctx.newPage();
const problemas = [];

await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.locator('#cotizar').scrollIntoViewIfNeeded();

await p.fill('#origen', 'Antofagasta');
await p.fill('#destino', 'Calama');
await p.selectOption('#tipo', 'Minera');
await p.fill('#volumen', '24 t');
await p.selectOption('#frecuencia', 'Semanal');
await p.selectOption('#plazo', 'Este mes');
await p.fill('#nombre', 'Prueba');
await p.fill('#empresa', 'Empresa SpA');
await p.fill('#correo', 'prueba@ejemplo.cl');
await p.fill('#telefono', '+56 9 1234 5678');

const [respuesta] = await Promise.all([
  p.waitForResponse(r => r.url().includes('/api/cotizar'), { timeout: 15000 }),
  p.getByRole('button', { name: /Enviar solicitud/ }).click(),
]);

console.log('respuesta de la API:', respuesta.status(), await respuesta.text());

await p.waitForTimeout(800);
const alerta = await p.locator('[role="alert"]').count();
const exito = await p.locator('[role="status"]').count();

if (respuesta.status() === 503 && exito > 0)
  problemas.push('GRAVE: dice que se envió cuando la API respondió 503');
if (respuesta.status() === 503 && alerta === 0)
  problemas.push('GRAVE: la API falló y no se muestra ningún error al usuario');

await p.screenshot({ path: 'shots/formulario-error.png', clip: { x: 700, y: 100, width: 740, height: 780 } });

// Validación del navegador: enviar vacío no debe llegar a la API.
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.locator('#cotizar').scrollIntoViewIfNeeded();
let llamo = false;
p.on('request', r => { if (r.url().includes('/api/cotizar')) llamo = true; });
await p.getByRole('button', { name: /Enviar solicitud/ }).click();
await p.waitForTimeout(700);
if (llamo) problemas.push('el formulario vacío llegó a la API: falta validación');

await b.close();
console.log(problemas.length ? '\nPROBLEMAS:\n' + problemas.join('\n') : '\nFormulario correcto: falla visible, sin falso éxito, valida vacíos.');
