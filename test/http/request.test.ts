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

  it('parses querystring', async () => {
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
})
