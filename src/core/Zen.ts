import { ZenApp } from './ZenApp'
import type { ZenConfig } from '../types/interfaces'

export async function zen(config?: ZenConfig): Promise<ZenApp> {
  const app = new ZenApp()
  await app.boot(config)

  return app
}
