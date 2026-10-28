// src/helper.ts
import { BUTTONS } from "./config";
import { Draggable } from "./draggable";

export function createHelper(): HTMLElement {
  const helper = document.createElement("div");
  Object.assign(helper.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "320px",
    minHeight: "200px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    padding: "16px",
    zIndex: "9999",
    resize: "both",
    overflow: "auto",
    border: "1px solid rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    transition: "box-shadow 0.3s ease",
    transform: "translate(0, 0)",
  });

  // Header
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    userSelect: "none",
    padding: "4px 4px 12px 4px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
  });

  // Title container (logos + text) - this will be the drag handle
  const titleContainer = document.createElement("div");
  Object.assign(titleContainer.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "move",
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "background-color 0.2s ease",
  });

  // Create logo SVGs (split into helper functions)
  const logoSiapDips = createLogoSiapDips();
  const logoMyudak = createLogoMyudak();

  // Title text
  const titleText = document.createElement("span");
  titleText.textContent = "Siap Dipss";
  Object.assign(titleText.style, {
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "default",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  // Close button with mobile-friendly touch targets
  const closeButton = document.createElement("button");
  Object.assign(closeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "16px",
    transition: "all 0.2s ease",
    minWidth: "44px",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  closeButton.textContent = "✕";
  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f5f5f5";
    closeButton.style.color = "#333";
  });
  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });
  closeButton.addEventListener("click", () => helper.remove());

  // Create minimize button with mobile-friendly touch targets
  const minimizeButton = document.createElement("button");
  Object.assign(minimizeButton.style, {
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#666",
    fontSize: "16px",
    transition: "all 0.2s ease",
    marginRight: "8px",
    minWidth: "44px",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  minimizeButton.textContent = "▼";
  minimizeButton.title = "Minimize";

  minimizeButton.addEventListener("mouseenter", () => {
    minimizeButton.style.backgroundColor = "#f5f5f5";
    minimizeButton.style.color = "#333";
  });
  minimizeButton.addEventListener("mouseleave", () => {
    minimizeButton.style.backgroundColor = "transparent";
    minimizeButton.style.color = "#666";
  });

  // Store original styles for restoring later
  const originalStyles = {
    width: helper.style.width,
    minHeight: helper.style.minHeight,
    padding: helper.style.padding,
    borderRadius: helper.style.borderRadius,
    resize: helper.style.resize,
  };

  let isMinimized = false;
  minimizeButton.addEventListener("click", () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      // Minimize the helper - just hide content, keep header
      content.style.display = "none";
      helper.style.minHeight = "auto";
      helper.style.resize = "none";
      minimizeButton.textContent = "▲";
      minimizeButton.title = "Maximize";
    } else {
      // Restore the helper
      content.style.display = "grid";
      helper.style.minHeight = originalStyles.minHeight;
      helper.style.resize = originalStyles.resize;
      minimizeButton.textContent = "▼";
      minimizeButton.title = "Minimize";
    }
  });

  // Assemble header
  titleContainer.appendChild(logoSiapDips);
  titleContainer.appendChild(logoMyudak);
  titleContainer.appendChild(titleText);
  header.appendChild(titleContainer);
  header.appendChild(minimizeButton);
  header.appendChild(closeButton);
  helper.appendChild(header);

  // Content container for buttons
  const content = document.createElement("div");
  Object.assign(content.style, {
    minHeight: "100px",
    width: "100%",
    display: "grid",
    gap: "12px",
    padding: "8px 0",
  });
  helper.appendChild(content);

  // Enable dragging for the helper using the title container as the handle.
  new Draggable({ element: helper, handle: titleContainer });

  // Create buttons in the content area.
  createButtons(content);

  // Append helper to the document body.
  document.body.appendChild(helper);
  return helper;
}

function createLogoSiapDips(): HTMLImageElement {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL("icons/icon48.png");
  image.alt = "Siap Dips";
  image.width = 20;
  image.height = 20;
  image.draggable = false;
  image.style.flexShrink = "0";
  return image;
}

function createLogoMyudak(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 595.28 595.28");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  Object.assign(svg.style, { cursor: "pointer" });

  const polygons = [
    "206.43 406.96 297.66 564.99 297.65 565.01 115 565.01 206.32 406.83 206.34 406.8 206.43 406.96",
    "571.62 90.47 480.3 248.65 388.99 406.8 297.75 248.78 297.66 248.63 388.97 90.47 571.62 90.47",
    "297.65 248.65 115 248.65 23.67 90.47 206.32 90.47 297.65 248.65",
  ];

  polygons.forEach((points) => {
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", points);
    polygon.setAttribute("fill", "currentColor");
    svg.appendChild(polygon);
  });
  return svg;
}

// Updated createButtons function that supports custom actions per button.
function createButtons(container: HTMLElement) {
  BUTTONS.forEach((btn) => {
    const button = document.createElement("button");
    Object.assign(button.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 16px",
      border: btn.primary ? "none" : "1px solid #e0e0e0",
      borderRadius: "8px",
      backgroundColor: btn.primary ? "#007AFF" : "#ffffff",
      color: btn.primary ? "#ffffff" : "#333333",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: "relative",
    });

    // Container for icon and text.
    const buttonContent = document.createElement("div");
    Object.assign(buttonContent.style, {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "opacity 0.2s",
    });

    const icon = document.createElement("span");
    icon.textContent = btn.icon;
    Object.assign(icon.style, { fontSize: "16px" });

    const text = document.createElement("span");
    text.textContent = btn.text;

    buttonContent.appendChild(icon);
    buttonContent.appendChild(text);
    button.appendChild(buttonContent);

    // Loading spinner element (initially hidden)
    const spinner = createSpinner();
    spinner.style.display = "none";
    button.appendChild(spinner);

    // Mouse effects
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = btn.primary ? "#0066DD" : "#f5f5f5";
      button.style.transform = "translateY(-1px)";
      button.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = btn.primary ? "#007AFF" : "#ffffff";
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "none";
    });

    // Button click handler with custom action and loading state.
    button.addEventListener("click", async () => {
      button.disabled = true;
      buttonContent.style.opacity = "0";
      spinner.style.display = "block";

      if (btn.action) {
        await btn.action();
        await new Promise((resolve) => setTimeout(resolve, 900));
      } else {
        // Default loading simulation if no action is provided.
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(`${btn.text} clicked`);
      }

      button.disabled = false;
      buttonContent.style.opacity = "1";
      spinner.style.display = "none";
    });

    container.appendChild(button);
  });
}

// Creates a spinner SVG element with a CSS spin animation.
function createSpinner(): SVGSVGElement {
  const spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  spinner.setAttribute("viewBox", "0 0 24 24");
  spinner.setAttribute("width", "16");
  spinner.setAttribute("height", "16");

  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", "12");
  circle.setAttribute("cy", "12");
  circle.setAttribute("r", "8");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-width", "2");
  circle.setAttribute("fill", "none");

  spinner.appendChild(circle);
  spinner.style.animation = "spin 1s linear infinite";
  return spinner;
}

export function injectGlobalStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .dragging {
      user-select: none;
      cursor: move;
    }
  `;
  document.head.appendChild(style);
}
