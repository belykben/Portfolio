/**
 * Timing utilities — debounce and throttle.
 * Used internally by the scrolling engine and hooks.
 */

/**
 * Returns a debounced version of `fn` that delays invocation until
 * `wait` ms have elapsed since the last call.
 *
 * @param fn   - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns      Debounced function with a `.cancel()` method
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  }) as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}

/**
 * Returns a throttled version of `fn` that is invoked at most once
 * per `wait` ms using leading-edge invocation.
 *
 * @param fn   - Function to throttle
 * @param wait - Throttle window in milliseconds
 */
export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number
): T & { cancel: () => void } {
  let lastTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn(...args);
    } else if (timer === null) {
      // Trailing call
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  }) as T & { cancel: () => void };

  throttled.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return throttled;
}
