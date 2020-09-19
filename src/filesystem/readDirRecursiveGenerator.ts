import { promises } from 'fs'
import { resolve } from 'path'

/**
 * Generator function to read the content of a directory recursively.
 *
 * @param dir A absolute path to a folder
 */
export async function* readDirRecursive(dir: string): AsyncGenerator<string> {
  const dirContent = await promises.readdir(dir, {
    withFileTypes: true,
  })

  for (const content of dirContent) {
    const file = resolve(dir, content.name)

    if (content.isDirectory()) {
      yield* readDirRecursive(file)
    } else {
      yield file
    }
  }
}
