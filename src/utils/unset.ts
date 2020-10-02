export function unset(obj: { [key: string]: any }, path: string): void {
  if (!obj || !path) {
    return
  }

  const paths = path.split('.')

  for (let i = 0; i < paths.length - 1; i++) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    obj = obj[paths[i]]

    if (typeof obj === 'undefined') {
      return
    }
  }

  delete obj[paths.pop()]
}
