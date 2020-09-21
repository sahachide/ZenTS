import { getContentType } from '../../src/utils/getContentType'
import { isObject } from '../../src/utils/isObject'

describe('Util', () => {
  it('getContentType() returns the correct mime type', () => {
    expect(getContentType('json')).toBe('application/json; charset=utf-8')
    expect(getContentType('foo.html')).toBe('text/html; charset=utf-8')
    expect(getContentType('app.js')).toBe('application/javascript; charset=utf-8')
    expect(getContentType('app.thismimetypedoesntexist')).toBe(false)
  })

  it('getContentType() has a working cached copy', () => {
    expect(getContentType('json')).toBe('application/json; charset=utf-8')
    expect(getContentType('json')).toBe('application/json; charset=utf-8')
  })

  it('isObject()', () => {
    expect(isObject({ foo: 'bar' })).toBe(true)
    expect(isObject(['foo', 'bar'])).toBe(false)
    expect(isObject('foo')).toBe(false)
    expect(isObject(42)).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})
