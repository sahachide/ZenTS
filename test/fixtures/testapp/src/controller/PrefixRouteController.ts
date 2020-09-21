import { Controller, controller, get, prefix } from '../../../../../lib'

@controller('Prefix')
@prefix('/prefix/')
export default class extends Controller {
  @get('example-without-slash')
  public async exampleWithoutSlash() {
    return {
      foo: 'bar',
    }
  }
}
