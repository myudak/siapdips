import { TRACKER_BUTTON_ID } from "../constants";

/**
 * Creates and injects the tracker button onto the page.
 * @param {Function} onClick - The function to call when the button is clicked.
 */
export function createTrackerButton(onClick: () => void) {
  if (document.getElementById(TRACKER_BUTTON_ID)) {
    return;
  }

  const button = document.createElement("button");
  button.id = TRACKER_BUTTON_ID;

  const logoSiapDips = createLogoSiapDips();
  button.appendChild(logoSiapDips);

  // Enhanced styling with  animations
  Object.assign(button.style, {
    position: "fixed",
    bottom: "110px",
    right: "20px",
    zIndex: "9999",
    width: "60px",
    height: "60px",
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: "0",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(26, 115, 232, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "scale(1)",
    backgroundImage: "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
    outline: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  });

  // Add idle pulse animation
  addIdlePulseAnimation(button);

  // Add hover effects
  button.addEventListener("mouseenter", () => {
    Object.assign(button.style, {
      transform: "scale(1.1)",
      boxShadow: "0 8px 25px rgba(26, 115, 232, 0.4)",
      backgroundImage: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    });
    button.style.animationPlayState = "paused";
  });

  button.addEventListener("mouseleave", () => {
    Object.assign(button.style, {
      transform: "scale(1)",
      boxShadow: "0 6px 20px rgba(26, 115, 232, 0.3)",
      backgroundImage: "linear-gradient(135deg, #1a73e8 0%, #4285f4 100%)",
    });
    button.style.animationPlayState = "running";
  });

  // Add click animation
  button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)";
  });

  button.addEventListener("mouseup", () => {
    button.style.transform = button.matches(":hover")
      ? "scale(1.1)"
      : "scale(1)";
  });

  // Add ripple effect on click
  button.addEventListener("click", (e) => {
    createRippleEffect(button, e);
    onClick();
  });

  document.body.appendChild(button);
}

/**
 * Removes the tracker button from the page.
 */
export function removeTrackerButton() {
  const button = document.getElementById(TRACKER_BUTTON_ID);
  if (button) {
    button.remove();
  }
}

function createLogoSiapDips(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 283.46 283.46");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");

  // Add subtle drop shadow and white stroke for better contrast
  Object.assign(svg.style, {
    filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
    transition: "transform 0.2s ease-in-out",
  });

  // First path
  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "m94.86,34.25l1.76,30.39c-8.19-.18-14.5-.15-18.92.09-14.12.82-21.15,6.09-21.11,15.79.05,9.27,7.4,13.87,22.06,13.8,7.22-.04,14.6-1.8,22.13-5.28,4.84-2.29,11.88-6.91,21.12-13.85l22.56-15.31c12.25-8.25,22.41-14.18,30.48-17.78,11.08-4.9,21.96-7.38,32.63-7.43,14.01-.07,25.24,3.65,33.69,11.16,9.42,8.25,14.16,19.55,14.23,33.89.07,14.66-5.16,25.68-15.69,33.06-8.17,5.86-19.04,8.93-32.62,9.21-1.08,0-4.8.02-11.16.05l-3.22-30.22c9.59-.05,16.33-.35,20.21-.91,9.26-1.34,13.88-5.62,13.84-12.84-.04-8.63-6.96-12.9-20.76-12.83-7.76.04-14.92,1.85-21.48,5.44-3.98,2.18-12.52,7.66-25.63,16.46l-22.73,15.63c-21.49,14.87-42.21,22.36-62.15,22.46-11.86.06-21.57-2.43-29.14-7.46-11.25-7.38-16.91-19.75-17-37.11-.08-16.39,5.47-28.7,16.64-36.95,5.91-4.45,12.2-7.28,18.88-8.5,5.38-.89,11.96-1.35,19.72-1.39,3.56-.02,7.44.13,11.65.43Z"
  );
  path1.setAttribute("stroke", "rgba(255, 255, 255, 0.9)");
  path1.setAttribute("fill", "none");
  path1.setAttribute("stroke-width", "12");
  path1.setAttribute("stroke-linecap", "round");
  path1.setAttribute("stroke-linejoin", "round");

  // Second path
  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute(
    "d",
    "m252.41,161.34l.16,32.99c1.47,35.68-15.37,53.92-50.51,54.74l-119.17.58c-35.15-.48-52.16-18.56-51.04-54.25l-.16-32.99,220.72-1.07Zm-191.95,31.82l.02,3.88c.04,9.06,2.07,15.14,6.07,18.24,3.03,2.25,8.42,3.41,16.19,3.48l119.17-.58c8.84-.15,14.81-2.01,17.92-5.58,2.68-3.25,4.05-8.7,4.13-16.35l-.02-3.88-163.48.79Z"
  );
  path2.setAttribute("stroke", "rgba(255, 255, 255, 0.9)");
  path2.setAttribute("fill", "none");
  path2.setAttribute("stroke-width", "12");
  path2.setAttribute("stroke-linecap", "round");
  path2.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path1);
  svg.appendChild(path2);

  return svg;
}

/**
 * Adds idle pulse animation to the button
 */
function addIdlePulseAnimation(button: HTMLButtonElement) {
  const keyframes = `
    @keyframes siap-dips-pulse {
      0% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.3);
      }
      50% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.5);
      }
      100% {
        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.3);
      }
    }
  `;

  // Create and inject keyframes
  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);

  // Apply animation
  button.style.animation = "siap-dips-pulse 2s ease-in-out infinite";
}

/**
 * Creates a ripple effect on button click
 */
function createRippleEffect(button: HTMLButtonElement, event: MouseEvent) {
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  Object.assign(ripple.style, {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "50%",
    transform: "scale(0)",
    animation: "siap-dips-ripple 0.6s ease-out",
    pointerEvents: "none",
  });

  // Add ripple keyframes
  const rippleKeyframes = `
    @keyframes siap-dips-ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = rippleKeyframes;
  document.head.appendChild(style);

  // Set button to relative position for ripple positioning
  button.style.position = "fixed";
  button.style.overflow = "hidden";

  button.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}
