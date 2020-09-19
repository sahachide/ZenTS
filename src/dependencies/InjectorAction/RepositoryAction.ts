import type {
  GenericControllerInstance,
  InjectorFunctionParameter,
  RepositoryReflectionMetadata,
} from '../../types/interfaces'
import { REFLECT_METADATA, REPOSITORY_TYPE } from '../../types'

import { AbstractAction } from './AbstractAction'

export class RepositoryAction extends AbstractAction {
  public run(instance: GenericControllerInstance, method: string): InjectorFunctionParameter[] {
    if (!Reflect.hasMetadata(REFLECT_METADATA.DATABASE_REPOSITORY, instance, method)) {
      return []
    }

    const connection = this.injector.context.getConnection()
    const metadata = Reflect.getMetadata(
      REFLECT_METADATA.DATABASE_REPOSITORY,
      instance,
      method,
    ) as RepositoryReflectionMetadata[]
    const parameters = metadata.map((meta) => {
      let value = null

      switch (meta.repositoryType) {
        case REPOSITORY_TYPE.REPOSITORY:
          value = connection.getRepository(meta.entity)
          break

        case REPOSITORY_TYPE.TREE:
          value = connection.getTreeRepository(meta.entity)
          break

        case REPOSITORY_TYPE.CUSTOM:
          value = connection.getCustomRepository(meta.entity)
          break
      }

      return {
        index: meta.index,
        value,
      }
    })

    return parameters
  }
}
