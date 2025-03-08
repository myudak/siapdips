import { useScrollToHashSection } from "@/hooks/useScrollToHashSection";
import { useMemo, useRef } from "react";

type Tutorial = {
  id: number;
  title: string;
  videoSrc: string;
  hash: string;
  ref?: React.RefObject<HTMLDivElement>;
};

const TutorialSection = () => {
  const tutorialRefs = useMemo(() => {
    return {
      IpkStatus: useRef<HTMLDivElement>(null),
      Theme: useRef<HTMLDivElement>(null),
      Autopbm: useRef<HTMLDivElement>(null),
      EnableClickKanan: useRef<HTMLDivElement>(null),
      tutorialJadwal: useRef<HTMLDivElement>(null),
      autolearnsocial: useRef<HTMLDivElement>(null),
      autolearnsocialold: useRef<HTMLDivElement>(null),
    };
  }, []);

  const tutorials: Tutorial[] = [
    { id: 1, title: "Ipk Status", videoSrc: "vid-ipk.mp4", hash: "IpkStatus" },
    { id: 2, title: "Theme", videoSrc: "Vid-Theme.mp4", hash: "Theme" },
    { id: 3, title: "Auto PBM", videoSrc: "Vid-Pbm.mp4", hash: "Autopbm" },
    {
      id: 4,
      title: "Enable Click Kanan",
      videoSrc: "vid-klikKanan.mp4",
      hash: "EnableClickKanan",
    },
    {
      id: 5,
      title: "Jadwal Dips",
      videoSrc: "vid-jadwal.mp4",
      hash: "tutorialJadwal",
    },
    {
      id: 6,
      title: "Auto Learn Social",
      videoSrc: "vid-learnsocial.mp4",
      hash: "autolearnsocial",
    },
    {
      id: 7,
      title: "Auto Learn Social {old}",
      videoSrc: "vid-learnsocialold.mp4",
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
              <video
                src={tutorial.videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-4xl rounded-lg shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
