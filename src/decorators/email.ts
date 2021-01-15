import type { Class } from 'type-fest'
import { REFLECT_METADATA } from '../types/enums'

export function email(target: Class, propertyKey: string, parameterIndex: number): void {
  Reflect.defineMetadata(REFLECT_METADATA.EMAIL, parameterIndex, target, propertyKey)
}
