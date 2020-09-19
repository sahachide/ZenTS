import { AbstractAction } from './AbstractAction'
import type { InjectModuleInstance } from '../../types/interfaces'
import { REFLECT_METADATA } from '../../types/enums'

export class EntityManagerAction extends AbstractAction {
  public run(instance: InjectModuleInstance): void {
    if (!Reflect.hasMetadata(REFLECT_METADATA.DATABASE_EM, instance)) {
      return
    }

    const propertyKey = Reflect.getMetadata(REFLECT_METADATA.DATABASE_EM, instance) as string

    instance[propertyKey] = this.injector.context.getConnection().manager
  }
}
