import { TRACKER_MODAL_ID } from "../constants";

/**
 * Closes a modal with animation
 */
function closeModal(modalElement: HTMLElement) {
  const backdrop = document.getElementById(`${TRACKER_MODAL_ID}-backdrop`);
  const modal = modalElement.querySelector("div") as HTMLElement;

  if (modal) {
    modal.style.transform = "scale(0.7) translateY(-50px)";
    modal.style.opacity = "0";
  }

  if (backdrop) {
    backdrop.style.opacity = "0";
  }

  setTimeout(() => {
    modalElement.remove();
    backdrop?.remove();
  }, 300);
}

/**
 * Adds modal animation keyframes to the document
 */
function addModalAnimations() {
  const existingStyle = document.getElementById("modal-animations");
  if (existingStyle) return;

  const style = document.createElement("style");
  style.id = "modal-animations";
  style.textContent = `
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.7) translateY(-50px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes modalFadeOut {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      to {
        opacity: 0;
        transform: scale(0.7) translateY(-50px);
      }
    }
    
    @keyframes backdropFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes backdropFadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Shows a modal with the extracted job data and options to save or cancel.
 * @param {Object} jobData - The job data to display.
 * @param {Function} onSave - The function to call when the save button is clicked.
 */
export function showTrackerModal(
  jobData: any,
  onSave: (updatedData: any) => void
) {
  // Remove existing modal if any
  const existingModal = document.getElementById(TRACKER_MODAL_ID);
  if (existingModal) {
    closeModal(existingModal);
    return;
  }

  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.id = `${TRACKER_MODAL_ID}-backdrop`;
  Object.assign(backdrop.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
    backdropFilter: "blur(2px)",
  });

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = TRACKER_MODAL_ID;
  Object.assign(modalContainer.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "10000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  });

  // Create modal content
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
    transform: "scale(0.7) translateY(-50px)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    opacity: "0",
    position: "relative",
  });

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "32px",
    height: "32px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "24px",
    cursor: "pointer",
    borderRadius: "50%",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    zIndex: "1",
  });

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f5f5f5";
    closeButton.style.color = "#333";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });

  // Create content
  const content = document.createElement("div");
  content.style.padding = "24px";

  let modalContent = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
      <div id="logo-container" style="flex-shrink: 0;"></div>
      <h2 style="margin: 0; color: #1a73e8; font-size: 24px; font-weight: 600;">
        Track Job Application
      </h2>
    </div>
    
    <div id="job-tracker-form">
  `;
  for (const key in jobData) {
    if (key === "status") continue;
    modalContent += `
      <div style="margin-bottom: 16px;">
        <label for="${key}" style="display: block; margin-bottom: 8px; font-weight: 500; color: #374151; font-size: 14px;">
          ${key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
        <input type="text" id="${key}" name="${key}" value="${jobData[key]}" 
               style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; 
                      font-size: 14px; transition: border-color 0.2s ease; box-sizing: border-box;
                      outline: none;" 
               onfocus="this.style.borderColor='#1a73e8'; this.style.boxShadow='0 0 0 3px rgba(26, 115, 232, 0.1)'"
               onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
      </div>
    `;
  }

  modalContent += `
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 32px;">
      <button id="cancel-track" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: 2px solid #e5e7eb; 
        background-color: #f9fafb; 
        color: #374151;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
      ">Cancel</button>
      <button id="save-track" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: none; 
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
        color: white; 
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
      ">Save</button>
    </div>
  `;

  content.innerHTML = modalContent;

  // Add the SiapDips logo
  const logoContainer = content.querySelector("#logo-container");
  if (logoContainer) {
    const logo = createLogoSiapDips();
    logoContainer.appendChild(logo);
  }

  modal.appendChild(closeButton);
  modal.appendChild(content);
  modalContainer.appendChild(modal);

  // Add to DOM
  document.body.appendChild(backdrop);
  document.body.appendChild(modalContainer);

  // Add animations and styles
  addModalAnimations();

  // Trigger entrance animation
  requestAnimationFrame(() => {
    backdrop.style.opacity = "1";
    modal.style.transform = "scale(1) translateY(0)";
    modal.style.opacity = "1";
  });

  // Enhanced button hover effects
  const cancelBtn = document.getElementById("cancel-track");
  const saveBtn = document.getElementById("save-track");

  if (cancelBtn) {
    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.backgroundColor = "#f3f4f6";
      cancelBtn.style.borderColor = "#d1d5db";
    });
    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.backgroundColor = "#f9fafb";
      cancelBtn.style.borderColor = "#e5e7eb";
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener("mouseenter", () => {
      saveBtn.style.transform = "translateY(-1px)";
      saveBtn.style.boxShadow = "0 4px 12px rgba(26, 115, 232, 0.4)";
    });
    saveBtn.addEventListener("mouseleave", () => {
      saveBtn.style.transform = "translateY(0)";
      saveBtn.style.boxShadow = "0 2px 8px rgba(26, 115, 232, 0.3)";
    });
  }

  // Event listeners
  const closeModalHandler = () => closeModal(modalContainer);

  closeButton.addEventListener("click", closeModalHandler);

  // Click outside to close
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModalHandler();
    }
  });

  // Escape key to close
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModalHandler();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  cancelBtn?.addEventListener("click", closeModalHandler);

  saveBtn?.addEventListener("click", () => {
    const updatedData = { ...jobData };
    const inputs = document.querySelectorAll("#job-tracker-form input");
    inputs.forEach((input) => {
      const key = (input as HTMLInputElement).name;
      updatedData[key] = (input as HTMLInputElement).value;
    });
    onSave(updatedData);
    closeModalHandler();
  });
}

