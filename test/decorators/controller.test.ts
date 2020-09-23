import 'reflect-metadata'

import { REFLECT_METADATA } from '../../src/types/enums'
import { controller } from '../../src/decorators/controller'

describe('Controller decorator', () => {
  it('should set a controller key', () => {
    @controller('Foo')
    class Test {}

    const key = Reflect.getMetadata(REFLECT_METADATA.CONTROLLER_KEY, Test)
    expect(key).toBe('Foo')
  })
})
