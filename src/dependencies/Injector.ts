import {
  ConnectionAction,
  DependenciesAction,
  EntityManagerAction,
  RedisAction,
  RepositoryAction,
} from './InjectorAction'
import type {
  GenericControllerInstance,
  InjectModuleInstance,
  InjectorFunctionParameter,
} from '../types/interfaces'

import type { Class } from 'type-fest'
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
  public injectFunctionParameters(instance: GenericControllerInstance, method: string): unknown[] {
    const actions = [new RepositoryAction(this)]
    let params: InjectorFunctionParameter[] = []

    for (const action of actions) {
      const result = action.run(instance, method)

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
