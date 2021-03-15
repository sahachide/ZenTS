import type { GenericControllerInstance, InjectorFunctionParameter } from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import { REFLECT_METADATA } from '../../types/enums'

export class EmailAction extends AbstractAction {
  public run(instance: GenericControllerInstance, method: string): InjectorFunctionParameter {
    if (!Reflect.hasMetadata(REFLECT_METADATA.EMAIL, instance, method)) {
      return
    }

    const metadata = Reflect.getMetadata(REFLECT_METADATA.EMAIL, instance, method) as number

    return {
      index: metadata,
      value: this.injector.context.getEmailFactory(),
    }
  }
}
