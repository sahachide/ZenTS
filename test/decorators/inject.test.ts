import 'reflect-metadata'

import { REFLECT_METADATA } from '../../src/types/enums'
import { inject } from '../../src/decorators/inject'

describe('Inject decorator', () => {
  it('should inject services', () => {
    class MyService1 {
      public foo() {
        return 'bar'
      }
    }
    class MyService2 {
      public bar() {
        return 'foo'
      }
    }
    class MyController {
      @inject
      public myService1: MyService1
      @inject
      public myService2: MyService2

      public test() {
        return `${this.myService1.foo()}-${this.myService2.bar()}`
      }
    }

    const dependencies = Reflect.getMetadata(REFLECT_METADATA.DEPENDENCIES, MyController.prototype)

    expect(dependencies.length).toBe(2)
    expect(dependencies[0].propertyKey).toBe('myService1')
    expect(dependencies[0].dependency).toBeInstanceOf(Function)
    expect(dependencies[1].propertyKey).toBe('myService2')
    expect(dependencies[1].dependency).toBeInstanceOf(Function)

    const initializedDependency = new dependencies[0].dependency()

    expect(initializedDependency).toBeInstanceOf(MyService1)
  })
})
