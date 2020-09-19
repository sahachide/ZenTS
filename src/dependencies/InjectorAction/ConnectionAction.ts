import { AbstractAction } from './AbstractAction'
import { InjectModuleInstance } from '../../types/interfaces'
import { REFLECT_METADATA } from '../../types/enums'

export class ConnectionAction extends AbstractAction {
  public run(instance: InjectModuleInstance): void {
    if (!Reflect.hasMetadata(REFLECT_METADATA.DATABASE_CONNECTION, instance)) {
      return
    }

    const propertyKey = Reflect.getMetadata(
      REFLECT_METADATA.DATABASE_CONNECTION,
      instance,
    ) as string

    instance[propertyKey] = this.injector.context.getConnection()
  }
}
