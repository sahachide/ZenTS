import { Controller, inject } from '../../../../../src'

import DepdendencyInjectionService from '../service/DepdendencyInjectionService'

export default class extends Controller {
  @inject
  public injectedService: DepdendencyInjectionService

  public async example() {
    return {
      foo: 'bar',
    }
  }
  public valueFromInjectedService() {
    return this.injectedService.example()
  }
}
