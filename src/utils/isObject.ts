export function isObject(value: any): boolean {
  if (value === null || Array.isArray(value)) {
    return false
  }

  const type = typeof value

  return type === 'object' || type === 'function'
}
