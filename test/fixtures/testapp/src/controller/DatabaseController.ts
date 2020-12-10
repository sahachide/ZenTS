import type { Repository } from 'typeorm'
import { Controller, get, repository } from '../../../../../src'

import { Person } from '../entity/Person'

export default class extends Controller {
  @get('/database-test/persons')
  public async persons(@repository(Person) repo: Repository<Person>) {
    const products = await repo.find()

    return {
      products,
    }
  }
}
