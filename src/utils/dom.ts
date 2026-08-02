/**
 * Safe DOM access helpers.
 * All functions guard against SSR / non-browser environments.
 */

/** True when running in a real browser (not SSR). */
export const isBrowser = typeof window !== 'undefined';

/**
 * Returns the computed CSS custom property value from :root.
 * @example getCSSVar('--color-primary') → '#1a1a2e'
 */
export function getCSSVar(name: string, element: HTMLElement = document.documentElement): string {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

/**
 * Sets a CSS custom property on :root (or a given element).
 */
export function setCSSVar(name: string, value: string, element: HTMLElement = document.documentElement): void {
  element.style.setProperty(name, value);
}

/**
 * Query selector that throws a typed error if element is not found.
 * Use when you are certain the element must exist (e.g. layout wrappers).
 */
export function qs<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: Document | HTMLElement = document
): T {
  const el = scope.querySelector<T>(selector);
  if (!el) throw new Error(`Element not found: "${selector}"`);
  return el;
}

/**
 * Query selector that returns null if element is not found (safe version).
 */
export function qsMaybe<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: Document | HTMLElement = document
): T | null {
  return scope.querySelector<T>(selector);
}

/**
 * Query selector all — returns a real array (not NodeList).
 */
export function qsAll<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: Document | HTMLElement = document
): T[] {
  return Array.from(scope.querySelectorAll<T>(selector));
}

/**
 * Returns the scroll position (supports both window and custom scroll containers).
 */
export function getScrollY(): number {
  return isBrowser ? window.scrollY : 0;
}
