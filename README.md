# Siap Dips

Siap Dips is a browser extension for students at Universitas Diponegoro. It smooths out the daily campus portal routine: SIAP, Kulon/Moodle, LearnSocial, forms, schedules, IPK tracking, local todos, Todoist sync, and a few focused helpers for pages that students actually use.

It is built with React, TypeScript, Vite, Astro for the public landing page, and browser extension APIs.

## Install

- [Chrome Web Store](https://chromewebstore.google.com/detail/siap-dips-your-campus-com/inpmbpkngacgeljphlapgdgdjmoffild)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/siap-dips/)
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/siap-dips-your-campus-co/hlmmkdnclolciolbhaacjmphkmbceopl)

## Features

- SIAP Undip enhancements, including themes, privacy blur, schedule parsing, and IPK tools.
- Kulon/Moodle helper for quiz and assignment workflows.
- New tab dashboard for cached Kulon assignments and local todos.
- Optional Todoist sync using the user's own Todoist API token.
- LearnSocial and Oracle Academy helper overlays.
- QR attendance helper.
- PBM and Food Truck form helpers.
- Dyandra Loket watcher helper.
- SEB config hash helper with Chromium header rewrite support.
- Job application tracker and form watcher utilities.

## Development

Use pnpm.

```bash
pnpm install
```

Run the extension popup/options dev server:

```bash
pnpm dev
```

Build browser targets:

```bash
pnpm build:chrome
pnpm build:firefox
pnpm build:edge
```

Build the Astro marketing landing page:

```bash
pnpm build:landing
```

Preview the landing page locally:

```bash
pnpm dev:landing
```

## Versioning

Keep `package.json`, browser manifests, `package-lock.json`, and app-visible constants synced with the release tooling.

```bash
pnpm version:status
pnpm version:check
pnpm version:sync
pnpm version:set 1.4.970
pnpm version:patch
pnpm version:minor
pnpm version:major
pnpm version:build
```

`version:sync`, `version:set`, and all bump commands also update `src/constants/storage.ts` so the option page displays the same version and latest update date.

## Packaging

Build and zip upload-ready extension packages:

```bash
pnpm package:firefox
pnpm package:chrome
pnpm package:edge
pnpm package:all
```

Release ZIPs are written to `release/`.

Skip rebuilding and zip the current `dist/` contents:

```bash
pnpm package:firefox -- --no-build
```

## Project Layout

- `src/pages/main`: extension popup.
- `src/pages/option`: options page.
- `src/pages/job`: job tracker page.
- `src/pages/landing`: React landing page components rendered by Astro.
- `src/landing-astro`: Astro SEO shell for the public landing page.
- `src/background`: background service worker features and listeners.
- `src/lib/content_*`: domain-specific content helper modules.
- `src/manifest-*.json`: browser-specific manifest templates.
- `scripts`: release, packaging, and maintenance scripts.

## Firefox Source Build Notes

Firefox-specific build instructions for reviewers live in [FIREFOX_BUILD_INSTRUCTIONS.md](./FIREFOX_BUILD_INSTRUCTIONS.md).

## Data And Privacy

Most settings and cache data live in browser extension storage. Todoist and AI integrations are optional and only run when users configure their own tokens or provider settings. The extension does not require a developer-owned backend for normal use.
