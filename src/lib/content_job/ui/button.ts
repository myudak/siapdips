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

function createLogoSiapDips(): HTMLImageElement {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL("icons/icon48.png");
  image.alt = "Siap Dips";
  image.width = 24;
  image.height = 24;
  image.draggable = false;
  image.style.flexShrink = "0";
  return image;
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
