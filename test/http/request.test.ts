import type { ZenApp } from '../../src/core/ZenApp'
import { mockZenApp } from '../mock/mockZenApp'
import supertest from 'supertest'

let app: ZenApp

describe('Request', () => {
  beforeAll(async () => {
    app = await mockZenApp('./test/fixtures/testapp/')
  })

  afterAll(() => {
    app.destroy()
  })

  it('parses request parameters', async () => {
    await supertest(app.nodeServer)
      .get('/request-test/bar/baz')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        foo: 'bar',
        bar: 'baz',
        paramsSetter: 'test',
      })
  })

  it('parses a querystring', async () => {
    await supertest(app.nodeServer)
      .get('/request-test-queryparams?foo=bar&bar[]=baz&bar[]=buzz')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        foo: 'bar',
        bar: ['baz', 'buzz'],
        search: '?foo=bar&bar%5B0%5D=baz&bar%5B1%5D=buzz',
        querystring: 'foo=bar&bar%5B0%5D=baz&bar%5B1%5D=buzz',
        querystringSetter: 'foo',
        resetQuerystringSearch: '',
      })
  })

  it('handles the URL correctly', async () => {
    await supertest(app.nodeServer)
      .get('/url-test')
      .expect(201)
      .expect('Content-Type', /json/)
      .expect({
        request: {
          requestUrl: '/url-test',
          pathname: '/url-test',
          httpMethod: 'get',
          httpVersion: '1.1',
          httpVersionMajor: 1,
          httpVersionMinor: 1,
        },
        setterTests: {
          requestUrl: '/rewrite',
          pathname: '',
          httpMethod: 'post',
        },
      })
  })

  it('recives all request headers', async () => {
    const response = await supertest(app.nodeServer)
      .get('/request-header/all')
      .set('Accept', 'application/json')
      .set('x-zen-test', 'foo')
      .expect(200)

    expect(response.body).toMatchSnapshot()
  })

  it('recives a custom request header correctly', async () => {
    await supertest(app.nodeServer)
      .get('/request-header/get')
      .set('x-zen-test', 'foo')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        value: 'foo',
      })
  })

  it('knows which header has been send', async () => {
    await supertest(app.nodeServer)
      .get('/request-header/has')
      .set('x-zen-test', 'foo')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        exist: true,
        doesntexist: false,
      })
  })

  it('removes request header correctly', async () => {
    await supertest(app.nodeServer)
      .get('/request-header/remove')
      .set('x-zen-test', 'foo')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        success: true,
        typeofCurrentValue: 'undefined',
        oldValue: 'foo',
        has: false,
      })
  })

  it('sets request header', async () => {
    await supertest(app.nodeServer)
      .get('/request-header/set')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        has: true,
        value: 'bar',
      })
  })

  it('returns accept header', async () => {
    await supertest(app.nodeServer)
      .get('/request-header/accept')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        accept: 'application/json',
      })
  })

  it('validates a POST request body', async () => {
    const body = {
      foo: 'bar',
      bar: 'baz',
    }

    await supertest(app.nodeServer)
      .post('/request-test-validate')
      .send(body)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(body)
  })

  it('validates a POST request body (fail)', async () => {
    const body = {
      foo: 'bar',
    }

    await supertest(app.nodeServer)
      .post('/request-test-validate')
      .send(body)
      .set('Accept', 'application/json')
      .expect(422)
      .expect('Content-Type', /json/)
  })
})