/**
 * Shows a warning modal if a job with the same URL is already tracked.
 * @param {Function} onConfirm - The function to call if the user confirms to track anyway.
 */
export function showDuplicateWarningModal(onConfirm: () => void) {
  const modalId = "duplicate-warning-modal";

  // Remove existing modal if any
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }

  // Create backdrop
  const backdrop = document.createElement("div");
  backdrop.id = `${modalId}-backdrop`;
  Object.assign(backdrop.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "10000",
    opacity: "0",
    transition: "opacity 0.3s ease-in-out",
    backdropFilter: "blur(2px)",
  });

  // Create modal container
  const modalContainer = document.createElement("div");
  modalContainer.id = modalId;
  Object.assign(modalContainer.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "10001",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
  });

  // Create modal content
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
    transform: "scale(0.7) translateY(-50px)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    opacity: "0",
    position: "relative",
    textAlign: "center",
  });

  // Add close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = "×";
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "32px",
    height: "32px",
    border: "none",
    backgroundColor: "transparent",
    fontSize: "24px",
    cursor: "pointer",
    borderRadius: "50%",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    zIndex: "1",
  });

  closeButton.addEventListener("mouseenter", () => {
    closeButton.style.backgroundColor = "#f5f5f5";
    closeButton.style.color = "#333";
  });

  closeButton.addEventListener("mouseleave", () => {
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.color = "#666";
  });

  // Create content
  const content = document.createElement("div");
  content.style.padding = "32px 24px 24px";

  content.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div style="width: 48px; height: 48px; margin: 0 auto 16px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 9v2m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/>
        </svg>
      </div>
      <h3 style="margin: 0 0 8px; color: #111827; font-size: 20px; font-weight: 600;">Job Already Tracked</h3>
      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">This job URL is already in your tracker. Do you want to add it again?</p>
    </div>
    <div style="display: flex; gap: 12px; justify-content: center;">
      <button id="cancel-duplicate" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: 2px solid #e5e7eb; 
        background-color: #f9fafb; 
        color: #374151;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
      ">Cancel</button>
      <button id="confirm-duplicate" style="
        padding: 12px 24px; 
        border-radius: 8px; 
        border: none; 
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white; 
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
      ">Track Anyway</button>
    </div>
  `;

  modal.appendChild(closeButton);
  modal.appendChild(content);
  modalContainer.appendChild(modal);

  // Add to DOM
  document.body.appendChild(backdrop);
  document.body.appendChild(modalContainer);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    backdrop.style.opacity = "1";
    modal.style.transform = "scale(1) translateY(0)";
    modal.style.opacity = "1";
  });

  // Enhanced button hover effects
  const cancelBtn = document.getElementById("cancel-duplicate");
  const confirmBtn = document.getElementById("confirm-duplicate");

  if (cancelBtn) {
    cancelBtn.addEventListener("mouseenter", () => {
      cancelBtn.style.backgroundColor = "#f3f4f6";
      cancelBtn.style.borderColor = "#d1d5db";
    });
    cancelBtn.addEventListener("mouseleave", () => {
      cancelBtn.style.backgroundColor = "#f9fafb";
      cancelBtn.style.borderColor = "#e5e7eb";
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("mouseenter", () => {
      confirmBtn.style.transform = "translateY(-1px)";
      confirmBtn.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.4)";
    });
    confirmBtn.addEventListener("mouseleave", () => {
      confirmBtn.style.transform = "translateY(0)";
      confirmBtn.style.boxShadow = "0 2px 8px rgba(220, 38, 38, 0.3)";
    });
  }

  // Close modal function
  const closeModalHandler = () => {
    modal.style.transform = "scale(0.7) translateY(-50px)";
    modal.style.opacity = "0";
    backdrop.style.opacity = "0";

    setTimeout(() => {
      modalContainer.remove();
      backdrop.remove();
    }, 300);
  };

  // Event listeners
  closeButton.addEventListener("click", closeModalHandler);

  // Click outside to close
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) {
      closeModalHandler();
    }
  });

  // Escape key to close
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModalHandler();
      document.removeEventListener("keydown", escapeHandler);
    }
  };
  document.addEventListener("keydown", escapeHandler);

  cancelBtn?.addEventListener("click", closeModalHandler);

  confirmBtn?.addEventListener("click", () => {
    onConfirm();
    closeModalHandler();
  });
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
  path1.setAttribute("stroke", "#000");
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
  path2.setAttribute("stroke", "#000");
  path2.setAttribute("fill", "none");
  path2.setAttribute("stroke-width", "12");
  path2.setAttribute("stroke-linecap", "round");
  path2.setAttribute("stroke-linejoin", "round");

  svg.appendChild(path1);
  svg.appendChild(path2);

  return svg;
}
