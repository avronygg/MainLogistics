import Image from "next/image";
import { CORREO, TELEFONO } from "../datos/contacto";
import type { Solicitud } from "../datos/solicitud";
import type { Mensajes } from "@/mensajes";

/**
 * La hoja A4 que se arma mientras el cliente escribe.
 *
 * Reproduce el documento del cotizador interno (misma banda morada, mismos
 * filetes) porque el valor de esta pantalla es que la persona vea SU
 * cotización tomando forma, no un resumen genérico.
 *
 * Tres diferencias, y las tres a propósito:
 *
 *  - **Sin columnas de valor ni totales.** Acá no hay precio. Ver
 *    `datos/solicitud.ts`.
 *  - **Sin folio, validez ni ejecutivo.** Eso lo asigna Trade al emitir.
 *  - **Sin las líneas de firma.** Una solicitud no se firma.
 *
 * El título dice "Solicitud de cotización", con todas las letras: el
 * documento no puede parecer una cotización emitida, porque no lo es.
 *
 * ── Tamaño ───────────────────────────────────────────────────────────────
 *
 * La hoja se dibuja a 640 px de ancho (proporción A4) y quien la muestra la
 * escala. Antes medía 794 y llevaba la letra en 7,5 px: reducida al ancho de
 * la columna quedaba en cinco píxeles y no se podía leer. Ahora las
 * etiquetas van en 12 px y los valores en 15 px, en sans y sin mayúsculas
 * sostenidas, y a ancho de escritorio la hoja se muestra sin achicar.
 *
 * La hoja crece hacia abajo si el contenido lo pide (ocho líneas de
 * detalle no caben en una A4 a este tamaño): quien la muestra mide su alto.
 * Nada se corta.
 */

export const HOJA_ANCHO = 640;
export const HOJA_ALTO = 905;

const TINTA = "#0E1519";
const MORADO = "#6835E1";
const FILETE = "#DDE2E3";
const APAGADO = "#4A5B63";
const TENUE = "#AEB8BC";

function Vacio() {
  return (
    <span aria-hidden className="font-normal" style={{ color: TENUE }}>
      &mdash;
    </span>
  );
}

function Dato({
  etiqueta,
  valor,
  ancho,
}: {
  etiqueta: string;
  valor: string;
  ancho?: boolean;
}) {
  return (
    <div className={ancho ? "col-span-2" : undefined}>
      <dt className="text-[12px] font-medium leading-[1.3]" style={{ color: APAGADO }}>
        {etiqueta}
      </dt>
      <dd
        className="mt-[3px] min-h-[22px] break-words border-b pb-[4px] text-[15px] leading-[1.35]"
        style={{ color: TINTA, borderColor: FILETE }}
      >
        {valor.trim() ? valor : <Vacio />}
      </dd>
    </div>
  );
}

function Titulo({ children }: { children: string }) {
  return (
    <h3
      className="text-[13px] font-semibold uppercase leading-none tracking-[0.08em]"
      style={{ color: MORADO }}
    >
      {children}
    </h3>
  );
}

