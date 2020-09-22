import type { Class } from 'type-fest'
import type { ModuleDependency } from '../types/interfaces'
import { REFLECT_METADATA } from '../types/enums'

export function inject(target: any, propertyKey: string): void {
  const dependency: Class = Reflect.getMetadata('design:type', target, propertyKey) as Class
  const dependencies: ModuleDependency[] =
    (Reflect.getMetadata(REFLECT_METADATA.DEPENDENCIES, target) as ModuleDependency[]) ?? []
  dependencies.push({ propertyKey, dependency })

  Reflect.defineMetadata(REFLECT_METADATA.DEPENDENCIES, dependencies, target)
}
