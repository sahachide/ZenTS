import type {
  GenericControllerInstance,
  InjectorFunctionParameter,
  RequestConfigControllerUser,
} from '../../types/interfaces'

import { AbstractAction } from './AbstractAction'
import type { Context } from '../../http/Context'
import type { Injector } from '../Injector'
import { REFLECT_METADATA } from '../../types/enums'
import { SecurityProviderReflectionMetadata } from '../../types/interfaces'
import type { Session } from '../../security/Session'
import { isObject } from '../../utils/isObject'

export class SessionAction extends AbstractAction {
  protected readonly loadedUser: RequestConfigControllerUser
  protected readonly context: Context
  protected injectedSessions: Session[]

  constructor(
    injector: Injector,
    context: Context,
    loadedUser: RequestConfigControllerUser,
    injectedSessions: Session[],
  ) {
    super(injector)

    this.context = context
    this.loadedUser = loadedUser
    this.injectedSessions = injectedSessions
  }

  public async run(
    instance: GenericControllerInstance,
    method: string,
  ): Promise<InjectorFunctionParameter[]> {
    if (!Reflect.hasMetadata(REFLECT_METADATA.SESSION, instance, method)) {
      return []
    }

    const factory = this.injector.context.getSessionFactory()

    const metadata = Reflect.getMetadata(
      REFLECT_METADATA.SESSION,
      instance,
      method,
    ) as SecurityProviderReflectionMetadata[]

    const parameters = []

    for (const meta of metadata) {
      const session = await factory.build(
        meta.name,
        this.context,
        isObject(this.loadedUser) && this.loadedUser.provider === meta.name
          ? this.loadedUser
          : undefined,
      )

      this.injectedSessions.push(session)
      parameters.push({
        index: meta.index,
        value: session,
      })
    }

    return parameters
  }
}
