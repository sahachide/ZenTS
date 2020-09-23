import type { ZenApp } from '../../src/core/ZenApp'
import { mockZenApp } from '../mock/mockZenApp'
import supertest from 'supertest'

let app: ZenApp

describe('ZenTS test app', () => {
  beforeAll(async () => {
    app = await mockZenApp('./test/fixtures/testapp/')
  })

  afterAll(() => {
    app.destroy()
  })

  it('answers ping message', async () => {
    await supertest(app.nodeServer).get('/ping').expect('Content-Type', /json/).expect(200).expect({
      answer: 'pong',
    })
  })

  it('returns a JSON object response', async () => {
    await supertest(app.nodeServer)
      .get('/json-object')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({
        foo: 'bar',
        baz: 'battzz',
      })
  })

  it('returns a JSON array response', async () => {
    await supertest(app.nodeServer)
      .get('/json-array')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(['foo', 'bar', 'baz'])
  })

  it('parses a POST request body', async () => {
    const body = {
      foo: 'bar',
    }

    await supertest(app.nodeServer)
      .post('/post-echo')
      .send(body)
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .expect(body)
  })

  it('parses a PUT request body', async () => {
    const body = {
      foo: 'bar',
    }

    await supertest(app.nodeServer)
      .put('/put-echo')
      .send(body)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(body)
  })
})
