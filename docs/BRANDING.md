# Siap Dips brand assets

The black and lavender app icon follows the reference supplied by the project owner. It was generated with the built-in imagegen tool on October 29, 2026 (`logo-brand`, reference-guided generation). No API/CLI fallback was used.

- Master: [`public/icons/logo1024.png`](../public/icons/logo1024.png).
- PNG exports: `icon16`, `icon32`, `icon48`, `icon128`, `icon180`, `icon256`, and `icon512` in `public/icons/`.
- All exports are square RGBA images with transparent outer corners, mechanically downscaled from the generated source using Pillow's Lanczos resampling. The artwork itself comes from imagegen.
- Browser toolbar and extension manifests use the small exports. The README uses 512 px, and the landing page copies the same PNG assets. Content helpers load only `icon48.png` through `chrome.runtime.getURL`; the manifest exposes that one image to HTTP(S) pages without adding site permissions.

## Final imagegen prompt

> Create a production app icon for Siap Dips based closely on the attached reference image. Preserve its exact recognizable two-part abstract S / smiling bowl silhouette: a thick soft rounded flowing S-shaped ribbon above, and a wide rounded smiling bowl below with a horizontal dark slit. Lavender, soft lilac, and periwinkle gradient on the mark. Center it within a near-black rounded square with generous smooth corners and a restrained deep purple glow near the bottom. Faithfully retain the reference composition and proportions, polished clean crisp edges and subtle material shading, minimal premium browser extension branding. Square 1024 x 1024 composition, icon fills the square with only tiny transparent outer corner area, absolutely no white canvas or border, no text, no letters added, no extra objects, no mockup, no drop shadow outside the icon. Transparent background outside the rounded black square.

## Toolbar variant (v1.5.2)

The browser action uses a dedicated transparent glyph, with the lavender symbol filling almost the whole width. Removing the dark tile and its internal padding makes the symbol larger within Chrome's fixed 16-DIP toolbar slot. Exports at 16, 20, 24, 32, 48, and 128 px cover different display scales; these pixel dimensions do not enlarge the browser-controlled slot. See [Chrome's action icon documentation](https://developer.chrome.com/docs/extensions/reference/api/action#icon).

Master: [`public/icons/toolbar1024.png`](../public/icons/toolbar1024.png). The `action.default_icon` entries in all three manifests use the toolbar exports; the app and README retain the rounded-square artwork.

This variant was edited with built-in imagegen from `logo1024.png`, then mechanically downscaled with Lanczos resampling. Its final prompt was:

> Using the reference solely for its two-part silhouette, create a CLEAN FLAT toolbar icon: a thick flowing rounded S ribbon on top, and a wide shallow rounded smiling bowl below with one long horizontal opening. Both shapes have a smooth simple lavender-to-periwinkle gradient. Pure clean graphic shapes, no texture, no bevels, no gloss, no lighting, no white highlights, no white outlines. Remove the black rounded-square tile completely. Transparent background everywhere outside the two shapes, and transparency inside every opening including the smile slit. No white patches, no speckles, no tiny particles, no shadows, no glow, no backdrop, no text. Keep the same purple S-and-bowl brand identity. Center the symbol on a square transparent canvas and enlarge it to occupy 96 percent of canvas width, preserving the full silhouette and its proportions. Crisp, solid contours suitable for a browser toolbar at 16 pixels. The output must contain exactly the two smooth purple shapes and nothing else.
