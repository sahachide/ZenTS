import { exec } from 'child_process'
import { get } from '../../src/utils/get'
import { getContentType } from '../../src/utils/getContentType'
import { isObject } from '../../src/utils/isObject'
import { set } from '../../src/utils/set'

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

  it('set()', () => {
    const base: { [key: string]: any } = {
      foo: 'bar',
    }

    set(base, 'test', 'test')
    expect(base).toHaveProperty('test')
    expect(base.test).toBe('test')

    set(base, 'nested.value', 'foo')
    expect(base).toHaveProperty('nested')
    expect(base.nested).toHaveProperty('value')
    expect(base.nested.value).toBe('foo')
  })

  it('get()', () => {
    const testObj = {
      foo: 'bar',
      nested: {
        value: {
          deep: true,
        },
      },
    }

    expect(get(testObj, 'foo')).toBe('bar')
    expect(get(testObj, 'nested.value.deep')).toBe(true)
    expect(get(testObj, 'not.there')).toBeUndefined
  })
})
