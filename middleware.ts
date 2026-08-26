import { NextResponse, type NextRequest } from "next/server";
import { IDIOMAS, detectarIdioma, esIdioma } from "@/mensajes/idiomas";

/**
 * Lleva `/` al idioma que corresponde.
 *
 * Orden de preferencia:
 *   1. La cookie, si la persona ya eligió idioma a mano. Una elección
 *      explícita gana sobre lo que diga el navegador, siempre.
 *   2. El encabezado `Accept-Language`.
 *   3. Español.
 *
 * Las rutas que ya traen idioma (`/en`, `/pt/...`) pasan de largo: eso es lo
 * que hace que se pueda mandar por WhatsApp el enlace en el idioma del
 * destinatario, que es justamente para lo que existe todo esto.
 */
export const COOKIE_IDIOMA = "ml-idioma";

export function middleware(peticion: NextRequest) {
  const { pathname } = peticion.nextUrl;

  // ¿Ya viene con idioma? Nada que hacer.
  const primerTramo = pathname.split("/")[1];
  if (esIdioma(primerTramo)) return NextResponse.next();

  const elegido = peticion.cookies.get(COOKIE_IDIOMA)?.value;
  const idioma =
    elegido && esIdioma(elegido)
      ? elegido
      : detectarIdioma(peticion.headers.get("accept-language"));

  const destino = peticion.nextUrl.clone();
  destino.pathname = `/${idioma}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(destino);
}

export const config = {
  /**
   * Todo menos la API, los archivos internos de Next y cualquier cosa con
   * extensión. Sin excluir los estáticos, el middleware redirigiría también
   * los videos y las fotos del hero, y la página quedaría sin fondo.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};

/** Se exporta para que el selector de idioma no reinvente la lista. */
export { IDIOMAS };
