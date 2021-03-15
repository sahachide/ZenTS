import type { ZenApp } from '../../src/core/ZenApp'
import { join } from 'path'
import { zen } from '../../src/core/Zen'

export async function mockZenApp(basePath: string): Promise<ZenApp> {
  process.env.NODE_ENV = 'development'
  const app = await zen({
    web: {
      port: Math.floor(Math.random() * 30000) + 5000,
    },
    database: {
      enable: true,
      type: 'postgres',
      host: 'localhost',
      port: 54321,
      username: 'test',
      password: 'test',
      database: 'test',
    },
    email: {
      enable: true,
      engine: 'mjml',
      host: 'localhost',
      port: 1025,
      mailOptions: {
        from: 'test@zents.dev',
      },
    },
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
