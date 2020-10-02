import {
  ConnectionAction,
  DependenciesAction,
  EntityManagerAction,
  RedisAction,
  RepositoryAction,
  SecurityProviderAction,
  SessionAction,
} from './InjectorAction'
import type {
  GenericControllerInstance,
  InjectModuleInstance,
  InjectorFunctionParameter,
  RequestConfigControllerUser,
} from '../types/interfaces'

import type { Class } from 'type-fest'
import type { Context } from '../http/Context'
import type { ModuleContext } from './ModuleContext'

export class Injector {
  constructor(public context: ModuleContext) {}

  public inject<T>(module: Class, ctorArgs: unknown[]): T {
    const instance: InjectModuleInstance = new module(...ctorArgs)
    const actions = [
      new DependenciesAction(this),
      new ConnectionAction(this),
      new RedisAction(this),
      new EntityManagerAction(this),
    ]

    for (const action of actions) {
      action.run(instance)
    }

    return instance as T
  }

  public async injectFunctionParameters(
    instance: GenericControllerInstance,
    method: string,
    context: Context,
    loadedUser: RequestConfigControllerUser,
  ): Promise<unknown[]> {
    const actions = [
      new RepositoryAction(this),
      new SecurityProviderAction(this),
      new SessionAction(this, context, loadedUser),
    ]
    let params: InjectorFunctionParameter[] = []

    for (const action of actions) {
      const result = await action.run(instance, method)

      if (Array.isArray(result)) {
        if (result.length) {
          params = [...params, ...result]
        }
      } else {
        params.push(result)
      }
    }

    if (!params.length) {
      return []
    }

    params.sort((a, b) => a.index - b.index)

    return params.map((param) => param.value as unknown)
  }
}
