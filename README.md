# Firefox Extension Build Instructions

This document provides step-by-step instructions to build the source code for this Firefox extension.

## Operating System and Build Environment

This project is built using Node.js and pnpm. The build process should be compatible with common operating systems including Windows, macOS, and Linux.

## Prerequisites

You need to have Node.js and pnpm installed on your system.

- **Node.js:** We recommend using Node.js version 20 or later. You can download the installer from the official Node.js website: [https://nodejs.org/](https://nodejs.org/)
- **pnpm:** Once Node.js is installed, you can install pnpm globally by running the following command in your terminal:
  ```bash
  npm install -g pnpm
  ```

## Build Instructions

Follow these steps to build the extension:

1.  **Clone the repository:** If you haven't already, clone the source code repository to your local machine.
    ```bash
    git clone <repository_url>
    ```
    Replace `<repository_url>` with the actual URL of the repository.
2.  **Navigate to the project directory:**
    ```bash
    cd siapDipss
    ```
3.  **Install dependencies:** Use pnpm to install the project dependencies.
    ```bash
    pnpm install
    ```
4.  **Build the extension:** Run the build script to generate the extension files.
    ```bash
    pnpm run build:full
    ```
    This command will build both the main extension files and the content scripts.

## Source Code

The source code for this extension is provided in its original form. Source files (aside from open-source third-party libraries located in `node_modules`) are not transpiled, concatenated, minified, or otherwise machine-generated. The build process primarily bundles the modules and prepares them for the extension environment.
