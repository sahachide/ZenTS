import { ZenApp } from './ZenApp'

/**
 * The main entry point for your application. Call this function to start a new ZenTS instance.
 *
 * ```
 * import { zen } from 'zents'
 *
 * ;(async () => {
 *   await zen()
 * })()
 * ```
 */
export async function zen(): Promise<ZenApp> {
  const app = new ZenApp()
  await app.boot()

  return app
}
