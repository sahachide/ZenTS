import { REFLECT_METADATA, REPOSITORY_TYPE } from '../types/enums'

import type { Class } from 'type-fest'
import type { RepositoryReflectionMetadata } from '../types/interfaces'

export function connection(target: any, propertyKey: string): void {
  Reflect.defineMetadata(REFLECT_METADATA.DATABASE_CONNECTION, propertyKey, target)
}

export function entityManager(target: any, propertyKey: string): void {
  Reflect.defineMetadata(REFLECT_METADATA.DATABASE_EM, propertyKey, target)
}

function repositoryDecorator(
  repositoryType: REPOSITORY_TYPE,
  entity: Class,
): (target: Class, propertyKey: string, parameterIndex: number) => void {
  return (target: Class, propertyKey: string, parameterIndex: number): void => {
    const repositories =
      (Reflect.getMetadata(
        REFLECT_METADATA.DATABASE_REPOSITORY,
        target,
        propertyKey,
      ) as RepositoryReflectionMetadata[]) ?? []

    repositories.push({
      index: parameterIndex,
      propertyKey,
      entity,
      repositoryType,
    })

    Reflect.defineMetadata(REFLECT_METADATA.DATABASE_REPOSITORY, repositories, target, propertyKey)
  }
}

export function repository(
  entity: Class,
): (target: Class, propertyKey: string, parameterIndex: number) => void {
  return repositoryDecorator(REPOSITORY_TYPE.REPOSITORY, entity)
}

export function treeRepository(
  entity: Class,
): (target: Class, propertyKey: string, parameterIndex: number) => void {
  return repositoryDecorator(REPOSITORY_TYPE.TREE, entity)
}

export function customRepository(
  repository: Class,
): (target: Class, propertyKey: string, parameterIndex: number) => void {
  return repositoryDecorator(REPOSITORY_TYPE.CUSTOM, repository)
}
