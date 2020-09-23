import { Context, Controller, get, post, put } from '../../../../../src'

export default class extends Controller {
  @get('/ping')
  public ping() {
    return {
      answer: 'pong',
    }
  }

  @get('/json-object')
  public jsonObject() {
    return {
      foo: 'bar',
      baz: 'battzz',
    }
  }

  @get('/json-array')
  public jsonArray() {
    return ['foo', 'bar', 'baz']
  }

  @post('/post-echo')
  public postEcho({ req }: Context) {
    return req.body
  }

  @put('/put-echo')
  public putEcho({ req }: Context) {
    return req.body
  }
}
