import { AbstractAction } from './AbstractAction'
import { InjectModuleInstance } from '../../types/interfaces'
import { REFLECT_METADATA } from '../../types/enums'

export class RedisAction extends AbstractAction {
  public run(instance: InjectModuleInstance): void {
    if (!Reflect.hasMetadata(REFLECT_METADATA.REDIS_CLIENT, instance)) {
      return
    }

    const propertyKey = Reflect.getMetadata(REFLECT_METADATA.REDIS_CLIENT, instance) as string

    instance[propertyKey] = this.injector.context.getRedisClient()
  }
}
