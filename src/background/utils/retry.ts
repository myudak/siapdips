/**
 * Reusable retry helper for Chrome script injection
 *
 * Wraps async operations (executeScript, insertCSS, etc.) with
 * configurable retry + exponential backoff to handle transient
 * failures on pages that aren't ready for injection yet (e.g.
 * Angular SPA bootstrap, CSP timing issues).
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  backoffMultiplier?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 500,
  backoffMultiplier: 2,
};

/**
 * Attempts an async injection `fn` up to `maxRetries` times.
 *
 * Only retries on generic runtime / "Blocked" errors (transient).
 * Permission-denied errors (e.g. missing host_permissions) are
 * re-thrown immediately.
 *
 * @param fn       Async function that performs the injection
 * @param tabId    Tab ID for logging context
 * @param url      Tab URL for logging context
 * @param options  Retry configuration (optional)
 */
export async function retryScriptInjection<T = void>(
  fn: () => Promise<T>,
  tabId: number,
  url: string,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelayMs, backoffMultiplier } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result; // success
    } catch (error) {
      lastError = error;
      const errorMsg =
        error instanceof Error ? error.message : String(error);

      // Re-throw immediately for permanent permission errors
      if (
        errorMsg.includes("Cannot access") ||
        errorMsg.includes("permission") ||
        errorMsg.includes("Extension manifest must request permission")
      ) {
        throw error;
      }

      if (attempt < maxRetries) {
        console.warn(
          `[SiapDips] Retry ${attempt}/${maxRetries} for tab ${tabId} (${url}): ${errorMsg}`
        );
        const delay = baseDelayMs * Math.pow(backoffMultiplier, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
