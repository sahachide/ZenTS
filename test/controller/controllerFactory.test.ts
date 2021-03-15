import { ControllerFactory } from '../../src/controller/ControllerFactory'
import { ControllerLoader } from '../../src/controller/ControllerLoader'
import type { Controllers } from '../../src/types'
import DepdendencyInjectionService from '../fixtures/testapp/src/service/DepdendencyInjectionService'
import type DependencyInjectionController from '../fixtures/testapp/src/controller/DependencyInjectionController'
import type ResponseController from '../fixtures/testapp/src/controller/ResponseController'
import { loadFixtureTestAppConfig } from '../helper/loadFixtureTestAppConfig'

let controllers: Controllers

describe('ControllerFactory', () => {
  beforeAll(async () => {
    await loadFixtureTestAppConfig()

    process.env.NODE_ENV = 'development'
    const controllerLoader = new ControllerLoader()
    controllers = await controllerLoader.load()
  })

  afterAll(() => {
    process.env.NODE_ENV = 'test'
  })

  it('should build controller', () => {
    const controllerFactory = new ControllerFactory(controllers, null, null, null, null, {
      files: [],
      filters: new Map(),
    })

    const instance = controllerFactory.build<ResponseController>('responsecontroller')

    expect(instance).not.toBeNull()
    expect(typeof instance.ping).toBe('function')

    const notExists = controllerFactory.build('loremipsumloremipsumloremipsum')

    expect(notExists).toBeNull()
  })

  it('should inject dependencies', () => {
    const controllerFactory = new ControllerFactory(controllers, null, null, null, null, {
      files: [],
      filters: new Map(),
    })

    const instance = controllerFactory.build<DependencyInjectionController>(
      'dependencyinjectioncontroller',
    )

    expect(instance).not.toBeNull()
    expect(instance.injectedService).toBeInstanceOf(DepdendencyInjectionService)
    expect(instance.valueFromInjectedService()).toBe('foo')
  })
})
