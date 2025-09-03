export interface ToastOptions {
  id?: number;
  type?: "success" | "error" | "warning" | "info" | "loading" | "default";
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastPromiseMessages {
  loading?: string;
  success?: string;
  error?: string;
}

interface ToastData {
  element: HTMLElement;
  timeout: NodeJS.Timeout | null;
  action?: ToastOptions["action"];
}

class ToastSonner {
  private toasts: Map<number, ToastData>;
  private id: number;
  private container: HTMLElement | null;

  constructor() {
    this.toasts = new Map();
    this.id = 0;
    this.container = null;
    this.initContainer();
    this.initStyles();
  }

  private initContainer(): void {
    // Try to find existing container first
    this.container = document.getElementById("toastContainer");

    // If not found, create one
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "toastContainer";
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  }

  private initStyles(): void {
    // Check if styles already exist
    if (document.getElementById("toast-sonner-styles")) {
      return;
    }

    const styles = `
      /* Toast Container */
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 400px;
        width: 100%;
        pointer-events: none;
      }

      /* Toast Base Styles */
      .toast {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid #e5e7eb;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        position: relative;
        overflow: hidden;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .toast.show {
        transform: translateX(0);
        opacity: 1;
      }

      .toast.hide {
        transform: translateX(100%);
        opacity: 0;
      }

      /* Toast Types */
      .toast.success {
        border-left: 4px solid #22c55e;
      }

      .toast.error {
        border-left: 4px solid #ef4444;
      }

      .toast.warning {
        border-left: 4px solid #f59e0b;
      }

      .toast.info {
        border-left: 4px solid #3b82f6;
      }

      .toast.loading {
        border-left: 4px solid #6b7280;
      }

      /* Toast Icon */
      .toast-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .toast-icon svg {
        width: 100%;
        height: 100%;
      }

      /* Loading Spinner */
      .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #6b7280;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Toast Content */
      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
        line-height: 1.4;
        font-size: 14px;
      }

      .toast-description {
        color: #6b7280;
        font-size: 13px;
        line-height: 1.4;
      }

      /* Close Button */
      .toast-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: #9ca3af;
        transition: all 0.2s ease;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-close:hover {
        background: #f3f4f6;
        color: #6b7280;
      }

      /* Progress Bar */
      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        transform-origin: left;
        transition: transform linear;
        width: 100%;
      }

      .toast.success .toast-progress {
        background: #22c55e;
      }

      .toast.error .toast-progress {
        background: #ef4444;
      }

      .toast.warning .toast-progress {
        background: #f59e0b;
      }

      .toast.info .toast-progress {
        background: #3b82f6;
      }

      /* Action Button */
      .toast-action {
        margin-top: 8px;
        padding: 6px 12px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .toast-action:hover {
        background: #e5e7eb;
      }

      /* Responsive */
      @media (max-width: 480px) {
        .toast-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.id = "toast-sonner-styles";
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  private generateId(): number {
    return ++this.id;
  }

  private getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #22c55e;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>`,
      error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #ef4444;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>`,
      warning: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #f59e0b;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.132 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
      </svg>`,
      info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #3b82f6;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>`,
    };
    return icons[type] || "";
  }

  create(
    message: string,
    description = "",
    options: ToastOptions = {}
  ): number {
    if (!this.container) {
      this.initContainer();
    }

    const id = options.id || this.generateId();
    const type = options.type || "default";
    const duration = options.duration !== undefined ? options.duration : 4000;
    const dismissible = options.dismissible !== false;

    // Remove existing toast with same id
    if (this.toasts.has(id)) {
      this.remove(id);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("data-id", String(id));

    let iconHtml = "";
    if (type === "loading") {
      iconHtml = '<div class="toast-icon"><div class="spinner"></div></div>';
    } else if (type !== "default") {
      iconHtml = `<div class="toast-icon">${this.getIcon(type)}</div>`;
    }

    const closeButton = dismissible
      ? `<button class="toast-close" data-toast-close="${id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>`
      : "";

    const actionHtml = options.action
      ? `<button class="toast-action" data-toast-action="${id}">
          ${options.action.label}
        </button>`
      : "";

    toast.innerHTML = `
      ${iconHtml}
      <div class="toast-content">
        <div class="toast-title">${message}</div>
        ${
          description
            ? `<div class="toast-description">${description}</div>`
            : ""
        }
        ${actionHtml}
      </div>
      ${closeButton}
      ${duration > 0 ? '<div class="toast-progress"></div>' : ""}
    `;

    // Add event listeners
    const closeBtn = toast.querySelector(`[data-toast-close="${id}"]`);
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.remove(id));
    }

    const actionBtn = toast.querySelector(`[data-toast-action="${id}"]`);
    if (actionBtn && options.action) {
      actionBtn.addEventListener("click", () => this.handleAction(id));
    }

    this.container!.appendChild(toast);

    // Store toast data
    this.toasts.set(id, {
      element: toast,
      timeout: null,
      action: options.action,
    });

    // Trigger animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Auto dismiss
    if (duration > 0) {
      const progressBar = toast.querySelector(".toast-progress") as HTMLElement;
      if (progressBar) {
        progressBar.style.transform = "scaleX(0)";
        progressBar.style.transition = `transform ${duration}ms linear`;
      }

      const timeout = setTimeout(() => {
        this.remove(id);
      }, duration);

      this.toasts.get(id)!.timeout = timeout;
    }

    return id;
  }

  remove(id: number): void {
    const toastData = this.toasts.get(id);
    if (!toastData) return;

    const { element, timeout } = toastData;

    if (timeout) {
      clearTimeout(timeout);
    }

    element.classList.remove("show");
    element.classList.add("hide");

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts.delete(id);
    }, 300);
  }

  private handleAction(id: number): void {
    const toastData = this.toasts.get(id);
    if (toastData?.action?.onClick) {
      toastData.action.onClick();
    }
  }

  // Convenience methods
  success(
    message: string,
    description?: string,
    options?: Omit<ToastOptions, "type">
  ): number {
    return this.create(message, description, { ...options, type: "success" });
  }

  error(
    message: string,
    description?: string,
    options?: Omit<ToastOptions, "type">
  ): number {
    return this.create(message, description, { ...options, type: "error" });
  }

  warning(
    message: string,
    description?: string,
    options?: Omit<ToastOptions, "type">
  ): number {
    return this.create(message, description, { ...options, type: "warning" });
  }

  info(
    message: string,
    description?: string,
    options?: Omit<ToastOptions, "type">
  ): number {
    return this.create(message, description, { ...options, type: "info" });
  }

  loading(
    message: string,
    description?: string,
    options?: Omit<ToastOptions, "type">
  ): number {
    return this.create(message, description, {
      ...options,
      type: "loading",
      duration: 0,
    });
  }

  promise<T>(
    promise: Promise<T>,
    messages: ToastPromiseMessages,
    options?: Omit<ToastOptions, "type">
  ): Promise<T> {
    const id = this.loading(messages.loading || "Loading...");

    return promise
      .then((data) => {
        this.success(messages.success || "Success!", "", { ...options, id });
        return data;
      })
      .catch((error) => {
        this.error(messages.error || "Error occurred", "", { ...options, id });
        throw error;
      });
  }

  // Default method for basic usage
  default(
    message: string,
    description?: string,
    options?: ToastOptions
  ): number {
    return this.create(message, description, options);
  }
}

// Create and export singleton instance
const toastInstance = new ToastSonner();

// Export both the class and the instance
export { ToastSonner };
export const toast = toastInstance;

// Make it also available as default export
export default toast;
