// src/helper.ts
// import { BUTTONS } from "./config";
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

// QR Code Image Upload Button with jsQR scanning
function createButtons(container: HTMLElement) {
  // Create file input (hidden)
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";

  // Create upload button
  const uploadButton = document.createElement("button");
  Object.assign(uploadButton.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007AFF",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",
  });

  // Container for icon and text
  const buttonContent = document.createElement("div");
  Object.assign(buttonContent.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "opacity 0.2s",
  });

  const icon = document.createElement("span");
  icon.textContent = "📷";
  Object.assign(icon.style, { fontSize: "16px" });

  const text = document.createElement("span");
  text.textContent = "Upload QR Absen";

  buttonContent.appendChild(icon);
  buttonContent.appendChild(text);
  uploadButton.appendChild(buttonContent);

  // Loading spinner (initially hidden)
  const spinner = createSpinner();
  spinner.style.display = "none";
  uploadButton.appendChild(spinner);

  // Result display area
  const resultDiv = document.createElement("div");
  Object.assign(resultDiv.style, {
    marginTop: "12px",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
    fontSize: "14px",
    lineHeight: "1.4",
    wordBreak: "break-all",
    display: "none",
  });

  // Mouse effects
  uploadButton.addEventListener("mouseenter", () => {
    uploadButton.style.backgroundColor = "#0066DD";
    uploadButton.style.transform = "translateY(-1px)";
    uploadButton.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  });
  uploadButton.addEventListener("mouseleave", () => {
    uploadButton.style.backgroundColor = "#007AFF";
    uploadButton.style.transform = "translateY(0)";
    uploadButton.style.boxShadow = "none";
  });

  // Button click handler
  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  // File input change handler
  fileInput.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Show loading state
    uploadButton.disabled = true;
    buttonContent.style.opacity = "0";
    spinner.style.display = "block";
    resultDiv.style.display = "none";

    try {
      // Create image element
      const img = new Image();
      img.onload = () => {
        // Create canvas to get image data
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

        // Define jsQR interface
        interface JsQRCode {
          data: string;
        }

        interface WindowWithJsQR extends Window {
          jsQR?: (
            data: Uint8ClampedArray,
            width: number,
            height: number
          ) => JsQRCode | null;
        }

        if (imageData && (window as WindowWithJsQR).jsQR) {
          // Scan QR code using jsQR
          const code = (window as WindowWithJsQR).jsQR!(
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (code) {
            // QR code found
            resultDiv.innerHTML = `
              <div style="color: #28a745; font-weight: bold; margin-bottom: 8px;">✅ Done</div>
              <div style="color: #333;"><strong>Data:</strong></div>
              <div style="color: #666; margin-top: 4px;">${code.data}</div>
            `;
            resultDiv.style.backgroundColor = "#d4edda";
            resultDiv.style.borderLeft = "4px solid #28a745";

            window.open(`https://siap.undip.ac.id/a/${code.data}`, "_blank");

            // Try to navigate to the URL if it's a valid URL
            try {
              new URL(code.data); // Just validate, don't store
              setTimeout(() => {
                if (
                  confirm(
                    `Found QR code with URL: ${code.data}\n\nDo you want to navigate to this URL?`
                  )
                ) {
                  window.location.href = code.data;
                }
              }, 1000);
            } catch {
              // Not a valid URL, just show the data
            }
          } else {
            // No QR code found
            resultDiv.innerHTML = `
              <div style="color: #dc3545; font-weight: bold;">❌ No QR Code Found</div>
              <div style="color: #666; margin-top: 4px;">Please try with a clearer image or different angle.</div>
            `;
            resultDiv.style.backgroundColor = "#f8d7da";
            resultDiv.style.borderLeft = "4px solid #dc3545";
          }
        } else {
          // jsQR not available
          resultDiv.innerHTML = `
            <div style="color: #ffc107; font-weight: bold;">⚠️ QR Scanner Not Available</div>
            <div style="color: #666; margin-top: 4px;">jsQR library is not loaded.</div>
          `;
          resultDiv.style.backgroundColor = "#fff3cd";
          resultDiv.style.borderLeft = "4px solid #ffc107";
        }

        resultDiv.style.display = "block";

        // Reset button state
        uploadButton.disabled = false;
        buttonContent.style.opacity = "1";
        spinner.style.display = "none";
      };

      img.onerror = () => {
        resultDiv.innerHTML = `
          <div style="color: #dc3545; font-weight: bold;">❌ Error Loading Image</div>
          <div style="color: #666; margin-top: 4px;">Please select a valid image file.</div>
        `;
        resultDiv.style.backgroundColor = "#f8d7da";
        resultDiv.style.borderLeft = "4px solid #dc3545";
        resultDiv.style.display = "block";

        // Reset button state
        uploadButton.disabled = false;
        buttonContent.style.opacity = "1";
        spinner.style.display = "none";
      };

      // Load image
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      resultDiv.innerHTML = `
        <div style="color: #dc3545; font-weight: bold;">❌ Processing Error</div>
        <div style="color: #666; margin-top: 4px;">An error occurred while processing the image.</div>
      `;
      resultDiv.style.backgroundColor = "#f8d7da";
      resultDiv.style.borderLeft = "4px solid #dc3545";
      resultDiv.style.display = "block";

      // Reset button state
      uploadButton.disabled = false;
      buttonContent.style.opacity = "1";
      spinner.style.display = "none";
    }

    // Reset file input
    fileInput.value = "";
  });

  // Append elements to container
  container.appendChild(fileInput);
  container.appendChild(uploadButton);
  container.appendChild(resultDiv);
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
