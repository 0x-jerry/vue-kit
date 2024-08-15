export function normalizeCssValue(x: string) {
  return /^\d+$/.test(x) ? `${x}px` : x
}
