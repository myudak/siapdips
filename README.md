<div align="center">
  <img src="public/icons/icon128.png" alt="Siap Dips Logo" width="128" />

  <h1>Siap Dips</h1>

  <p>
    <strong>The essential browser companion for Universitas Diponegoro students.</strong><br />
    Streamlining SIAP, Kulon, schedules, IPK tracking, and more into one lightweight extension.
  </p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![Astro](https://img.shields.io/badge/Astro-FF7E33?style=for-the-badge&logo=astro&logoColor=white)](#)

  <br />

  ### 📥 Install Extension

  <a href="https://chromewebstore.google.com/detail/siap-dips-your-campus-com/inpmbpkngacgeljphlapgdgdjmoffild">
    <img src="public\images\chrome-store.png" height="50" alt="Available in the Chrome Web Store" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://addons.mozilla.org/en-US/firefox/addon/siap-dips/">
    <img src="public\images\firefox-addons.jpg" height="50" alt="Get it on Firefox Add-ons" style="border-radius: 4px;" />
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://microsoftedge.microsoft.com/addons/detail/siap-dips-your-campus-co/hlmmkdnclolciolbhaacjmphkmbceopl">
    <img src="public\images\edge.png" height="50" alt="Get it on Edge Add-ons" />
  </a>

  <br /><br />
</div>

---

## ✨ Features

**🎓 Academic & Portal Support**
- **SIAP Undip Enhancements:** Dark mode, privacy blur, smart schedule parsing, and visual IPK tracking.
- **Kulon / Moodle Assistant:** Streamlines quiz and assignment workflows so you miss fewer deadlines.
- **Course Overlays:** Dedicated helpers for LearnSocial and Oracle Academy to speed up interactions.

**⚡ Productivity & Automation**
- **Custom New Tab Dashboard:** Replaces your new tab with cached Kulon assignments and quick local to-dos.
- **Todoist Sync:** Optionally connects with your Todoist API token to keep your campus tasks synced.
- **Form Helpers:** Auto-fills repetitive, high-friction forms (e.g., PBM, Food Truck, QR attendance).
- **Event Watchers:** Dyandra Loket watcher and job application tracking utilities.
- **SEB Config Helper:** Hash helper with Chromium header rewrite support.

---

## 🛠️ Development

This project uses `pnpm` as its package manager.

```bash
# Install dependencies
pnpm install
```

### Dev Server
Run the extension popup and options page locally in your browser:
```bash
pnpm dev
```

### Building the Extension
Compile production-ready targets for specific browsers. Outputs will be generated in the `dist/` directory.
```bash
pnpm build:chrome
pnpm build:firefox
pnpm build:edge
```

### Landing Page
The marketing site is built with Astro.
```bash
pnpm dev:landing    # Start local preview
pnpm build:landing  # Compile static site
```

---

## 📦 Packaging & Release

We use dedicated scripts to manage zip creation and versioning. Release ZIPs are written to the `release/` folder.

**Create Upload-Ready Packages:**
```bash
pnpm package:firefox
pnpm package:chrome
pnpm package:edge
pnpm package:all
```
*(Tip: Add `--no-build` to package the current `dist/` folder without recompiling).*

**Versioning:**
Ensure `package.json`, browser manifests, and app-visible constants stay in sync:
```bash
pnpm version:status
pnpm version:patch
pnpm version:minor
pnpm version:major
```
*(These commands automatically update `src/constants/storage.ts` so the options page reflects the correct version).*

---

## 📂 Project Layout

| Directory / File | Description |
| ---------------- | ----------- |
| `src/pages/main` | Extension popup UI |
| `src/pages/option` | Extension settings/options page |
| `src/pages/job` | Job tracker utility page |
| `src/background` | Background service worker, listeners, and core logic |
| `src/lib/content_*` | Domain-specific content scripts (SIAP, Kulon, etc.) |
| `src/manifest-*.json` | Browser-specific manifest configuration templates |
| `src/pages/landing` | React components for the marketing site |
| `src/landing-astro` | Astro SEO shell wrapping the React landing page |
| `scripts/` | Maintenance, release, and build pipeline scripts |

> **Note:** Firefox-specific build instructions for Mozilla reviewers live in [`FIREFOX_BUILD_INSTRUCTIONS.md`](./FIREFOX_BUILD_INSTRUCTIONS.md).

---

## 🔒 Data & Privacy Promise

Your data is yours.
Most settings, cached assignments, and local to-dos live entirely in your browser's local extension storage. Third-party integrations (like Todoist or AI assistants) are strictly **optional** and only activate when you explicitly configure your own API tokens.

**Siap Dips does not require a developer-owned backend server to function.**
