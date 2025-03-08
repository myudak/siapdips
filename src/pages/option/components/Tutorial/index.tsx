import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import { useMemo, useRef, useState } from "react";

type Media = {
  type: "video" | "image" | "text";
  src?: string;
  content?: string;
};

type Tutorial = {
  id: number;
  title: string;
  media: Media[];
  hash: string;
  ref?: React.RefObject<HTMLDivElement>;
};

const TutorialCarousel = ({ media }: { media: Media[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const goPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  const currentMedia = media[currentIndex];

  return (
    <div className="w-full max-w-4xl relative">
      <div className="relative">
        {currentMedia.type === "video" && currentMedia.src && (
          <video
            src={currentMedia.src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg shadow-2xl"
          />
        )}
        {currentMedia.type === "image" && currentMedia.src && (
          <img
            src={currentMedia.src}
            alt="slide"
            className="w-full rounded-lg shadow-2xl"
          />
        )}
        {currentMedia.type === "text" && currentMedia.content && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-2xl">
            {currentMedia.content}
          </div>
        )}
        {media.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 opacity-70 hover:opacity-100"
            >
              ←
            </button>
            <button
              onClick={goNext}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 opacity-70 hover:opacity-100"
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const TutorialSection = () => {
  const tutorialRefs = useMemo(
    () => ({
      IpkStatus: useRef<HTMLDivElement>(null),
      Theme: useRef<HTMLDivElement>(null),
      Autopbm: useRef<HTMLDivElement>(null),
      EnableClickKanan: useRef<HTMLDivElement>(null),
      tutorialJadwal: useRef<HTMLDivElement>(null),
      autolearnsocial: useRef<HTMLDivElement>(null),
      autolearnsocialold: useRef<HTMLDivElement>(null),
    }),
    []
  );

  const tutorials: Tutorial[] = [
    {
      id: 1,
      title: "Ipk Status",
      media: [{ type: "video", src: "vid-ipk.mp4" }] as Media[],
      hash: "IpkStatus",
    },
    {
      id: 2,
      title: "Theme",
      media: [{ type: "video", src: "Vid-Theme.mp4" }] as Media[],
      hash: "Theme",
    },
    {
      id: 3,
      title: "Auto PBM",
      media: [{ type: "video", src: "Vid-Pbm.mp4" }] as Media[],
      hash: "Autopbm",
    },
    {
      id: 4,
      title: "Enable Click Kanan",
      media: [{ type: "video", src: "vid-klikKanan.mp4" }] as Media[],
      hash: "EnableClickKanan",
    },
    {
      id: 5,
      title: "Jadwal Dips",
      media: [{ type: "video", src: "vid-jadwal.mp4" }] as Media[],
      hash: "tutorialJadwal",
    },
    {
      id: 6,
      title: "Auto Learn Social",
      media: [
        { type: "video", src: "vid-learnsocial.mp4" },
        {
          type: "text",
          content: "LearnSocial ~~> loremipsum",
        },
      ] as Media[],
      hash: "autolearnsocial",
    },
    {
      id: 7,
      title: "Auto Learn Social {old}",
      media: [{ type: "video", src: "vid-learnsocialold.mp4" }] as Media[],
      hash: "autolearnsocialold",
    },
  ].map((tutorial) => {
    const ref = tutorialRefs[tutorial.hash as keyof typeof tutorialRefs];
    useScrollToHashSection(tutorial.hash, ref);
    return { ...tutorial, ref };
  });

  return (
    <section className="bg-muted/50 mt-6 py-12">
      <div className="container mx-auto px-4">
        <h2 id="Tutorials" className="text-4xl font-bold mb-12 text-center">
          ~ Tutorial ~
        </h2>
        <div className="flex flex-col space-y-12">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="w-full flex flex-col items-center"
              id={tutorial.hash}
              ref={tutorial.ref}
            >
              <h3 className="text-2xl font-semibold mb-6">{tutorial.title}</h3>
              <TutorialCarousel media={tutorial.media} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
