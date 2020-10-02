import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'
import type { SecurityProviderReflectionMetadata } from '../types/interfaces'

export function auth(provider: string = 'default') {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.AUTH_PROVIDER, provider, target, propertyKey)
  }
}

export function securityProvider(provider: string = 'default') {
  return (target: Class, propertyKey: string, parameterIndex: number): void => {
    const providers =
      (Reflect.getMetadata(
        REFLECT_METADATA.SECURITY_PROVIDER,
        target,
        propertyKey,
      ) as SecurityProviderReflectionMetadata[]) ?? []

    providers.push({
      index: parameterIndex,
      propertyKey,
      target,
      name: provider,
    })

    Reflect.defineMetadata(REFLECT_METADATA.SECURITY_PROVIDER, providers, target, propertyKey)
  }
}

export function session(provider: string = 'default') {
  return (target: Class, propertyKey: string, parameterIndex: number): void => {
    const sessions =
      (Reflect.getMetadata(
        REFLECT_METADATA.SESSION,
        target,
        propertyKey,
      ) as SecurityProviderReflectionMetadata[]) ?? []

    sessions.push({
      index: parameterIndex,
      propertyKey,
      target,
      name: provider,
    })

    Reflect.defineMetadata(REFLECT_METADATA.SESSION, sessions, target, propertyKey)
  }
}
