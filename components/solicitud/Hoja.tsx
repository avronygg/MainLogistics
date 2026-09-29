import Image from "next/image";
import { CORREO, TELEFONO } from "../datos/contacto";
import type { Solicitud } from "../datos/solicitud";
import type { Mensajes } from "@/mensajes";

/**
 * La hoja A4 que se arma mientras el cliente escribe.
 *
 * Reproduce el documento del cotizador interno —misma banda morada, misma
 * retícula, mismos filetes— porque el valor de esta pantalla es que la
 * persona vea SU cotización tomando forma, no un resumen genérico.
 *
 * Tres diferencias, y las tres a propósito:
 *
 *  - **Sin columnas de valor ni totales.** Acá no hay precio. Ver
 *    `datos/solicitud.ts`.
 *  - **Sin folio, validez ni ejecutivo.** Eso lo asigna Trade al emitir;
 *    pedírselo al cliente no tendría sentido.
 *  - **Sin las líneas de firma.** Una solicitud no se firma.
 *
 * El título dice "Solicitud de cotización", con todas las letras: el
 * documento no puede parecer una cotización emitida, porque no lo es.
 *
 * Medidas en píxeles a 96 dpi, que es el A4 del original en puntos por
 * 96/72. La hoja se dibuja siempre a 794×1123 y quien la muestra la escala;
 * así el diseño no cambia con el ancho de la ventana.
 */

export const HOJA_ANCHO = 794;
export const HOJA_ALTO = 1123;

const TINTA = "#0E1519";
const MORADO = "#6835E1";
const FILETE = "#DDE2E3";
const APAGADO = "#4A5B63";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="grid grid-cols-[78px_1fr] gap-x-3 py-[3px]">
      <dt
        className="dato text-[7.5px] uppercase leading-[1.5] tracking-[0.1em]"
        style={{ color: APAGADO }}
      >
        {etiqueta}
      </dt>
      <dd className="text-[11px] leading-[1.35]" style={{ color: TINTA }}>
        {valor}
      </dd>
    </div>
  );
}

