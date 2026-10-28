# Siap Dips brand assets

The black and lavender app icon follows the reference supplied by the project owner. It was generated with the built-in imagegen tool on October 29, 2026 (`logo-brand`, reference-guided generation). No API/CLI fallback was used.

- Master: [`public/icons/logo1024.png`](../public/icons/logo1024.png).
- PNG exports: `icon16`, `icon32`, `icon48`, `icon128`, `icon180`, `icon256`, and `icon512` in `public/icons/`.
- All exports are square RGBA images with transparent outer corners, mechanically downscaled from the generated source using Pillow's Lanczos resampling. The artwork itself comes from imagegen.
- Browser toolbar and extension manifests use the small exports. The README uses 512 px, and the landing page copies the same PNG assets. Content helpers load only `icon48.png` through `chrome.runtime.getURL`; the manifest exposes that one image to HTTP(S) pages without adding site permissions.

## Final imagegen prompt

> Create a production app icon for Siap Dips based closely on the attached reference image. Preserve its exact recognizable two-part abstract S / smiling bowl silhouette: a thick soft rounded flowing S-shaped ribbon above, and a wide rounded smiling bowl below with a horizontal dark slit. Lavender, soft lilac, and periwinkle gradient on the mark. Center it within a near-black rounded square with generous smooth corners and a restrained deep purple glow near the bottom. Faithfully retain the reference composition and proportions, polished clean crisp edges and subtle material shading, minimal premium browser extension branding. Square 1024 x 1024 composition, icon fills the square with only tiny transparent outer corner area, absolutely no white canvas or border, no text, no letters added, no extra objects, no mockup, no drop shadow outside the icon. Transparent background outside the rounded black square.
