/**
 * cn — Lightweight class name utility.
 * Joins truthy string values, filtering out falsy ones.
 *
 * @example
 * cn('base', isActive && 'active', variant === 'dark' && 'dark')
 * // → 'base active'
 */
export function cn(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
