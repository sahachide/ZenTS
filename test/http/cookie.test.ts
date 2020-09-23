import { Cookie } from '../../src/http/Cookie'

describe('Cookie', () => {
  it('constructs a existing cookie', () => {
    const cookie = new Cookie({
      cookie: 'foo=%22bar%22',
    })

    expect(cookie.has('foo')).toBe(true)
    expect(cookie.get('foo')).toBe('bar')
    expect(cookie.get('notfoo')).toBeUndefined()
  })

  it('sets a simple cookie value', () => {
    const cookie = new Cookie({})

    cookie.set('foo', 'bar', {
      httpOnly: true,
    })
    expect(cookie.has('foo')).toBe(true)
    expect(cookie.get('foo')).toBe('bar')
    expect(cookie.serialize()).toBe('foo=%22bar%22; HttpOnly')
  })

  it('sets a complex cookie value', () => {
    const cookie = new Cookie({})

    cookie.set('foo', {
      bar: 'baz',
    })
    expect(cookie.has('foo')).toBe(true)
    expect(cookie.get('foo')).toStrictEqual({ bar: 'baz' })
    expect(cookie.serialize()).toBe('foo=%7B%22bar%22%3A%22baz%22%7D')
  })

  it("doesn't serialize() unmodified keys", () => {
    const cookie = new Cookie({})

    expect(cookie.serialize()).toBeFalsy()
  })
})
