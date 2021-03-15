import type { ZenApp } from '../../src/core/ZenApp'
import { mockZenApp } from '../mock/mockZenApp'
import supertest from 'supertest'

let app: ZenApp

describe('Email', () => {
  beforeAll(async () => {
    app = await mockZenApp('./test/fixtures/testapp/')
  })

  afterAll(() => {
    app.destroy()
  })

  it('is send correctly', async () => {
    await supertest(app.nodeServer)
      .get('/send-mail')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({
        success: true,
      })
  })
})
