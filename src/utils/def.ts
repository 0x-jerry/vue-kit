// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function defGetter<T extends Record<string, any>, K extends keyof T = keyof T>(
  obj: T,
  key: K,
  value: T[K],
) {
  return Object.defineProperty(obj, key, {
    value,
  })
}
