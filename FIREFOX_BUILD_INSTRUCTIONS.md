# Firefox Extension Build Instructions

This document provides step-by-step instructions to build the source code for the Firefox version of Siap Dips.

## Operating System and Build Environment

This project is built using Node.js and pnpm. The build process should work on Windows, macOS, and Linux.

## Prerequisites

You need Node.js and pnpm installed.

- Node.js: use Node.js 20 or later.
- pnpm: install it globally after Node.js is installed.

```bash
npm install -g pnpm
```

## Build Instructions

1. Clone the repository.

```bash
git clone <repository_url>
```

2. Open the project directory.

```bash
cd siapdips
```

3. Install dependencies.

```bash
pnpm install
```

4. Build the Firefox extension.

```bash
pnpm build:firefox
```

The generated extension files are written to `dist/`.

## Build And Zip For AMO

Use the package script when you need an upload-ready ZIP.

```bash
pnpm package:firefox
```

The generated ZIP is written to `release/` using this naming format:

```text
siap-dips-firefox-v<version>.zip
```

## GitHub Actions Publishing

The deploy workflow publishes an existing AMO listing with
[`wdzeng/firefox-addon`](https://github.com/marketplace/actions/publish-firefox-add-on).
It runs for manual dispatches and commits containing `[deploy]`.

Configure these repository Actions secrets:

- `FIREFOX_JWT_ISSUER`: AMO API JWT issuer
- `FIREFOX_JWT_SECRET`: AMO API JWT secret

The add-on GUID is read from
`src/manifest-firefox.json` (`browser_specific_settings.gecko.id`). The workflow
also uploads a source archive generated from the exact Git commit submitted to
AMO, together with these build instructions.

## Source Code

The source code is provided in its original form. Source files are not manually minified or pre-generated. The build process bundles modules and prepares browser-specific extension output from the source manifests.