export default function Hoja({ datos, m }: { datos: Solicitud; m: Mensajes }) {
  const t = m.solicitud.documento;
  const c = m.solicitud.campos;

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
      className="relative flex flex-col bg-white"
      style={{ width: HOJA_ANCHO, minHeight: HOJA_ALTO, color: TINTA }}
    >
      {/* Banda del encabezado. El logo blanco va acá y no en la hoja
          blanca, que es justo por lo que existe la banda. */}
      <div
        className="flex items-center justify-between gap-4 px-[36px] py-[24px]"
        style={{ background: MORADO }}
      >
        <Image
          src="/logo-horizontal-trade-blanco.png"
          alt="Logística Trade"
          width={2172}
          height={724}
          className="h-[46px] w-auto max-w-none shrink-0"
        />
        <div className="text-right">
          <p className="text-[12px] leading-none" style={{ color: "#E4D9FF" }}>
            {t.bajada}
          </p>
          <p className="mt-[8px] text-[19px] font-bold uppercase leading-none tracking-[0.1em] text-white">
            {t.titulo}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-[36px] pb-[20px] pt-[22px]">
        {/* Fecha y quién la prepara. El original tiene cuatro casillas; acá
            van dos, porque folio, validez y ejecutivo los pone Trade. */}
        <div className="grid grid-cols-[150px_1fr] gap-x-[22px]">
          <div>
            <p className="text-[12px] font-medium leading-[1.3]" style={{ color: APAGADO }}>
              {t.fecha}
            </p>
            <p className="dato mt-[3px] text-[15px] leading-[1.35]">{hoy}</p>
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium leading-[1.3]" style={{ color: APAGADO }}>
              {t.solicitadaPor}
            </p>
            <p className="mt-[3px] truncate text-[15px] font-semibold leading-[1.35]">
              {datos.razonSocial || <Vacio />}
            </p>
          </div>
        </div>

        <section className="mt-[24px]">
          <Titulo>{m.solicitud.secciones.cliente}</Titulo>
          <dl className="mt-[10px] grid grid-cols-2 gap-x-[22px] gap-y-[12px]">
            <Dato etiqueta={c.razonSocial} valor={datos.razonSocial} ancho />
            <Dato etiqueta={datos.extranjero ? c.rutExtranjero : c.rut} valor={datos.rut} />
            <Dato
              etiqueta={c.contacto}
              valor={[datos.contacto, datos.cargo].filter(Boolean).join(" · ")}
            />
            <Dato etiqueta={c.correo} valor={datos.correo} />
            <Dato etiqueta={c.telefono} valor={datos.telefono} />
          </dl>
        </section>

        <section className="mt-[24px]">
          <Titulo>{m.solicitud.secciones.servicio}</Titulo>
          <dl className="mt-[10px] grid grid-cols-2 gap-x-[22px] gap-y-[12px]">
            <Dato etiqueta={c.tipoCarga} valor={datos.tipoCarga} />
            <Dato etiqueta={c.equipo} valor={datos.equipo} />
            <Dato etiqueta={c.modalidad} valor={datos.modalidad} />
            <Dato etiqueta={c.fechaEstimada} valor={datos.fechaEstimada} />
          </dl>
        </section>

        {/* Ruta. La línea entre origen y destino es el mismo motivo de
            carretera del resto del sistema, a escala de detalle. */}
        <div className="mt-[24px] px-[16px] py-[14px]" style={{ background: "#F4F5F6" }}>
          <p className="text-[12px] font-medium leading-none" style={{ color: APAGADO }}>
            {m.solicitud.secciones.ruta}
          </p>
          <div className="mt-[9px] flex items-center gap-[14px]">
            <b className="min-w-0 max-w-[45%] break-words text-[16px] leading-[1.25]">
              {datos.origen || <Vacio />}
            </b>
            <span className="h-px flex-1" style={{ background: "#B9C2C6" }} />
            <b className="min-w-0 max-w-[45%] break-words text-right text-[16px] leading-[1.25]">
              {datos.destino || <Vacio />}
            </b>
          </div>
        </div>

        {/* La tabla aparece cuando hay algo que poner en ella. Un encabezado
            de columnas sobre el vacío se lee como un documento a medio hacer. */}
        {lineas.length > 0 && (
          <table className="mt-[24px] w-full border-collapse text-left">
            <thead>
              <tr>
                <th
                  className="border-b py-[7px] pr-[10px] text-[12px] font-medium"
                  style={{ color: APAGADO, borderColor: FILETE }}
                >
                  {t.colDetalle}
                </th>
                <th
                  className="w-[150px] border-b px-[10px] py-[7px] text-[12px] font-medium"
                  style={{ color: APAGADO, borderColor: FILETE }}
                >
                  {t.colEquipo}
                </th>
                <th
                  className="w-[56px] border-b py-[7px] pl-[10px] text-right text-[12px] font-medium"
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
                    className="break-words border-b py-[9px] pr-[10px] align-top text-[15px] leading-[1.35]"
                    style={{ borderColor: FILETE }}
                  >
                    {l.descripcion}
                  </td>
                  <td
                    className="break-words border-b px-[10px] py-[9px] align-top text-[15px] leading-[1.35]"
                    style={{ borderColor: FILETE }}
                  >
                    {l.equipo}
                  </td>
                  <td
                    className="dato border-b py-[9px] pl-[10px] text-right align-top text-[15px] leading-[1.35]"
                    style={{ borderColor: FILETE }}
                  >
                    {l.cantidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {datos.observaciones.trim() && (
          <section className="mt-[24px]">
            <Titulo>{m.solicitud.secciones.observaciones}</Titulo>
            <p className="mt-[8px] whitespace-pre-line break-words text-[15px] leading-[1.5]">
              {datos.observaciones}
            </p>
          </section>
        )}

        {vacia && (
          <p
            className="mt-[40px] text-center text-[15px] leading-[1.5]"
            style={{ color: APAGADO }}
          >
            {t.vacio}
          </p>
        )}

        {/* Que el documento diga que no lleva precios es parte del documento,
            no una nota al margen: sin eso alguien podría tomarlo por una
            cotización emitida. */}
        <p className="mt-auto pt-[28px] text-[13px] leading-[1.5]" style={{ color: APAGADO }}>
          {t.nota}
        </p>
      </div>

      <footer
        className="flex items-center justify-between gap-3 px-[36px] py-[13px] text-[12px]"
        style={{ borderTop: `1px solid ${FILETE}`, color: APAGADO }}
      >
        <span className="font-medium">Logística Trade</span>
        <span className="text-right">
          {TELEFONO} · {CORREO}
        </span>
      </footer>
    </article>
  );
}
