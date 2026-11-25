import Image from "next/image";
import Link from "next/link";
import type { Mensajes } from "@/mensajes";
import type { Idioma } from "@/mensajes/idiomas";
import BotonPill from "@/components/ui/BotonPill";
import Revelar from "@/components/Revelar";
import { CORREO, WHATSAPP } from "@/components/datos/contacto";
import {
  FILAS_CUMPLIMIENTO,
  PDF_PRESENTACION,
  SERVICIOS,
  TESTIMONIOS,
} from "@/components/datos/presentacion";
import Mando from "./Mando";
import PasosRuta from "./PasosRuta";
import RutaCobertura from "./RutaCobertura";
import s from "./presentacion.module.css";

/**
 * La presentación de 10 láminas, reescrita como página.
 *
 * Lo que se conserva de las láminas: el orden, el texto, las fotos, la paleta
 * violeta y las dos bandas moradas. En escritorio cada capítulo ocupa una
 * pantalla y escala con ella (`--u` en el CSS), así que se lee como la lámina
 * original y se puede proyectar.
 *
 * Lo que cambia por ser web, y por qué:
 *   · Es HTML de verdad: titulares, tabla y citas se leen en el teléfono, se
 *     traducen, se indexan y los lee un lector de pantalla.
 *   · Cada servicio y cada carga llevan a su página o al cotizador ya
 *     preseleccionado. Una lámina termina en la lámina; esto sigue.
 *   · La numeración y los rótulos "02 — SERVICIOS" salen de cada lámina y se
 *     vuelven el mando de abajo. El sitio no numera secciones (AGENTS.md).
 *   · El logo de cada lámina también sale: ya está en la barra del sitio.
 *   · Sin orbes animados, parallax de mouse ni halos que siguen al cursor:
 *     en este sitio solo se mueve lo que avanza por una ruta (DESIGN.md).
 */

const Flecha = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={s.flecha}>
    <path
      d="M4 12 12 4M5.5 4H12v6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Primera letra del nombre y del primer apellido. */
const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("");

