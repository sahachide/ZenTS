import { REFLECT_METADATA } from '../types/enums'

export function redis(target: any, propertyKey: string): void {
  Reflect.defineMetadata(REFLECT_METADATA.REDIS_CLIENT, propertyKey, target)
}
