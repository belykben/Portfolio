/**
 * Math utilities for animations and layout calculations.
 */

/**
 * Linear interpolation between two values.
 * @param start - Start value
 * @param end   - End value
 * @param t     - Progress (0–1)
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map a value from one range to another.
 * @example mapRange(0.5, 0, 1, 0, 100) → 50
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Normalise a value within a range to 0–1.
 */
export function normalise(value: number, min: number, max: number): number {
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Round to a given number of decimal places.
 */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Convert degrees to radians.
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees.
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}
