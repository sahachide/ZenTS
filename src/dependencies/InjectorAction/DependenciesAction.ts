import type { InjectModuleInstance, ModuleDependency } from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import { REFLECT_METADATA } from '../../types/enums'

export class DependenciesAction extends AbstractAction {
  public run(instance: InjectModuleInstance): void {
    const dependencies =
      (Reflect.getMetadata(REFLECT_METADATA.DEPENDENCIES, instance) as ModuleDependency[]) ?? []

    for (const { dependency, propertyKey } of dependencies) {
      instance[propertyKey] = this.injector.inject<typeof dependency>(dependency, [])
    }
  }
}
