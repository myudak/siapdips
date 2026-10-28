import { ArrowRight, Clock } from "lucide-react";
import { tutorialPath, type Screen, type Video } from "../data/site";
import { tutorialCategories, type Tutorial } from "../data/tutorials";

export function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const Icon = tutorial.icon;
  return (
    <a className="card tutorial-card" href={tutorialPath(tutorial.slug)}>
      <span className="card-icon">
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="eyebrow">{tutorialCategories[tutorial.category].label}</span>
      <h3>{tutorial.name}</h3>
      <p>{tutorial.description}</p>
      <span className="card-meta">
        <Clock size={14} aria-hidden="true" />
        {tutorial.minutes} menit · {tutorial.steps.length} langkah
        <ArrowRight className="card-arrow" size={16} aria-hidden="true" />
      </span>
    </a>
  );
}

/** Muted, looping clip that the page script loads and plays only while on screen. */
export function AutoplayVideo({ video }: { video: Video }) {
  return (
    <video
      className="media"
      data-src={video.src}
      poster={video.poster}
      preload="none"
      muted
      loop
      playsInline
      aria-label={video.label}
      width={960}
      height={600}
    />
  );
}

/** Click-to-play clip for tutorial pages; nothing downloads until the reader presses play. */
export function TutorialVideo({ video }: { video: Video }) {
  return (
    <figure className="media-frame">
      <video
        className="media"
        src={video.src}
        poster={video.poster}
        preload="none"
        controls
        muted
        playsInline
        aria-label={video.label}
        width={960}
        height={600}
      />
      <figcaption>{video.label}</figcaption>
    </figure>
  );
}

export function ScreenImage({
  screen,
  priority = false,
  caption = true,
}: {
  screen: Screen;
  priority?: boolean;
  caption?: boolean;
}) {
  return (
    <figure className="media-frame">
      <img
        className="media"
        src={screen.src}
        srcSet={`${screen.small} 768w, ${screen.src} 1280w`}
        sizes="(max-width: 900px) 100vw, 1100px"
        alt={screen.alt}
        width={1280}
        height={800}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // React 18 only forwards the lowercase attribute.
        {...((priority ? { fetchpriority: "high" } : {}) as Record<string, string>)}
      />
      {caption && <figcaption>{screen.alt}</figcaption>}
    </figure>
  );
}
