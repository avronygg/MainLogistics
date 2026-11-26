# Traspaso de Logística Trade a las cuentas de la agencia

Para: Ricardo · Escrita el 26-11-2026 · Dudas: Aaron

El sitio (www.logisticatrade.cl) y el cotizador interno viven hoy en el GitHub
y el Vercel personales de Aaron. Pasan a la organización de GitHub
`mainbrain-cl` y al equipo de Vercel `mb`. No hace falta entrar a las cuentas
de Aaron: la idea es rearmar todo en la agencia y mover el dominio al final.

| | Hoy | Después |
|---|---|---|
| Repo del sitio | `avronygg/MainLogistics` (público) | `mainbrain-cl/<nombre>` (privado) |
| Repo del cotizador | `avronygg/cotizador-logistica-trade` (privado) | `mainbrain-cl/<nombre>` (privado) |
| Vercel | cuenta personal de Aaron | equipo `mb` |
| Resend | cuenta del cliente (team `logisticatrade`) | **la misma**, solo una clave nueva |
| DNS | Route 53 | **el mismo**, solo un TXT de verificación |

**No se toca:** el dominio en Resend (ya está verificado), los registros
`resend._domainkey` y `send.` del DNS, ni los MX de logisticatrade.cl (el
correo del cliente).

El orden importa: el dominio se mueve recién en el paso 6, cuando lo nuevo ya
está probado. Hasta entonces el sitio actual sigue atendiendo normal.

---

## 1. GitHub: copiar los dos repos

Con historial completo, como repos normales (no fork) y **privados**. Nombres
sugeridos: `logistica-trade-web` y `logistica-trade-cotizador`.

```bash
# Sitio
git clone --mirror https://github.com/avronygg/MainLogistics.git
cd MainLogistics.git
gh repo create mainbrain-cl/logistica-trade-web --private
git push --mirror https://github.com/mainbrain-cl/logistica-trade-web.git
cd ..

# Cotizador
git clone --mirror https://github.com/avronygg/cotizador-logistica-trade.git
cd cotizador-logistica-trade.git
gh repo create mainbrain-cl/logistica-trade-cotizador --private
git push --mirror https://github.com/mainbrain-cl/logistica-trade-cotizador.git
```

Si `push --mirror` muestra errores `deny updating a hidden ref` con
`refs/pull/...`, son normales: GitHub no deja copiar las referencias de los
pull requests. Las ramas y el historial pasan igual. Revisar en GitHub que
esté la rama `main` con el último commit.

## 2. Resend: clave nueva

En la cuenta del cliente (team `logisticatrade`):

1. **API Keys → Create API Key**. Nombre: `vercel-agencia-mb`. Permiso:
   **Sending access**. Dominio: **logisticatrade.cl**.
2. Copiarla en el momento: Resend la muestra una sola vez.
3. En **Emails**, abrir un envío reciente de producción y anotar el **From**
   exacto. Ese valor va en `COTIZA_REMITENTE`.

La clave vieja **no se borra todavía** (paso 8).

## 3. Vercel: el cotizador

Equipo `mb` → **Add New → Project** → importar `logistica-trade-cotizador`.

- Framework: **Other**. Sin comando de build. Es HTML, CSS y JS estáticos.
- Sin variables de entorno.
- Anotar la dirección de producción que asigna Vercel (algo como
  `logistica-trade-cotizador.vercel.app`). El nombre actual
  `cotizador-logistica-trade.vercel.app` sigue ocupado en la cuenta de Aaron,
  así que la dirección **cambia**.

⚠️ **Tiene que quedar público.** Lo abren los ejecutivos del cliente desde el
enlace de cada correo, y no tienen cuenta en Vercel. En **Settings →
Deployment Protection**, que la protección no alcance a la dirección de
producción. Comprobarlo en una ventana de incógnito: tiene que abrir el
formulario, no una pantalla de inicio de sesión de Vercel.

## 4. Vercel: el sitio

Equipo `mb` → **Add New → Project** → importar `logistica-trade-web`.

- Framework: Next.js (lo detecta solo). Node 20.9 o superior; el actual usa 24.x.
- Variables, en **Production** y **Preview**:

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | la clave del paso 2 (marcarla como **Sensitive**) |
| `COTIZA_REMITENTE` | el From anotado en el paso 2 |
| `COTIZADOR_URL` | la dirección del paso 3, con `https://` y sin barra final |

