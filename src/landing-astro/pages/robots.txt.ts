import type { APIRoute } from "astro";
import { absoluteUrl } from "../../pages/landing/data/site";

// Crawlers only read robots.txt at the domain root (myudak.github.io), so this copy
// mainly documents the sitemap; submit the sitemap URL in Search Console as well.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("sitemap.xml")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
