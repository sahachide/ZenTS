import 'reflect-metadata'

import { REFLECT_METADATA } from '../../src/types/enums'
import { get, post, put, del, options } from '../../src/decorators/'

class MyController {
  @get('/get-route-test')
  public getTest() {}

  @post('/post-route-test')
  public postTest() {}

  @put('/put-route-test')
  public putTest() {}

  @del('/del-route-test')
  public delTest() {}

  @options('/options-route-test')
  public optionsTest() {}
}

describe('Routing decorator', () => {
  it('should register GET routes', () => {
    const method = 'getTest'
    const httpMethod = Reflect.getMetadata(
      REFLECT_METADATA.HTTP_METHOD,
      MyController.prototype,
      method,
    )
    const urlPath = Reflect.getMetadata(REFLECT_METADATA.URL_PATH, MyController.prototype, method)

    expect(httpMethod).toBe('get')
    expect(urlPath).toBe('/get-route-test')
  })

  it('should register POST routes', () => {
    const method = 'postTest'
    const httpMethod = Reflect.getMetadata(
      REFLECT_METADATA.HTTP_METHOD,
      MyController.prototype,
      method,
    )
    const urlPath = Reflect.getMetadata(REFLECT_METADATA.URL_PATH, MyController.prototype, method)

    expect(httpMethod).toBe('post')
    expect(urlPath).toBe('/post-route-test')
  })

  it('should register PUT routes', () => {
    const method = 'putTest'
    const httpMethod = Reflect.getMetadata(
      REFLECT_METADATA.HTTP_METHOD,
      MyController.prototype,
      method,
    )
    const urlPath = Reflect.getMetadata(REFLECT_METADATA.URL_PATH, MyController.prototype, method)

    expect(httpMethod).toBe('put')
    expect(urlPath).toBe('/put-route-test')
  })

  it('should register DEL routes', () => {
    const method = 'delTest'
    const httpMethod = Reflect.getMetadata(
      REFLECT_METADATA.HTTP_METHOD,
      MyController.prototype,
      method,
    )
    const urlPath = Reflect.getMetadata(REFLECT_METADATA.URL_PATH, MyController.prototype, method)

    expect(httpMethod).toBe('delete')
    expect(urlPath).toBe('/del-route-test')
  })

  it('should register OPTIONS routes', () => {
    const method = 'optionsTest'
    const httpMethod = Reflect.getMetadata(
      REFLECT_METADATA.HTTP_METHOD,
      MyController.prototype,
      method,
    )
    const urlPath = Reflect.getMetadata(REFLECT_METADATA.URL_PATH, MyController.prototype, method)

    expect(httpMethod).toBe('options')
    expect(urlPath).toBe('/options-route-test')
  })
})
