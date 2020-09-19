import { contentType } from 'mime-types'

const cache = new Map<string, string>()

export const getContentType = function (filenameOrExt: string): string | false {
  if (cache.has(filenameOrExt)) {
    return cache.get(filenameOrExt)
  }

  const mimeType = contentType(filenameOrExt)

  if (!mimeType) {
    return false
  }

  cache.set(filenameOrExt, mimeType)

  return mimeType
}
