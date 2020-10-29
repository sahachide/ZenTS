import { Context, Controller, get, prefix, req, Request, request } from '../../../../../src'

const customHeaderKey = 'x-zen-test'

@prefix('/request-header')
export default class extends Controller {
  @get('/all')
  public allTest(@request req: Request) {
    const result: { [key: string]: string | string[] } = {}

    for (const [key, value] of req.header.all()) {
      if (key !== 'host') {
        result[key] = value
      }
    }

    return {
      result,
    }
  }

  @get('/get')
  public getTest(@req request: Request) {
    return {
      value: request.header.get<string>(customHeaderKey),
    }
  }

  @get('/has')
  public hasTest(@request request: Request) {
    return {
      exist: request.header.has(customHeaderKey),
      doesntexist: request.header.has('not-send'),
    }
  }

  @get('/remove')
  public removeTest(@request request: Request) {
    if (!request.header.has(customHeaderKey)) {
      return {
        success: false,
      }
    }

    const value = request.header.get<string>(customHeaderKey)

    request.header.remove(customHeaderKey)

    return {
      success: true,
      typeofCurrentValue: typeof request.header.get<string>(customHeaderKey),
      oldValue: value,
      has: request.header.has(customHeaderKey),
    }
  }

  @get('/set')
  public setTest(@request request: Request) {
    request.header.set('foo', 'bar')

    return {
      has: request.header.has('foo'),
      value: request.header.get('foo'),
    }
  }

  @get('/accept')
  public acceptTest(@request request: Request) {
    return {
      accept: request.header.getAccept(),
    }
  }
}
