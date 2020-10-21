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

import { BodyContextAction } from './InjectorAction/BodyContextAction'
import type { Class } from 'type-fest'
import type { Context } from '../http/Context'
import type { ModuleContext } from './ModuleContext'
import type { Session } from '../security/Session'

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
    injectedSessions: Session[],
  ): Promise<unknown[]> {
    const actions = [
      new RepositoryAction(this),
      new SecurityProviderAction(this),
      new SessionAction(this, context, loadedUser, injectedSessions),
      new BodyContextAction(this, context),
    ]
    let params: InjectorFunctionParameter[] = []

    for (const action of actions) {
      const result = await action.run(instance, method)

      if (Array.isArray(result)) {
        if (result.length) {
          params = [...params, ...result.filter((val) => val !== null)]
        }
      } else if (result) {
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
