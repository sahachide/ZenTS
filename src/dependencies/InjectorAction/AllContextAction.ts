import type { GenericControllerInstance, InjectorFunctionParameter } from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import type { Context } from '../../http/Context'
import type { Injector } from '../Injector'
import { REFLECT_METADATA } from '../../types'

export class AllContextAction extends AbstractAction {
  protected readonly context: Context

  constructor(injector: Injector, context: Context) {
    super(injector)

    this.context = context
  }

  public run(instance: GenericControllerInstance, method: string): InjectorFunctionParameter {
    if (!Reflect.hasMetadata(REFLECT_METADATA.CONTEXT_ALL, instance, method)) {
      return
    }

    const metadata = Reflect.getMetadata(REFLECT_METADATA.CONTEXT_ALL, instance, method) as number

    return {
      index: metadata,
      value: this.context,
    }
  }
}
