import { Controller, get } from '../../../../../lib'

export default class extends Controller {
  @get('/')
  public async index() {
    return {
      success: true,
    }
  }
}
