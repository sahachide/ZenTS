import { AutoLoader } from '../../src/core/AutoLoader'
import { loadFixtureTestAppConfig } from '../helper/loadFixtureTestAppConfig'

describe('AutoLoader and Registry', () => {
  beforeAll(async () => {
    await loadFixtureTestAppConfig()
    process.env.NODE_ENV = 'development'
  })

  afterAll(() => {
    process.env.NODE_ENV = 'test'
  })

  it('should let the AutoLoader create a Registry', async () => {
    const autoLoader = new AutoLoader()
    const registry = await autoLoader.createRegistry()

    expect(registry.getControllers().size).toBeGreaterThanOrEqual(3)
    expect(registry.getServices().size).toBeGreaterThanOrEqual(1)
    expect(registry.getConnection()).toBeUndefined()
  })
})
