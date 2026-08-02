/**
 * Device / capability detection utilities.
 */

import { isBrowser } from './dom';

/**
 * True when the primary input is a touch screen (coarse pointer).
 */
export function isTouchDevice(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * True when the user has requested reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * True when the user prefers a dark colour scheme.
 */
export function prefersDarkMode(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Returns the device pixel ratio (defaults to 1 in non-browser environments).
 */
export function getDevicePixelRatio(): number {
  if (!isBrowser) return 1;
  return window.devicePixelRatio ?? 1;
}

/**
 * True when the viewport width is below a given breakpoint (mobile-first check).
 * @example isMobile() → true on phones
 */
export function isMobile(breakpoint = 768): boolean {
  if (!isBrowser) return false;
  return window.innerWidth < breakpoint;
}
