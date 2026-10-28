export const SITE_ORIGIN = "https://myudak.github.io";
export const SITE_NAME = "Siap Dips";
export const GITHUB_URL = "https://github.com/myudak/siapdips";
export const PRIVACY_URL = `${GITHUB_URL}/blob/main/PRIVACY.md`;
export const ISSUES_URL = `${GITHUB_URL}/issues`;

const landingBase = `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/`;

/** Path under the site base, e.g. landingPath("tutorial/") -> "/siapdips/tutorial/". */
export const landingPath = (path = "") =>
  `${landingBase}${path.replace(/^\/+/, "")}`;

/** Absolute URL for canonical links, sitemap and structured data. */
export const absoluteUrl = (path = "") =>
  new URL(landingPath(path), SITE_ORIGIN).toString();

export const tutorialPath = (slug: string) => landingPath(`tutorial/${slug}/`);

export type StoreLink = {
  id: "chrome" | "firefox" | "edge";
  name: string;
  label: string;
  href: string;
  icon: string;
};

export const storeLinks: StoreLink[] = [
  {
    id: "chrome",
    name: "Chrome Web Store",
    label: "Install di Chrome",
    href: "https://chromewebstore.google.com/detail/siap-dips-your-campus-com/inpmbpkngacgeljphlapgdgdjmoffild",
    icon: landingPath("images/chrome-store.png"),
  },
  {
    id: "firefox",
    name: "Firefox Add-ons",
    label: "Install di Firefox",
    href: "https://addons.mozilla.org/en-US/firefox/addon/siap-dips/",
    icon: landingPath("images/firefox-addons.jpg"),
  },
  {
    id: "edge",
    name: "Microsoft Edge Add-ons",
    label: "Install di Edge",
    href: "https://microsoftedge.microsoft.com/addons/detail/siap-dips-your-campus-co/hlmmkdnclolciolbhaacjmphkmbceopl",
    icon: landingPath("images/edge.png"),
  },
];

export const chromeStore = storeLinks[0];

export type Screen = {
  src: string;
  small: string;
  alt: string;
};

const screen = (name: string, alt: string): Screen => ({
  src: landingPath(`images/screens/${name}.webp`),
  small: landingPath(`images/screens/${name}-768.webp`),
  alt,
});

export const screens = {
  popupDashboard: screen(
    "popup-siap-dashboard",
    "Popup Siap Dips berisi Quick Access dan IPK Status, terbuka di atas dashboard SIAP mode gelap",
  ),
  kulonDark: screen(
    "kulon-dark-mode",
    "Halaman My courses Kulon Undip dengan tema gelap dari Siap Dips",
  ),
  popupLainnya: screen(
    "popup-lainnya-pbm",
    "Kartu Lainnya dengan toggle Hide pop up SSO, Enable klik kanan Copy, dan Blur Dosen Wali, serta kartu Auto PBM",
  ),
  templatePbm: screen(
    "template-pbm",
    "Halaman Template PBM di pengaturan Siap Dips untuk memilih jawaban default tiap pertanyaan",
  ),
  pbmPanel: screen(
    "pbm-auto-panel",
    "Panel Siap Dips di halaman Evaluasi PBM SIAP dengan tombol Auto This, Auto All, Auto Submit, dan Clear",
  ),
};

export type Video = {
  src: string;
  poster: string;
  label: string;
};

export const video = (file: string, label: string): Video => ({
  src: landingPath(`video/${file}.mp4`),
  poster: landingPath(`posters/${file}.webp`),
  label,
});

// All feature clips were first published in the repo on this date (git history).
export const VIDEO_UPLOAD_DATE = "2025-09-03";
