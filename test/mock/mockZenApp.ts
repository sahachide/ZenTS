import type { ZenApp } from '../../src/core/ZenApp'
import { join } from 'path'
import { zen } from '../../src/core/Zen'

export async function mockZenApp(basePath: string): Promise<ZenApp> {
  process.env.NODE_ENV = 'development'
  const app = await zen({
    paths: {
      base: {
        src: join(process.cwd(), basePath, 'src'),
        dist: join(process.cwd(), basePath, 'dist'),
      },
      public: false,
    },
  })
  process.env.NODE_ENV = 'test'

  return app
}