No hacen falta `COTIZA_DESTINO` (el correo que recibe está en
`components/datos/contacto.ts`) ni `NEXT_PUBLIC_WHATSAPP` (WhatsApp está apagado).

Si se agrega una variable después del primer despliegue, hay que **volver a
desplegar** para que la tome.

## 5. Probar antes de mover el dominio

En la dirección `.vercel.app` del sitio nuevo:

1. Recorrer el sitio. `/` tiene que redirigir a `/es`, y el selector de
   idioma tiene que funcionar.
2. Comprobar que el formulario tiene la configuración, **sin mandar ningún correo**:

   ```bash
   curl -s -X POST -H "Content-Type: application/json" --data "no-es-json" \
     https://<sitio-nuevo>.vercel.app/api/solicitud
   ```

   - `{"ok":false,"motivo":"json-invalido"}` → bien, Resend está configurado.
   - `{"ok":false,"motivo":"sin-configurar"}` → falta una variable o no se
     volvió a desplegar.
   - Una página de inicio de sesión de Vercel o un 401 → es la Deployment
     Protection. Probar desde el navegador con la sesión iniciada, o repetir
     la prueba después del paso 6.

   Repetir con `/api/cotizar`. El resultado esperado es el mismo.

La prueba con un envío real se hace después del paso 6 (ver paso 7).

## 6. Mover el dominio

En el proyecto nuevo del sitio → **Settings → Domains**:

1. Agregar `www.logisticatrade.cl` (es el principal).
2. Agregar `logisticatrade.cl` con **redirección 308 a www**, igual que hoy.
3. Como el dominio está en otra cuenta de Vercel, Vercel va a pedir un
   **registro TXT `_vercel.logisticatrade.cl`**. Ponerlo en Route 53 y
   apretar **Verify**. Al verificar, el dominio pasa al proyecto nuevo y deja
   de servir el viejo.
4. Comparar los registros A y CNAME que muestra Vercel con los de Route 53.
   Hoy el apex apunta a `216.198.79.1` y `www` es un CNAME a Vercel. Si Vercel
   pide valores distintos, actualizarlos.

El corte dura segundos o pocos minutos.

## 7. Verificación final

- [ ] `https://logisticatrade.cl` redirige a `https://www.logisticatrade.cl/es`, con certificado válido.
- [ ] El `curl` del paso 5 contra `https://www.logisticatrade.cl/api/solicitud` y `/api/cotizar` da `json-invalido`.
- [ ] **Un envío real** desde `/es/solicitud-de-cotizacion`, con "PRUEBA" en la
      razón social. Llega a la casilla comercial del cliente, así que **avisar
      antes a Aaron**. Comprobar que llega y que el botón **"Armar la
      cotización con precios"** abre el cotizador **nuevo**, con los datos cargados.
- [ ] Hacer un push cualquiera a `main` en el repo nuevo y ver que Vercel despliegue solo.

## 8. Cierre

**Ricardo**

- En Resend, borrar la clave vieja (todas menos `vercel-agencia-mb`), recién
  cuando el envío real del paso 7 haya llegado.
- En el repo nuevo, cambiar la dirección por defecto del cotizador en
  `app/api/solicitud/route.ts` (constante `COTIZADOR`) por la nueva. Hoy
  apunta a la vieja y solo sirve de respaldo si falta `COTIZADOR_URL`, pero
  no debe quedar apuntando a una cuenta que se va a cerrar.
- Cualquier copia local de los repos se repunta así:

  ```bash
  git remote set-url origin https://github.com/mainbrain-cl/logistica-trade-web.git
  ```

**Aaron**

- Archivar y dejar **privados** `avronygg/MainLogistics` y
  `avronygg/cotizador-logistica-trade`.
- Borrar el proyecto viejo del **sitio** en su Vercel.
- Mantener el **cotizador viejo** unas semanas: los correos enviados antes del
  traspaso tienen enlaces a `cotizador-logistica-trade.vercel.app`. Borrarlo
  cuando esas solicitudes ya estén cotizadas.

## Si algo sale mal

Hasta el paso 6 no hay riesgo: el sitio actual no se toca. Después del paso 6,
si el sitio nuevo falla y no se arregla rápido, Aaron puede volver a agregar el
dominio en su proyecto viejo (con su propio TXT `_vercel`). Por eso los
proyectos viejos no se borran hasta terminar el paso 7.
