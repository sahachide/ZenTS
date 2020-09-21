import { getFixtureDir } from './getFixtureDir'
import { join } from 'path'
import { loadConfig } from '../../src/config/config'

export async function loadFixtureTestAppConfig(force: boolean = true): Promise<void> {
  process.env.NODE_ENV = 'development'
  await loadConfig(
    {
      paths: {
        base: {
          src: join(process.cwd(), '/test/fixtures/testapp/src'),
          dist: join(process.cwd(), '/test/fixtures/testapp/dist'),
        },
      },
    },
    getFixtureDir('config'),
    force,
  )
  process.env.NODE_ENV = 'test'
}
