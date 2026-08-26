import s from "./HeroBackdrop.module.css";
import VideoFondo from "./VideoFondo";

type Props = {
  /**
   * Activa el video de fondo. Los archivos los genera
   * `node scripts/video-hero.mjs` desde `brand/hero-original-hevc.mp4`.
   *
   * Con video, la carretera generativa se apaga: era el sustituto mientras
   * no existía metraje, y superponer dos carreteras se pelea consigo mismo.
   */
  conVideo?: boolean;
  poster?: string;
};

export default function HeroBackdrop({
  conVideo = false,
  poster = "/hero-poster.jpg",
}: Props) {
  return (
    <div className={s.escena} aria-hidden="true">
      {conVideo ? (
        <VideoFondo poster={poster} />
      ) : (
        <div className={s.plano}>
          <div className={s.calzada} />
          <div className={s.rieles} />
          <div className={s.segmentada} />
        </div>
      )}

      {/* Con video el velo es mucho más denso: el metraje tiene cielos claros
          y el titular va en blanco encima. El doc de marca §8 lo exige —
          texto sobre imagen siempre con overlay, o se vuelve ilegible. */}
      <div className={conVideo ? s.veloVideo : s.velo} />

      <div className={s.horizonte} style={conVideo ? { opacity: 0.35 } : undefined} />
    </div>
  );
}
