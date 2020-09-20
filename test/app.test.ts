import supertest from 'supertest'
import { zen } from './../src/core/Zen'

describe('ZenTS app', () => {
  test('server starts successfully', async () => {
    const app = await zen()

    await supertest(app.nodeServer).get('/').expect(200)
  })
})