const enlaceWhatsapp = (mensaje: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

export default function Presentacion({ m, idioma }: { m: Mensajes; idioma: Idioma }) {
  const p = m.presentacion;
  const ruta = (r: string) => `/${idioma}${r}`;

  return (
    <main className={s.raiz} data-presentacion>
      {/* Sin JavaScript la animación nunca dispara, y lo que parte oculto
          quedaría oculto: ocho servicios, citas y la ruta incluidos. */}
      <noscript>
        <style>{`
          [data-presentacion] [style*="opacity"] { opacity: 1 !important; filter: none !important; transform: none !important; }
          [data-presentacion] [class*="rutaAvance"] { height: 100% !important; }
          [data-presentacion] [class*="rutaMarca"] { display: none !important; }
          [data-presentacion] [class*="pasosAvance"] { transform: none !important; }
        `}</style>
      </noscript>

      {/* ── 1 · Portada ─────────────────────────────────────────── */}
      <section tabIndex={-1} id="portada" className={`${s.capitulo} ${s.portada}`} aria-labelledby="t-portada">
        <div className={s.fotoLado}>
          <Image
            src="/fotos/flota-marca.png"
            alt={p.portada.altFoto}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={s.fotoPortada}
          />
        </div>
        <div className={s.columnaTexto}>
          <p className={s.rotulo}>{p.portada.rotulo}</p>
          <h1 id="t-portada" className={s.h1}>
            {p.portada.linea1}
            <span className={s.h1Lila}>{p.portada.linea2}</span>
          </h1>
          <p className={s.entrada}>{p.portada.bajada}</p>
          <p className={`dato ${s.rutaTexto}`}>
            Arica <span aria-hidden="true">→</span> Punta Arenas
          </p>
          <div className={s.acciones}>
            <BotonPill href="#servicios">{p.portada.empezar}</BotonPill>
            <a href={PDF_PRESENTACION} download className={s.enlacePdf}>
              {p.pdf}
            </a>
          </div>
        </div>
      </section>

      {/* ── 2 · Servicios ───────────────────────────────────────── */}
      <section tabIndex={-1} id="servicios" className={s.capitulo} aria-labelledby="t-servicios">
        <div className={s.encabezado}>
          <h2 id="t-servicios" className={s.h2}>
            {p.servicios.titulo}
          </h2>
          <p className={s.nota}>
            {p.servicios.preguntaAsesoria}{" "}
            <a
              href={enlaceWhatsapp(p.servicios.mensajeWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className={s.enlace}
            >
              {p.servicios.asesoria}
            </a>
          </p>
        </div>
        <ul className={s.servicios}>
          {SERVICIOS.map(({ clave, ruta: destino }, i) => {
            const servicio = p.servicios.items[clave];
            return (
              <Revelar
                key={clave}
                como="li"
                retraso={i * 0.04}
                desplazamiento={14}
                className={s.servicioCelda}
              >
                <Link
                  href={ruta(destino)}
                  className={i === 0 ? `${s.servicio} ${s.servicioSolido}` : s.servicio}
                >
                  <Flecha />
                  <span className={s.servicioNombre}>{servicio.nombre}</span>
                  <span className={s.servicioDetalle}>{servicio.detalle}</span>
                </Link>
              </Revelar>
            );
          })}
        </ul>
      </section>

      {/* ── 3 · La norma de cada carga ──────────────────────────── */}
      <section tabIndex={-1} id="cumplimiento" className={s.capitulo} aria-labelledby="t-cumplimiento">
        <div className={s.encabezado}>
          <h2 id="t-cumplimiento" className={s.h2}>
            {p.cumplimiento.titulo}
          </h2>
          <p className={s.nota}>{p.cumplimiento.bajada}</p>
        </div>
        {/* Los `role` son explícitos porque en móvil la tabla pasa a
            `display: block`, y eso le quita la semántica de tabla. */}
        <table role="table" className={s.tabla} aria-labelledby="t-cumplimiento">
          <thead role="rowgroup">
            <tr role="row">
              <th role="columnheader" scope="col">{p.cumplimiento.columnaCarga}</th>
              <th role="columnheader" scope="col">{p.cumplimiento.columnaRevisa}</th>
              <th role="columnheader" scope="col">{p.cumplimiento.columnaNorma}</th>
              <th role="columnheader" scope="col">
                <span className={s.soloLector}>{p.cumplimiento.columnaCotizar}</span>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {FILAS_CUMPLIMIENTO.map(({ clave, normas, ruta: destino }) => {
              const fila = p.cumplimiento.filas[clave];
              return (
                <tr key={clave} role="row">
                  <td role="cell" className={s.celdaCarga}>{fila.carga}</td>
                  <td role="cell" className={s.celdaRevisa}>{fila.revisa}</td>
                  <td role="cell" className={s.celdaNorma}>
                    {normas.length > 0 ? (
                      normas.map((norma) => (
                        <span key={norma} className={`dato ${s.norma}`}>
                          {norma}
                        </span>
                      ))
                    ) : (
                      <span className={s.sinNorma}>
                        <span aria-hidden="true">—</span>
                        <span className={s.soloLector}>{p.cumplimiento.sinNorma}</span>
                      </span>
                    )}
                  </td>
                  <td role="cell" className={s.celdaCotizar}>
                    <Link
                      href={ruta(destino)}
                      className={s.cotizarFila}
                      aria-label={`${p.cumplimiento.cotizarFila}: ${fila.carga}`}
                    >
                      <span className={s.cotizarTexto}>{p.cumplimiento.cotizarFila}</span>
                      <Flecha />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* ── 4 · Monitoreo ───────────────────────────────────────── */}
      <section tabIndex={-1} id="monitoreo" className={`${s.capitulo} ${s.partido}`} aria-labelledby="t-monitoreo">
        <div className={s.fotoLado}>
          <Image
            src="/fotos/cabina-pantalla.png"
            alt={p.monitoreo.altFoto}
            fill
            quality={90}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className={s.foto}
          />
        </div>
        <div className={s.columnaTexto}>
          <p className={s.estado}>
            <span className={s.estadoPunto} aria-hidden="true" />
            {p.monitoreo.estado}
          </p>
          <h2 id="t-monitoreo" className={s.h2}>
            {p.monitoreo.titulo}
          </h2>
          <p className={s.entrada}>{p.monitoreo.bajada}</p>
          <ul className={s.lista}>
            {Object.entries(p.monitoreo.puntos).map(([clave, texto], i) => (
              <Revelar key={clave} como="li" retraso={i * 0.08} className={s.listaFila}>
                {texto}
              </Revelar>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5 · Cobertura ───────────────────────────────────────── */}
      <section tabIndex={-1} id="cobertura" className={`${s.capitulo} ${s.morado} ${s.cobertura}`} aria-labelledby="t-cobertura">
        <div className={s.coberturaTexto}>
          <h2 id="t-cobertura" className={s.h2}>
            {p.cobertura.titulo}
          </h2>
          <div>
            <p className={`dato ${s.cifra}`}>
              {p.cobertura.cifra}
              <span className={s.cifraUnidad}> {p.cobertura.unidad}</span>
            </p>
            <p className={s.entrada}>{p.cobertura.bajada}</p>
          </div>
        </div>
        <RutaCobertura etiqueta={p.cobertura.etiquetaRuta} />
      </section>

      {/* ── 6 · Seguridad ───────────────────────────────────────── */}
      <section tabIndex={-1} id="seguridad" className={`${s.capitulo} ${s.seguridad}`} aria-labelledby="t-seguridad">
        <Image
          src="/fotos/seguridad-amarre.webp"
          alt={p.seguridad.altFoto}
          fill
          quality={90}
          sizes="100vw"
          className={s.fotoFondo}
        />
        <div className={s.velo} aria-hidden="true" />
        <div className={s.seguridadTexto}>
          <h2 id="t-seguridad" className={s.h2}>
            {p.seguridad.titulo}
          </h2>
          <p className={s.entrada}>{p.seguridad.bajada}</p>
        </div>
        <Revelar className={`vidrio ${s.ejemplo}`}>
          <p className={s.ejemploRotulo}>{p.seguridad.ejemploRotulo}</p>
          <p className={s.ejemploTitulo}>{p.seguridad.ejemploTitulo}</p>
          <p className={s.ejemploCuerpo}>{p.seguridad.ejemploCuerpo}</p>
        </Revelar>
      </section>

      {/* ── 7 · Cómo funciona ───────────────────────────────────── */}
      <section tabIndex={-1} id="proceso" className={`${s.capitulo} ${s.proceso}`} aria-labelledby="t-proceso">
        <div>
          <h2 id="t-proceso" className={s.h2}>
            {p.proceso.titulo}
          </h2>
          <p className={s.entrada}>{p.proceso.bajada}</p>
        </div>
        <PasosRuta pasos={Object.values(p.proceso.pasos)} />
      </section>

      {/* ── 8 · Equipo ──────────────────────────────────────────── */}
      <section tabIndex={-1} id="equipo" className={`${s.capitulo} ${s.equipo}`} aria-labelledby="t-equipo">
        <div className={s.equipoTexto}>
          <h2 id="t-equipo" className={s.h2}>
            {p.equipo.titulo}
          </h2>
          <p className={s.entrada}>{p.equipo.bajada}</p>
          <ul className={s.lista}>
            {Object.entries(p.equipo.puntos).map(([clave, punto], i) => (
              <Revelar key={clave} como="li" retraso={i * 0.08} className={s.listaFila}>
                <strong className={s.listaTitulo}>{punto.titulo}</strong>
                <span className={s.listaCuerpo}>{punto.cuerpo}</span>
              </Revelar>
            ))}
          </ul>
        </div>
        <div className={s.equipoFotos}>
          <div className={s.equipoFoto}>
            <Image
              src="/fotos/chofer-jockey.png"
              alt={p.equipo.altConductor}
              fill
              quality={90}
              sizes="(min-width: 1024px) 22vw, 50vw"
              className={s.foto}
            />
          </div>
          <div className={s.equipoFoto}>
            <Image
              src="/fotos/bodega-operario.png"
              alt={p.equipo.altBodega}
              fill
              quality={90}
              sizes="(min-width: 1024px) 22vw, 50vw"
              className={s.foto}
            />
          </div>
        </div>
      </section>

      {/* ── 9 · Clientes ────────────────────────────────────────── */}
      <section tabIndex={-1} id="clientes" className={s.capitulo} aria-labelledby="t-clientes">
        <h2 id="t-clientes" className={s.h2}>
          {p.clientes.titulo}
        </h2>
        <div className={s.citas}>
          {TESTIMONIOS.map((clave, i) => {
            const t = m.resenas.testimonios[clave];
            return (
              <Revelar key={clave} retraso={i * 0.08} className={s.citaCelda}>
                <figure className={s.cita}>
                  <p className={s.citaIndustria}>{t.industria}</p>
                  <blockquote className={s.citaTexto}>{t.cita}</blockquote>
                  <figcaption className={s.citaAutor}>
                    <span className={s.avatar} aria-hidden="true">
                      {iniciales(t.nombre)}
                    </span>
                    <span>
                      <strong className={s.citaNombre}>{t.nombre}</strong>
                      <span className={s.citaCargo}>
                        {t.cargo} · {t.empresa}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Revelar>
            );
          })}
        </div>
      </section>

      {/* ── 10 · Contacto ───────────────────────────────────────── */}
      {/* `cierre` y no `contacto`: ese id ya lo usa el pie del sitio. */}
      <section tabIndex={-1} id="cierre" className={`${s.capitulo} ${s.morado} ${s.contacto}`} aria-labelledby="t-cierre">
        <Image
          src="/logo-horizontal-trade-blanco.png"
          alt="Logística Trade"
          width={2172}
          height={724}
          className={s.contactoLogo}
        />
        <h2 id="t-cierre" className={s.h1}>
          {p.cierre.titulo}
        </h2>
        <p className={s.entrada}>{p.cierre.bajada}</p>
        <div className={s.contactoAcciones}>
          <Link href={ruta("/cotizar")} className={s.botonBlanco}>
            {p.cierre.cotizar}
            <Flecha />
          </Link>
          <a
            href={enlaceWhatsapp(p.cierre.mensajeWhatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className={s.botonContorno}
          >
            {p.cierre.whatsapp}
          </a>
          <a href={`mailto:${CORREO}`} className={`dato ${s.botonContorno}`}>
            {CORREO}
          </a>
        </div>
        <a href={PDF_PRESENTACION} download className={s.enlacePdf}>
          {p.pdf}
        </a>
        <p className={s.lema}>
          {p.cierre.lema} · <span className="dato">Arica → Punta Arenas</span>
        </p>
      </section>

      <Mando
        textos={p.mando}
        capitulos={p.capitulos}
        titulo={p.metaTitulo}
        hrefCotizar={ruta("/cotizar")}
      />
    </main>
  );
}
