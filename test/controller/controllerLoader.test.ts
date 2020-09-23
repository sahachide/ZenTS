import { ControllerLoader } from '../../src/controller/ControllerLoader'
import { loadFixtureTestAppConfig } from '../helper/loadFixtureTestAppConfig'

describe('ControllerLoader', () => {
  beforeAll(async () => {
    await loadFixtureTestAppConfig()
    process.env.NODE_ENV = 'development'
  })
  afterAll(() => {
    process.env.NODE_ENV = 'test'
  })

  it('loads controllers in a given directory correctly', async () => {
    const controllerLoader = new ControllerLoader()
    const controllers = await controllerLoader.load()

    expect(controllers.has('responsecontroller')).toBe(true)
    expect(controllers.get('responsecontroller')).toHaveProperty('module')
    expect(typeof controllers.get('responsecontroller').module).toBe('function')
    expect(Array.isArray(controllers.get('responsecontroller').routes)).toBe(true)
  })

  it('should handle the @controller annotation correctly', async () => {
    const controllerLoader = new ControllerLoader()
    const controllers = await controllerLoader.load()

    expect(controllers.has('prefixcontroller')).toBe(true)
  })

  it('should register annotated controller routes correctly', async () => {
    const controllerLoader = new ControllerLoader()
    const controllers = await controllerLoader.load()

    const responseController = controllers.get('responsecontroller')
    const prefixController = controllers.get('prefixcontroller')

    expect(responseController).not.toBeUndefined()
    expect(prefixController).not.toBeUndefined()

    expect(responseController).toHaveProperty('routes')
    expect(prefixController).toHaveProperty('routes')

    expect(responseController.routes.length).toBeGreaterThanOrEqual(1)
    expect(responseController.routes[0]).toStrictEqual({
      method: 'GET',
      path: '/ping',
      controllerMethod: 'ping',
    })

    expect(prefixController.routes.length).toBeGreaterThanOrEqual(1)
    expect(prefixController.routes[0].path).toBe('/prefix/example-without-slash')
  })
})
