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

const tutorialsData = [
  {
    id: 1,
    title: "Ipk Status",
    media: [{ type: "video", src: "video/vid-ipk.mp4" }] as Media[],
    hash: "IpkStatus",
  },
  {
    id: 2,
    title: "Theme",
    media: [{ type: "video", src: "video/Vid-Theme.mp4" }] as Media[],
    hash: "Theme",
  },
  {
    id: 3,
    title: "Auto PBM",
    media: [{ type: "video", src: "video/Vid-Pbm.mp4" }] as Media[],
    hash: "Autopbm",
  },
  {
    id: 4,
    title: "Enable Click Kanan",
    media: [{ type: "video", src: "video/Vid-Klikkanan.mp4" }] as Media[],
    hash: "EnableClickKanan",
  },
  {
    id: 5,
    title: "Jadwal Dips",
    media: [
      { type: "video", src: "video/vid-jadwal.mp4" },
      {
        type: "video",
        src: "video/vid-jadwal-2.mp4",
      },
    ] as Media[],
    hash: "tutorialJadwal",
  },
  {
    id: 6,
    title: "Auto Learn Social",
    media: [
      { type: "video", src: "video/vid-learnsocial.mp4" },
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
    media: [{ type: "video", src: "video/vid-learnsocialold.mp4" }] as Media[],
    hash: "autolearnsocialold",
  },
  {
    id: 7,
    title: "FoodTruk Helper",
    media: [
      { type: "video", src: "video/vid-foodtruk.mp4" },
      {
        type: "text",
        content: "FoodTruk ~~> AutoScroll, AutoLokasi, Auto refresh{optional}",
      },
    ] as Media[],
    hash: "foodtruk",
  },
];

export { tutorialsData };
export type { Tutorial, Media };
