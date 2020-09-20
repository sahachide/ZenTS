import { Controller, get } from '../../../../../lib'

export default class extends Controller {
  @get('/ping')
  public async ping() {
    return {
      answer: 'pong',
    }
  }

  @get('/json-object')
  public async jsonObject() {
    return {
      foo: 'bar',
      baz: 'battzz',
    }
  }

  @get('/json-array')
  public async jsonArray() {
    return ['foo', 'bar', 'baz']
  }
}
