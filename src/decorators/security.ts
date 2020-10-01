import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'
import type { SecurityStrategyReflectionMetadata } from '../types/interfaces'

export function securityStrategy(strategy: string = 'default') {
  return (target: Class, propertyKey: string, parameterIndex: number): void => {
    const strategies =
      (Reflect.getMetadata(
        REFLECT_METADATA.SECURITY_STRATEGY,
        target,
        propertyKey,
      ) as SecurityStrategyReflectionMetadata[]) ?? []

    strategies.push({
      index: parameterIndex,
      propertyKey,
      target,
      name: strategy,
    })

    Reflect.defineMetadata(REFLECT_METADATA.SECURITY_STRATEGY, strategies, target, propertyKey)
  }
}

export function auth(strategy: string = 'default') {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.AUTH_STRATEGY, strategy, target, propertyKey)
  }
}
