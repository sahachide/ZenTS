import type { GenericControllerInstance, InjectorFunctionParameter } from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import { REFLECT_METADATA } from '../../types'
import { SecurityStrategyReflectionMetadata } from '../../types/interfaces'

export class SecurityStrategyAction extends AbstractAction {
  public run(instance: GenericControllerInstance, method: string): InjectorFunctionParameter[] {
    if (!Reflect.hasMetadata(REFLECT_METADATA.SECURITY_STRATEGY, instance, method)) {
      return []
    }

    const metadata = Reflect.getMetadata(
      REFLECT_METADATA.SECURITY_STRATEGY,
      instance,
      method,
    ) as SecurityStrategyReflectionMetadata[]

    const parameters = metadata.map((meta) => {
      const value = this.injector.context.getSecurityStrategy(meta.name)

      if (!value) {
        return null
      }

      return {
        index: meta.index,
        value,
      }
    })

    return parameters
  }
}
