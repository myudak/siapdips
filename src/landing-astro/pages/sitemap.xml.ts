import type { APIRoute } from "astro";
import { absoluteUrl } from "../../pages/landing/data/site";
import { tutorials } from "../../pages/landing/data/tutorials";

export const GET: APIRoute = () => {
  const paths = ["", "tutorial/", ...tutorials.map((t) => `tutorial/${t.slug}/`)];
  const urls = paths
    .map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
