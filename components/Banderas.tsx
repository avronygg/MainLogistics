import type { Idioma } from "@/mensajes/idiomas";

/**
 * Banderas del selector de idioma.
 *
 * Dibujadas en SVG y no en emoji. Windows no tiene glifos de bandera: un
 * 🇨🇱 se ve como un recuadro con las letras "CL", y este sitio lo abre gente
 * en el computador de la oficina. Además el emoji no se puede ajustar de
 * tamaño ni de radio, y al lado de un ícono de línea se ve pegoteado.
 *
 * QUÉ BANDERA PARA QUÉ IDIOMA. Un idioma no es un país, y por eso la bandera
 * nunca va sola: siempre acompaña al nombre del idioma, que es lo que
 * realmente informa. Dicho eso, la elección no es arbitraria — es el mapa
 * comercial de Chile:
 *
 *   es → Chile.   El sitio está escrito en español de Chile, no de España.
 *   zh → China.   Primer socio comercial del país.
 *   en → EE. UU.  Segundo, y el inglés de referencia en comercio exterior.
 *   pt → Brasil.  El portugués que aparece en esta operación es brasileño.
 *
 * Caja de 20×15 (4:3, la proporción real de la mayoría de las banderas) con
 * las esquinas redondeadas por `clipPath` propio de cada una: sin el clip,
 * el `rect` interno se sale del borde redondeado del contenedor.
 */

type Props = { className?: string };

/** Estrella de cinco puntas. Determinista: mismos puntos en cada render. */
function estrella(cx: number, cy: number, radio: number): string {
  const interno = radio * 0.396; // proporción de la estrella de cinco puntas
  const puntos: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? radio : interno;
    const angulo = (Math.PI / 5) * i - Math.PI / 2;
    puntos.push(`${(cx + r * Math.cos(angulo)).toFixed(2)} ${(cy + r * Math.sin(angulo)).toFixed(2)}`);
  }
  return `M${puntos.join("L")}Z`;
}

function Marco({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 15"
      aria-hidden="true"
      className={`shrink-0 rounded-[3px] ${className}`}
    >
      <clipPath id={id}>
        <rect width="20" height="15" rx="2.2" />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
      {/* Filete tenue: sin él, la franja blanca de Chile se funde con el
          fondo claro y la bandera parece cortada. */}
      <rect
        width="20"
        height="15"
        rx="2.2"
        fill="none"
        stroke="rgb(0 0 0 / 0.18)"
        strokeWidth="0.9"
      />
    </svg>
  );
}

function Chile(p: Props) {
  return (
    <Marco id="bandera-cl" {...p}>
      <rect width="20" height="15" fill="#fff" />
      <rect y="7.5" width="20" height="7.5" fill="#D52B1E" />
      <rect width="7.5" height="7.5" fill="#0039A6" />
      <path d={estrella(3.75, 3.75, 2.4)} fill="#fff" />
    </Marco>
  );
}

function EEUU(p: Props) {
  // Trece franjas: 15 / 13 = 1.1538 de alto cada una.
  const franjas = [0, 2, 4, 6, 8, 10, 12].map((i) => (
    <rect key={i} y={i * 1.1538} width="20" height="1.1538" fill="#B31942" />
  ));
  // Las estrellas van como discos: cincuenta estrellas de cinco puntas en
  // veinte píxeles serían una mancha gris.
  const estrellas: React.ReactElement[] = [];
  for (let f = 0; f < 4; f++) {
    for (let c = 0; c < 5; c++) {
      const impar = f % 2 === 1;
      if (impar && c === 4) continue;
      estrellas.push(
        <circle
          key={`${f}-${c}`}
          cx={0.85 + c * 1.55 + (impar ? 0.78 : 0)}
          cy={1.1 + f * 1.75}
          r="0.42"
          fill="#fff"
        />,
      );
    }
  }
  return (
    <Marco id="bandera-us" {...p}>
      <rect width="20" height="15" fill="#fff" />
      {franjas}
      <rect width="8.4" height="8.077" fill="#0A3161" />
      {estrellas}
    </Marco>
  );
}

function Brasil(p: Props) {
  return (
    <Marco id="bandera-br" {...p}>
      <rect width="20" height="15" fill="#009B3A" />
      <path d="M10 1.7 18.4 7.5 10 13.3 1.6 7.5Z" fill="#FEDF00" />
      <circle cx="10" cy="7.5" r="3.3" fill="#002776" />
      {/* La banda blanca de "Ordem e Progresso", recortada al disco. */}
      <clipPath id="bandera-br-disco">
        <circle cx="10" cy="7.5" r="3.3" />
      </clipPath>
      <path
        d="M5.9 6.4Q10 4.1 14.3 7.0L14.3 8.0Q10 5.1 5.9 7.4Z"
        fill="#fff"
        clipPath="url(#bandera-br-disco)"
      />
    </Marco>
  );
}

function China(p: Props) {
  return (
    <Marco id="bandera-cn" {...p}>
      <rect width="20" height="15" fill="#DE2910" />
      <path d={estrella(3.6, 3.7, 2.1)} fill="#FFDE00" />
      <path d={estrella(7.1, 1.7, 0.72)} fill="#FFDE00" />
      <path d={estrella(8.5, 3.4, 0.72)} fill="#FFDE00" />
      <path d={estrella(8.3, 5.6, 0.72)} fill="#FFDE00" />
      <path d={estrella(6.7, 6.9, 0.72)} fill="#FFDE00" />
    </Marco>
  );
}

export const BANDERAS: Record<Idioma, (p: Props) => React.ReactElement> = {
  es: Chile,
  en: EEUU,
  pt: Brasil,
  zh: China,
};
