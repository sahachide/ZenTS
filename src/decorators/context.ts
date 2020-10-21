import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'

export function body(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.CONTEXT_BODY, parameterIndex, target, propertyKey)
}
