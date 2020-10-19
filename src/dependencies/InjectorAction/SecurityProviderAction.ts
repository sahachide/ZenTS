import type { GenericControllerInstance, InjectorFunctionParameter } from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import { REFLECT_METADATA } from '../../types'
import { SecurityProviderReflectionMetadata } from '../../types/interfaces'

export class SecurityProviderAction extends AbstractAction {
  public run(instance: GenericControllerInstance, method: string): InjectorFunctionParameter[] {
    if (!Reflect.hasMetadata(REFLECT_METADATA.SECURITY_PROVIDER, instance, method)) {
      return []
    }

    const metadata = Reflect.getMetadata(
      REFLECT_METADATA.SECURITY_PROVIDER,
      instance,
      method,
    ) as SecurityProviderReflectionMetadata[]

    const parameters = metadata.map((meta) => {
      const value = this.injector.context.getSecurityProvider(meta.name)

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
