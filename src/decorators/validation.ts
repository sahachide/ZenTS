import { REFLECT_METADATA } from '../types/enums'
import type { ValidationSchema } from '../types/types'

export function validation(schema: ValidationSchema) {
  return (target: any, propertyKey: string): void => {
    Reflect.defineMetadata(REFLECT_METADATA.VALIDATION_SCHEMA, schema, target, propertyKey)
  }
}
