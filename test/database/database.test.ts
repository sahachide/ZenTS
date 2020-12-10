import type { ZenApp } from '../../src/core/ZenApp'
import { mockZenApp } from '../mock/mockZenApp'
import supertest from 'supertest'

let app: ZenApp

describe('Database', () => {
  beforeAll(async () => {
    app = await mockZenApp('./test/fixtures/testapp/')
  })

  afterAll(() => {
    app.destroy()
  })

  it('returns all person records', async () => {
    const response = await supertest(app.nodeServer)
      .get('/database-test/persons')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body).toMatchSnapshot()
  })

  it('can access records via EntityManager', async () => {
    const response = await supertest(app.nodeServer)
      .get('/database-test/persons2')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body).toMatchSnapshot()
  })

  it('can access records via connection', async () => {
    const response = await supertest(app.nodeServer)
      .get('/database-test/persons3')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(response.body).toMatchSnapshot()
  })
})