export default function Hoja({ datos, m }: { datos: Solicitud; m: Mensajes }) {
  const t = m.solicitud.documento;

  /* Fecha del día, en el idioma del lector. Es el único dato que la hoja
     pone por su cuenta, y es verificable de un vistazo. */
  const hoy = new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const lineas = datos.lineas.filter(
    (l) => l.descripcion.trim() || l.equipo.trim() || l.cantidad.trim(),
  );

  const vacia =
    !datos.razonSocial.trim() &&
    !datos.contacto.trim() &&
    !datos.tipoCarga.trim() &&
    !datos.origen.trim() &&
    !datos.destino.trim() &&
    lineas.length === 0;

  return (
    <article
      aria-label={t.titulo}
      className="relative overflow-hidden bg-white"
      style={{ width: HOJA_ANCHO, height: HOJA_ALTO, color: TINTA }}
    >
      {/* Banda del encabezado. El logo blanco va acá y no en la hoja
          blanca, que es justo por lo que existe la banda. */}
      <div className="relative h-[128px]" style={{ background: MORADO }}>
        <Image
          src="/logo-horizontal-trade-blanco.png"
          alt="Logística Trade"
          width={2172}
          height={724}
          className="absolute left-[42px] top-[34px] h-[60px] w-auto max-w-none"
        />
        <p
          className="dato absolute right-[41px] top-[45px] text-[9px] uppercase leading-none tracking-[0.21em]"
          style={{ color: "#D6C6FF" }}
        >
          {t.bajada}
        </p>
        <p className="absolute right-[42px] top-[61px] text-[23px] font-bold uppercase leading-none tracking-[0.17em] text-white">
          {t.titulo}
        </p>
      </div>

      {/* Fecha y quién la prepara. El original tiene cuatro casillas; acá
          van dos, porque folio, validez y ejecutivo los pone Trade. */}
      <div
        className="mx-[42px] mt-[20px] grid grid-cols-2"
        style={{ border: `1px solid ${FILETE}` }}
      >
        <div className="px-[13px] py-[11px]">
          <p
            className="dato text-[7.5px] uppercase leading-none tracking-[0.1em]"
            style={{ color: APAGADO }}
          >
            {t.fecha}
          </p>
          <p className="dato mt-[6px] text-[13px] leading-none">{hoy}</p>
        </div>
        <div className="px-[13px] py-[11px]" style={{ borderLeft: `1px solid ${FILETE}` }}>
          <p
            className="dato text-[7.5px] uppercase leading-none tracking-[0.1em]"
            style={{ color: APAGADO }}
          >
            {t.preparadaPor}
          </p>
          <p className="mt-[6px] truncate text-[12px] font-semibold leading-none">
            {datos.razonSocial}
          </p>
        </div>
      </div>

      <div className="mx-[42px] mt-[17px] grid grid-cols-2 gap-x-[22px]">
        <section>
          <h3
            className="dato border-b pb-[5px] text-[8px] uppercase tracking-[0.12em]"
            style={{ color: MORADO, borderColor: FILETE }}
          >
            {m.solicitud.secciones.cliente}
          </h3>
          <dl className="mt-[6px]">
            <Dato etiqueta={m.solicitud.campos.razonSocial} valor={datos.razonSocial} />
            <Dato etiqueta={m.solicitud.campos.rut} valor={datos.rut} />
            <Dato
              etiqueta={m.solicitud.campos.contacto}
              valor={[datos.contacto, datos.cargo].filter(Boolean).join(" · ")}
            />
            <Dato etiqueta={m.solicitud.campos.correo} valor={datos.correo} />
            <Dato etiqueta={m.solicitud.campos.telefono} valor={datos.telefono} />
          </dl>
        </section>
        <section>
          <h3
            className="dato border-b pb-[5px] text-[8px] uppercase tracking-[0.12em]"
            style={{ color: MORADO, borderColor: FILETE }}
          >
            {m.solicitud.secciones.servicio}
          </h3>
          <dl className="mt-[6px]">
            <Dato etiqueta={m.solicitud.campos.tipoCarga} valor={datos.tipoCarga} />
            <Dato etiqueta={m.solicitud.campos.equipo} valor={datos.equipo} />
            <Dato etiqueta={m.solicitud.campos.modalidad} valor={datos.modalidad} />
            <Dato etiqueta={m.solicitud.campos.fechaEstimada} valor={datos.fechaEstimada} />
          </dl>
        </section>
      </div>

      {/* Ruta. La línea entre origen y destino es el mismo motivo de
          carretera del resto del sistema, a escala de detalle. */}
      <div
        className="mx-[42px] mt-[16px] flex items-center gap-[14px] px-[14px] py-[11px]"
        style={{ background: "#F4F5F6" }}
      >
        <span
          className="dato text-[7.5px] uppercase tracking-[0.1em]"
          style={{ color: APAGADO }}
        >
          {m.solicitud.secciones.ruta}
        </span>
        <b className="text-[13px] leading-none">{datos.origen}</b>
        <span className="h-px flex-1" style={{ background: FILETE }} />
        <b className="text-[13px] leading-none">{datos.destino}</b>
      </div>

      <table className="mx-[42px] mt-[16px] w-[710px] border-collapse text-left">
        <thead>
          <tr>
            <th
              className="dato border-b px-[8px] pb-[6px] text-[7.5px] uppercase tracking-[0.1em]"
              style={{ color: APAGADO, borderColor: FILETE, width: 400 }}
            >
              {t.colDetalle}
            </th>
            <th
              className="dato border-b px-[8px] pb-[6px] text-[7.5px] uppercase tracking-[0.1em]"
              style={{ color: APAGADO, borderColor: FILETE, width: 200 }}
            >
              {t.colEquipo}
            </th>
            <th
              className="dato border-b px-[8px] pb-[6px] text-right text-[7.5px] uppercase tracking-[0.1em]"
              style={{ color: APAGADO, borderColor: FILETE }}
            >
              {t.colCantidad}
            </th>
          </tr>
        </thead>
        <tbody>
          {lineas.map((l, i) => (
            <tr key={i}>
              <td
                className="border-b px-[8px] py-[9px] align-top text-[11px] leading-[1.4]"
                style={{ borderColor: FILETE }}
              >
                {l.descripcion}
              </td>
              <td
                className="border-b px-[8px] py-[9px] align-top text-[11px] leading-[1.4]"
                style={{ borderColor: FILETE }}
              >
                {l.equipo}
              </td>
              <td
                className="dato border-b px-[8px] py-[9px] text-right align-top text-[11px] leading-[1.4]"
                style={{ borderColor: FILETE }}
              >
                {l.cantidad}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {datos.observaciones.trim() && (
        <section className="mx-[42px] mt-[16px]">
          <h3
            className="dato border-b pb-[5px] text-[8px] uppercase tracking-[0.12em]"
            style={{ color: MORADO, borderColor: FILETE }}
          >
            {m.solicitud.secciones.observaciones}
          </h3>
          <p className="mt-[7px] max-w-[640px] text-[11px] leading-[1.5]">
            {datos.observaciones}
          </p>
        </section>
      )}

      {vacia && (
        <p
          className="absolute left-0 right-0 top-[520px] text-center text-[12px]"
          style={{ color: APAGADO }}
        >
          {t.vacio}
        </p>
      )}

      {/* Que el documento diga que no lleva precios es parte del documento,
          no una nota al margen: sin eso alguien podría tomarlo por una
          cotización emitida. */}
      <p
        className="absolute bottom-[62px] left-[42px] right-[42px] text-[9.5px] leading-[1.5]"
        style={{ color: APAGADO }}
      >
        {t.nota}
      </p>

      <footer
        className="dato absolute bottom-0 left-0 right-0 flex items-center justify-between px-[42px] py-[14px] text-[8.5px]"
        style={{ borderTop: `1px solid ${FILETE}`, color: APAGADO }}
      >
        <span>Logística Trade</span>
        <span>
          {TELEFONO} · {CORREO} · logisticatrade.cl
        </span>
      </footer>
    </article>
  );
}
