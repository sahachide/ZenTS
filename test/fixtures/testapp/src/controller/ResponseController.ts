import { body, Controller, get, post, put, req, Request } from '../../../../../src'

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
  public postEcho(@body body: any) {
    return body
  }

  @put('/put-echo')
  public putEcho(@req req: Request) {
    return req.body
  }
}
