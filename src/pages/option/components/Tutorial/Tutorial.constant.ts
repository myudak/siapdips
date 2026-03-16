type Media = {
  type: "video" | "image" | "text";
  src?: string;
  content?: string;
};

type Tutorial = {
  id: number;
  title: string;
  description: string;
  category: "core" | "automation" | "academic";
  media: Media[];
  hash: string;
  ref?: React.RefObject<HTMLDivElement>;
};

const tutorialsData = [
  {
    id: 1,
    title: "Ipk Status",
    description: "Ubah tampilan IPK/status jadi lebih fleksibel di halaman utama.",
    category: "core",
    media: [{ type: "video", src: "video/vid-ipk.mp4" }] as Media[],
    hash: "IpkStatus",
  },
  {
    id: 2,
    title: "Theme",
    description: "Aktifin dark mode dan tampilan visual biar situs Undip lebih enak dipakai.",
    category: "core",
    media: [{ type: "video", src: "video/Vid-Theme.mp4" }] as Media[],
    hash: "Theme",
  },
  {
    id: 3,
    title: "Auto PBM",
    description: "Bantu isi evaluasi PBM lebih cepet kalau emang itu flow yang lagi dipakai.",
    category: "academic",
    media: [{ type: "video", src: "video/Vid-Pbm.mp4" }] as Media[],
    hash: "Autopbm",
  },
  {
    id: 4,
    title: "Enable Click Kanan",
    description: "Ngebalikin right click, copy, inspect, dan interaksi dasar yang sering diblok.",
    category: "core",
    media: [{ type: "video", src: "video/Vid-Klikkanan.mp4" }] as Media[],
    hash: "EnableClickKanan",
  },
  {
    id: 5,
    title: "Jadwal Dips",
    description: "Lihat flow helper jadwal buat parsing dan ngerapihin jadwal kuliah.",
    category: "academic",
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
    description: "Flow otomatis untuk LearnSocial yang masih relevan di setup sekarang.",
    category: "automation",
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
    description: "Versi tutorial lama buat referensi kalau masih nemu flow lama.",
    category: "automation",
    media: [{ type: "video", src: "video/vid-learnsocialold.mp4" }] as Media[],
    hash: "autolearnsocialold",
  },
  {
    id: 8,
    title: "FoodTruk Helper",
    description: "Auto scroll, auto lokasi, dan refresh opsional buat flow FoodTruk.",
    category: "automation",
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
