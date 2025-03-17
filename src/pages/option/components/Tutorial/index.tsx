import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import { useMemo, useRef, useState } from "react";
import { Media, Tutorial, tutorialsData } from "./Tutorial.constant";

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
          <div className="p-4 text-center bg-white dark:bg-gray-900 rounded-lg shadow-2xl text-lg">
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
      foodtruk: useRef<HTMLDivElement>(null),
    }),
    []
  );

  const tutorials: Tutorial[] = tutorialsData.map((tutorial) => {
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
