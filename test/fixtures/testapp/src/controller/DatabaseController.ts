import type { Repository, EntityManager, Connection } from 'typeorm'
import { Controller, get, repository, entityManager, connection } from '../../../../../src'

import { Person } from '../entity/Person'

export default class extends Controller {
  @entityManager
  private em: EntityManager

  @connection
  private con: Connection

  @get('/database-test/persons')
  public async persons(@repository(Person) repo: Repository<Person>) {
    const products = await repo.find()

    return {
      products,
    }
  }

  @get('/database-test/persons2')
  public async persons2() {
    const products = await this.em.getRepository(Person).find()

    return {
      products,
    }
  }

  @get('/database-test/persons3')
  public async persons3() {
    const products = await this.con.getRepository(Person).find()

    return {
      products,
    }
  }
}
