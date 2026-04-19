/** Tiny unique ID — avoids external package dependency */
export function nanoid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}
