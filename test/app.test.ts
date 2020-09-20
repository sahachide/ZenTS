import { mockZenApp } from './mock/mockZenApp'
import supertest from 'supertest'

describe('ZenTS app', () => {
  test('server starts successfully', async () => {
    const app = await mockZenApp('./test/fixtures/baseapp/')

    await supertest(app.nodeServer).get('/').expect('Content-Type', /json/).expect(200).expect({
      success: true,
    })
  })
})
