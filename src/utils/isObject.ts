export function isObject(value: any): boolean {
  if (value === null) {
    return false
  }

  const type = typeof value

  return type === 'object' || type === 'function'
}
