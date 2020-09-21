import { join } from 'path'

export function getFixtureDir(which: string): string {
  return join(process.cwd(), `./test/fixtures/${which}`)
}
