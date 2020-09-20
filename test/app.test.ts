import type { ZenApp } from '../src/core/ZenApp'
import { mockZenApp } from './mock/mockZenApp'
import supertest from 'supertest'

let app: ZenApp

describe('ZenTS test app', () => {
  beforeAll(async () => {
    app = await mockZenApp('./test/testapp/')
  })
  afterAll(() => {
    app.destroy()
  })

  test('answers ping message', async () => {
    await supertest(app.nodeServer).get('/ping').expect('Content-Type', /json/).expect(200).expect({
      answer: 'pong',
    })
  })

  test('returns a JSON object response', async () => {
    await supertest(app.nodeServer)
      .get('/json-object')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        foo: 'bar',
        baz: 'battzz',
      })
  })

  test('returns a JSON array response', async () => {
    await supertest(app.nodeServer)
      .get('/json-array')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(['foo', 'bar', 'baz'])
  })
})
