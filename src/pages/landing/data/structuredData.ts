import { changelogEntries } from "../../../constants/changelog";
import { plainText } from "./text";
import { faqItems } from "./faq";
import {
  GITHUB_URL,
  SITE_NAME,
  SITE_ORIGIN,
  VIDEO_UPLOAD_DATE,
  absoluteUrl,
  chromeStore,
  storeLinks,
} from "./site";
import type { Tutorial } from "./tutorials";

const author = { "@type": "Person", name: "myudak", url: GITHUB_URL };
const toAbsolute = (path: string) => new URL(path, SITE_ORIGIN).toString();

export const homeJsonLd = (description: string) => [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(),
    inLanguage: "id",
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome, Firefox, Microsoft Edge",
    description,
    url: absoluteUrl(),
    image: absoluteUrl("og-image.png"),
    installUrl: chromeStore.href,
    downloadUrl: storeLinks.map((store) => store.href),
    softwareVersion: changelogEntries[0].version.replace(/^v/, ""),
    inLanguage: "id",
    author,
    offers: { "@type": "Offer", price: "0", priceCurrency: "IDR" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const tutorialJsonLd = (tutorial: Tutorial, path: string) => {
  const url = absoluteUrl(path);
  const image = tutorial.screen
    ? toAbsolute(tutorial.screen.src)
    : tutorial.video
      ? toAbsolute(tutorial.video.poster)
      : absoluteUrl("og-image.png");

  return [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: tutorial.title,
      description: tutorial.description,
      inLanguage: "id",
      totalTime: `PT${tutorial.minutes}M`,
      image,
      ...(tutorial.video
        ? {
            video: {
              "@type": "VideoObject",
              name: tutorial.video.label,
              description: tutorial.description,
              thumbnailUrl: toAbsolute(tutorial.video.poster),
              contentUrl: toAbsolute(tutorial.video.src),
              uploadDate: VIDEO_UPLOAD_DATE,
            },
          }
        : {}),
      step: tutorial.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.title,
        text: plainText(step.body),
        url: `${url}#langkah-${index + 1}`,
      })),
    },
    breadcrumbJsonLd([
      { name: "Beranda", path: "" },
      { name: "Tutorial", path: "tutorial/" },
      { name: tutorial.name, path },
    ]),
  ];
};
