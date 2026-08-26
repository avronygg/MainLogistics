# Créditos

**Main Logistics · Sitio corporativo**

Diseñado y desarrollado por **Aaron Tardón**
Marketing Manager · **MAIN BRAIN**

Construido bajo el estándar de agencia de MAIN BRAIN.

---

## Qué significa ese estándar acá

No es una firma decorativa: el sitio se construyó con reglas verificables y
cada una tiene un script que la comprueba. Antes de publicar, todo esto tiene
que pasar en verde.

| Comando | Qué verifica |
|---|---|
| `node scripts/pruebas.mjs` | Sin desborde horizontal de 320 a 1920px, titular siempre en dos líneas, menú móvil con Escape y bloqueo de scroll, `reduced-motion` detiene toda animación |
| `node scripts/contraste.mjs` | Contraste WCAG AA en las 15 combinaciones de texto sobre superficie del tema oscuro |
| `node scripts/tema-claro.mjs` | Lo mismo para las 15 del tema claro |
| `node scripts/anclas.mjs` | Todos los enlaces internos resuelven a un `id` que existe |
| `node scripts/alternancia.mjs` | Las bandas alternan claro y oscuro sin dos iguales seguidas |
| `node scripts/nitidez.mjs` | Ninguna foto se amplía: mide los bytes servidos contra los píxeles físicos |
| `node scripts/auditoria-movil.mjs` | El hero en cuatro equipos reales, sin solapes ni contenido fuera del viewport |
| `npx tsc --noEmit && npx eslint components app` | Tipos y lint |
| `npm run build` | Build de producción |

## Y qué NO se hizo, a propósito

- **Ninguna cifra ni certificación sin confirmar.** Los pendientes están en
  `brand/main-logistics-marca.md` §11.
- **Ninguna reseña inventada con rostro.** La atribución está vacante hasta
  que existan citas reales autorizadas.
- **Ningún logo de cliente sin autorización de uso de marca.** Los archivos
  están, el permiso es una gestión comercial pendiente.
- **Ningún formulario que finja haber enviado.** Si Resend falla, el
  formulario lo dice y ofrece WhatsApp con la solicitud ya escrita.

Ver `PRODUCT.md` y `DESIGN.md` para el registro completo de decisiones.
