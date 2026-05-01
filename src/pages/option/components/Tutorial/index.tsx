import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import { ArrowRight, BookOpen, Layers3 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Media, Tutorial, tutorialsData } from "./Tutorial.constant";

const categoryLabelMap = {
  core: "Core Setup",
  automation: "Automation",
  academic: "Academic Helpers",
} as const;

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

  const tutorialGroups = Object.entries(categoryLabelMap).map(
    ([categoryKey, label]) => ({
      category: categoryKey as keyof typeof categoryLabelMap,
      label,
      items: tutorials.filter((tutorial) => tutorial.category === categoryKey),
    })
  );

  return (
    <section className="bg-muted/50 mt-8 py-12 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Detailed Tutorials
          </Badge>
          <h2 id="Tutorials" className="text-4xl font-bold text-center">
            Guides buat fitur yang pengen dipakai beneran
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Quick start di atas buat orientasi. Bagian ini buat dalemin fitur
            tertentu tanpa harus baca semuanya dari awal sampai bawah.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tutorialGroups.map((group) => (
            <Card key={group.category} className="bg-background/90">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers3 className="h-4 w-4 text-primary" />
                  {group.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((tutorial) => (
                  <button
                    key={tutorial.hash}
                    type="button"
                    className="w-full rounded-xl border p-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      window.location.href = `#${tutorial.hash}`;
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{tutorial.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {tutorial.description}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex flex-col space-y-12">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              className="w-full flex flex-col items-center"
              id={tutorial.hash}
              ref={tutorial.ref}
            >
              <div className="mb-6 max-w-3xl text-center">
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {categoryLabelMap[tutorial.category]}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold">{tutorial.title}</h3>
                <p className="mt-2 text-muted-foreground">
                  {tutorial.description}
                </p>
              </div>
              <TutorialCarousel media={tutorial.media} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "#quickStart";
            }}
          >
            Back to quick start
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
